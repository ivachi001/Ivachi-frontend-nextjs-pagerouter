import React from 'react';
import { Spin } from 'antd';
import { hideAppLoader } from '@/store/slices/appConfigSlice';
import { useDispatch, useSelector } from 'react-redux';

const AppLoader: React.FC = () => {
  const dispatch: any = useDispatch();
  const appConfig = useSelector((state: any) => state?.appConfig);

  const handleAppLoader = () => {
    dispatch(hideAppLoader());
  };

  if (!appConfig?.appLoading) {
    return null; // Return null if the app is not loading
  }

  return (
    <div
      className="app-loader-wrapper"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      onClick={handleAppLoader}
    >
      <Spin />
    </div>
  );
};

export default AppLoader;
