"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Switch,
  Button,
  Divider,
  message,
  Popconfirm,
} from "antd";

const SecuritySettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: Gọi API thật ở đây
        // const res = await fetch("/api/settings/security");
        // const data = await res.json();
        const data = {
          twoFactorAuth: false,
          emailLoginAlert: true,
        };
        form.setFieldsValue(data);
      } catch (err) {
        console.error("Failed to fetch security settings:", err);
        message.error("Cannot load security settings.");
      }
    };

    fetchSettings();
  }, [form]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const values = await form.validateFields();

      // TODO: Gọi API thật để lưu
      // await fetch("/api/settings/security", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });

      message.success("Security settings updated successfully.");
    } catch (err) {
      console.error("Save security settings error:", err);
      message.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields([
        "currentPassword",
        "newPassword",
        "confirmPassword",
      ]);

      if (values.newPassword !== values.confirmPassword) {
        message.error("New passwords do not match!");
        return;
      }

      // TODO: Kết nối backend ở đây
      // await fetch("/api/settings/change-password", { ... });

      message.success("Password changed successfully.");
      form.resetFields(["currentPassword", "newPassword", "confirmPassword"]);
    } catch (err) {
      console.error("Password change error:", err);
      message.error("Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAll = () => {
    // TODO: Gọi API logout tất cả session
    message.success("All sessions have been logged out.");
  };

  return (
    <Card
      title={<span className="text-lg font-semibold">Security Settings</span>}
      variant="borderless"
      className="shadow-sm rounded-xl"
      style={{ maxWidth: 1200, margin: "0 auto", marginTop: 24 }}
    >
      <Form form={form} layout="vertical">
        <Divider orientation="left">Account Security</Divider>

        <Form.Item
          label="Two-Factor Authentication (2FA)"
          name="twoFactorAuth"
          valuePropName="checked"
          tooltip="Adds an extra layer of security to your account"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Email Login Notifications"
          name="emailLoginAlert"
          valuePropName="checked"
          tooltip="Receive an email when a new login occurs"
        >
          <Switch />
        </Form.Item>

        <div className="flex justify-end mb-6">
          <Button type="primary" onClick={handleSave} loading={saving}>
            Save Changes
          </Button>
        </div>

        <Divider orientation="left">Change Password</Divider>

        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: "Enter your current password" }]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Enter new password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          rules={[{ required: true, message: "Please confirm your new password" }]}
        >
          <Input.Password placeholder="Re-enter new password" />
        </Form.Item>

        <div className="flex justify-end mb-6">
          <Button type="primary" onClick={handleChangePassword} loading={loading}>
            Change Password
          </Button>
        </div>

        <Divider orientation="left">Session Control</Divider>

        <Popconfirm
          title="Sign out all devices?"
          description="This will log you out from all active sessions."
          okText="Yes, log out"
          cancelText="Cancel"
          onConfirm={handleLogoutAll}
        >
          <Button danger>Sign out of all devices</Button>
        </Popconfirm>
      </Form>
    </Card>
  );
};

export default SecuritySettings;
