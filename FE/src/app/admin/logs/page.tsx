"use client";

import React, { useEffect, useState } from "react";
import { Pagination, message, Select, Button, Modal } from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { systemlogService } from "@/services/systemlogService";
import { SystemLog } from "@/model/SystemLog";

export default function SystemLogsPage() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [allLogs, setAllLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalElement, setTotalElement] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [actionFilter, setActionFilter] = useState<string | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<SystemLog | null>(null);
  const [modal, modalContextHolder] = Modal.useModal();

  useEffect(() => {
    loadAllLogs();
  }, []);

  const loadAllLogs = async () => {
    try {
      setLoading(true);
      const res = await systemlogService.getAllLogs(1, 1000);
      
      if (res.data?.isSuccess) {
        const data = res.data.list || [];
        setAllLogs(data);
        
        const startIdx = (currentPage - 1) * pageSize;
        setLogs(data.slice(startIdx, startIdx + pageSize));
        setTotalElement(data.length);
      } else {
        messageApi.error(res.data?.message || "Failed to load system logs");
      }
    } catch (error) {
      messageApi.error("Error loading system logs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);

    const dataSource = keyword.trim() || statusFilter || actionFilter ? logs : allLogs;
    const startIdx = (page - 1) * size;
    setLogs(dataSource.slice(startIdx, startIdx + size));
  };

  const handleSearch = () => {
    setLoading(true);

    let filtered = [...allLogs];

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter((log: SystemLog) =>
        log.userName?.toLowerCase().includes(lowerKeyword) ||
        log.ipAddress?.toLowerCase().includes(lowerKeyword) ||
        log.userId?.toLowerCase().includes(lowerKeyword)
      );
    }

    if (statusFilter) {
      const status = statusFilter === "success";
      filtered = filtered.filter((log: SystemLog) => log.status === status);
    }

    if (actionFilter) {
      filtered = filtered.filter((log: SystemLog) => log.action === actionFilter);
    }

    setCurrentPage(1);
    setTotalElement(filtered.length);
    setLogs(filtered.slice(0, pageSize));
    setLoading(false);
  };

  const handleResetFilter = () => {
    setKeyword("");
    setStatusFilter(null);
    setActionFilter(null);
    setCurrentPage(1);
    setTotalElement(allLogs.length);
    setLogs(allLogs.slice(0, pageSize));
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: "Delete System Log",
      content: "Are you sure you want to delete this log? This action cannot be undone.",
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,

      async onOk() {
        try {
          const res = await systemlogService.deleteLog(id);

          if (res.data?.isSuccess) {
            messageApi.success("Log deleted successfully");
            loadAllLogs(); // Reload data
          } else {
            messageApi.error(res.data?.message || "Failed to delete log");
          }
        } catch (error) {
          messageApi.error("Error deleting log");
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY HH:mm:ss");
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "Login":
        return "Login";
      case "Logout":
        return "Logout";
      case "LoginFailed":
        return "Login Failed";
      default:
        return action || "Unknown";
    }
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "Login":
        return "bg-blue-100 text-blue-700";
      case "Logout":
        return "bg-gray-100 text-gray-700";
      case "LoginFailed":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const openViewModal = (log: SystemLog) => {
    setSelectedLog(log);
    setViewModalVisible(true);
  };

  const handleCloseModal = () => {
    setViewModalVisible(false);
    setSelectedLog(null);
  };

  return (
    <>
      {contextHolder}
      {modalContextHolder}

      <div className="font-semibold text-lg">System Logs Management</div>
      <div className="my-3 border-b border-gray-300"></div>

      {/* Search & Filter */}
      <div className="flex justify-start gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by user name, IP, or user ID..."
          className="w-80 border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />

        <Select
          placeholder="Status"
          style={{ width: 130 }}
          allowClear
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { label: "Success", value: "success" },
            { label: "Failed", value: "failed" },
          ]}
        />

        <Select
          placeholder="Action"
          style={{ width: 150 }}
          allowClear
          value={actionFilter}
          onChange={setActionFilter}
          options={[
            { label: "Login", value: "Login" },
            { label: "Login Failed", value: "LoginFailed" },
            { label: "Logout", value: "Logout" },
          ]}
        />

        <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch}>
          Search
        </Button>

        <Button onClick={handleResetFilter}>Reset</Button>
      </div>

      {/* Table */}
      <div className="mb-5 bg-white shadow-md rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 text-left font-semibold">
              <tr>
                <th className="px-4 py-3 w-16">No</th>
                <th className="px-4 py-3">User Name</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3 text-center">Action</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Created Date</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No logs found
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600">
                      {index + 1 + (currentPage - 1) * pageSize}
                    </td>
                    
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {log.userName || "Unknown"}
                    </td>
                    
                    <td className="px-4 py-3">
                      {log.userId ? (
                        <span className="text-xs text-gray-500 font-mono">
                          {log.userId}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-3 text-gray-700 font-mono text-xs">
                      {log.ipAddress || "-"}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          log.status
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {log.status ? "Success" : "Failed"}
                      </span>
                    </td>
                    
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(log.createdDate)}
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => openViewModal(log)}
                          className="px-3 py-2 text-sm font-medium !text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow"
                        >
                          <EyeOutlined />
                        </button>

                        <button
                          onClick={() => handleDelete(log.id)}
                          className="px-3 py-2 text-sm font-medium !text-white bg-red-500 hover:bg-red-600 rounded-lg shadow"
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalElement}
        showSizeChanger
        pageSizeOptions={[10, 20, 50, 100]}
        onChange={handlePaginationChange}
        className="text-center flex justify-end"
        showTotal={(total) => `Total ${total} logs`}
      />

      {/* View Modal */}
      <Modal
        title={<span className="text-xl font-semibold text-blue-600">Log Details</span>}
        open={viewModalVisible}
        onCancel={handleCloseModal}
        centered
        width={600}
        footer={[
          <Button key="close" type="primary" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        {selectedLog && (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">User Name</label>
                <div className="p-2 bg-gray-50 rounded border">{selectedLog.userName || "Unknown"}</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <div className="p-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedLog.status
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedLog.status ? "Success" : "Failed"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
              <div className="p-2 bg-gray-50 rounded border font-mono text-xs break-all">
                {selectedLog.userId || "-"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">IP Address</label>
              <div className="p-2 bg-gray-50 rounded border font-mono text-sm">
                {selectedLog.ipAddress || "-"}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Action</label>
              <div className="p-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(selectedLog.action)}`}>
                  {getActionLabel(selectedLog.action)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Created Date</label>
              <div className="p-2 bg-gray-50 rounded border">
                {formatDate(selectedLog.createdDate)}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}