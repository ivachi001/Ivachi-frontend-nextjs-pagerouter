import React from "react";
import { Card, Col, Row, Typography } from "antd";
import styles from "./dashboard.module.scss"; // Create this file for styling

const { Title } = Typography;

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Title level={2}>Admin Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Users" bordered={false}>
            <p>100</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Products" bordered={false}>
            <p>250</p>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Categories" bordered={false}>
            <p>15</p>
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Recent Activity" bordered={false}>
            <p>No recent activity to display.</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;
