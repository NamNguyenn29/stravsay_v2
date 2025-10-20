"use client";

import React, { useEffect, useState } from "react";
import { Card, Form, Switch, Button, Divider, Row, Col, message, Space } from "antd";
import { SendOutlined, SaveOutlined } from "@ant-design/icons";

/**
 * NotificationSettings
 * - Quản lý các cấu hình thông báo (email / SMS / in-app)
 * - Dễ dàng connect backend: có chỗ // TODO để gọi API
 * - Messages tiếng Anh, comment tiếng Việt
 */

type NotificationSettingsType = {
  bookingConfirmationEmail?: boolean;
  paymentConfirmationEmail?: boolean;
  newReviewNotification?: boolean;
  systemAlerts?: boolean;
  smsNotifications?: boolean;
  inAppNotifications?: boolean;
};

export default function NotificationSettings() {
  const [form] = Form.useForm<NotificationSettingsType>();
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // TODO: GET /api/settings/notifications
    // Demo data trước khi có backend
    const demo: NotificationSettingsType = {
      bookingConfirmationEmail: true,
      paymentConfirmationEmail: true,
      newReviewNotification: true,
      systemAlerts: true,
      smsNotifications: false,
      inAppNotifications: true,
    };
    form.setFieldsValue(demo);
  }, [form]);

  // Lưu cài đặt notifications (PUT /api/settings/notifications)
  const handleSave = async (values: NotificationSettingsType) => {
    setLoading(true);
    try {
      // TODO: Gọi API PUT /api/settings/notifications với payload = values
      // Example:
      // await fetch("/api/settings/notifications", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });

      message.success("Notification settings saved successfully.");
    } catch (err) {
      console.error("Save notification settings error:", err);
      message.error("Failed to save notification settings.");
    } finally {
      setLoading(false);
    }
  };

  // Test notification (gọi API test -> gửi mail/sms demo)
  const handleTestNotification = async () => {
    setTesting(true);
    try {
      // TODO: Gọi API POST /api/settings/notifications/test
      // const res = await fetch("/api/settings/notifications/test", { method: "POST" });
      // const json = await res.json();

      // Demo success
      await new Promise((r) => setTimeout(r, 800));
      message.success("Test notification sent (demo).");
    } catch (err) {
      console.error("Test notification error:", err);
      message.error("Failed to send test notification.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card
      title={<span style={{ fontSize: 16, fontWeight: 600 }}>Notification Settings</span>}
      variant="borderless"
      className="shadow-sm rounded-xl"
      style={{ maxWidth: 1200, margin: "0 auto", marginTop: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{}}
      >
        <Divider orientation="left">Email Notifications</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Booking Confirmation Email"
              name="bookingConfirmationEmail"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Payment Confirmation Email"
              name="paymentConfirmationEmail"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Notifications for Admin</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="New Review Notification"
              name="newReviewNotification"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="System Alerts"
              name="systemAlerts"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Other Channels</Divider>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="SMS Notifications"
              name="smsNotifications"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="In-App Notifications"
              name="inAppNotifications"
              valuePropName="checked"
            >
              <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
            </Form.Item>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
          <Space>
            <Button
              icon={<SendOutlined />}
              onClick={handleTestNotification}
              loading={testing}
            >
              Test Notification
            </Button>
            <Button
              onClick={() => {
                form.resetFields();
                message.info("Changes reverted.");
              }}
            >
              Reset
            </Button>
          </Space>

          <Button
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
            loading={loading}
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Card>
  );
}
