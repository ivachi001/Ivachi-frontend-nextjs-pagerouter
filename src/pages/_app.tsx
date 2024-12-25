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

export default function App({ Component, pageProps }: AppProps) {
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    // Get user role from cookies or your auth system
    const role = Cookies.get('userRole');
    setUserRole(role as 'admin' | 'user' || 'admin'); // Default to user if no role found
  }, []);

  const getLayout = () => {
    if (userRole === 'admin') {
      return (
        <AdminLayout>
          <Component {...pageProps} />
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
