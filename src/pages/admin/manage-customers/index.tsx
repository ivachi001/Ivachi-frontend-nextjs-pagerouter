"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Drawer,
  Space,
  Form,
  Input,
  Select,
  DatePicker,
} from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import styles from "./manage-customers.module.scss";
import { AppPageProps } from "@/types";
import { API_ENDPOINTS } from "@/constants/apiUrl";
import axiosHelper from "@/utils/axiosHelper";
import { notify } from "@/utils/common";
import { required, maxLength } from "@/utils/formValidation";
import { debounce } from "lodash";
import dayjs from "dayjs";
import { DefaultOptionType } from "antd/es/select";

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  dob?: string;
  address?: string;
  zipcode?: string;
  country_id?: number;
  state_id?: number;
  city_id?: number;
  status?: string;
}

const ManageCustomersPage: AppPageProps = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [customerForm] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const fetchCustomers = async (page = 1, perPage = 10, search = "") => {
    try {
      setLoading(true);
      const response: any = await axiosHelper.get(
        API_ENDPOINTS.CUSTOMER_ACTIONS,
        {
          page,
          per_page: perPage,
          search,
        }
      );

      if (response?.list_data) {
        setCustomers(response.list_data);
        setPagination({
          current: response.page,
          pageSize: response.per_page,
          total: response.total_records,
        });
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerById = async (id: number) => {
    try {
      const response: any = await axiosHelper.get(
        `${API_ENDPOINTS.CUSTOMER_ACTIONS}/${id}`
      );
      return response;
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch customer details");
      return null;
    }
  };

  const fetchCountries = async () => {
    try {
      const response: any = await axiosHelper.get(API_ENDPOINTS.COUNTRY_LIST);
      setCountries(response);
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch countries");
    }
  };

  const fetchStates = async (countryId: number) => {
    try {
      const response: any = await axiosHelper.get(
        `${API_ENDPOINTS.STATE_LIST}/${countryId}`
      );
      setStates(response);
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch states");
    }
  };

  const fetchCities = async (stateId: number) => {
    try {
      const response: any = await axiosHelper.get(
        `${API_ENDPOINTS.CITY_LIST}/${stateId}`
      );
      setCities(response);
    } catch (error: any) {
      notify.error(error?.message || "Failed to fetch cities");
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchCountries(); // Fetch countries on component mount
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchText(value);
        setPagination((prev) => ({
          ...prev,
          current: 1,
        }));
        fetchCustomers(1, pagination.pageSize, value);
      }, 500),
    [pagination.pageSize]
  );

  const columns: ColumnsType<Customer> = [
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.first_name} ${record.last_name}`,
      sorter: (a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone_no",
      key: "phone_no",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(record.id);
            }}
          >
            Edit
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = async (customerId: number) => {
    const customer = await fetchCustomerById(customerId);
    if (customer) {
      setSelectedCustomer(customer);
      customerForm.setFieldsValue({
        ...customer,
        dob: customer.dob ? dayjs(customer.dob, "YYYY-MM-DD") : null,
      });
      fetchStates(customer.country_id); // Fetch states based on the selected country
      fetchCities(customer.state_id); // Fetch cities based on the selected state
      setDrawerVisible(true);
    }
  };

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    fetchCustomers(newPagination.current || 1, newPagination.pageSize || 10);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedCustomer(null);
    customerForm.resetFields();
    setStates([]); // Reset states
    setCities([]); // Reset cities
  };

  const handleUpdateCustomer = async (values: any) => {
    if (!selectedCustomer) return;

    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        dob: values.dob ? dayjs(values.dob).format("YYYY-MM-DD") : null,
      };

      const response = await axiosHelper.put(
        `${API_ENDPOINTS.UPDATE_CUSTOMER}/${selectedCustomer.id}`,
        formattedValues
      );

      if (response?.data) {
        notify.success("Customer updated successfully!");
        setDrawerVisible(false);
        customerForm.resetFields();
        fetchCustomers(pagination.current, pagination.pageSize, searchText);
      }
    } catch (error: any) {
      notify.error(error?.message || "Failed to update customer");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    handleUpdateCustomer(values);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Customers</h1>
      </div>

      <div className={styles.tableActions}>
        <Input
          placeholder="Search customers..."
          allowClear
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ width: 300, marginBottom: 16 }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={customers}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} customers`,
          pageSizeOptions: ["10", "20", "50"],
        }}
      />

      <Drawer
        title="Edit Customer"
        placement="right"
        width={400}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        destroyOnClose={true}
      >
        <Form
          form={customerForm}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[required("Please input first name!"), maxLength(50)]}
          >
            <Input placeholder="First Name" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[required("Please input last name!"), maxLength(50)]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[required("Please input email!")]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone_no"
            label="Phone Number"
            rules={[required("Please input phone number!"), maxLength(15)]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            name="dob"
            label="Date of Birth"
            rules={[required("Please input date of birth!")]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              placeholder="Select Date"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[required("Please input address!"), maxLength(100)]}
          >
            <Input placeholder="Address" />
          </Form.Item>

          <Form.Item
            name="zipcode"
            label="Zip Code"
            rules={[required("Please input zip code!"), maxLength(10)]}
          >
            <Input placeholder="Zip Code" />
          </Form.Item>

          <Form.Item
            name="country_id"
            label="Country"
            rules={[required("Please select country!")]}
          >
            <Select
              placeholder="Select Country"
              onChange={(value) => {
                customerForm.setFieldsValue({
                  state_id: undefined,
                  city_id: undefined,
                }); // Reset state and city
                fetchStates(value); // Fetch states based on selected country
              }}
              showSearch
              allowClear
              filterOption={(
                input: string,
                option: DefaultOptionType | undefined
              ) =>
                // @ts-ignore
                (option?.children.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
            >
              {countries.map((country) => (
                <Select.Option key={country.id} value={country.id}>
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="state_id"
            label="State"
            rules={[required("Please select state!")]}
          >
            <Select
              placeholder="Select State"
              onChange={(value) => {
                customerForm.setFieldsValue({ city_id: undefined }); // Reset city
                fetchCities(value); // Fetch cities based on selected state
              }}
              showSearch
              allowClear
              filterOption={(
                input: string,
                option: DefaultOptionType | undefined
              ) =>
                // @ts-ignore
                (option?.children.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
            >
              {states.map((state) => (
                <Select.Option key={state.id} value={state.id}>
                  {state.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="city_id"
            label="City"
            rules={[required("Please select city!")]}
          >
            <Select
              placeholder="Select City"
              showSearch
              allowClear
              filterOption={(
                input: string,
                option: DefaultOptionType | undefined
              ) =>
                // @ts-ignore
                (option?.children.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
            >
              {cities.map((city) => (
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Status"
            rules={[required("Please select status!")]}
          >
            <Select
              placeholder="Select Status"
              showSearch
              allowClear
              filterOption={(
                input: string,
                option: DefaultOptionType | undefined
              ) =>
                // @ts-ignore
                (option?.children.toLowerCase() ?? "").includes(
                  input.toLowerCase()
                )
              }
            >
              <Select.Option value={1}>Active</Select.Option>
              <Select.Option value={0}>Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Customer
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

ManageCustomersPage.protected = true;
export default ManageCustomersPage;
