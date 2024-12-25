import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from '../components/layout/Layout/Layout';
import { ConfigProvider } from 'antd';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ConfigProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  );
}
