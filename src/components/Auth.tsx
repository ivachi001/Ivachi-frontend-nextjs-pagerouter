import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/router';

import { isAuthorized } from '@/utils/common';
import { appRoutes } from '@/constants/routes';
import AppLoader from './common/AppLoader';

export default function Auth(props: any) {
  const router = useRouter();
  const path: any = router.pathname;
  // console.log('router',router, path);
  let { children }: any = props;

  const sessionState:any = null;
  const { data: session, status } = sessionState;
  //@ts-ignore
  const currentUserRole = sessionState?.data?.user?.role_name.length ? sessionState?.data?.user?.role_name : null;

  const isUser = !!session?.user;
  let componentRoles: any = appRoutes[path];

  // return;
  let isAccessible = isAuthorized(currentUserRole, componentRoles);

  useEffect(() => {

    if (status === "loading") return
    if (!isUser) {
      router.push('/login')
    }

  }, [isUser, status])

  if (isUser && isAccessible) {
    return children
  }

  //Redirect to respective home page if the unauthorized user tries to access page. 
  if (isUser && !isAccessible) {
    router.push('/apps');
  }

  return <AppLoader />
}