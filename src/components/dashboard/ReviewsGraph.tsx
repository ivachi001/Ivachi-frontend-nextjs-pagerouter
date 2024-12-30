import React from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';

const Area = dynamic(
  () => import('@ant-design/plots').then(({ Area }) => Area),
  { ssr: false }
);

const ReviewsGraph: React.FC = () => {
  const data = [
    { month: 'Jan', type: 'Total Reviews', count: 80 },
    { month: 'Jan', type: 'Pending Response', count: 20 },
    { month: 'Feb', type: 'Total Reviews', count: 100 },
    { month: 'Feb', type: 'Pending Response', count: 25 },
    // Add more months
  ];

  const config = {
    data,
    xField: 'month',
    yField: 'count',
    seriesField: 'type',
    smooth: true,
    areaStyle: {
      fillOpacity: 0.6,
    },
  };

  return (
    <Card title="Product Reviews Analysis">
      <Area {...config} />
    </Card>
  );
};

export default ReviewsGraph; 