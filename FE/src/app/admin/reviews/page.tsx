'use client';
import { Review } from "@/model/Review";
import { useState, useEffect } from "react";
import { Pagination, Modal, Form, Input, Button, message, Rate, Select } from "antd";
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { reviewService } from "@/services/reviewService";

interface ReviewWithBooking extends Review {
  bookingUserName?: string;
  roomName?: string;
  roomNumber?: string;
}

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<ReviewWithBooking[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewWithBooking[]>([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithBooking | null>(null);
  const [form] = Form.useForm();
  const [totalElement, setTotalElement] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [modal, modalContextHolder] = Modal.useModal();

  const loadAllReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviews();

      if (res.data?.isSuccess) {
        const data = res.data.list || [];
        setAllReviews(data);

        const startIdx = (currentPage - 1) * pageSize;
        setReviews(data.slice(startIdx, startIdx + pageSize));
        setTotalElement(data.length);
      } else {
        messageApi.error("Failed to load reviews");
      }
    } catch (error) {
      messageApi.error("Error loading reviews");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadAllReviews();
  }, []);



  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);


    const dataSource = keyword.trim() || ratingFilter ? reviews : allReviews;
    const startIdx = (page - 1) * size;
    setReviews(dataSource.slice(startIdx, startIdx + size));
  };

  const handleSearch = () => {
    setLoading(true);

    let filtered = [...allReviews];

    if (keyword.trim()) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter((r: ReviewWithBooking) =>
        r.title?.toLowerCase().includes(lowerKeyword) ||
        r.content?.toLowerCase().includes(lowerKeyword) ||
        r.userName?.toLowerCase().includes(lowerKeyword)
      );
    }

    // Filter by rating
    if (ratingFilter) {
      filtered = filtered.filter((r: ReviewWithBooking) => r.rating === ratingFilter);
    }
    setCurrentPage(1);
    setTotalElement(filtered.length);
    setReviews(filtered.slice(0, pageSize));
    setLoading(false);
  };

  // Reset filter
  const handleResetFilter = () => {
    setKeyword("");
    setRatingFilter(null);
    setCurrentPage(1);
    setTotalElement(allReviews.length);
    setReviews(allReviews.slice(0, pageSize));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YYYY - HH:mm");
  };

  const openViewModal = (review: ReviewWithBooking) => {
    setSelectedReview(review);
    form.setFieldsValue({
      userName: review.userName,
      rating: review.rating,
      title: review.title,
      content: review.content,
      createdDate: dayjs(review.createdDate),
    });
    setViewModalVisible(true);
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: "Delete Review",
      content: "Are you sure you want to delete this review?",
      okText: "Delete",
      cancelText: "Cancel",
      okType: "danger",
      centered: true,

      async onOk() {
        try {
          const res = await reviewService.deleteReview(id);

          if (res.data?.isSuccess) {
            messageApi.success("Review deleted successfully");
            loadAllReviews(); // Reload data
          } else {
            messageApi.error(res.data?.message || "Failed to delete review");
          }
        } catch (error) {
          messageApi.error("Error deleting review");
        }
      },
    });
  };

  const handleCancel = () => {
    setViewModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      {modalContextHolder}

      <div className="font-semibold text-lg">Review Management</div>
      <div className="my-3 border-b border-gray-300"></div>

      {/* Search & Filter */}
      <div className="flex justify-start gap-5 container mb-10">
        <input
          type="search"
          placeholder="Search by reviewer, title, or content"
          className="w-96 border p-2 rounded-md"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />

        <Select
          placeholder="Filter by rating"
          style={{ width: 150 }}
          allowClear
          value={ratingFilter}
          onChange={setRatingFilter}
          options={[
            { label: "5 Stars", value: 5 },
            { label: "4 Stars", value: 4 },
            { label: "3 Stars", value: 3 },
            { label: "2 Stars", value: 2 },
            { label: "1 Star", value: 1 },
          ]}
        />

        <Button type="primary" icon={<SearchOutlined />} size="large" onClick={handleSearch}>
          Search
        </Button>

        <Button onClick={handleResetFilter}>Reset</Button>
      </div>

      {/* Table */}
      <div className="mb-5 bg-white shadow-md rounded-xl overflow-hidden container mx-auto">
        <table className="min-w-full text-base">
          <thead className="bg-gray-100 text-gray-700 text-left font-semibold">
            <tr>
              <th className="px-5 py-3">No</th>
              <th className="px-3 py-3">Reviewer</th>
              <th className="px-3 py-3">Room</th>
              <th className="px-2 py-3">Rating</th>
              <th className="px-3 py-3">Title</th>
              <th className="px-2 py-3">Content</th>
              <th className="px-3 py-3">Created Date</th>
              <th className="px-3 py-3">Updated Date</th>
              <th className="px-3 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">Loading...</td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8">No reviews found</td>
              </tr>
            ) : (
              reviews.map((review, index) => (
                <tr key={review.reviewID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">{index + 1 + (currentPage - 1) * pageSize}</td>

                  <td className="px-3 py-4">{review.userName || "Unknown"}</td>

                  <td className="px-3 py-4">{review.roomName || "-"}</td>

                  <td className="px-2 py-4">
                    <Rate disabled value={review.rating} />
                  </td>

                  <td className="px-3 py-4 max-w-xs truncate">{review.title || "-"}</td>

                  <td className="px-2 py-4 max-w-xs">{review.content || "-"}</td>

                  <td className="px-3 py-4">{formatDate(review.createdDate!)}</td>
                  <td className="px-3 py-4">{formatDate(review.updatedDate!)}</td>

                  <td className="px-3 py-4 text-center flex gap-3 justify-center">
                    <button
                      onClick={() => openViewModal(review)}
                      className="px-4 py-2 text-sm font-medium !text-white bg-blue-500 hover:bg-blue-600 rounded-lg shadow"
                    >
                      View
                    </button>

                    <button
                      onClick={() => handleDelete(review.reviewID!)}
                      className="px-4 py-2 text-sm font-medium !text-white bg-red-500 hover:bg-red-600 rounded-lg shadow"
                      title="Delete"
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

      {/* Pagination */}
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalElement}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        onChange={handlePaginationChange}
        className="text-center flex justify-end"
        showTotal={(total) => `Total ${total} reviews`}
      />

      {/* View Modal */}
      <Modal
        title={<span className="text-xl font-semibold text-blue-600">View Review</span>}
        open={viewModalVisible}
        onCancel={handleCancel}
        centered
        footer={[<Button key="close" onClick={handleCancel}>Close</Button>]}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item label="Reviewer">
            <Input value={selectedReview?.userName} disabled />
          </Form.Item>

          <Form.Item label="Rating">
            <Rate disabled value={selectedReview?.rating} />
          </Form.Item>

          <Form.Item label="Title">
            <Input value={selectedReview?.title} disabled />
          </Form.Item>

          <Form.Item label="Content">
            <Input.TextArea value={selectedReview?.content} disabled rows={5} />
          </Form.Item>

          <Form.Item label="Created Date">
            <Input value={formatDate(selectedReview?.createdDate || "")} disabled />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}