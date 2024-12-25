import React, { useState } from "react";
import {
  Table,
  Button,
  Drawer,
  Tag,
  Space,
  Input,
  Form,
  message,
  Select,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-products.module.scss";
import { required, maxLength, minLength } from "@/utils/formValidation";

const { Option } = Select;

interface Product {
  id: number;
  title: string;
  category: string;
  heading: string;
  description: string;
  actualPrice: number;
  discountedPrice: number;
  quantity: number;
  sku: string;
  size: string;
  benefits: string;
  howToUse: string;
  keyIngredients: string;
  status: "active" | "inactive";
  imageUrl: string;
}

// Mock product data
const mockProducts: Product[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  title: `Product ${index + 1}`,
  category: "Electronics",
  heading: `Heading for Product ${index + 1}`,
  description: `Detailed description for Product ${index + 1}.`,
  actualPrice: 100 + 10,
  discountedPrice: 100 + 5,
  quantity: 100,
  sku: `SKU${(index + 1).toString().padStart(4, "0")}`,
  size: "M",
  benefits: "Benefit description",
  howToUse: "Instructions on how to use",
  keyIngredients: "Ingredient list",
  status: index  % 2 === 0 ? "active" : "inactive",
  imageUrl: `https://picsum.photos/200/300?random=${index + 1}`,
}));

const ManageProductsPage: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [form] = Form.useForm();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const columns: ColumnsType<Product> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Actual Price",
      dataIndex: "actualPrice",
      key: "actualPrice",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Discounted Price",
      dataIndex: "discountedPrice",
      key: "discountedPrice",
      render: (price) => `$${price.toFixed(2)}`,
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
        </Space>
      ),
    },
  ];
  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDrawerVisible(true);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  const handleAddProduct = async (values: any) => {
    // Simulate adding a product
    const newProduct = {
      id: mockProducts.length + 1,
      title: values.title,
      category: values.category,
      heading: values.heading,
      description: values.description,
      actualPrice: parseFloat(values.actualPrice.toFixed(2)),
      discountedPrice: parseFloat(values.discountedPrice.toFixed(2)),
      quantity: values.quantity,
      sku: values.sku,
      size: values.size,
      benefits: values.benefits,
      howToUse: values.howToUse,
      keyIngredients: values.keyIngredients,
      status: "active",
      imageUrl: `https://picsum.photos/200/300?random=${
        mockProducts.length + 1
      }`,
    };

    // Update the mock products array (in a real app, you would update the state or make an API call)
    mockProducts.push(newProduct as Product);
    message.success("Product added successfully!");
    setDrawerVisible(false);
    form.resetFields(); // Reset the form fields
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Products</h1>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add New Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={mockProducts}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title="Add Product"
        placement="right"
        width={800}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Form form={form} onFinish={handleAddProduct} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[required("Please input the product title!")]}
          >
            <Input placeholder="Product Title" />
          </Form.Item>
          <Form.Item
            name="category"
            label="Select Category"
            rules={[required("Please select a category!")]}
          >
            <Select placeholder="Select a category">
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Books">Books</Option>
              <Option value="Home">Home</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="heading"
            label="Heading"
            rules={[required("Please input the heading!")]}
          >
            <Input placeholder="Product Heading" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[required("Please input the description!")]}
          >
            <Input.TextArea placeholder="Product Description" />
          </Form.Item>
          <Form.Item
            name="actualPrice"
            label="Actual Price"
            rules={[
              {
                required: true,
                message: "Please input the actual price!",
              },
            ]}
          >
            <Input type="number" step="0.01" placeholder="Actual Price" />
          </Form.Item>
          <Form.Item
            name="discountedPrice"
            label="Discounted Price"
            rules={[
              {
                required: true,
                message: "Please input the discounted price!",
              },
            ]}
          >
            <Input type="number" step="0.01" placeholder="Discounted Price" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              {
                required: true,
                message: "Please input the quantity!",
              },
            ]}
          >
            <Input type="number" placeholder="Quantity" />
          </Form.Item>
          <Form.Item
            name="sku"
            label="SKU"
            rules={[required("Please input the SKU!")]}
          >
            <Input placeholder="SKU" />
          </Form.Item>
          <Form.Item
            name="size"
            label="Size"
            rules={[required("Please input the size!")]}
          >
            <Input placeholder="Size" />
          </Form.Item>
          <Form.Item
            name="benefits"
            label="Benefits"
            rules={[required("Please input the benefits!")]}
          >
            <Input.TextArea placeholder="Benefits" />
          </Form.Item>
          <Form.Item
            name="howToUse"
            label="How to Use"
            rules={[required("Please input how to use!")]}
          >
            <Input.TextArea placeholder="How to Use" />
          </Form.Item>
          <Form.Item
            name="keyIngredients"
            label="Key Ingredients"
            rules={[required("Please input key ingredients!")]}
          >
            <Input.TextArea placeholder="Key Ingredients" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Product
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default ManageProductsPage;
