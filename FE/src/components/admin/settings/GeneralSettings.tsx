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
  Divider,
  Space,
  Spin,
  notification,
} from "antd";
import { UndoOutlined, SaveOutlined } from "@ant-design/icons";
import type { FormInstance } from "antd";
import { settingService } from "@/services/settingService";
import type { Setting } from "@/model/Setting";

type SettingFormData = Omit<Setting, "id" | "updatedDate">;

export default function GeneralSettings() {
  const [form] = Form.useForm<SettingFormData>();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settingId, setSettingId] = useState("");
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await settingService.getSetting();
        if (response.data.isSuccess && response.data.object) {
          const setting: Setting = response.data.object;
          setSettingId(setting.id);
          form.setFieldsValue({
            contactEmail: setting.contactEmail,
            contactPhone: setting.contactPhone,
            address: setting.address,
            status: setting.status,
          });
        } else {
          api.error({
            message: "Load Failed",
            description: response.data.message || "Failed to load settings",
            placement: "topRight",
          });
        }
      } catch (err) {
        api.error({
          message: "Error",
          description: "Failed to load settings",
          placement: "topRight",
        });
      } finally {
        setFetching(false);
      }
    };
    fetchSetting();
  }, [form, api]);

  const handleSave = async (values: SettingFormData) => {
    setLoading(true);
    try {
      await settingService.updateSetting({
        id: settingId,
        ...values,
        updatedDate: new Date().toISOString(),
      });
      api.success({
        message: "Update Success!",
        description: "Settings have been saved successfully",
        placement: "topRight",
        duration: 3,
      });
    } catch (err) {
      api.error({
        message: "Update Failed",
        description: "Failed to save settings. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Card style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", minHeight: 400 }}>
        <Spin size="large" />
      </Card>
    );
  }

  return (
    <Card style={{ maxWidth: 1200, margin: "0 auto", borderRadius: 12 }}>
      <div style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: 18 }}>General Settings</h3>
        <div style={{ color: "#6b7280", marginTop: 6 }}>Configure hotel contact information</div>
      </div>

      <Divider style={{ margin: "12px 0 18px" }} />

      {contextHolder}

      <Form<SettingFormData>
        form={form}
        layout="vertical"
        onFinish={handleSave}
      >
        <Row gutter={[24, 8]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Contact Email"
              name="contactEmail"
              rules={[
                { required: true, message: "Please enter email" },
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

          <Col xs={24} md={12}>
            <Form.Item
              label="Contact Phone"
              name="contactPhone"
              rules={[{ required: true, message: "Please enter phone" }]}
            >
              <Input placeholder="+84 912 345 678" />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value={1}>Active</Select.Option>
                <Select.Option value={0}>Inactive</Select.Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              <Button icon={<UndoOutlined />} onClick={() => form.resetFields()}>
                Reset
              </Button>
              <Button type="primary" icon={<SaveOutlined />} htmlType="submit" loading={loading}>
                Save
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}