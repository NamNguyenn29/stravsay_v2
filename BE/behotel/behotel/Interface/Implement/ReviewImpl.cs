using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class ReviewImpl : IReviewService
    {
        private readonly HotelManagementContext _context;

        public ReviewImpl(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task<ReviewDTO> CreateReviewAsync(ReviewDTO reviewDto)
        {
            var review = new Review
            {
                ReviewID = Guid.NewGuid(),
                BookingID = reviewDto.BookingID,
                UserID = reviewDto.UserID,
                Rating = reviewDto.Rating,
                Title = reviewDto.Title,
                Content = reviewDto.Content,
                ModerationReason = reviewDto.ModerationReason,
                ModerationNote = reviewDto.ModerationNote,
                IsDeleted = false,
                Status = reviewDto.Status,
                CreatedDate = DateTime.Now
            };

            _context.Review.Add(review);
            await _context.SaveChangesAsync();

            reviewDto.ReviewID = review.ReviewID;
            reviewDto.CreatedDate = review.CreatedDate;
            return reviewDto;
        }

        public async Task<IEnumerable<ReviewDTO>> GetAllReviewsAsync()
        {
            var reviews = await _context.Review
                .Where(r => !r.IsDeleted)
                .ToListAsync();

            return reviews.Select(r => new ReviewDTO
            {
                ReviewID = r.ReviewID,
                BookingID = r.BookingID,
                UserID = r.UserID,
                Rating = r.Rating,
                Title = r.Title,
                Content = r.Content,
                ModerationReason = r.ModerationReason,
                ModerationNote = r.ModerationNote,
                IsDeleted = r.IsDeleted,
                DeletedDate = r.DeletedDate,
                DeletedBy = r.DeletedBy,
                UpdatedDate = r.UpdatedDate,
                UpdatedBy = r.UpdatedBy,
                Status = r.Status,
                CreatedDate = r.CreatedDate
            }).ToList();
        }

        public async Task<ReviewDTO?> GetReviewByIdAsync(Guid reviewId)
        {
            var r = await _context.Review.FirstOrDefaultAsync(x => x.ReviewID == reviewId && !x.IsDeleted);
            if (r == null) return null;

            return new ReviewDTO
            {
                ReviewID = r.ReviewID,
                BookingID = r.BookingID,
                UserID = r.UserID,
                Rating = r.Rating,
                Title = r.Title,
                Content = r.Content,
                ModerationReason = r.ModerationReason,
                ModerationNote = r.ModerationNote,
                IsDeleted = r.IsDeleted,
                DeletedDate = r.DeletedDate,
                DeletedBy = r.DeletedBy,
                UpdatedDate = r.UpdatedDate,
                UpdatedBy = r.UpdatedBy,
                Status = r.Status,
                CreatedDate = r.CreatedDate
            };
        }

        public async Task<ReviewDTO?> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDto)
        {
            var review = await _context.Review.FirstOrDefaultAsync(r => r.ReviewID == reviewId && !r.IsDeleted);
            if (review == null)
                return null;

            review.Title = reviewDto.Title;
            review.Content = reviewDto.Content;
            review.Rating = reviewDto.Rating;
            review.ModerationNote = reviewDto.ModerationNote;
            review.ModerationReason = reviewDto.ModerationReason;
            review.UpdatedDate = DateTime.Now;
            review.UpdatedBy = reviewDto.UpdatedBy;

            _context.Review.Update(review);
            await _context.SaveChangesAsync();

            reviewDto.ReviewID = review.ReviewID;
            reviewDto.UpdatedDate = review.UpdatedDate;
            return reviewDto;
        }

        public async Task<bool> DeleteReviewAsync(Guid reviewId, Guid deletedBy)
        {
            var review = await _context.Review.FirstOrDefaultAsync(r => r.ReviewID == reviewId && !r.IsDeleted);
            if (review == null)
                return false;

            review.IsDeleted = true;
            review.DeletedDate = DateTime.Now;
            review.DeletedBy = deletedBy;

            _context.Review.Update(review);
            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<ApiResponse<ReviewDTO>> GetReviewsWithPaginationAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<ReviewDTO>(null, null, "400", "Current page and page size is require", true, 0, 0, 0, 0, null, null);
            }

            var allReviews = await GetAllReviewsAsync();
            int totalItem = allReviews.Count();
            int totalPage = (int)Math.Ceiling((double)totalItem / pageSize);
            var reviewsWithPagination = allReviews.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
            var reviewDTOsWithPagination = new List<ReviewDTO>();
            foreach (var review in reviewsWithPagination)
            {
                var reviewDTO = await GetReviewByIdAsync(review.ReviewID);
                if (reviewDTO != null)
                {
                    reviewDTOsWithPagination.Add(reviewDTO);
                }
            }

            return new ApiResponse<ReviewDTO>(reviewDTOsWithPagination, null, "200", "Get review successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);
        }



    }

}
