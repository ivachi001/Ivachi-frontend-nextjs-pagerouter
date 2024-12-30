import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, Divider, message } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./register.module.scss";
import {
  checkEmail,
  maxLength,
  minLength,
  required,
} from "@/utils/formValidation";

const { Title, Text } = Typography;

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: RegisterFormData) => {
    try {
      setLoading(true);
      // Replace with your actual registration API call
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        message.success("Registration successful! Please login.");
        router.push("/login");
      } else {
        message.error(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      message.error("Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard}>
        <Title level={2} className={styles.title}>
          Create Account
        </Title>
        <Text className={styles.subtitle}>
          Please fill in the details below to create your account
        </Text>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item name="name" rules={[required(), maxLength(50)]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="Full Name"
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[required(), checkEmail(), maxLength(100)]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[required(), minLength(8), maxLength(50)]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={styles.registerButton}
            >
              Register
            </Button>
          </Form.Item>

          <Divider plain>Or</Divider>

          <div className={styles.login}>
            <Text>Already have an account?</Text>
            <Link href="/login" className={styles.loginLink}>
              Login now
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
