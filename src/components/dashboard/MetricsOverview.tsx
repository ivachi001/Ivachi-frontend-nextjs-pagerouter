import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, ShoppingOutlined } from '@ant-design/icons';

const MetricsOverview: React.FC = () => {
  const metrics = {
    newCustomers: 150,
    healthCareItems: 320,
    skinCareItems: 450,
    comboItems: 280,
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="New Customers (Last Month)"
            value={metrics.newCustomers}
            prefix={<UserOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Health Care Items Sold"
            value={metrics.healthCareItems}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Skin Care Items Sold"
            value={metrics.skinCareItems}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Combo Products Sold"
            value={metrics.comboItems}
            prefix={<ShoppingOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default MetricsOverview; 