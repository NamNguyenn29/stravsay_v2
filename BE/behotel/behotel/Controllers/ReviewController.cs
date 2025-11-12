using behotel.DTO;
using behotel.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAllReviews([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var result = await _reviewService.GetReviewsWithPaginationAsync(page, size);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReviewById(Guid id)
    {
        var review = await _reviewService.GetReviewByIdAsync(id);
        if (review == null) return NotFound("Review not found");
        return Ok(review);
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] ReviewDTO dto)
    {
        var created = await _reviewService.CreateReviewAsync(dto);
        return CreatedAtAction(nameof(GetReviewById), new { id = created.ReviewID }, created);
    }

    [Authorize(Roles = "User,Admin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] ReviewDTO dto)
    {
        var updated = await _reviewService.UpdateReviewAsync(id, dto);
        if (updated == null) return NotFound("Review not found");
        return Ok(updated);
    }

    [Authorize(Roles = "User,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id, [FromQuery] Guid deletedBy)
    {
        var success = await _reviewService.DeleteReviewAsync(id, deletedBy);
        if (!success) return NotFound("Review not found");
        return Ok("Review deleted successfully");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("admin/{id}/moderate")]
    public async Task<IActionResult> ModerateReview(Guid id, [FromBody] ReviewDTO dto)
    {
        var updated = await _reviewService.UpdateReviewAsync(id, dto);
        if (updated == null) return NotFound("Review not found");
        return Ok("Review moderated successfully");
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllReviewsAdmin([FromQuery] int page = 1, [FromQuery] int size = 10)
    {
        var result = await _reviewService.GetReviewsWithPaginationAsync(page, size);
        return Ok(result);
    }
}
