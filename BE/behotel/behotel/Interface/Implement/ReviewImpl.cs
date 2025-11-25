using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using behotel.DTOs;
using behotel.Models;
using behotel.Interface;
using behotel.Helper;
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

        public async Task<ApiResponse<ReviewDTO>> GetAllReviewsAsync()
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Room)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            var reviewDTOs = reviews.Select(r => MapToDTO(r)).ToList();

            return new ApiResponse<ReviewDTO>(reviewDTOs, null, "200", "Get all reviews successfully", true, 0, 0, 0, reviewDTOs.Count, null, 0);
        }

        public async Task<ApiResponse<ReviewDTO>> GetReviewByIdAsync(Guid reviewId)
        {
            var review = await _context.Review
                .Include(r => r.User)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Room)
                .FirstOrDefaultAsync(r => r.ReviewID == reviewId);

            if (review == null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, 0);
            }

            return new ApiResponse<ReviewDTO>(null, MapToDTO(review), "200", "Get review successfully", true, 0, 0, 0, 0, null, 0);
        }

        public async Task<ApiResponse<ReviewDTO>> GetReviewsByRoomIdAsync(Guid roomId)
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Include(r => r.Booking)
                .Where(r => r.Booking.RoomId == roomId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            var reviewDTOs = reviews.Select(r => MapToDTO(r)).ToList();

            return new ApiResponse<ReviewDTO>(reviewDTOs, null, "200", "Get reviews by room successfully", true, 0, 0, 0, reviewDTOs.Count, null, 0);
        }

        public async Task<ApiResponse<ReviewDTO>> GetReviewsByUserIdAsync(Guid userId)
        {
            var reviews = await _context.Review
                .Include(r => r.User)
                .Include(r => r.Booking)
                .Where(r => r.UserID == userId)
                .OrderByDescending(r => r.CreatedDate)
                .ToListAsync();

            var reviewDTOs = reviews.Select(r => MapToDTO(r)).ToList();

            return new ApiResponse<ReviewDTO>(reviewDTOs, null, "200", "Get reviews by user successfully", true, 0, 0, 0, reviewDTOs.Count, null, 0);
        }

        public async Task<ReviewDTO?> GetReviewByBookingIdAsync(Guid bookingId)
        {
            var review = await _context.Review
                .Where(r => r.BookingID == bookingId)
                .Select(r => new ReviewDTO
                {
                    ReviewID = r.ReviewID,
                    BookingID = r.BookingID,
                    UserID = r.UserID,
                    Rating = r.Rating,
                    Title = r.Title,
                    Content = r.Content,
                    CreatedDate = r.CreatedDate,
                    UpdatedDate = r.UpdatedDate,
                    UserName = r.User.FullName ?? "Unknown"
                    
                })
                .FirstOrDefaultAsync();

            return review; 
        }

        public async Task<ApiResponse<ReviewDTO>> CreateReviewAsync(ReviewDTO reviewDto, Guid currentUserId)
        {
            var booking = await _context.Booking.FindAsync(reviewDto.BookingID);
            if (booking == null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "404", "Booking not found", false, 0, 0, 0, 0, null, 0);
            }


            if (booking.UserId != currentUserId)
            {
                return new ApiResponse<ReviewDTO>(null, null, "403", "You do not have permission to review this booking", false, 0, 0, 0, 0, null, 0);
            }

            if (DateTime.Now <= booking.CheckOutDate)
            {
                return new ApiResponse<ReviewDTO>(null, null, "400", "Cannot review before checkout time", false, 0, 0, 0, 0, null, 0);
            }

            var existingReview = await _context.Review
                .FirstOrDefaultAsync(r => r.BookingID == reviewDto.BookingID);

            if (existingReview != null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "400", "You have already reviewed this booking", false, 0, 0, 0, 0, null, 0);
            }

            var review = new Review
            {
                ReviewID = Guid.NewGuid(),
                BookingID = reviewDto.BookingID,
                UserID = currentUserId,
                Rating = reviewDto.Rating,
                Title = reviewDto.Title,
                Content = reviewDto.Content,
                CreatedDate = DateTime.Now,
                UpdatedDate=DateTime.Now,
                Status = 1
            };

            _context.Review.Add(review);
            await _context.SaveChangesAsync();

            var createdReviewDTO = MapToDTO(review);
            return new ApiResponse<ReviewDTO>(null, createdReviewDTO, "200", "Create review successfully", true, 0, 0, 0, 0, null, 0);
        }

        public async Task<ApiResponse<ReviewDTO>> UpdateReviewAsync(Guid reviewId, ReviewDTO reviewDto, Guid currentUserId)
        {
            var review = await _context.Review.FindAsync(reviewId);
            if (review == null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, 0);
            }

            if (review.UserID != currentUserId)
            {
                return new ApiResponse<ReviewDTO>(null, null, "403", "You do not have permission to update this review", false, 0, 0, 0, 0, null, 0);
            }

            review.Rating = reviewDto.Rating;
            review.Title = reviewDto.Title;
            review.Content = reviewDto.Content;
            review.UpdatedDate = DateTime.Now;

            _context.Review.Update(review); 
            await _context.SaveChangesAsync();

            var updatedReviewDTO = MapToDTO(review);
            return new ApiResponse<ReviewDTO>(null, updatedReviewDTO, "200", "Update review successfully", true, 0, 0, 0, 0, null, 0);
        }

        public async Task<ApiResponse<ReviewDTO>> DeleteReviewAsync(Guid reviewId)
        {
            var review = await _context.Review.FindAsync(reviewId);

            if (review == null)
            {
                return new ApiResponse<ReviewDTO>(null, null, "404", "Review not found", false, 0, 0, 0, 0, null, 0);
            }

            _context.Review.Remove(review);
            await _context.SaveChangesAsync();

            return new ApiResponse<ReviewDTO>(null, null, "200", "Delete review successfully", true, 0, 0, 0, 0, null, 0);
        }

        public async Task<bool> CanReviewBookingAsync(Guid bookingId, Guid userId)
        {
            var booking = await _context.Booking.FindAsync(bookingId);
            if (booking == null || booking.UserId != userId)
            {
                return false;
            }

            if (DateTime.Now <= booking.CheckOutDate)
            {
                return false;
            }

            return true;
        }

        private ReviewDTO MapToDTO(Review review)
        {
            return new ReviewDTO
            {
                ReviewID = review.ReviewID,
                BookingID = review.BookingID,
                UserID = review.UserID,
                Rating = review.Rating,
                Title = review.Title,
                Content = review.Content,
                CreatedDate = review.CreatedDate,
                UpdatedDate = review.UpdatedDate,
                UserName = review.User?.FullName ?? "Unknown",
                RoomName = review.Booking?.Room?.RoomName ?? "-",        
                RoomNumber = review.Booking?.Room?.RoomNumber.ToString() ?? "-"
            };
        }
    }
}