using behotel.Models;
using behotel.DTO;
using behotel.Helper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace behotel.Interface
{
    public interface IReviewService
    {
        Task<ReviewDTO> CreateReviewAsync(ReviewDTO reviewDto);
        Task<IEnumerable<ReviewDTO>> GetAllReviewsAsync();
        Task<ReviewDTO?> GetReviewByIdAsync(Guid reviewId);
        Task<ReviewDTO?> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDto);
        Task<bool> DeleteReviewAsync(Guid reviewId, Guid deletedBy);
        Task<ApiResponse<ReviewDTO>> GetReviewsWithPaginationAsync(int currentPage, int pageSize);
 
    }
}
