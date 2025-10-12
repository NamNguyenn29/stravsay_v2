"use client";
import { useState } from "react";
import { Card, Avatar, Form, Input, Button, DatePicker, Tabs } from "antd";
import {
    UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, LockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

export default function Profile() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleUpdate = () => {
        form
            .validateFields()
            .then((values) => {
                setLoading(true);
                setTimeout(() => {
                    console.log("Updated values:", values);
                    setLoading(false);
                }, 1000);
            })
            .catch(() => { });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
            <h1 className="text-4xl font-bold text-gray-700 mb-10">My Profile</h1>

            <Card
                className="w-full max-w-6xl shadow-2xl rounded-3xl border border-gray-200"
                bodyStyle={{ padding: "3rem 4rem" }}
            >
                <div className="flex gap-12">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center w-1/4 border-r pr-8">
                        <Avatar size={128} icon={<UserOutlined />} />
                        <h2 className="text-2xl font-semibold mt-4">Nam Nguyen</h2>
                        <p className="text-gray-500 text-base mt-1">Account Information</p>
                    </div>

                    {/* Form Section */}
                    <div className="flex-1 text-lg">
                        <Tabs
                            defaultActiveKey="1"
                            size="large"
                            tabBarStyle={{ fontSize: "18px" }}
                            items={[
                                {
                                    key: "1",
                                    label: <span className="text-xl font-medium">Profile</span>,
                                    children: (
                                        <Form
                                            layout="vertical"
                                            form={form}
                                            initialValues={{
                                                email: "namnguyen@gmail.com",
                                                fullname: "Nguyen Nam",
                                                phone: "0912345678",
                                                dob: dayjs("2000-01-01"),
                                            }}
                                            style={{ fontSize: "18px" }}
                                        >
                                            <div className="grid grid-cols-2 gap-8">
                                                <Form.Item
                                                    label={<span className="text-lg font-semibold">Email</span>}
                                                    name="email"
                                                    rules={[{ required: true, type: "email" }]}
                                                >
                                                    <Input
                                                        prefix={<MailOutlined style={{ fontSize: 18 }} />}
                                                        size="large"
                                                        style={{ fontSize: "16px", padding: "12px" }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span className="text-lg font-semibold">Phone</span>}
                                                    name="phone"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input
                                                        prefix={<PhoneOutlined style={{ fontSize: 18 }} />}
                                                        size="large"
                                                        style={{ fontSize: "16px", padding: "12px" }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span className="text-lg font-semibold">Full Name</span>}
                                                    name="fullname"
                                                    rules={[{ required: true }]}
                                                >
                                                    <Input
                                                        prefix={<UserOutlined style={{ fontSize: 18 }} />}
                                                        size="large"
                                                        style={{ fontSize: "16px", padding: "12px" }}
                                                    />
                                                </Form.Item>

                                                <Form.Item
                                                    label={<span className="text-lg font-semibold">Date of Birth</span>}
                                                    name="dob"
                                                    rules={[{ required: true }]}
                                                >
                                                    <DatePicker
                                                        format="DD/MM/YYYY"
                                                        suffixIcon={<CalendarOutlined style={{ fontSize: 18 }} />}
                                                        className="w-full"
                                                        size="large"
                                                        style={{ fontSize: "16px", padding: "12px" }}
                                                    />
                                                </Form.Item>
                                            </div>

                                            <div className="flex justify-center mt-6">
                                                <Button
                                                    type="primary"
                                                    loading={loading}
                                                    onClick={handleUpdate}
                                                    size="large"
                                                    className="px-16 py-2 text-lg rounded-md bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Update
                                                </Button>
                                            </div>
                                        </Form>
                                    ),
                                },
                                {
                                    key: "2",
                                    label: <span className="text-xl font-medium">Password</span>,
                                    children: (
                                        <Form layout="vertical" style={{ fontSize: "18px" }}>
                                            <Form.Item
                                                label={<span className="text-lg font-semibold">Current Password</span>}
                                                name="current"
                                            >
                                                <Input.Password
                                                    prefix={<LockOutlined style={{ fontSize: 18 }} />}
                                                    size="large"
                                                    style={{ fontSize: "16px", padding: "12px" }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={<span className="text-lg font-semibold">New Password</span>}
                                                name="new"
                                            >
                                                <Input.Password
                                                    prefix={<LockOutlined style={{ fontSize: 18 }} />}
                                                    size="large"
                                                    style={{ fontSize: "16px", padding: "12px" }}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={<span className="text-lg font-semibold">Confirm Password</span>}
                                                name="confirm"
                                            >
                                                <Input.Password
                                                    prefix={<LockOutlined style={{ fontSize: 18 }} />}
                                                    size="large"
                                                    style={{ fontSize: "16px", padding: "12px" }}
                                                />
                                            </Form.Item>

                                            <div className="flex justify-center mt-6">
                                                <Button
                                                    type="primary"
                                                    size="large"
                                                    className="px-16 py-2 text-lg rounded-md bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Change Password
                                                </Button>
                                            </div>
                                        </Form>
                                    ),
                                },
                            ]}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
