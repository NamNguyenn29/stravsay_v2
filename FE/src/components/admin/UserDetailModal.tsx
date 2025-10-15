"use client";
import { useState } from "react";
import { Modal, Tabs, Table, Tag, Avatar, Divider, Select } from "antd";
import { Box, Button } from "@mui/material";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "@/model/User";
// import { updateUser } from "@/api/updateUser"; // API update user

type Props = {
    selectedUser: User | null;
    onClose: () => void;
    onUpdated: () => void;
};

type UserStatus = "Active" | "Inactive" | "Deleted";

const statusMap: Record<UserStatus, { isActive: boolean; isDeleted: boolean }> = {
    Active: { isActive: true, isDeleted: false },
    Inactive: { isActive: false, isDeleted: false },
    Deleted: { isActive: false, isDeleted: true },
};

// Log mẫu
const userLogs = [
    { key: "1", date: "2025-10-12 09:45", action: "Login", ip: "192.168.0.12", device: "Chrome - Windows 11" },
    { key: "2", date: "2025-10-13 14:22", action: "Updated Profile", ip: "192.168.0.18", device: "Edge - Windows 11" },
    { key: "3", date: "2025-10-14 08:11", action: "Logged out", ip: "192.168.0.10", device: "Chrome - Android" },
];

const logColumns: ColumnsType<typeof userLogs[0]> = [
    { title: "Date", dataIndex: "date", key: "date", width: 200 },
    { title: "Action", dataIndex: "action", key: "action", width: 150 },
    { title: "IP Address", dataIndex: "ip", key: "ip", width: 180 },
    { title: "Device", dataIndex: "device", key: "device" },
];

export default function UserDetailModal({ selectedUser, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<string[]>(selectedUser?.roles || []);
    const [status, setStatus] = useState<UserStatus>(() => {
        if (!selectedUser) return "Inactive";
        if (selectedUser.isDeleted) return "Deleted";
        if (selectedUser.isActive) return "Active";
        return "Inactive";
    });

    if (!selectedUser) return null;

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedUser = {
                ...selectedUser,
                roles,
                ...statusMap[status],
            };
            // await updateUser(updatedUser);
            setLoading(false);
            onUpdated();
            onClose();
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <Modal open={!!selectedUser} onCancel={onClose} footer={null} width={1000}>
            <Box
                sx={{
                    bgcolor: "#f9fafb",
                    borderRadius: 2,
                    p: 4,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    maxHeight: "85vh",
                    overflowY: "auto",
                }}
            >
                {/* Header user info */}
                <div className="flex items-center gap-6 mb-6">
                    <Avatar
                        size={96}
                        icon={<UserOutlined />}
                        style={{ backgroundColor: "#1677ff" }}
                    >
                        {selectedUser.fullName?.charAt(0).toUpperCase()}
                    </Avatar>

                    <div>
                        <div className="text-2xl font-bold text-gray-800">{selectedUser.fullName}</div>
                        <div className="text-gray-500 text-base">{selectedUser.email}</div>
                        <div className="mt-2 flex gap-3 flex-wrap">
                            <Tag color={selectedUser.isActive ? "green" : "volcano"}>
                                {selectedUser.isActive ? "Active" : "Inactive"}
                            </Tag>
                            {selectedUser.isDeleted && <Tag color="red">Deleted</Tag>}
                            {selectedUser.roles.map((r) => (
                                <Tag color="blue" key={r}>{r}</Tag>
                            ))}
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Tabs */}
                <Tabs
                    defaultActiveKey="1"
                    size="large"
                    items={[
                        {
                            key: "1",
                            label: "User Information",
                            children: (
                                <div className="grid grid-cols-2 gap-10 mt-4 text-lg">
                                    <div>
                                        <div className="font-semibold text-gray-600 mb-1">User ID</div>
                                        <div className="mb-4">{selectedUser.id}</div>

                                        <div className="font-semibold text-gray-600 mb-1">Created Date</div>
                                        <div className="mb-4">{selectedUser.createdDate}</div>

                                        <div className="font-semibold text-gray-600 mb-1">Date of Birth</div>
                                        <div className="mb-4">{selectedUser.dateOfBirth ?? "—"}</div>

                                        <div className="font-semibold text-gray-600 mb-1">Status</div>
                                        <Select
                                            value={status}
                                            style={{ width: "100%" }}
                                            onChange={(value: UserStatus) => setStatus(value)}
                                            options={[
                                                { label: "Active", value: "Active" },
                                                { label: "Inactive", value: "Inactive" },
                                                { label: "Deleted", value: "Deleted" },
                                            ]}
                                        />
                                    </div>

                                    <div>
                                        <div className="font-semibold text-gray-600 mb-1">Phone</div>
                                        <div className="mb-4">{selectedUser.phone ?? "—"}</div>

                                        <div className="font-semibold text-gray-600 mb-1">Last login</div>
                                        <div className="mb-4">{"—"}</div>


                                    </div>
                                </div>
                            ),
                        },
                        {
                            key: "2",
                            label: "Activity Log",
                            children: (
                                <div className="mt-4">
                                    <Table
                                        columns={logColumns}
                                        dataSource={userLogs}
                                        pagination={{ pageSize: 5 }}
                                        bordered
                                        size="middle"
                                    />
                                </div>
                            ),
                        },
                    ]}
                />

                {/* Footer */}
                <div className="flex justify-end mt-8 gap-3">
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        sx={{ borderRadius: "10px", textTransform: "none", fontSize: "16px" }}
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ borderRadius: "10px", textTransform: "none", fontSize: "16px" }}
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
