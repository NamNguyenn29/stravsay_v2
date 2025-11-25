using behotel.DTOs;
using behotel.Interface;
using behotel.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace behotel.Interface.Implement
{
    public class ReviewImpl : IReviewService
    {
        private readonly HotelManagementContext _context;

        public ReviewImpl(HotelManagementContext context)
        {
            _context = context;
        }

        // Tạo review mới
        public async Task<ReviewDTO> CreateReviewAsync(ReviewDTO reviewDTO, Guid userId)
        {
            // Kiểm tra booking có tồn tại không
            var bookingExists = await _context.Booking.AnyAsync(b => b.Id == reviewDTO.BookingID);
            if (!bookingExists)
                throw new Exception("Booking không tồn tại");

            // Kiểm tra user đã review booking này chưa
            var existingReview = await _context.Review
                .AnyAsync(r => r.BookingID == reviewDTO.BookingID && r.UserID == userId);
            if (existingReview)
                throw new Exception("Bạn đã review booking này rồi");

            var review = new Review
            {
                ReviewID = Guid.NewGuid(),
                BookingID = reviewDTO.BookingID,
                UserID = userId,
                Rating = reviewDTO.Rating,
                Title = reviewDTO.Title,
                Content = reviewDTO.Content,
                CreatedDate = DateTime.Now
            };

            _context.Review.Add(review);
            await _context.SaveChangesAsync();

            return await MapToDTO(review);
        }

        // Lấy review theo ID
        public async Task<ReviewDTO> GetReviewByIdAsync(Guid reviewId)
        {
            var review = await _context.Review
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.ReviewID == reviewId);

            if (review == null)
                throw new Exception("Review không tồn tại");

            return await MapToDTO(review);
        }

        // Lấy tất cả reviews của 1 booking
        public async Task<List<ReviewDTO>> GetReviewsByBookingIdAsync(Guid bookingId)
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Where(r => r.BookingID == bookingId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            var reviewDTOs = new List<ReviewDTO>();
            foreach (var review in reviews)
            {
                reviewDTOs.Add(await MapToDTO(review));
            }

            return reviewDTOs;
        }

        // Lấy tất cả reviews của 1 user
        public async Task<List<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId)
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Where(r => r.UserID == userId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            var reviewDTOs = new List<ReviewDTO>();
            foreach (var review in reviews)
            {
                reviewDTOs.Add(await MapToDTO(review));
            }

            return reviewDTOs;
        }

        // Cập nhật review
        public async Task<ReviewDTO> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDTO, Guid currentUserId)
        {
            var review = await _context.Review.FindAsync(reviewId);

            if (review == null)
                throw new Exception("Review không tồn tại");

            // Chỉ cho phép user sở hữu review được update
            if (review.UserID != currentUserId)
                throw new UnauthorizedAccessException("Bạn không có quyền sửa review này");

            review.Rating = reviewDTO.Rating;
            review.Title = reviewDTO.Title;
            review.Content = reviewDTO.Content;

            _context.Review.Update(review);
            await _context.SaveChangesAsync();

            return await MapToDTO(review);
        }

        // Xóa review (hard delete)
        public async Task<bool> DeleteReviewAsync(Guid reviewId, Guid currentUserId, bool isAdmin)
        {
            var review = await _context.Review.FindAsync(reviewId);

            if (review == null)
                throw new Exception("Review không tồn tại");

            // Admin hoặc chính chủ review mới được xóa
            if (!isAdmin && review.UserID != currentUserId)
                throw new UnauthorizedAccessException("Bạn không có quyền xóa review này");

            _context.Review.Remove(review);
            await _context.SaveChangesAsync();

            return true;
        }

        // Map từ Model sang DTO
        private async Task<ReviewDTO> MapToDTO(Review review)
        {
            // Lấy thông tin user nếu chưa load
            if (review.User == null)
            {
                review.User = await _context.User.FindAsync(review.UserID);
            }

            return new ReviewDTO
            {
                ReviewID = review.ReviewID,
                BookingID = review.BookingID,
                UserID = review.UserID,
                Rating = review.Rating,
                Title = review.Title,
                Content = review.Content,
                CreatedDate = review.CreatedDate,
                UserName = review.User?.FullName ?? "Unknown User"
            };
        }
    }
}