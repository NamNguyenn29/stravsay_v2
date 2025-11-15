"use client";
import { useState } from "react";
import { Modal, Tabs, Table, Tag, Avatar, Divider, Select, message } from "antd";
import { Box, Button } from "@mui/material";
import { UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { User } from "@/model/User";
import dayjs from "dayjs";
import { userService } from "@/services/userService";
type Props = {
    selectedUser: User | null;
    onClose: () => void;
    onUpdated: () => void;
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

const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY ");
};

export default function UserDetailModal({ selectedUser, onClose, onUpdated }: Props) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState((selectedUser?.isActived ? 1 : 0));
    const [messageApi, contextHolder] = message.useMessage();
    if (!selectedUser) return null;

    const handleSave = async () => {
        try {
            setLoading(true);

            const res = await userService.eidtStatus(selectedUser.id, status);
            messageApi.open({
                type: res.data.isSuccess ? "success" : "error",
                content: res.data.message,
                duration: 1, // 1 giây
                onClose: () => {
                    onUpdated();
                    onClose();
                    setTimeout(() => setLoading(false), 150); // tránh re-render khi modal đang fade-out
                }
            });
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    return (
        <>{contextHolder}
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
                                <Tag color={selectedUser.isActived ? "green" : "volcano"}>
                                    {selectedUser.isActived ? "Active" : "Inactive"}
                                </Tag>
                                {selectedUser.roleList.map((r) => (
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
                                            <div className="mb-4">{formatDate(selectedUser.createdDate)}</div>

                                            <div className="font-semibold text-gray-600 mb-1">Date of Birth</div>
                                            <div className="mb-4">{formatDate(selectedUser.dateOfBirth) ?? "—"}</div>

                                            <div className="font-semibold text-gray-600 mb-1">Status</div>
                                            <Select
                                                value={status}
                                                style={{ width: "100%" }}
                                                onChange={(value) => setStatus(value)}
                                                options={[
                                                    { label: "Active", value: 1 },
                                                    { label: "Inactive", value: 0 },
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
        </>
    );
}
