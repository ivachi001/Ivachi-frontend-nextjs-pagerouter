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
  message,
  Modal,
  Image,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-inquiries.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";
import { INQUIRY_STATUSES } from "@/constants/appDefaults";

interface Inquiry {
  id: number;
  request_type_id: number;
  full_name: string;
  email: string;
  phone_no: string;
  message: string;
  status: number | null;
  created_at: string;
  request_type: {
    id: number;
    title: string;
  };
}

interface DetailedInquiry extends Inquiry {
  attachment_path?: string;
  reply_message?: string;
  status_name: string;
}

const ManageInquiriesPage: AppPageProps = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [inquiryForm] = Form.useForm();
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  console.log("selectedInquiry", selectedInquiry);

  const [searchText, setSearchText] = useState("");
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);

  const fetchInquiries = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(API_ENDPOINTS.INQUIRY_GET, {
        page,
        per_page: perPage,
        search,
      });
      console.log("fetchInquiries", response);

      if (response?.list_data?.length > 0) {
        setInquiries(response?.list_data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const fetchInquiryById = async (id: number) => {
    try {
      const response: any = await axiosHelper.get(
        `${API_ENDPOINTS.INQUIRY_GET}/${id}`
      );
      return response;
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch inquiry details");
      return null;
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchInquiries(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<Inquiry> = [
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_no",
      key: "phone_no",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Status",
      dataIndex: "status_name",
      key: "status_name",
      // render: (status) => (status === INQUIRY_STATUSES.REPLIED ? "Resolved" : "Pending"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            onClick={async () => {
              const inquiry = await fetchInquiryById(record.id);
              setSelectedInquiry(inquiry);
              setViewDrawerVisible(true);
            }}
          >
            View
          </Button>
          {record?.status === INQUIRY_STATUSES.PENDING && (
            <Button
              type="primary"
              onClick={async () => {
                setSelectedInquiry(record);
                setDrawerVisible(true);
              }}
            >
              Reply
            </Button>
          )}
          {(record?.status === INQUIRY_STATUSES.PENDING ||
            record?.status === INQUIRY_STATUSES.REPLIED) && (
            <Button
              type="default"
              onClick={async () => {
                await axiosHelper.patch(
                  `${API_ENDPOINTS.INQUIRY_MARK_AS_RESOLVED}/${record.id}`
                );
                notify.success("Inquiry marked as resolved!");
                fetchInquiries(
                  pagination.current,
                  pagination.pageSize,
                  searchText
                );
              }}
            >
              Mark as Resolved
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleReplyInquiry = async (values: any) => {
    if (!selectedInquiry) return;

    try {
      setLoading(true);
      const response = await axiosHelper.patch(
        `${API_ENDPOINTS.INQUIRY_REPLY}/${selectedInquiry?.id}`,
        {
          reply_message: values.reply_message,
        }
      );

      if (response?.data) {
        notify.success("Reply sent successfully!");
        setDrawerVisible(false);
        inquiryForm.resetFields();
        fetchInquiries(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleReplyInquiry(values);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Inquiries</h1>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search inquiries..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={inquiries}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} inquiries`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title="Reply to Inquiry"
        placement="right"
        width={400}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={inquiryForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="reply_message"
            label="Reply Message"
            rules={[
              required("Please input your reply message!"),
              maxLength(500),
            ]}
          >
            <Input.TextArea placeholder="Type your reply here..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Reply
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Drawer
        title="View Inquiry Details"
        placement="right"
        width={500}
        onClose={() => setViewDrawerVisible(false)}
        open={viewDrawerVisible}
        destroyOnClose={true}
      >
        {selectedInquiry && (
          <div className={styles.inquiryDetails}>
            <div className={styles.detailItem}>
              <strong>Request Type:</strong>
              <span>{selectedInquiry?.request_type?.title}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Full Name:</strong>
              <span>{selectedInquiry?.full_name}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Email:</strong>
              <span>{selectedInquiry?.email}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Phone Number:</strong>
              <span>{selectedInquiry?.phone_no}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Message:</strong>
              <span>{selectedInquiry?.message}</span>
            </div>
            <div className={styles.detailItem}>
              <strong>Status:</strong>
              <span>{selectedInquiry?.status_name}</span>
            </div>
            {selectedInquiry?.reply_message && (
              <div className={styles.detailItem}>
                <strong>Reply Message:</strong>
                <span>{selectedInquiry?.reply_message}</span>
              </div>
            )}
            {selectedInquiry?.attachment_path && (
              <div className={styles.detailItem}>
                <strong>Attachment:</strong>
                <Image
                  src={selectedInquiry?.attachment_path}
                  alt="Inquiry attachment"
                  style={{ maxWidth: "100%", marginTop: 8 }}
                />
              </div>
            )}
            <div className={styles.detailItem}>
              <strong>Created At:</strong>
              <span>{selectedInquiry?.created_at}</span>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

ManageInquiriesPage.protected = true;
export default ManageInquiriesPage;
