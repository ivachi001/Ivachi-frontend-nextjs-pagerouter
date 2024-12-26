import React from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';

const Column = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  { ssr: false }
);

const CustomerCountGraph: React.FC = () => {
  const data = [
    { month: 'Jan', type: 'Purchased', count: 120 },
    { month: 'Jan', type: 'Registered Only', count: 80 },
    { month: 'Feb', type: 'Purchased', count: 140 },
    { month: 'Feb', type: 'Registered Only', count: 90 },
    { month: 'Mar', type: 'Purchased', count: 160 },
    { month: 'Mar', type: 'Registered Only', count: 100 },
    // Add more months as needed
  ];

  const config = {
    data,
    isGroup: true,
    xField: 'month',
    yField: 'count',
    seriesField: 'type',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      style: {
        fill: '#000000',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: 'Category',
      },
      count: {
        alias: 'Count',
      },
    },
    color: ['#1890ff', '#5AD8A6'],
  };

  return (
    <Card title="Customer Analysis">
      <Column {...config} />
    </Card>
  );
};

export default CustomerCountGraph; 