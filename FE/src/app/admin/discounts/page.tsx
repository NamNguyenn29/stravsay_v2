'use client';
import { Discount } from "@/model/Discount";
import { useState, useEffect } from "react";
import { Pagination, Modal, Form, Input, Button, message, Select, DatePicker } from "antd";
import { SearchOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { discountService } from "@/services/discountService";

export default function DiscountManagement() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [allDiscounts, setAllDiscounts] = useState<Discount[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<"view" | "create" | "edit">("view");
    const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);
    const [form] = Form.useForm();
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<number | null>(null);
    const [modal, modalContextHolder] = Modal.useModal();

    const loadAllDiscounts = async () => {
        try {
            setLoading(true);
            const res = await discountService.getAllDiscount();

            if (res.data?.isSuccess) {
                const data = res.data.list || [];
                setAllDiscounts(data);

                const startIdx = (currentPage - 1) * pageSize;
                setDiscounts(data.slice(startIdx, startIdx + pageSize));
                setTotalElement(data.length);
            } else {
                messageApi.error("Failed to load discounts");
            }
        } catch (error) {
            messageApi.error("Error loading discounts");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        loadAllDiscounts();
    }, []);

    

    const handlePaginationChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);

        const dataSource = keyword.trim() || statusFilter !== null ? discounts : allDiscounts;
        const startIdx = (page - 1) * size;
        setDiscounts(dataSource.slice(startIdx, startIdx + size));
    };

    const handleSearch = () => {
        setLoading(true);

        let filtered = [...allDiscounts];

        if (keyword.trim()) {
            const lowerKeyword = keyword.toLowerCase();
            filtered = filtered.filter((d: Discount) =>
                d.discountCode?.toLowerCase().includes(lowerKeyword)
            );
        }

        if (statusFilter !== null) {
            filtered = filtered.filter((d: Discount) => d.status === statusFilter);
        }

        setCurrentPage(1);
        setTotalElement(filtered.length);
        setDiscounts(filtered.slice(0, pageSize));
        setLoading(false);
    };

    const handleResetFilter = () => {
        setKeyword("");
        setStatusFilter(null);
        setCurrentPage(1);
        setTotalElement(allDiscounts.length);
        setDiscounts(allDiscounts.slice(0, pageSize));
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return dayjs(dateString).format("DD/MM/YYYY");
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusText = (status: number) => {
        return status === 1 ? "Active" : "Inactive";
    };

    const getStatusColor = (status: number) => {
        return status === 1 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100";
    };

    const openViewModal = (discount: Discount) => {
        setModalMode("view");
        setSelectedDiscount(discount);
        form.setFieldsValue({
            discountCode: discount.discountCode,
            discountValue: discount.discountValue,
            maxDiscountAmount: discount.maxDiscountAmount,
            startDate: dayjs(discount.startDate),
            expiredDate: dayjs(discount.expiredDate),
            minOrderAmount: discount.minOrderAmount,
            maxUsageLimit: discount.maxUsageLimit,
            discountUsage: discount.discountUsage,
            status: discount.status,
        });
        setModalVisible(true);
    };

    const openCreateModal = () => {
        setModalMode("create");
        setSelectedDiscount(null);
        form.resetFields();
        form.setFieldsValue({
            status: 1,
            discountUsage: 0,
        });
        setModalVisible(true);
    };

    const openEditModal = (discount: Discount) => {
        setModalMode("edit");
        setSelectedDiscount(discount);
        form.setFieldsValue({
            discountCode: discount.discountCode,
            discountValue: discount.discountValue,
            maxDiscountAmount: discount.maxDiscountAmount,
            startDate: dayjs(discount.startDate),
            expiredDate: dayjs(discount.expiredDate),
            minOrderAmount: discount.minOrderAmount,
            maxUsageLimit: discount.maxUsageLimit,
            discountUsage: discount.discountUsage,
            status: discount.status,
        });
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const discountData: Discount = {
                discountCode: values.discountCode,
                discountValue: values.discountValue,
                maxDiscountAmount: values.maxDiscountAmount,
                startDate: values.startDate.toISOString(),
                expiredDate: values.expiredDate.toISOString(),
                minOrderAmount: values.minOrderAmount,
                maxUsageLimit: values.maxUsageLimit,
                discountUsage: values.discountUsage || 0,
                status: values.status,
            };

            let res;
            if (modalMode === "create") {
                res = await discountService.createDiscount(discountData);
            } else if (modalMode === "edit") {
                res = await discountService.updateDiscount(selectedDiscount!.id!, discountData);
            }

            if (res?.data?.isSuccess) {
                messageApi.success(`Discount ${modalMode === "create" ? "created" : "updated"} successfully`);
                setModalVisible(false);
                form.resetFields();
                loadAllDiscounts();
            } else {
                messageApi.error(res?.data?.message || `Failed to ${modalMode} discount`);
            }
        } catch (error) {
            messageApi.error(`Error ${modalMode === "create" ? "creating" : "updating"} discount`);
        }
    };

    const handleDelete = (id: string) => {
        modal.confirm({
            title: "Delete Discount",
            content: "Are you sure you want to delete this discount?",
            okText: "Delete",
            cancelText: "Cancel",
            okType: "danger",
            centered: true,

            async onOk() {
                try {
                    const res = await discountService.deleteDiscount(id);

                    if (res.data?.isSuccess) {
                        messageApi.success("Discount deleted successfully");
                        loadAllDiscounts();
                    } else {
                        messageApi.error(res.data?.message || "Failed to delete discount");
                    }
                } catch (error) {
                    messageApi.error("Error deleting discount");
                }
            },
        });
    };

    const handleCancel = () => {
        setModalVisible(false);
        form.resetFields();
    };

    return (
        <>
            {contextHolder}
            {modalContextHolder}

            <div className="font-semibold text-lg">Discount Management</div>
            <div className="my-3 border-b border-gray-300"></div>

            <div className="flex justify-between items-center container mb-10">
                <div className="flex gap-5">
                    <input
                        type="search"
                        placeholder="Search by discount code"
                        className="w-96 border p-2 rounded-md"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                    />

                    <Select
                        placeholder="Filter by status"
                        style={{ width: 150 }}
                        allowClear
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: "Active", value: 1 },
                            { label: "Inactive", value: 0 },
                        ]}
                    />

                    <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch}>
                        Search
                    </Button>

                    <Button onClick={handleResetFilter}>Reset</Button>
                </div>

                <Button type="primary" size="large" onClick={openCreateModal}>
                    Create Discount
                </Button>
            </div>
            <div className="mb-5 bg-white shadow-md rounded-xl overflow-hidden container mx-auto">
                <table className="min-w-full text-base">
                    <thead className="bg-gray-100 text-gray-700 text-left font-semibold">
                        <tr>
                            <th className="px-5 py-3">No</th>
                            <th className="px-3 py-3">Code</th>
                            <th className="px-3 py-3">Value (%)</th>
                            <th className="px-3 py-3">Max Discount</th>
                            <th className="px-3 py-3">Min Order</th>
                            <th className="px-3 py-3">Usage/Limit</th>
                            <th className="px-3 py-3">Start Date</th>
                            <th className="px-3 py-3">Expired Date</th>
                            <th className="px-3 py-3">Status</th>
                            <th className="px-3 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8">Loading...</td>
                            </tr>
                        ) : discounts.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8">No discounts found</td>
                            </tr>
                        ) : (
                            discounts.map((discount, index) => (
                                <tr key={discount.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">{index + 1 + (currentPage - 1) * pageSize}</td>
                                    <td className="px-3 py-4 font-semibold">{discount.discountCode}</td>
                                    <td className="px-3 py-4">{discount.discountValue}%</td>
                                    <td className="px-3 py-4">{discount.maxDiscountAmount ? formatCurrency(discount.maxDiscountAmount) : "-"}</td>
                                    <td className="px-3 py-4">{formatCurrency(discount.minOrderAmount)}</td>
                                    <td className="px-3 py-4">{discount.discountUsage}/{discount.maxUsageLimit}</td>
                                    <td className="px-3 py-4">{formatDate(discount.startDate)}</td>
                                    <td className="px-3 py-4">{formatDate(discount.expiredDate)}</td>
                                    <td className="px-3 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(discount.status)}`}>
                                            {getStatusText(discount.status)}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-center flex gap-2 justify-center">
                                        <button
                                            onClick={() => openViewModal(discount)}
                                            className="px-4 py-2 text-sm font-medium !text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => openEditModal(discount)}
                                            className="px-4 py-2 text-sm font-medium !text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow"
                                        >
                                            <EditOutlined />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discount.id!)}
                                            className="px-4 py-2 text-sm font-medium !text-white bg-red-500 hover:bg-red-600 rounded-lg shadow"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalElement}
                showSizeChanger
                pageSizeOptions={[5, 10, 20, 50]}
                onChange={handlePaginationChange}
                className="text-center flex justify-end"
                showTotal={(total) => `Total ${total} discounts`}
            />

            <Modal
                title={
                    <span className="text-xl font-semibold text-blue-600">
                        {modalMode === "view" ? "View Discount" : modalMode === "create" ? "Create Discount" : "Edit Discount"}
                    </span>
                }
                open={modalVisible}
                onCancel={handleCancel}
                centered
                width={600}
                footer={
                    modalMode === "view"
                        ? [<Button key="close" onClick={handleCancel}>Close</Button>]
                        : [
                            <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                            <Button key="submit" type="primary" onClick={handleSubmit}>
                                {modalMode === "create" ? "Create" : "Update"}
                            </Button>
                        ]
                }
            >
                <Form form={form} layout="vertical" className="mt-4">
                    <Form.Item
                        label="Discount Code"
                        name="discountCode"
                        rules={[{ required: true, message: "Please enter discount code" }]}
                    >
                        <Input disabled={modalMode === "view"} placeholder="e.g., SUMMER2024" />
                    </Form.Item>

                    <Form.Item
                        label="Discount Value (%)"
                        name="discountValue"
                        rules={[
                            { required: true, message: "Please enter discount value" }
                        ]}
                    >
                        <Input type="number" disabled={modalMode === "view"} />
                    </Form.Item>

                    <Form.Item label="Max Discount Amount (VND)" name="maxDiscountAmount">
                        <Input type="number" disabled={modalMode === "view"} />
                    </Form.Item>

                    <Form.Item
                        label="Min Order Amount (VND)"
                        name="minOrderAmount"
                        rules={[{ required: true, message: "Please enter minimum order amount" }]}
                    >
                        <Input type="number" disabled={modalMode === "view"} />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Start Date"
                            name="startDate"
                            rules={[{ required: true, message: "Please select start date" }]}
                        >
                            <DatePicker disabled={modalMode === "view"} className="w-full" format="DD/MM/YYYY" />
                        </Form.Item>

                        <Form.Item
                            label="Expired Date"
                            name="expiredDate"
                            rules={[{ required: true, message: "Please select expired date" }]}
                        >
                            <DatePicker disabled={modalMode === "view"} className="w-full" format="DD/MM/YYYY" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Max Usage Limit"
                            name="maxUsageLimit"
                            rules={[{ required: true, message: "Please enter max usage limit" }]}
                        >
                            <Input type="number" disabled={modalMode === "view"} />
                        </Form.Item>

                        <Form.Item label="Current Usage" name="discountUsage">
                            <Input type="number" disabled />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: "Please select status" }]}
                    >
                        <Select disabled={modalMode === "view"}>
                            <Select.Option value={1}>Active</Select.Option>
                            <Select.Option value={0}>Inactive</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
