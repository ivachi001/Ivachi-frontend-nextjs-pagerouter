import React from "react";
import { Form, Input, Button, Card, Typography } from "antd";
import { MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./forgot-password.module.scss";
import { notify } from "@/utils/common";
import { checkEmail, maxLength, required } from "@/utils/formValidation";

const { Title, Text } = Typography;

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: ForgotPasswordFormData) => {
    try {
      setLoading(true);
     notify.success(
        "Password reset instructions have been sent to your email"
      );
      form.resetFields();
    } catch (error) {
      notify.error("Failed to send reset instructions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <Card className={styles.forgotPasswordCard}>
        <Title level={2} className={styles.title}>
          Reset Password
        </Title>
        <Text className={styles.subtitle}>
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        <Form
          form={form}
          name="forgotPassword"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className={styles.submitButton}
            >
              Send Reset Instructions
            </Button>
          </Form.Item>

          <div className={styles.footer}>
            <Text>Remember your password?</Text>
            <Link href="/login" className={styles.loginLink}>
              Back to Login
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
