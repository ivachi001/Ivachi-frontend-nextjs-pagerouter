import React from 'react';
import { useRouter } from 'next/router';
import { isAuthorized } from '@/utils/common';
import { appRoutes } from '@/constants/routes';
import AppLoader from './common/AppLoader';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function Auth(props: { children: React.ReactNode }) {
  const router = useRouter();
  const path = router.pathname;
  const { children } = props;

  const userData = useSelector((state: RootState) => state?.userData);
  const isUserLoggedIn = !!userData?.user?.token;
  const currentUserRole = userData?.user?.role || null;

  let componentRoles: string[] = appRoutes[path];
  let isAccessible = isAuthorized(currentUserRole, componentRoles);

  // Handle login redirects based on path and role
  const getLoginRedirect = () => {
    // Check if current path is in admin section
    const isAdminSection = path.startsWith('/admin');
    
    // Redirect to appropriate login page
    if (isAdminSection) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
  };

  React.useEffect(() => {
    if (!isUserLoggedIn) {
      getLoginRedirect();
    }
  }, [isUserLoggedIn, path]);

  // Show loader while checking authentication
  if (!isUserLoggedIn) {
    return <AppLoader />;
  }

  // Allow access if user is logged in and has proper role
  if (isUserLoggedIn && isAccessible) {
    return children;
  }

  // Redirect to 404 if user is logged in but doesn't have access
  if (isUserLoggedIn && !isAccessible) {
    router.push('/404');
    return <AppLoader />;
  }

  return <AppLoader />;
}