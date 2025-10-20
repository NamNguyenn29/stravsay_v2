"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  message,
  Divider,
  Space,
} from "antd";
import { UndoOutlined, SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

/**
 * TODO: replace demo fetch/save with real API calls
 */

export default function GeneralSettings() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    // TODO: GET /api/settings/general
    // Demo data để hiển thị trước khi có backend
    const demo = {
      hotelName: "StravStay Hotel",
      contactEmail: " stravstay@gmail.com",
      contactPhone: "+84912345678",
      address: "123 My Phuoc Tan Van, Chanh Hiep, Ho Chi Minh",
      timezone: "Asia/Ho_Chi_Minh",
      defaultLanguage: "en",
      websiteUrl: "https://stravstay.example",
    };
    setInitialValues(demo);
    form.setFieldsValue(demo);
  }, [form]);

  // Reset về giá trị ban đầu (từ server/demo)
  const handleReset = () => {
    if (initialValues) form.setFieldsValue(initialValues);
    else form.resetFields();
    message.info("Changes reverted.");
  };

  // Validate phone (simple) và URL bằng regex (basic)
  const validatePhone = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const phoneRe = /^[+0-9\s\-()]{6,20}$/;
    return phoneRe.test(value) ? Promise.resolve() : Promise.reject("Invalid phone number");
  };

  const validateUrl = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    try {
      // URL constructor phức tạp cho browser env; dùng regex đơn giản
      const urlRe =
        /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w\-._~:?#[\]@!$&'()*+,;=\/%]*)?$/i;
      return urlRe.test(value) ? Promise.resolve() : Promise.reject("Invalid URL");
    } catch {
      return Promise.reject("Invalid URL");
    }
  };

  // Lưu dữ liệu (PUT /api/settings/general)
  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // TODO: call real backend API: PUT /api/settings/general
      // Example:
      // await fetch("/api/settings/general", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });

      // Demo: cập nhật local state
      setInitialValues(values);
      message.success("Settings saved successfully.");
    } catch (err) {
      console.error("Save general settings error:", err);
      message.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      variant="borderless"
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>General Settings</h3>
        <div style={{ color: "#6b7280", marginTop: 6 }}>
          Configure basic hotel info and public contact details.
        </div>
      </div>

      <Divider style={{ margin: "12px 0 18px" }} />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={initialValues ?? undefined}
      >
        <Row gutter={[24, 8]}>
          {/* Left column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Hotel Name"
              name="hotelName"
              rules={[{ required: true, message: "Please enter hotel name" }]}
            >
              <Input placeholder="e.g. StravStay Central" />
            </Form.Item>

            <Form.Item
              label="Contact Email"
              name="contactEmail"
              rules={[
                { required: true, message: "Please enter contact email" },
                { type: "email", message: "Invalid email" },
              ]}
            >
              <Input placeholder="contact@example.com" />
            </Form.Item>

            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <Input.TextArea rows={3} placeholder="Full address" />
            </Form.Item>
          </Col>

          {/* Right column */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Contact Phone"
              name="contactPhone"
              rules={[{ validator: validatePhone }]}
            >
              <Input placeholder="+84 912 345 678" />
            </Form.Item>

            <Form.Item label="Timezone" name="timezone">
              <Select showSearch placeholder="Select timezone">
                <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</Option>
                <Option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</Option>
                <Option value="Europe/London">Europe/London (GMT+0)</Option>
                <Option value="UTC">UTC</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Default Language" name="defaultLanguage">
              <Select placeholder="Select default language">
                <Option value="en">English</Option>
                <Option value="vi">Tiếng Việt</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Website URL" name="websiteUrl" rules={[{ validator: validateUrl }]}>
              <Input placeholder="https://example.com" />
            </Form.Item>
          </Col>

          {/* Buttons row full width */}
          <Col xs={24}>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
              <Space>
                <Button icon={<UndoOutlined />} onClick={handleReset}>
                  Reset
                </Button>

                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  htmlType="submit"
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Space>
            </div>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
