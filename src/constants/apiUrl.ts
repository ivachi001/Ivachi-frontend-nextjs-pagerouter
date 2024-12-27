// https://dev-api.ivachi-dev.in/api/v1/auth/login

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,

  //Categories
  CATEGORY: `${BASE_URL}/category`,
  CREATE_CATEGORY: `${BASE_URL}/category/create`,
  UPDATE_CATEGORY: `${BASE_URL}/category/update`,
  DELETE_CATEGORY: `${BASE_URL}/category/delete`,

  //Users
  CREATE_USER: `${BASE_URL}/user/create`,
  USER_ACTIONS: `${BASE_URL}/user`,
  UPDATE_USER: `${BASE_URL}/user/update`,
  UPDATE_USER_STATUS: `${BASE_URL}/user/update-status`,

  //Customers
  CUSTOMER_ACTIONS: `${BASE_URL}/customer`,
  UPDATE_CUSTOMER: `${BASE_URL}/customer/update`,
  UPDATE_CUSTOMER_STATUS: `${BASE_URL}/customer/update-status`,

  //Coupons
  COUPON: `${BASE_URL}/coupon`, // For listing all coupons
  CREATE_COUPON: `${BASE_URL}/coupon/create`
};
