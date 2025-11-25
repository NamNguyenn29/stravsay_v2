"use client";
import { Modal, Rate, Input, notification, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Review } from "@/model/Review";
import { reviewService } from "@/services/reviewService";
import { Booking } from "@/model/Booking";
import { AxiosResponse } from "axios";
import { ApiResponse } from "@/model/ApiResponse";

const { TextArea } = Input;



interface ReviewModalProps {
  open: boolean;
  booking: Booking | null;
  currentUserName: string;
  existingReview?: Review | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ReviewModal({
  open,
  booking,
  currentUserName,
  existingReview,
  onSuccess,
  onCancel,
}: ReviewModalProps) {
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (open) {
      if (existingReview) {
        setRating(existingReview.rating ?? 5);
        setTitle(existingReview.title ?? "");
        setContent(existingReview.content ?? "");
      } else {
        setRating(5);
        setTitle("");
        setContent("");
      }
    }
  }, [open, existingReview]);

  // SUCCESS
  const showSuccess = (msg: string, desc?: string) => {
    api.success({
      message: msg,
      description: desc,
      placement: "topRight",
      duration: 3,
    });
  };

  // ERROR
  const showError = (msg: string, desc?: string) => {
    api.error({
      message: msg,
      description: desc,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleSubmit = async () => {
    if (!booking) return;

    if (rating < 1 || rating > 5) {
      showError("Validation Error", "Rating must be between 1 and 5.");
      return;
    }

    const reviewData: Review = {
      bookingID: booking.id!,
      rating,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
    };

    try {
      setLoading(true);

      let res: AxiosResponse<ApiResponse<Review>>;
      

      if (existingReview?.reviewID) {
        res = await reviewService.updateReview(existingReview.reviewID, reviewData);
      } else {
        res = await reviewService.createReview(reviewData);
      }


      const responseData = res.data;
      if (responseData?.isSuccess) {
        showSuccess(
          existingReview ? "Review Updated" : "Review Submitted",
          existingReview
            ? "Your review has been updated successfully."
            : "Thank you for sharing your experience!"
        );
        onSuccess();
        onCancel();
      } else {
        const errorMsg = responseData?.message || "Unable to submit review.";
        showError("Submit Failed", errorMsg);
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse<Review> }; message?: string };
      const errorMsg = 
        axiosError?.response?.data?.message || 
        axiosError?.message || 
        "Cannot connect to server.";
      showError("Connection Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteReview = async () => {
    if (!existingReview?.reviewID) return;

    try {
      setDeleting(true);
      const res = await reviewService.deleteReview(existingReview.reviewID);
      const responseData = res.data;

      if (responseData?.isSuccess) {
        showSuccess("Review Deleted", "Your review has been deleted successfully.");
        onSuccess();
        onCancel();
      } else {
        const errorMsg = responseData?.message || "Unable to delete review.";
        showError("Delete Failed", errorMsg);
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: ApiResponse<Review> }; message?: string };
      const errorMsg = 
        axiosError?.response?.data?.message || 
        axiosError?.message || 
        "Cannot connect to server.";
      showError("Connection Error", errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {contextHolder}

      <Modal
        title={
          <div className="text-2xl font-serif text-[#5a4634]">
            {existingReview ? "Edit Review" : "Write a Review"}
          </div>
        }
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText={existingReview ? "Update" : "Submit Review"}
        cancelText="Cancel"
        confirmLoading={loading}
        width={600}
        centered
        okButtonProps={{
          className: "bg-[#c7a17a] hover:bg-[#b08b65] border-none",
        }}

        footer={[
          <div key="footer" className="flex justify-between items-center">
            {existingReview && (
              <Popconfirm
                title="Delete Review"
                description="Are you sure you want to delete this review?"
                onConfirm={handleDeleteReview}
                okText="Yes, delete"
                cancelText="Cancel"
                okButtonProps={{
                  className: "bg-red-500 hover:bg-red-600 border-none",
                }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  loading={deleting}
                  className="border-red-500 text-red-500 hover:text-red-600"
                >
                  Delete Review
                </Button>
              </Popconfirm>
            )}
            <div>
              <Button key="back" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleSubmit}
                className="bg-[#c7a17a] hover:bg-[#b08b65] border-none ml-2"
              >
                {existingReview ? "Update" : "Submit Review"}
              </Button>
            </div>
          </div>,
        ]}
      >
        <div className="py-4 space-y-4">
          {booking && (
            <div className="bg-[#f9f5f2] p-4 rounded-lg">
              <p className="text-lg font-semibold text-[#4b3826]">
                {booking.roomName} - {booking.roomNumber}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#4b3826] mb-2">
              Reviewer
            </label>
            <Input value={currentUserName} disabled className="bg-gray-100" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b3826] mb-2">
              Rating <span className="text-red-500">*</span>
            </label>
            <Rate value={rating} onChange={setRating} className="text-3xl" />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b3826] mb-2">
              Title (optional)
            </label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              maxLength={200} 
              showCount 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4b3826] mb-2">
              Content (optional)
            </label>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              maxLength={2000}
              showCount
            />
          </div>
        </div>
      </Modal>
    </>
  );
}