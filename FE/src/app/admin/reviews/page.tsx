"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, message, Select } from "antd";
import { SearchOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";

type Review = {
  id: string;
  reviewerName: string;
  reviewerEmail?: string;
  room: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "approved" | "pending";
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<"all" | "approved" | "pending">("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyFor, setReplyFor] = useState<Review | null>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // TODO: fetch from backend
  useEffect(() => {
    setReviews([]); 
  }, []);

  const totalCount = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return reviews.filter((r) => {
      if (appliedStatus !== "all" && r.status !== appliedStatus) return false;
      if (!q) return true;
      return (
        String(r.id).toLowerCase().includes(q) ||
        r.reviewerName.toLowerCase().includes(q) ||
        (r.reviewerEmail || "").toLowerCase().includes(q) ||
        r.room.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    });
  }, [reviews, appliedStatus, searchText]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const currentRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const handleSummaryClick = (filter: "all" | "approved" | "pending") => {
    setAppliedStatus(filter);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchText("");
    setAppliedStatus("all");
    setCurrentPage(1);
  };

  function confirmDelete(id: string) {
    Modal.confirm({
      title: "Delete review",
      content: `Are you sure you want to delete review ${id}?`,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        // TODO: backend delete
        setReviews((prev) => prev.filter((r) => r.id !== id));
        message.success("Deleted review");
      },
    });
  }

  function openReply(r: Review) {
    setReplyFor(r);
    setReplyMessage("");
    setReplyOpen(true);
  }

  function sendReply() {
    if (!replyFor) return;
    // TODO: backend reply
    message.success(`Reply sent to ${replyFor.reviewerName}`);
    setReplyOpen(false);
    setReplyFor(null);
  }

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-[calc(100vh-80px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Review Management</h1>
        <div className="w-full h-[2px] bg-black/80 mt-3 mb-6" />
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center bg-white rounded-md shadow-sm border border-gray-200 px-3 py-2 min-w-[420px]">
          <SearchOutlined className="text-gray-500 mr-2" />
          <input
            className="outline-none w-full"
            placeholder="Search by reviewer, room, email or content"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={handleReset} className="px-4 py-2 rounded-md bg-white border border-gray-200 shadow-sm">
            Reset
          </button>
        </div>
      </div>

      {/* === SUMMARY BOXE === */}
      <div className="flex gap-5 mb-6">
        {/* Total Reviews */}
        <div
          onClick={() => handleSummaryClick("all")}
          className={`flex-1 rounded-xl shadow-lg p-6 border transition cursor-pointer ${
            appliedStatus === "all"
              ? "bg-blue-100 border-blue-400"
              : "bg-white border-gray-200 hover:border-blue-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-blue-400" />
            <div className="font-semibold text-gray-800">Total Reviews</div>
          </div>
          <div className="text-2xl font-extrabold mt-4">{totalCount}</div>
        </div>

        {/* Approved */}
        <div
          onClick={() => handleSummaryClick("approved")}
          className={`w-64 rounded-xl shadow-lg p-6 border transition cursor-pointer ${
            appliedStatus === "approved"
              ? "bg-green-100 border-green-400"
              : "bg-white border-gray-200 hover:border-green-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-green-400" />
            <div className="font-semibold text-gray-800">Approved</div>
          </div>
          <div className="text-2xl font-extrabold mt-4">{approvedCount}</div>
        </div>

        {/* Pending */}
        <div
          onClick={() => handleSummaryClick("pending")}
          className={`w-64 rounded-xl shadow-lg p-6 border transition cursor-pointer ${
            appliedStatus === "pending"
              ? "bg-yellow-100 border-yellow-400"
              : "bg-white border-gray-200 hover:border-yellow-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-yellow-400" />
            <div className="font-semibold text-gray-800">Pending</div>
          </div>
          <div className="text-2xl font-extrabold mt-4">{pendingCount}</div>
        </div>
      </div>

      {/* Table */}
      <div className="container mx-auto my-6 bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full text-base">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-left text-gray-700 text-lg font-semibold">
            <tr>
              <th className="px-6 py-4">No</th>
              <th className="px-6 py-4">Reviewer / Email</th>
              <th className="px-6 py-4">Room</th>
              <th className="px-6 py-4">Rating</th>
              <th className="px-6 py-4">Content</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center text-gray-500">
                  No reviews found
                </td>
              </tr>
            ) : (
              currentRows.map((r, idx) => (
                <tr key={r.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{idx + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">{r.reviewerName}</div>
                    <div className="text-sm text-gray-500">{r.reviewerEmail}</div>
                  </td>
                  <td className="px-6 py-4">{r.room}</td>
                  <td className="px-6 py-4 text-yellow-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-gray-700 max-w-[420px]">{r.content}</td>
                  <td className="px-6 py-4">{r.createdAt}</td>
                  <td className="px-6 py-4">
                    {r.status === "approved" ? (
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                        Approved
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openReply(r)}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <SendOutlined /> Reply
                      </button>
                      <button
                        onClick={() => confirmDelete(r.id)}
                        className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
                      >
                        <DeleteOutlined /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-lg font-medium">Total {totalItems} items</div>
        <div className="flex items-center gap-3">
          <Select
            value={itemsPerPage}
            onChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
            options={[5, 10, 20].map((n) => ({ label: `${n} / page`, value: n }))}
            style={{ width: 120 }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 rounded-md bg-white border border-gray-200"
            >
              ‹
            </button>
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center shadow-sm">
              {currentPage}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-2 rounded-md bg-white border border-gray-200"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <Modal
        title={replyFor ? `Reply to ${replyFor.reviewerName}` : "Reply"}
        open={replyOpen}
        onOk={sendReply}
        onCancel={() => {
          setReplyOpen(false);
          setReplyFor(null);
        }}
        okText="Send"
      >
        <div className="mb-4">
          <div className="text-sm text-gray-500 mb-2">Original review</div>
          <div className="bg-gray-100 p-3 rounded">{replyFor?.content}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 mb-2">Your reply</div>
          <textarea
            rows={6}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded"
          />
        </div>
      </Modal>
    </div>
  );
}
