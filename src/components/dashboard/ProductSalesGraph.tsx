import React from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';

const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);

const ProductSalesGraph: React.FC = () => {
  const data = [
    { month: 'Jan', category: 'Skin Care', sales: 350 },
    { month: 'Jan', category: 'Hair Care', sales: 420 },
    { month: 'Jan', category: 'Combo', sales: 280 },
    { month: 'Feb', category: 'Skin Care', sales: 400 },
    { month: 'Feb', category: 'Hair Care', sales: 450 },
    { month: 'Feb', category: 'Combo', sales: 300 },
    // Add more months
  ];

  const config = {
    data,
    xField: 'month',
    yField: 'sales',
    seriesField: 'category',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
  };

  return (
    <Card title="Product Sales Trends">
      <Line {...config} />
    </Card>
  );
};

export default ProductSalesGraph; 