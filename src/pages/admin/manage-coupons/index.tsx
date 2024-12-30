"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Drawer,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-coupons.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";
import dayjs from "dayjs";

interface Coupon {
  id: number;
  coupon_code: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: number;
  usage_limit: number;
  applies_to: string;
  status: number;
  start_date?: string;
  end_date?: string;
}

const ManageCouponsPage: AppPageProps = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [couponForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [applicableOptions, setApplicableOptions] = useState<any[]>([]);
  const [appliesTo, setAppliesTo] = useState<string>("");

  const fetchCoupons = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.COUPON, {
        page,
        per_page: perPage,
        search,
      });

      if (response?.data?.list_data) {
        setCoupons(response.data.list_data);
        setPagination({
          current: response.data.page,
          pageSize: response.data.per_page,
          total: response.data.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchCoupons(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<Coupon> = [
    {
      title: "Code",
      dataIndex: "coupon_code",
      key: "coupon_code",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Discount Type",
      dataIndex: "discount_type",
      key: "discount_type",
    },
    {
      title: "Usage Limit",
      dataIndex: "usage_limit",
      key: "usage_limit",
    },
    {
      title: "Discount Value",
      dataIndex: "discount_value",
      key: "discount_value",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space>
          <Button type="primary" onClick={() => setDrawerVisible(true)}>
            Create Coupon
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreateCoupon = async (values: any) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        applicable_to:
          appliesTo === "Both"
            ? []
            : values.applicable_to.split(",").map(Number),
        start_date: values.start_date
          ? dayjs(values.start_date).format("YYYY-MM-DD")
          : null,
        end_date: values.end_date
          ? dayjs(values.end_date).format("YYYY-MM-DD")
          : null,
      };

      const response = await axiosHelper.post(
        API_ENDPOINTS.CREATE_COUPON,
        formattedValues
      );

      if (response?.data) {
        notify.success("Coupon created successfully!");
        setDrawerVisible(false);
        couponForm.resetFields();
        fetchCoupons(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to create coupon");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleCreateCoupon(values);
  };

  const handleAppliesToChange = (value: string) => {
    setAppliesTo(value);
    if (value === "Product") {
      axiosHelper.get(API_ENDPOINTS.PRODUCT_LIST).then((response) => {
        setApplicableOptions(
          response?.map((product: any) => ({
            label: product.title,
            value: product.id,
          }))
        );
      });
    } else if (value === "Combo") {
      axiosHelper.get(API_ENDPOINTS.COMBO_LIST).then((response) => {
        setApplicableOptions(
          response?.map((combo: any) => ({
            label: combo.title,
            value: combo.id,
          }))
        );
      });
    } else {
      setApplicableOptions([]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Coupons</h1>
        <Button type="primary" onClick={() => setDrawerVisible(true)}>
          Add New Coupon
        </Button>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search coupons..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={coupons}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} coupons`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title="Create Coupon"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={couponForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="coupon_code"
            label="Coupon Code"
            rules={[required("Please input coupon code!"), maxLength(50)]}
          >
            <Input
              placeholder="Coupon Code"
              onInput={(e: any) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Title"
            rules={[required("Please input title!"), maxLength(100)]}
          >
            <Input placeholder="Title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[required("Please input description!"), maxLength(200)]}
          >
            <Input placeholder="Description" />
          </Form.Item>

          <Form.Item
            name="discount_type"
            label="Discount Type"
            rules={[required("Please select discount type!")]}
          >
            <Select placeholder="Select Discount Type">
              <Select.Option value="Percentage">Percentage</Select.Option>
              <Select.Option value="Flat">Flat</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="discount_value"
            label="Discount Value"
            rules={[required("Please input discount value!")]}
          >
            <Input type="number" placeholder="Discount Value" />
          </Form.Item>

          <Form.Item
            name="usage_limit"
            label="Usage Limit"
            rules={[required("Please input usage limit!")]}
          >
            <Input type="number" placeholder="Usage Limit" />
          </Form.Item>

          <Form.Item
            name="applies_to"
            label="Applies To"
            rules={[required("Please select applies to!")]}
          >
            <Select
              placeholder="Select Applies To"
              onChange={handleAppliesToChange}
            >
              <Select.Option value="Product">Product</Select.Option>
              <Select.Option value="Combo">Combo</Select.Option>
              <Select.Option value="Both">Both</Select.Option>
            </Select>
          </Form.Item>

          {appliesTo !== "Both" && (
            <Form.Item
              name="applicable_to"
              label="Applicable To (IDs)"
              rules={[required("Please input applicable IDs!")]}
            >
              <Select
                mode="multiple"
                placeholder="Select Applicable IDs"
                options={applicableOptions}
              />
            </Form.Item>
          )}

          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[required("Please select start date!")]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select Start Date"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="end_date"
            label="End Date"
            rules={[required("Please select end date!")]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select End Date"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[required("Please select status!")]}
          >
            <Select placeholder="Select Status">
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Create Coupon
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageCouponsPage.protected = true;
export default ManageCouponsPage;
