import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ConfigProvider } from 'antd';
import AdminLayout from "@/components/layout/admin/Layout/layout";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import UserLayout from "@/components/layout/user/Layout/Layout";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import AppLoader from "@/components/common/AppLoader";
import Auth from "@/components/Auth";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const getLayout = () => {
    const path: any = router.pathname;
    const isAdminSection = path.startsWith('/admin');
    if (isAdminSection) {
      return (
        <AdminLayout>
          {
            // @ts-ignore
            Component?.protected ?
              <Auth>
                <Component {...pageProps} />
              </Auth>
              :
              <Component {...pageProps} />
          }
        </AdminLayout>
      );
    }

    return (
      <UserLayout>
        <Component {...pageProps} />
      </UserLayout>
    );
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider>
          <AppLoader />
          {getLayout()}
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}
