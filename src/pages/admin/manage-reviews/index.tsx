"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Space, Input, Modal, Form } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-reviews.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { REVIEW_STATUS } from "@/constants/appDefaults";

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
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchText, setSearchText] = useState("");

  const { confirm } = Modal;

  const fetchReviews = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.REVIEW_GET, {
        page,
        per_page: perPage,
        search,
      });

      if (response?.list_data?.length > 0) {
        setReviews(response.list_data);
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
      title: "Product",
      dataIndex: ["product", "title"], // Access nested key
      key: "title",
    },
    {
      title: "Customer Email",
      dataIndex: ["customer", "email"], // Access nested key
      key: "customer_email",
    },
    {
      title: "First Name",
      dataIndex: ["customer", "first_name"], // Access nested key
      key: "customer_first_name",
    },
    {
      title: "Last Name",
      dataIndex: ["customer", "last_name"], // Access nested key
      key: "customer_last_name",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
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
      render: (status) => {
        switch (status) {
          case 1:
            return "Approved";
          case 2:
            return "Rejected";
          default:
            return "Pending";
        }
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          {record.status === REVIEW_STATUS.PENDING && (
            <>
              <Button
                type="primary"
                onClick={() => showConfirm(record.id, "approve")}
              >
                Approve
              </Button>
              <Button danger onClick={() => showConfirm(record.id, "reject")}>
                Reject
              </Button>
            </>
          )}
          {record.status === REVIEW_STATUS.APPROVED && (
            <Button danger onClick={() => showConfirm(record.id, "reject")}>
              Reject
            </Button>
          )}
          {record.status === REVIEW_STATUS.REJECT && (
            <Button
              type="primary"
              onClick={() => showConfirm(record.id, "approve")}
            >
              Approve
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleStatusUpdate = async (reviewId: number, status: number) => {
    try {
      setLoading(true);
      const response = await axiosHelper.patch(
        `${API_ENDPOINTS.REVIEW_UPDATE_STATUS}/${reviewId}`,
        {
          status,
        }
      );

      if (response?.data) {
        notify.success(
          `Review ${status === 1 ? "approved" : "rejected"} successfully!`
        );
        fetchReviews(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to update review status");
    } finally {
      setLoading(false);
    }
  };

  const showConfirm = (reviewId: number, action: "approve" | "reject") => {
    confirm({
      title: `Are you sure you want to ${action} this review?`,
      icon: <ExclamationCircleOutlined />,
      content: `This action will ${action} the review and cannot be undone.`,
      okText: "Yes",
      okType: action === "approve" ? "primary" : "danger",
      cancelText: "No",
      onOk() {
        handleStatusUpdate(reviewId, action === "approve" ? 1 : 2);
      },
    });
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
    </div>
  );
};

ManageReviewsPage.protected = true;
export default ManageReviewsPage;
