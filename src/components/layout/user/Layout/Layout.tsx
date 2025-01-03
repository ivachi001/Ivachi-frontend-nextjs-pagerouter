import React from "react";
import { Layout } from "antd";
import dynamic from "next/dynamic";
import styles from "./Layout.module.scss";
 interface UserLayoutProps {
    children: React.ReactNode;
} 
const { Content } = Layout;
const Header = dynamic(() => import("../Header/Header"), {
  ssr: true,
  loading: () => <div style={{ height: "64px" }} />,
});
const Footer = dynamic(() => import("../Footer/Footer"), {
  ssr: true,
  loading: () => <div style={{ height: "200px" }} />,
});

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <Layout className={styles.layout}>
      <Header />
      <Content className={styles.content}>
        <div className={styles.contentWrapper}>{children}</div>
      </Content>
      <Footer />
    </Layout>
  );
};

export default UserLayout;
