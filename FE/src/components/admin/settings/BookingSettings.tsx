"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  InputNumber,
  Switch,
  Select,
  Button,
  message,
  Divider,
} from "antd";

const { Option } = Select;

const BookingSettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // ✅ Lấy dữ liệu ban đầu từ backend khi trang mở
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // TODO: gọi API thật để lấy dữ liệu booking settings
        // const res = await fetch("/api/settings/booking");
        // const data = await res.json();

        // Dữ liệu demo trước khi có backend
        const data = {
          allowInstantBooking: true,
          minNights: 2,
          maxGuests: 4,
          cancellationPolicy: "moderate",
          checkInTime: "14:00",
          checkOutTime: "12:00",
        };

        form.setFieldsValue(data);
      } catch (err) {
        console.error("Failed to fetch booking settings:", err);
        message.error("Cannot load booking settings.");
      }
    };

    fetchSettings();
  }, [form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("Booking settings:", values);

      // ✅ TODO: Kết nối backend ở đây
      // await fetch("/api/settings/booking", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(values),
      // });

      message.success("Booking & Policy settings saved successfully!");
    } catch (err) {
      console.error("Save booking settings error:", err);
      message.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={<span className="text-lg font-semibold">Booking & Policy Settings</span>}
      variant="borderless"
      className="shadow-sm rounded-xl"
      style={{ maxWidth: 1200, margin: "0 auto", marginTop: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          allowInstantBooking: true,
          minNights: 1,
          maxGuests: 2,
          cancellationPolicy: "flexible",
          checkInTime: "14:00",
          checkOutTime: "12:00",
        }}
      >
        <Divider orientation="left">General</Divider>

        <Form.Item
          label="Allow Instant Booking"
          name="allowInstantBooking"
          valuePropName="checked"
          tooltip="Enable this to allow guests to book instantly without host approval"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Minimum Nights per Booking"
          name="minNights"
          rules={[{ required: true, message: "Please set minimum nights" }]}
        >
          <InputNumber min={1} max={30} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Maximum Guests per Booking"
          name="maxGuests"
          rules={[{ required: true, message: "Please set maximum guests" }]}
        >
          <InputNumber min={1} max={20} className="w-full" />
        </Form.Item>

        <Divider orientation="left">Policy</Divider>

        <Form.Item
          label="Cancellation Policy"
          name="cancellationPolicy"
          rules={[{ required: true, message: "Please select a policy" }]}
        >
          <Select>
            <Option value="flexible">Flexible — full refund 1 day prior</Option>
            <Option value="moderate">
              Moderate — full refund 5 days prior
            </Option>
            <Option value="strict">
              Strict — 50% refund up to 7 days before
            </Option>
          </Select>
        </Form.Item>

        <Form.Item label="Check-in Time" name="checkInTime">
          <Select>
            <Option value="12:00">12:00 PM</Option>
            <Option value="13:00">1:00 PM</Option>
            <Option value="14:00">2:00 PM</Option>
            <Option value="15:00">3:00 PM</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Check-out Time" name="checkOutTime">
          <Select>
            <Option value="10:00">10:00 AM</Option>
            <Option value="11:00">11:00 AM</Option>
            <Option value="12:00">12:00 PM</Option>
          </Select>
        </Form.Item>

        <div className="flex justify-end mt-6">
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save Settings
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default BookingSettings;
