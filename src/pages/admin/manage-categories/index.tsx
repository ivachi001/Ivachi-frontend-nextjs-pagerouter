import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Drawer,
  Tag,
  Space,
  Input,
  Form,
  message,
  Modal,
  Switch,
} from "antd";
import { SearchOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-categories.module.scss";
import { maxLength, minLength, required } from "@/utils/formValidation";
import { notify, onKeyDownAlphabetsAndNumbersOnly } from "@/utils/common";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { debounce } from "lodash";

const { TextArea } = Input;
const { confirm } = Modal;

interface Category {
  id: number;
  parent_id: number;
  title: string;
  image_path: string;
  description: string;
  status: number;
}

const ManageCategoriesPage: AppPageProps = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [addCategoryForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchCategories = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.CATEGORY, {
        page,
        per_page: perPage,
        search,
      });
      if (response?.list_data) {
        setCategories(response.list_data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns: ColumnsType<Category> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number, record: Category) => (
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          checked={status === 1}
          loading={loading}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
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
              handleDeleteCategory(record);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (category: Category) => {
    addCategoryForm.resetFields();
    setSelectedCategory(category);
    addCategoryForm.setFieldsValue({
      title: category.title,
      description: category.description,
      status: category.status === 1,
    });
    setDrawerVisible(true);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchCategories(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleAddCategory = async (values: {
    title: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      const response = await axiosHelper.post(API_ENDPOINTS.CREATE_CATEGORY, {
        title: values.title,
        description: values.description,
      });

      if (response?.data) {
        notify.success(response?.message);
        setDrawerVisible(false);
        addCategoryForm.resetFields();
        fetchCategories(); // Refresh the list
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedCategory(null);
    addCategoryForm.resetFields();
  };

  const handleAddNewClick = () => {
    setSelectedCategory(null);
    addCategoryForm.resetFields();
    setDrawerVisible(true);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchCategories(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const handleUpdateCategory = async (values: {
    title: string;
    description: string;
    status: boolean;
  }) => {
    if (!selectedCategory) return;

    try {
      setLoading(true);
      const response = await axiosHelper.put(
        `${API_ENDPOINTS.UPDATE_CATEGORY}/${selectedCategory.id}`,
        {
          title: values.title,
          description: values.description,
          status: values.status, // This will be true/false from Switch
        }
      );
      if (response?.data) {
        notify.success(response?.message);
        setDrawerVisible(false);
        addCategoryForm.resetFields();
        fetchCategories(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    confirm({
      title: "Are you sure you want to delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          setLoading(true);
          const response = await axiosHelper.delete(
            `${API_ENDPOINTS.DELETE_CATEGORY}/${category.id}`
          );

          if (response?.data) {
            notify.success(response?.message);
            fetchCategories(
              pagination.current,
              pagination.pageSize,
              searchText
            );
          }
        } catch (error: any) {
          notify.error(error?.message || "Failed to delete category");
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleStatusChange = async (categoryId: number, status: boolean) => {
    try {
      setLoading(true);
      const response = await axiosHelper.patch(
        `${API_ENDPOINTS.UPDATE_CATEGORY_STATUS}/${categoryId}`,
        {
          status,
        }
      );

      if (response?.data) {
        notify.success(response?.message);
        fetchCategories(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: {
    title: string;
    description: string;
    status?: boolean;
  }) => {
    if (selectedCategory) {
      handleUpdateCategory({
        ...values,
        status: values.status ?? selectedCategory.status === 1,
      });
    } else {
      handleAddCategory(values);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Categories</h1>
        <Button type="primary" onClick={handleAddNewClick}>
          Add New Category
        </Button>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search categories..."
          prefix={<SearchOutlined />}
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} categories`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title={selectedCategory ? "Edit Category" : "Add Category"}
        placement="right"
        width={400}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={addCategoryForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[
              required("Please input the category title!"),
              minLength(2),
              maxLength(100),
            ]}
          >
            <Input
              placeholder="Category Title"
              onKeyDown={onKeyDownAlphabetsAndNumbersOnly}
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              required("Please input the category description!"),
              minLength(2),
              maxLength(250),
            ]}
          >
            <TextArea
              placeholder="Category Description"
              onKeyDown={onKeyDownAlphabetsAndNumbersOnly}
              autoSize={{ minRows: 3, maxRows: 5 }}
              size="large"
            />
          </Form.Item>
          {selectedCategory && (
            <Form.Item
              name="status"
              label="Status"
              valuePropName="checked"
              initialValue={selectedCategory.status === 1}
            >
              <Switch
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                defaultChecked={selectedCategory.status === 1}
              />
            </Form.Item>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
            >
              {selectedCategory ? "Update Category" : "Add Category"}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageCategoriesPage.protected = true;
export default ManageCategoriesPage;
