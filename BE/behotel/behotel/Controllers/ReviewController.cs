using System;
using System.Security.Claims;
using System.Threading.Tasks;
using behotel.DTOs;
using behotel.Helper;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        private Guid GetCurrentUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return string.IsNullOrEmpty(userId) ? Guid.Empty : Guid.Parse(userId);
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAllReviews()
        {
            var result = await _reviewService.GetAllReviewsAsync();
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetReviewById(Guid id)
        {
            var result = await _reviewService.GetReviewByIdAsync(id);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("room/{roomId}")]
        public async Task<IActionResult> GetReviewsByRoomId(Guid roomId)
        {
            var result = await _reviewService.GetReviewsByRoomIdAsync(roomId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetReviewsByUserId(Guid userId)
        {
            var result = await _reviewService.GetReviewsByUserIdAsync(userId);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("booking/{bookingId}")]
        public async Task<IActionResult> GetReviewByBookingId(Guid bookingId)
        {
            var review = await _reviewService.GetReviewByBookingIdAsync(bookingId);

            return Ok(review);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewDTO reviewDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = GetCurrentUserId();
            var result = await _reviewService.CreateReviewAsync(reviewDto, currentUserId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReview(Guid id, [FromBody] ReviewDTO reviewDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUserId = GetCurrentUserId();
            var result = await _reviewService.UpdateReviewAsync(id, reviewDto, currentUserId);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(Guid id)
        {
            var currentUserId = GetCurrentUserId();
            var result = await _reviewService.DeleteReviewAsync(id);

            if (!result.IsSuccess)
                return BadRequest(result);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("can-review/{bookingId}")]
        public async Task<IActionResult> CanReviewBooking(Guid bookingId)
        {
            var currentUserId = GetCurrentUserId();
            bool canReview = await _reviewService.CanReviewBookingAsync(bookingId, currentUserId);
            return Ok(new { canReview });
        }
    }
}