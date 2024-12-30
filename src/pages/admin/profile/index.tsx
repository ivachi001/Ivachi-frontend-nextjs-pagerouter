"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store"; // Adjust the import based on your store structure
import { Card, Col, Row } from "antd";
import styles from "./profile.module.scss";

const AdminProfilePage = () => {
  const userData = useSelector((state: RootState) => state.userData); // Access user data from Redux
  console.log("userData", userData);

  return (
    <div className={styles.container}>
      <h1>Admin Profile</h1>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Personal Information">
            <p>
              {/* @ts-ignore */}
              <strong>Full Name:</strong> {userData?.user?.full_name}
            </p>
            <p>
              <strong>Email:</strong> {userData?.user?.email}
            </p>
            <p>
              {/* @ts-ignore */}
              <strong>Phone Number:</strong> {userData?.user?.phone_no}
            </p>
            <p>
              <strong>Role:</strong> {userData?.user?.role}
            </p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Account Information">
            <p>
              <strong>Role:</strong> {userData?.user?.role}
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfilePage;
