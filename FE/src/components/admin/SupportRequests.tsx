// src/components/admin/SupportRequests.tsx
"use client";

import React from "react";
import { Card, List } from "antd";

type Req = { id: string; title: string; status: "open" | "closed" };

export default function SupportRequests({ items }: { items: Req[] }) {
  return (
    <Card title="Pending Support Requests" style={{ borderRadius: 10 }}>
      <div style={{ color: "#6b7280", marginBottom: 8 }}>{items.length} open tickets</div>
      <List
        dataSource={items}
        renderItem={(it) => (
          <List.Item style={{ padding: "8px 12px" }}>
            <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
              <div style={{ color: "#0f172a" }}>
                <strong>#{it.id}</strong> - {it.title}
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
