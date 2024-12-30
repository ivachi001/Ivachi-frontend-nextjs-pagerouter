import { useRouter } from "next/navigation";
import { Layout, Menu } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  MoneyCollectOutlined,
  DashboardOutlined,
  SettingOutlined,
  LoginOutlined,
  MessageOutlined,
  StarOutlined,
} from "@ant-design/icons";
import styles from "./admin.module.scss";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { appTheme } from "@/constants/appDefaults";

const { Sider, Content } = Layout;
const Header = dynamic(() => import("../Header/Header"), {
  ssr: true,
  loading: () => <div style={{ height: "64px" }} />,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const userData = useSelector((state: any) => state?.userData);

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => router.push("/admin/dashboard"),
    },
    {
      key: "customers",
      icon: <UsergroupAddOutlined />,
      label: "Customers",
      onClick: () => router.push("/admin/manage-customers"),
    },
    {
      key: "coupons",
      icon: <MoneyCollectOutlined />,
      label: "Coupons",
      onClick: () => router.push("/admin/manage-coupons"),
    },
    {
      key: "categories",
      icon: <SettingOutlined />,
      label: "Categories",
      onClick: () => router.push("/admin/manage-categories"),
    },
    {
      key: "reviews",
      icon: <StarOutlined />,
      label: "Reviews",
      onClick: () => router.push("/admin/manage-reviews"),
    },
    {
      key: "inquiries",
      icon: <MessageOutlined />,
      label: "Inquiries",
      onClick: () => router.push("/admin/manage-inquiries"),
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Products",
      onClick: () => router.push("/admin/manage-products"),
    },
    {
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => router.push("/admin/manage-users"),
    },
    {
      key: "roles",
      icon: <LoginOutlined />,
      label: "Roles",
      onClick: () => router.push("/admin/manage-roles"),
    },
  ];

  return (
    <Layout
      className={`${styles.adminLayout} admin-layout`}
      style={{ width: "100%", margin: 0 }}
    >
      {userData?.isAuthenticated && (
        <>
          <Header />
          <Sider
            width={200}
            className={styles.sider}
            style={{ background: appTheme.primaryColor, marginTop: "65px" }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={["products"]}
              items={menuItems}
              className={styles.menu}
            />
          </Sider>
        </>
      )}
      <Content
        className={styles.content}
        style={{ padding: 0, marginTop: "65px" }}
      >
        {children}
      </Content>
    </Layout>
  );
}
