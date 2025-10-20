"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Select,
  Radio,
  Button,
  Divider,
  message,
  Space,
  Switch,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";

/**
 * SystemSettings
 * - Quản lý các tùy chỉnh hệ thống (theme, date/time format, currency)
 * - Dễ dàng mở rộng và kết nối API
 */

type SystemSettingsType = {
  theme?: string;
  dateFormat?: string;
  timeFormat?: string;
  currency?: string;
  autoDarkMode?: boolean;
};

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm<SystemSettingsType>();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // TODO: GET /api/settings/system
    // Dữ liệu demo (trước khi kết nối backend)
    const demo: SystemSettingsType = {
      theme: "light",
      dateFormat: "DD/MM/YYYY",
      timeFormat: "24h",
      currency: "VND",
      autoDarkMode: false,
    };
    form.setFieldsValue(demo);
  }, [form]);

  // Lưu cấu hình hệ thống
  const handleSave = async (values: SystemSettingsType) => {
    try {
      setSaving(true);
      // TODO: Gọi API PUT /api/settings/system
      // await fetch("/api/settings/system", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });

      message.success("System preferences updated successfully.");
    } catch (err) {
      console.error("Save system settings error:", err);
      message.error("Failed to save system preferences.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={<span style={{ fontSize: 16, fontWeight: 600 }}>System Preferences</span>}
      variant="borderless"
      className="shadow-sm rounded-xl"
      style={{ maxWidth: 1200, margin: "0 auto", marginTop: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Divider orientation="left">Appearance</Divider>

        <Form.Item
          label="Theme Color"
          name="theme"
          rules={[{ required: true, message: "Please select a theme color" }]}
        >
          <Radio.Group>
            <Radio value="light">Light</Radio>
            <Radio value="dark">Dark</Radio>
            <Radio value="system">System (Auto)</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Auto Dark Mode"
          name="autoDarkMode"
          valuePropName="checked"
          tooltip="Automatically switch theme based on system preference"
        >
          <Switch checkedChildren="Enabled" unCheckedChildren="Disabled" />
        </Form.Item>

        <Divider orientation="left">Date & Time</Divider>

        <Form.Item
          label="Date Format"
          name="dateFormat"
          rules={[{ required: true, message: "Please select a date format" }]}
        >
          <Select>
            <Select.Option value="DD/MM/YYYY">DD/MM/YYYY</Select.Option>
            <Select.Option value="MM/DD/YYYY">MM/DD/YYYY</Select.Option>
            <Select.Option value="YYYY-MM-DD">YYYY-MM-DD</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Time Format"
          name="timeFormat"
          rules={[{ required: true, message: "Please select a time format" }]}
        >
          <Radio.Group>
            <Radio value="12h">12-hour</Radio>
            <Radio value="24h">24-hour</Radio>
          </Radio.Group>
        </Form.Item>

        <Divider orientation="left">Currency</Divider>

        <Form.Item
          label="Default Currency"
          name="currency"
          rules={[{ required: true, message: "Please select a currency" }]}
        >
          <Select>
            <Select.Option value="VND">Vietnamese Dong (VND)</Select.Option>
            <Select.Option value="USD">US Dollar (USD)</Select.Option>
            <Select.Option value="EUR">Euro (EUR)</Select.Option>
            <Select.Option value="JPY">Japanese Yen (JPY)</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                message.info("Changes reverted.");
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={saving}
            >
              Save Changes
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
};

export default SystemSettings;
