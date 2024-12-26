import React from 'react';
import { Card } from 'antd';
import dynamic from 'next/dynamic';

const Column = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  { ssr: false }
);

const ContactQueryGraph: React.FC = () => {
  const data = [
    { month: 'Jan', type: 'Pending', value: 25 },
    { month: 'Jan', type: 'Resolved', value: 45 },
    { month: 'Feb', type: 'Pending', value: 30 },
    { month: 'Feb', type: 'Resolved', value: 50 },
    { month: 'Mar', type: 'Pending', value: 20 },
    { month: 'Mar', type: 'Resolved', value: 60 },
    { month: 'Apr', type: 'Pending', value: 35 },
    { month: 'Apr', type: 'Resolved', value: 55 },
    { month: 'May', type: 'Pending', value: 28 },
    { month: 'May', type: 'Resolved', value: 62 },
    { month: 'Jun', type: 'Pending', value: 32 },
    { month: 'Jun', type: 'Resolved', value: 58 },
  ];

  const config = {
    data,
    isGroup: true,
    xField: 'month',
    yField: 'value',
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
    yAxis: {
      label: {
        formatter: (v: string) => `${v} queries`,
      },
    },
    meta: {
      month: {
        alias: 'Month',
      },
      value: {
        alias: 'Queries',
      },
      type: {
        alias: 'Status',
      },
    },
    color: ['#ff4d4f', '#52c41a'],
    legend: {
      position: 'top',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    tooltip: {
      showTitle: true,
      showMarkers: false,
      fields: ['type', 'value'],
      formatter: (datum: any) => {
        return {
          name: datum.type,
          value: `${datum.value} queries`,
        };
      },
    },
  };

  return (
    <Card title="Contact Queries Status">
      <div style={{ height: 400, width: '100%' }}>
        <Column {...config} />
      </div>
    </Card>
  );
};

export default ContactQueryGraph; 