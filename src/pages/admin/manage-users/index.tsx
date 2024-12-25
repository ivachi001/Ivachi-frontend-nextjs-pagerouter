'use client';

import React, { useState } from 'react';
import { Table, Button, Drawer, Tag, Space, Switch, Select } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import styles from './manage-users.module.scss';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'regular';
  status: 'active' | 'inactive';
  // joinDate: string;
  // lastLogin: string;
}

// Mock user data
const mockUsers: User[] = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: index  % 2 === 0 ? 'admin' : 'regular',
  status: index  % 2 === 0 ? 'active' : 'inactive',
  // joinDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
  // lastLogin: new Date(Date.now() - Math.random() * 1000000000).toISOString().split('T')[0],
}));

const ManageUsersPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const columns: ColumnsType<User> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'blue' : 'default'}>
          {role.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Regular', value: 'regular' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    // {
    //   title: 'Join Date',
    //   dataIndex: 'joinDate',
    //   key: 'joinDate',
    //   sorter: (a, b) => new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime(),
    // },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={(e) => {
            e.stopPropagation();
            handleEdit(record);
          }}>
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setDrawerVisible(true);
  };

  const handleRowClick = (record: User) => {
    setSelectedUser(record);
    setDrawerVisible(true);
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current || 1,
      pageSize: newPagination.pageSize || 10,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Users</h1>
        <Button type="primary">Add New User</Button>
      </div>

      <Table
        columns={columns}
        dataSource={mockUsers}
        rowKey="id"
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} users`,
          pageSizeOptions: ['10', '20', '50'],
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />

      <Drawer
        title="User Details"
        placement="right"
        width={500}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {selectedUser && (
          <div className={styles.userDetails}>
            <div className={styles.detailRow}>
              <strong>Name:</strong>
              <span>{selectedUser.name}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>Email:</strong>
              <span>{selectedUser.email}</span>
            </div>

            <div className={styles.detailRow}>
              <strong>Role:</strong>
              <Select
                defaultValue={selectedUser.role}
                style={{ width: 120 }}
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'regular', label: 'Regular' },
                ]}
              />
            </div>

            <div className={styles.detailRow}>
              <strong>Status:</strong>
              <Switch
                checked={selectedUser.status === 'active'}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
              />
            </div>

            <div className={styles.detailRow}>
              <strong>Join Date:</strong>
              {/* <span>{selectedUser.joinDate}</span> */}
            </div>

            <div className={styles.detailRow}>
              <strong>Last Login:</strong>
              {/* <span>{selectedUser.lastLogin}</span> */}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default ManageUsersPage; 