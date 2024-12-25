import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import Layout from '../components/layout/Layout/Layout';
import { ConfigProvider } from 'antd';
import AdminLayout from "@/components/layout/admin/Layout/layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <AdminLayout>
        <Component {...pageProps} />
      </AdminLayout>
    </ConfigProvider>
  );
}
