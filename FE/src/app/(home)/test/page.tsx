"use client";
import React, { useState } from "react";
import { Table, Button, Modal, Form, Select, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";

// 🧩 Kiểu dữ liệu User (có thể có nhiều role)
interface User {
    id: number;
    name: string;
    email: string;
    roles: string[]; // 👈 mảng các vai trò
}

// ⚙️ Dữ liệu mẫu
const initialUsers: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", roles: ["Customer"] },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", roles: ["Manager", "Staff"] },
    { id: 3, name: "Michael Lee", email: "michael@example.com", roles: ["Admin"] },
];

const roleOptions = [
    { label: "Admin", value: "Admin" },
    { label: "Manager", value: "Manager" },
    { label: "Staff", value: "Staff" },
    { label: "Customer", value: "Customer" },
];

const ChangeUserRole: React.FC = () => {
    const [users, setUsers] = useState<User[]>(initialUsers);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();

    // 🧭 Mở modal chỉnh role
    const openChangeRoleModal = (user: User) => {
        setSelectedUser(user);
        form.setFieldsValue({ newRoles: user.roles }); // set mảng role cũ
        setIsModalVisible(true);
    };

    // 💾 Lưu thay đổi vai trò
    const handleSaveRole = async () => {
        try {
            const values = await form.validateFields();
            const newRoles: string[] = values.newRoles;

            if (!selectedUser) return;

            Modal.confirm({
                title: "Confirm Role Change",
                content: `Are you sure you want to set roles for ${selectedUser.name} to: ${newRoles.join(", ")}?`,
                okText: "Yes, Change",
                cancelText: "Cancel",
                onOk: () => {
                    setUsers((prev) =>
                        prev.map((u) =>
                            u.id === selectedUser.id ? { ...u, roles: newRoles } : u
                        )
                    );
                    message.success("User roles updated successfully!");
                    setIsModalVisible(false);
                },
            });
        } catch (err) {
            console.error(err);
        }
    };

    // 🎨 Cột hiển thị người dùng
    const columns: ColumnsType<User> = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Roles",
            dataIndex: "roles",
            key: "roles",
            render: (roles: string[]) =>
                roles.map((role) => {
                    const color =
                        role === "Admin"
                            ? "red"
                            : role === "Manager"
                                ? "blue"
                                : role === "Staff"
                                    ? "orange"
                                    : "green";
                    return (
                        <Tag color={color} key={role}>
                            {role}
                        </Tag>
                    );
                }),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="link" onClick={() => openChangeRoleModal(record)}>
                    Change Roles
                </Button>
            ),
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Management</h2>

            <Table columns={columns} dataSource={users} rowKey="id" pagination={false} />

            <Modal
                title="Change User Roles"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={handleSaveRole}
                okText="Save Changes"
            >
                <p>
                    <b>User:</b> {selectedUser?.name}
                </p>

                <Form form={form} layout="vertical">
                    <Form.Item
                        name="newRoles"
                        label="Roles"
                        rules={[{ required: true, message: "Please select at least one role" }]}
                    >
                        <Select
                            mode="multiple" // 👈 chọn nhiều role
                            placeholder="Select user roles"
                            options={roleOptions}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChangeUserRole;
