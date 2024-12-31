"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Drawer, Space, Form, Input, Select } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-roles.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";

interface Role {
  id: number;
  name: string;
  permission_ids: number[];
  permissions?: Array<{ id: number; name: string }>;
}

const ManageRolesPage: AppPageProps = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [roleForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [permissions, setPermissions] = useState<any[]>([]); // To hold permissions list
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const fetchRoles = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.ROLE_ACTIONS, {
        page,
        per_page: perPage,
        search,
      });

      if (response?.list_data?.length > 0) {
        setRoles(response.list_data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response: any = await axiosHelper.get(
        API_ENDPOINTS.PERMISSION_LIST
      );
      if (response) {
        setPermissions(response);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch permissions");
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchRoles(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<Role> = [
    {
      title: "Role Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Permissions",
      key: "permissions",
      render: (_, record) => (
        <span>{record.permissions?.map((p) => p.name).join(", ")}</span>
      ),
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsEditing(true);
    roleForm.setFieldsValue({
      name: role.name,
      permission_ids: role.permissions?.map((p) => p.id) || [],
    });
    setDrawerVisible(true);
  };

  const handleRoleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const formattedValues = {
        name: values.name,
        permission_ids: values.permission_ids,
      };

      let response;
      if (isEditing && selectedRole) {
        response = await axiosHelper.put(
          `${API_ENDPOINTS.ROLE_UPDATE}/${selectedRole.id}`,
          formattedValues
        );
      } else {
        response = await axiosHelper.post(
          API_ENDPOINTS.ROLE_ACTIONS,
          formattedValues
        );
      }

      if (response?.data) {
        notify.success(
          `Role ${isEditing ? "updated" : "created"} successfully!`
        );
        setDrawerVisible(false);
        roleForm.resetFields();
        setSelectedRole(null);
        setIsEditing(false);
        fetchRoles(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(
        error?.message || `Failed to ${isEditing ? "update" : "create"} role`
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleRoleSubmit(values);
  };

  const handleDrawerClose = () => {
    setDrawerVisible(false);
    setSelectedRole(null);
    setIsEditing(false);
    roleForm.resetFields();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Roles</h1>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add New Role
        </Button>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search roles..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={roles}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} roles`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title={isEditing ? "Edit Role" : "Create Role"}
        placement="right"
        width={400}
        onClose={handleDrawerClose}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={roleForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            label="Role Name"
            rules={[required("Please input role name!"), maxLength(50)]}
          >
            <Input placeholder="Role Name" />
          </Form.Item>

          <Form.Item
            name="permission_ids"
            label="Permissions"
            rules={[required("Please select permissions!")]}
          >
            <Select
              mode="multiple"
              placeholder="Select Permissions"
              options={permissions.map((perm) => ({
                label: perm.name,
                value: perm.id,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {isEditing ? "Update Role" : "Create Role"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageRolesPage.protected = true;
export default ManageRolesPage;
