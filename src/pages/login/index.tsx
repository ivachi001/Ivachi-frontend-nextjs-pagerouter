import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./login.module.scss";
import { checkEmail, maxLength, required } from "@/utils/formValidation";
import { useRouter } from "next/router";
import OTPInput from "react-otp-input";
import { notify } from "@/utils/common";
import axiosHelper from "@/utils/axiosHelper";
import Cookies from "js-cookie";
import { API_ENDPOINTS } from "@/constants/apiUrl";

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResponse {
  id: number;
  full_name: string;
  email: string;
  phone_no: string;
  token: string;
  token_type: string;
  expires_in: number;
  role: string | null;
  role_id: number | null;
  permissions: string[];
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [loginOtp, setLoginOtp] = useState("");

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    try {
      const response = await axiosHelper.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        {
          isAdmin: true,
          ...values
        }
      );

      // Store the token
      Cookies.set('authToken', response.token);
      
      notify.success("Login successful");
      router.push("/admin/dashboard");
    } catch (error) {
      // Error is already handled by apiErrors function
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (loginOtp.length !== 4) {
      notify.error("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      // Simulating API call for demo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      notify.success("Login successful");
      router.push("/dashboard");

      // Uncomment below for actual API integration
      // const response = await authService.verifyOTP(loginOtp);
      // if (response.success) {
      //   notify.success("Login successful");
      //   router.push("/dashboard");
      // } else {
      //   notify.error("Invalid OTP. Please try again.");
      // }
    } catch (error) {
      notify.error("OTP verification failed. Please try again.");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <Title level={2} className={styles.title}>
          Welcome Back
        </Title>
        <Text className={styles.subtitle}>
          {show2FA
            ? "Enter OTP sent to your email"
            : "Please enter your credentials to login"}
        </Text>

        {show2FA ? (
          <div className={styles.otpWrapper}>
            <Form layout="vertical">
              <Form.Item className={styles.otpInput}>
                <OTPInput
                  value={loginOtp}
                  onChange={setLoginOtp}
                  numInputs={4}
                  renderSeparator={<span>-</span>}
                  renderInput={(props) => (
                    <input
                      {...props}
                      className={styles.optInput}
                      type="number"
                      pattern="\d*"
                    />
                  )}
                  containerStyle={styles.otpContainer}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  onClick={handleVerifyOTP}
                  loading={loading}
                  block
                  size="large"
                  className={styles.submitButton}
                >
                  Verify OTP
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="default"
                  onClick={() => {
                    setShow2FA(false);
                    setLoginOtp("");
                  }}
                  block
                  size="large"
                  className={styles.backButton}
                >
                  Back to Login
                </Button>
              </Form.Item>
            </Form>
          </div>
        ) : (
          <Form
            form={form}
            name="login"
            onFinish={handleLogin}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[required(), checkEmail(), maxLength(100)]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Email"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item name="password" rules={[required(), maxLength(50)]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item className={styles.forgotPassword}>
              <Link href="/forgot-password">Forgot password?</Link>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                className={styles.loginButton}
              >
                Log in
              </Button>
            </Form.Item>

            <Divider plain>Or</Divider>

            <div className={styles.register}>
              <Text>Don't have an account?</Text>&nbsp;
              <Link href="/register" className={styles.registerLink}>
                Register now
              </Link>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default LoginPage;
