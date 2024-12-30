import React from "react";
import { Typography } from "antd";
import styles from "./dashboard.module.scss";
import { AppPageProps } from "@/types";
import MetricsOverview from "@/components/dashboard/MetricsOverview";
import CustomerCountGraph from "@/components/dashboard/CustomerCountGraph";
import ProductSalesGraph from "@/components/dashboard/ProductSalesGraph";
import ContactQueryGraph from "@/components/dashboard/ContactQueryGraph";
import ReviewsGraph from "@/components/dashboard/ReviewsGraph";

const { Title } = Typography;

const DashboardPage: AppPageProps = () => {
  return (
    <div className={styles.dashboardContainer}>
      <Title level={2}>Dashboard Overview</Title>
      
      {/* Metrics Overview */}
      <MetricsOverview />

      {/* Customer Analysis */}
      <div style={{ marginTop: 24 }}>
        <CustomerCountGraph />
      </div>

      {/* Product Sales */}
      <div style={{ marginTop: 24 }}>
        <ProductSalesGraph />
      </div>

      {/* Contact Queries */}
      <div style={{ marginTop: 24 }}>
        <ContactQueryGraph />
      </div>

      {/* Reviews Analysis */}
      <div style={{ marginTop: 24 }}>
        <ReviewsGraph />
      </div>
    </div>
  );
};

DashboardPage.protected = true;
export default DashboardPage;
