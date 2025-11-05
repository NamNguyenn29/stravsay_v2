"use client";
import { useState, useEffect } from "react";
import { Card, Avatar, Form, Input, Button, DatePicker, Tabs, message } from "antd";
import {
    UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, LockOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { User } from "@/model/User";
import { getUserById } from "@/api/UserApi/getUserById";
import { UpdateUser } from "@/model/UpdateUser";
import { updateUser } from "@/api/UserApi/updateUser";
import { motion } from "framer-motion";
import { notification } from "antd";


export default function Profile() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [api, contextHolder] = notification.useNotification();
    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userCookie = getCookie("CURRENT_USER");

            if (userCookie) {
                const user = JSON.parse(userCookie);

                const data = await getUserById(user.id);
                setUser(data.object);

                form.setFieldsValue({
                    email: data.object?.email,
                    fullname: data.object?.fullName,
                    phone: data.object?.phone,
                    dob: data.object?.dateOfBirth ? dayjs(data.object.dateOfBirth) : null,
                });
            }

        } catch (err) {
            console.error("Erro: ", err);

        }
    }
    function getCookie(name: string): string | null {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }




    const handleUpdate = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const updatePayload: UpdateUser = {
                fullName: values.fullname,
                email: values.email,
                phone: values.phone,
                dateOfBirth: values.dob
            }

            const result = await updateUser(updatePayload);
            // await new Promise(resolve => setTimeout(resolve, 800));
            api.success({
                message: "Update information successfully!",
                description: "You have updated information.",
                placement: "topRight",
            });
            if (result.isSuccess) {
                message.success("Update user successfully!");
                loadUser();
            } else {
                message.error(result.message || "Fail to update user!");
            }
        }
        catch (error) {
            console.error(error);
            message.error("Please check information again.");
        } finally {
            setLoading(false);
        }

    };

    return (
        <>{contextHolder}
            <div className="min-h-screen bg-gray-50 flex flex-col items-center p-10">
                <h1 className="text-4xl font-bold text-gray-700 mb-10">My Profile</h1>

                <Card
                    className="w-full max-w-6xl shadow-2xl rounded-3xl border border-gray-200"
                    style={{ padding: "3rem 4rem" }}
                >
                    <div className="flex gap-12">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center w-1/4 border-r pr-8">
                            <Avatar size={128} icon={<UserOutlined />} />
                            <h2 className="text-2xl font-semibold mt-4">{user?.fullName || "User"}</h2>
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
                                                    <motion.div whileTap={{ scale: 0.95 }}>
                                                        <Button
                                                            type="primary"
                                                            loading={loading}
                                                            onClick={handleUpdate}
                                                            size="large"
                                                            style={{
                                                                padding: "12px 64px",
                                                                fontSize: "16px",
                                                                borderRadius: "0.5rem",
                                                                backgroundColor: loading ? "#2563eb" : "#3b82f6",
                                                                transition: "background-color 0.3s ease",
                                                            }}
                                                        >
                                                            {loading ? "Updating..." : "Update"}
                                                        </Button>
                                                    </motion.div>
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
        </>
    );
}
