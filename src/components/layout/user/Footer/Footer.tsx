import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import styles from "./Footer.module.scss";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter className={styles.footer}>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>About Us</Title>
          <Text>Your trusted e-commerce platform for quality products.</Text>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Quick Links</Title>
          <ul className={styles.linkList}>
            <li>
              <Link href="/about" legacyBehavior>
                <a>About</a>
              </Link>
            </li>
            <li>
              <Link href="/contact" legacyBehavior>
                <a>Contact</a>
              </Link>
            </li>
            <li>
              <Link href="/terms" legacyBehavior>
                <a>Terms & Conditions</a>
              </Link>
            </li>
            <li>
              <Link href="/privacy" legacyBehavior>
                <a>Privacy Policy</a>
              </Link>
            </li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Customer Service</Title>
          <ul className={styles.linkList}>
            <li>
              <Link href="/faq" legacyBehavior>
                <a>FAQ</a>
              </Link>
            </li>
            <li>
              <Link href="/shipping" legacyBehavior>
                <a>Shipping Info</a>
              </Link>
            </li>
            <li>
              <Link href="/returns" legacyBehavior>
                <a>Returns</a>
              </Link>
            </li>
            <li>
              <Link href="/support" legacyBehavior>
                <a>Support</a>
              </Link>
            </li>
          </ul>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Title level={4}>Follow Us</Title>
          <Space className={styles.socialLinks}>
            <Link href="#" legacyBehavior>
              <a>
                <GithubOutlined />
              </a>
            </Link>
            <Link href="#" legacyBehavior>
              <a>
                <TwitterOutlined />
              </a>
            </Link>
            <Link href="#" legacyBehavior>
              <a>
                <LinkedinOutlined />
              </a>
            </Link>
          </Space>
        </Col>
      </Row>
      <div className={styles.copyright}>
        <Text>
          © {new Date().getFullYear()} Your E-Commerce. All rights reserved.
        </Text>
      </div>
    </AntFooter>
  );
};

export default Footer;
