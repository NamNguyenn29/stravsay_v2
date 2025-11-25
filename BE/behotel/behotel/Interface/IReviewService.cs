using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using behotel.DTOs;

namespace behotel.Interface
{
    public interface IReviewService
    {
        Task<ReviewDTO> CreateReviewAsync(ReviewDTO reviewDTO, Guid userId);
        Task<ReviewDTO> GetReviewByIdAsync(Guid reviewId);
        Task<List<ReviewDTO>> GetReviewsByBookingIdAsync(Guid bookingId);
        Task<List<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId);
        Task<ReviewDTO> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDTO, Guid currentUserId);
        Task<bool> DeleteReviewAsync(Guid reviewId, Guid currentUserId, bool isAdmin);
    }
}