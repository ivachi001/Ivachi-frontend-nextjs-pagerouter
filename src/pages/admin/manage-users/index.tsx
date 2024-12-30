'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Drawer, Tag, Space, Form, Input, message, Select, Modal, Upload } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import styles from './manage-users.module.scss';
import { AppPageProps } from '@/types';
import { API_ENDPOINTS } from '@/constants/apiUrl';
import axiosHelper from '@/utils/axiosHelper';
import { notify } from '@/utils/common';
import { maxLength, minLength, required, checkEmail } from '@/utils/formValidation';
import { SearchOutlined, ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  role_id: number;
  profile_doc?: string;
}

const { confirm } = Modal;

const ManageUsersPage: AppPageProps = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ 
    current: 1, 
    pageSize: 10,
    total: 0 
  });
  const [userForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async (page = 1, perPage = 10, search = '') => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.USER_ACTIONS, {
        page,
        per_page: perPage,
        search
      });

      if (response?.list_data) {
        setUsers(response.list_data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records
        });
      }
    } catch (error: any) {
      notify.error(error?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((value: string) => {
      setSearchText(value);
      setPagination(prev => ({
        ...prev,
        current: 1
      }));
      fetchUsers(1, pagination.pageSize, value);
    }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      key: 'name',
      render: (_, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone_no',
      key: 'phone_no',
    },
    {
      title: 'Role',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (role_id) => (
        <Tag color={role_id === 1 ? 'blue' : 'default'}>
          {role_id === 1 ? 'ADMIN' : 'USER'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record);
            }}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(record);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleAddUser = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (key === 'profile_doc' && values[key]?.fileList?.[0]) {
          formData.append('profile_doc', values[key].fileList[0].originFileObj);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await axiosHelper.post(API_ENDPOINTS.CREATE_USER, formData);

      if (response?.data) {
        notify.success('User added successfully!');
        setDrawerVisible(false);
        userForm.resetFields();
        fetchUsers();
      }
    } catch (error: any) {
      notify.error(error?.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    userForm.setFieldsValue(user);
    setDrawerVisible(true);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchUsers(
      newPagination.current || 1,
      newPagination.pageSize || 10
    );
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedUser(null);
    userForm.resetFields();
  };

  const handleUpdateUser = async (values: any) => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      
      Object.keys(values).forEach(key => {
        if (key === 'profile_doc' && values[key]?.fileList?.[0]) {
          formData.append('profile_doc', values[key].fileList[0].originFileObj);
        } else {
          formData.append(key, values[key]);
        }
      });

      const response = await axiosHelper.put(
        `${API_ENDPOINTS.UPDATE_USER}/${selectedUser.id}`,
        formData
      );

      if (response?.data) {
        notify.success('User updated successfully!');
        setDrawerVisible(false);
        userForm.resetFields();
        fetchUsers(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          setLoading(true);
          const response = await axiosHelper.delete(
            `${API_ENDPOINTS.USER_ACTIONS}/${user.id}`
          );

          if (response?.data) {
            notify.success('User deleted successfully!');
            fetchUsers(pagination.current, pagination.pageSize, searchText);
          }
        } catch (error: any) {
          notify.error(error?.message || 'Failed to delete user');
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const onFinish = (values: any) => {
    if (selectedUser) {
      handleUpdateUser(values);
    } else {
      handleAddUser(values);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Users</h1>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add New User
        </Button>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
          pageSizeOptions: ['10', '20', '50'],
        }}
      />

      <Drawer
        title={selectedUser ? "Edit User" : "Add New User"}
        placement="right"
        width={400}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={userForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[required("Please input first name!"), minLength(2), maxLength(50)]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[required("Please input last name!"), minLength(2), maxLength(50)]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[required("Please input email!"), checkEmail()]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone_no"
            label="Phone Number"
            rules={[required("Please input phone number!"), maxLength(15)]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="role_id"
            label="Role"
            rules={[required("Please select role!")]}
          >
            <Select
              options={[
                { value: 1, label: 'Admin' },
                { value: 2, label: 'User' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="profile_doc"
            label="Profile Image"
            valuePropName="file"
          >
            <Upload
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*"
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Upload Profile Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              {selectedUser ? 'Update User' : 'Add User'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageUsersPage.protected = true;
export default ManageUsersPage; 