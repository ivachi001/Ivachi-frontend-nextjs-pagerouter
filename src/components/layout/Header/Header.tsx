import React from "react";
import { Layout, Menu, Button, Space, Dropdown } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useRouter } from "next/navigation";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const router = useRouter();

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {},
    },
  ];

  return (
    <AntHeader className={styles.header}>
      <div className={styles.logo} style={{ backgroundColor: "#1677ff" }}>
        <Link href="/">E-Commerce</Link>
      </div>
      {/* <Menu mode="horizontal" className={styles.menu} /> */}
      <Space className={styles.actions} style={{ backgroundColor: "#1677ff" }}>
        <Button icon={<ShoppingCartOutlined />} type="text" />
        {true ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button icon={<UserOutlined />} type="text">
              Admin User
            </Button>
          </Dropdown>
        ) : (
          <Link href="/login">Sign In</Link>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;