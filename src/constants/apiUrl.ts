// https://dev-api.ivachi-dev.in/api/v1/auth/login

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,

  //Common
  PERMISSION_LIST: `${BASE_URL}/common/permission-list`,//Get list of permissions
  ROLE_LIST: `${BASE_URL}/common/role-list`, //Get list of roles 
  COUNTRY_LIST: `${BASE_URL}/common/country-list`, //Get list of countries   
  STATE_LIST: `${BASE_URL}/common/state-list`, //Get states list by country ID  
  CITY_LIST: `${BASE_URL}/common/city-list`, // Get list of cities by state ID
  PRODUCT_LIST: `${BASE_URL}/common/product-list`, // Get list of cities by state ID
  COMBO_LIST: `${BASE_URL}/common/combo-list`, // Get list of cities by state ID

  //Categories
  CATEGORY: `${BASE_URL}/category`,
  CREATE_CATEGORY: `${BASE_URL}/category/create`,
  UPDATE_CATEGORY: `${BASE_URL}/category/update`,
  UPDATE_CATEGORY_STATUS: `${BASE_URL}/category/update-status`,
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
  CREATE_COUPON: `${BASE_URL}/coupon/create`,
  UPDATE_COUPON_STATUS: `${BASE_URL}/coupon/update-status`,

  //Roles
  ROLE_ACTIONS: `${BASE_URL}/role`, // For listing all coupons
  ROLE_UPDATE: `${BASE_URL}/role/update`,

  //Products
  PRODUCT_ACTIONS: `${BASE_URL}/product`,
  PRODUCT_UPDATE: `${BASE_URL}/product/update`,
  PRODUCT_UPDATE_STATUS: `${BASE_URL}/product/update-status`,

  //Inquiry
  INQUIRY_CREATE: `${BASE_URL}/inquiry/create`,
  INQUIRY_GET: `${BASE_URL}/inquiry`,
  INQUIRY_MARK_AS_RESOLVED: `${BASE_URL}/inquiry/mark-as-resolved`,
  INQUIRY_REPLY: `${BASE_URL}/inquiry/reply`,

  //Reviews
  REVIEW_GET: `${BASE_URL}/review`,
  REVIEW_CREATE: `${BASE_URL}/review/create`,
  REVIEW_UPDATE_STATUS: `${BASE_URL}/review/update-status`,

  // GET /api/v1/review Get list of product reviews
  // POST /api/v1/review/create Create a new product review
  // PATCH /api/v1/review/update-status/{id}
};
