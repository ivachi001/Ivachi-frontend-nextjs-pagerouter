import { useRouter } from "next/navigation";
import { Layout, Menu } from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import styles from "./admin.module.scss";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

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
      key: "users",
      icon: <UserOutlined />,
      label: "Users",
      onClick: () => router.push("/admin/manage-users"),
    },
    {
      key: "categories",
      icon: <SettingOutlined />,
      label: "Categories",
      onClick: () => router.push("/admin/manage-categories"),
    },
    {
      key: "products",
      icon: <ShoppingOutlined />,
      label: "Products",
      onClick: () => router.push("/admin/manage-products"),
    },
  ];

  return (
    <Layout
      className={`${styles.adminLayout} admin-layout`}
      style={{ width: "100%", margin: 0 }}
    >
      {
        userData?.isAuthenticated && (
          <>
            <Header />
            <Sider
              width={200}
              className={styles.sider}
              style={{ background: "#1677ff", marginTop: "65px" }}
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["products"]}
                items={menuItems}
                className={styles.menu}
              />
            </Sider>
          </>
        )
      }
      <Content className={styles.content} style={{ padding: 0, marginTop: "65px" }}>
        {children}
      </Content>
    </Layout>
  );
}
