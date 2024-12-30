import React from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { AppPageProps } from '@/types';

const NotFoundWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
`;

const StyledResult = styled(Result)`
  background: white;
  padding: 48px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
`;

const NotFoundPage: AppPageProps = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.userData);

  const handleBackHome = () => {
    if (isAuthenticated && user.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <NotFoundWrapper>
      <StyledResult
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        // extra={[
        //   <Button type="primary" onClick={handleBackHome} key="home">
        //     Back Home
        //   </Button>,
        //   <Button onClick={handleGoBack} key="back">
        //     Go Back
        //   </Button>,
        // ]}
      />
    </NotFoundWrapper>
  );
};

// Set this as a public page without layout
NotFoundPage.protected = false;
export default NotFoundPage; 