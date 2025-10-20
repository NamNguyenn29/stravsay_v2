"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  DatePicker,
  Select,
  Input,
  Button,
  Space,
  Tag,
  Drawer,
  Typography,
  Divider,
  message,
} from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

const { RangePicker } = DatePicker;
const { Text } = Typography;

type LogRow = {
  id: number;
  event_time: string;
  user_id?: number | null;
  username?: string | null;
  action: string;
  resource_type?: string | null;
  resource_id?: string | null;
  severity: string;
  ip?: string | null;
  message?: string | null;
  details?: any;
};

export default function SystemLogs() {
  const [data, setData] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState<any>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<LogRow | null>(null);

  const columns: ColumnsType<LogRow> = [
    {
      title: "Time",
      dataIndex: "event_time",
      key: "event_time",
      sorter: true,
    },
    {
      title: "User",
      dataIndex: "username",
      key: "username",
      render: (text, record) =>
        record.username ? record.username : <Text type="secondary">system</Text>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Resource",
      key: "resource",
      render: (_, r) => `${r.resource_type ?? "-"} ${r.resource_id ?? ""}`,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: (s: string) => {
        const color = s === "ERROR" ? "red" : s === "WARN" ? "orange" : "blue";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "IP",
      dataIndex: "ip",
      key: "ip",
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setSelected(record);
              setDrawerOpen(true);
            }}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  // Giả lập load dữ liệu
  const fetchData = async (page = 1, pageSize = 20, f = filters) => {
    setLoading(true);
    try {
      const fake: LogRow[] = new Array(pageSize).fill(0).map((_, i) => ({
        id: (page - 1) * pageSize + i + 1,
        event_time: new Date().toISOString(),
        user_id: i % 2 === 0 ? 1 : null,
        username: i % 2 === 0 ? "admin" : null,
        action: i % 3 === 0 ? "CREATE_BOOKING" : "LOGIN",
        resource_type: "booking",
        resource_id: `${1000 + i}`,
        severity: i % 5 === 0 ? "ERROR" : "INFO",
        ip: "123.123.123.123",
        message: "Demo log message " + (i + 1),
        details: { demo: true },
      }));
      setData(fake);
      setPagination((p) => ({ ...p, total: 100 }));
    } catch (err) {
      console.error(err);
      message.error("Failed to load logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-[calc(100vh-80px)]">
      {/* Custom Title */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="w-full h-[2px] bg-black/80 mt-3 mb-6" />
      </div>

      <Card variant="borderless" className="shadow-sm rounded-xl">
        <Space style={{ marginBottom: 12 }}>
          <RangePicker onChange={(vals) => setFilters((s: any) => ({ ...s, range: vals }))} />
          <Select
            placeholder="Severity"
            style={{ width: 140 }}
            onChange={(val) => setFilters((s: any) => ({ ...s, severity: val }))}
            allowClear
          >
            <Select.Option value="ERROR">ERROR</Select.Option>
            <Select.Option value="WARN">WARN</Select.Option>
            <Select.Option value="INFO">INFO</Select.Option>
            <Select.Option value="AUDIT">AUDIT</Select.Option>
          </Select>
          <Input.Search
            placeholder="Search message / user / action"
            onSearch={(q) => setFilters((s: any) => ({ ...s, q }))}
            style={{ width: 300 }}
            enterButton
          />
          <Button icon={<DownloadOutlined />}>Export</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination((p) => ({ ...p, current: page, pageSize }));
              fetchData(page, pageSize);
            },
          }}
        />
      </Card>

      <Drawer
        title={
          selected
            ? `${selected.action} — ${selected.resource_type ?? ""} ${selected.resource_id ?? ""}`
            : "Log detail"
        }
        width={720}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selected ? (
          <div>
            <p>
              <strong>Time:</strong> {selected.event_time}
            </p>
            <p>
              <strong>User:</strong> {selected.username ?? "system"}
            </p>
            <p>
              <strong>IP:</strong> {selected.ip}
            </p>
            <p>
              <strong>Message:</strong> {selected.message}
            </p>
            <Divider />
            <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {JSON.stringify(selected.details, null, 2)}
            </pre>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
