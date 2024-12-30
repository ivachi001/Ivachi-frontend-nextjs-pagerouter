"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Drawer, Space, Form, Input, Select } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-reviews.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";

interface Review {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: number;
  created_at: string;
  updated_at: string;
}

const ManageReviewsPage: AppPageProps = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [reviewForm] = Form.useForm();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchReviews = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.REVIEW_GET, {
        page,
        per_page: perPage,
        search,
      });

      if (response?.data) {
        setReviews(response.data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch reviews");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewById = async (id: number) => {
    try {
      const response: any = await axiosHelper.get(
        `${API_ENDPOINTS.REVIEW_GET}/${id}`
      );
      return response.data;
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch review details");
      return null;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchReviews(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<Review> = [
    {
      title: "Product ID",
      dataIndex: "product_id",
      key: "product_id",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status === 1 ? "Approved" : "Pending"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={async () => {
              const review = await fetchReviewById(record.id);
              if (review) {
                setSelectedReview(review);
                reviewForm.setFieldsValue({
                  status: review.status,
                });
                setDrawerVisible(true);
              }
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  const handleUpdateReview = async (values: any) => {
    if (!selectedReview) return;

    try {
      setLoading(true);
      const response = await axiosHelper.patch(
        `${API_ENDPOINTS.REVIEW_UPDATE_STATUS}/${selectedReview.id}`,
        {
          status: values.status,
        }
      );

      if (response?.data) {
        notify.success("Review status updated successfully!");
        setDrawerVisible(false);
        reviewForm.resetFields();
        fetchReviews(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to update review status");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleUpdateReview(values);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Reviews</h1>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search reviews..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={reviews}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} reviews`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title="Update Review Status"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={reviewForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[required("Please select status!")]}
          >
            <Select placeholder="Select Status">
              <Select.Option value={1}>Approved</Select.Option>
              <Select.Option value={0}>Pending</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageReviewsPage.protected = true;
export default ManageReviewsPage;
