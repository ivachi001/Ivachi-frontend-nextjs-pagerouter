import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Tag,
  Space,
  Switch,
  Input,
  Form,
  message,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-categories.module.scss";
import { maxLength, minLength, required } from "@/utils/formValidation";
import { onKeyDownAlphabetsAndNumbersOnly } from "@/utils/common";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  status: "active" | "inactive";
  productCount: number;
  // createdAt: string;
}

// Mock category data
const mockCategories: Category[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `Category ${index + 1}`,
  slug: `category-${index + 1}`,
  description: `Description for Category ${
    index + 1
  }. This is a sample category description.`,
  status: index  % 2 === 0 ? "active" : "inactive",
  productCount: 44,
  // createdAt: new Date(Date.now() - Math.random() * 10000000000)
  //   .toISOString()
  //   .split("T")[0]
  //   ,
}));

const ManageCategoriesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [form] = Form.useForm();

  const columns: ColumnsType<Category> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Products",
      dataIndex: "productCount",
      key: "productCount",
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    // {
    //   title: "Created At",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   sorter: (a, b) =>
    //     new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    // },
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
        </Space>
      ),
    },
  ];

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDrawerVisible(true);
  };

  const handleRowClick = (record: Category) => {
    setSelectedCategory(record);
    setDrawerVisible(true);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  const handleAddCategory = async (values: { name: string }) => {
    // Simulate adding a category
    const newCategory = {
      id: mockCategories.length + 1,
      name: values.name,
      slug: values.name.toLowerCase().replace(/\s+/g, "-"),
      description: "",
      status: "active",
      productCount: 0,
      // createdAt: new Date().toISOString().split("T")[0],
    };

    // Update the mock categories array (in a real app, you would update the state or make an API call)
    mockCategories.push(newCategory as Category);
    message.success("Category added successfully!");
    setDrawerVisible(false);
    form.resetFields(); // Reset the form fields
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Categories</h1>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add New Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mockCategories}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} categories`,
          pageSizeOptions: ["10", "20", "50"],
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Drawer
        title="Add Category"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Form form={form} onFinish={handleAddCategory}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              required("Please input the category name!"),
              minLength(2),
              maxLength(100),
            ]}
          >
            <Input
              placeholder="Category Name"
              onKeyDown={onKeyDownAlphabetsAndNumbersOnly}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Category
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ManageCategoriesPage;
