import React from "react";
import { Layout, Menu, Button, Space, Dropdown } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { handleUnauthorizeAdmin } from "@/utils/common";
import { clearUserData } from "@/store/slices/userDataSlice";
import { hideAppLoader, showAppLoader } from "@/store/slices/appConfigSlice";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const router = useRouter();
  const userData = useSelector((state: any) => state?.userData);
  const dispatch = useDispatch();

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    {
      key: "logout",
      label: "Logout",
      onClick: () => {
        dispatch(showAppLoader());
        handleUnauthorizeAdmin()
      },
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
        {userData?.isAuthenticated ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button icon={<UserOutlined />} type="text">
              {userData?.user?.full_name}
            </Button>
          </Dropdown>
        ) : (
          <Link href="/admin/login">Login</Link>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;
