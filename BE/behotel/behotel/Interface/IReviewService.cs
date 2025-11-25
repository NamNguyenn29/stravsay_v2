using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using behotel.DTOs;
using behotel.Helper;

namespace behotel.Interface
{
    public interface IReviewService
    {
        Task<ApiResponse<ReviewDTO>> GetAllReviewsAsync();

        Task<ApiResponse<ReviewDTO>> GetReviewByIdAsync(Guid reviewId);

        Task<ApiResponse<ReviewDTO>> GetReviewsByRoomIdAsync(Guid roomId);
        Task<ApiResponse<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId);
        Task<ReviewDTO?> GetReviewByBookingIdAsync(Guid bookingId);

        Task<ApiResponse<ReviewDTO>> CreateReviewAsync(ReviewDTO reviewDto, Guid currentUserId);

        Task<ApiResponse<ReviewDTO>> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDto, Guid currentUserId);

        Task<ApiResponse<ReviewDTO>> DeleteReviewAsync(Guid reviewId);
        Task<bool> CanReviewBookingAsync(Guid bookingId, Guid userId);
    }
}