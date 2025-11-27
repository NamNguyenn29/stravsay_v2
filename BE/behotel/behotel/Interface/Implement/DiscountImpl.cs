using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class DiscountImpl : IDiscountService
    {
        private readonly HotelManagementContext _context;

        public DiscountImpl(HotelManagementContext context)
        {
            _context = context;
        }

        // Lấy tất cả discounts với pagination
        public async Task<ApiResponse<DiscountDTO>> GetAllAsync(int currentPage, int pageSize)
        {
            try
            {
                var allDiscounts = await _context.Discount
                    .OrderByDescending(d => d.CreatedDate)
                    .ToListAsync();

                if (allDiscounts.Count == 0)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "404", "No discounts found", false, 0, 0, 0, 0, null, null);
                }

                int totalElement = allDiscounts.Count;
                int totalPage = (int)Math.Ceiling((double)totalElement / pageSize);

                var discountsWithPagination = allDiscounts
                    .Skip((currentPage - 1) * pageSize)
                    .Take(pageSize)
                    .Select(d => MapToDTO(d))
                    .ToList();

                return new ApiResponse<DiscountDTO>(discountsWithPagination, null, "200", "Get discounts successfully", true, currentPage, pageSize, totalPage, totalElement, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Lấy discount theo ID
        public async Task<ApiResponse<DiscountDTO>> GetByIdAsync(Guid id)
        {
            try
            {
                var discount = await _context.Discount.FindAsync(id);

                if (discount == null)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null);
                }

                var discountDTO = MapToDTO(discount);
                return new ApiResponse<DiscountDTO>(null, discountDTO, "200", "Get discount successfully", true, 0, 0, 0, 0, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Lấy discount theo Code
        public async Task<ApiResponse<DiscountDTO>> GetByCodeAsync(string code)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code))
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code is required", false, 0, 0, 0, 0, null, null);
                }

                var discount = await _context.Discount
                    .FirstOrDefaultAsync(d => d.DiscountCode == code.ToUpper());

                if (discount == null)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "404", "Discount code not found", false, 0, 0, 0, 0, null, null);
                }

                var discountDTO = MapToDTO(discount);
                return new ApiResponse<DiscountDTO>(null, discountDTO, "200", "Get discount successfully", true, 0, 0, 0, 0, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Tạo mới discount
        public async Task<ApiResponse<DiscountDTO>> CreateAsync(DiscountDTO dto)
        {
            try
            {
                // Validate
                if (string.IsNullOrWhiteSpace(dto.DiscountCode))
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code is required", false, 0, 0, 0, 0, null, null);
                }

                if (dto.ExpiredDate <= dto.StartDate)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Expired date must be after start date", false, 0, 0, 0, 0, null, null);
                }

                // Check trùng code
                var existingCode = await _context.Discount
                    .AnyAsync(d => d.DiscountCode == dto.DiscountCode.ToUpper());

                if (existingCode)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code already exists", false, 0, 0, 0, 0, null, null);
                }

                var discount = new Discount
                {
                    Id = Guid.NewGuid(),
                    DiscountCode = dto.DiscountCode.ToUpper(),
                    DiscountValue = dto.DiscountValue,
                    MaxDiscountAmount = dto.MaxDiscountAmount,
                    StartDate = dto.StartDate,
                    ExpiredDate = dto.ExpiredDate,
                    MinOrderAmount = dto.MinOrderAmount,
                    DiscountUsage = 0,
                    MaxUsageLimit = dto.MaxUsageLimit,
                    Status = 1,
                    CreatedDate = DateTime.UtcNow
                };

                _context.Discount.Add(discount);
                await _context.SaveChangesAsync();

                var discountDTO = MapToDTO(discount);
                return new ApiResponse<DiscountDTO>(null, discountDTO, "200", "Create discount successfully", true, 0, 0, 0, 0, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Cập nhật discount
        public async Task<ApiResponse<DiscountDTO>> UpdateAsync(Guid id, DiscountDTO dto)
        {
            try
            {
                var discount = await _context.Discount.FindAsync(id);

                if (discount == null)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null);
                }

                // Validate
                if (dto.ExpiredDate <= dto.StartDate)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Expired date must be after start date", false, 0, 0, 0, 0, null, null);
                }

                // Update fields
                discount.DiscountValue = dto.DiscountValue;
                discount.MaxDiscountAmount = dto.MaxDiscountAmount;
                discount.StartDate = dto.StartDate;
                discount.ExpiredDate = dto.ExpiredDate;
                discount.MinOrderAmount = dto.MinOrderAmount;
                discount.MaxUsageLimit = dto.MaxUsageLimit;
                discount.Status = dto.Status;

                _context.Discount.Update(discount);
                await _context.SaveChangesAsync();

                var discountDTO = MapToDTO(discount);
                return new ApiResponse<DiscountDTO>(null, discountDTO, "200", "Update discount successfully", true, 0, 0, 0, 0, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Xóa discount (hard delete)
        public async Task<ApiResponse<string>> DeleteAsync(Guid id)
        {
            try
            {
                var discount = await _context.Discount.FindAsync(id);

                if (discount == null)
                {
                    return new ApiResponse<string>(null, null, "404", "Discount not found", false, 0, 0, 0, 0, null, null);
                }

                // Check xem có booking nào đang dùng discount này không
                var bookingUsing = await _context.Booking
                    .AnyAsync(b => b.DiscountID == id);

                if (bookingUsing)
                {
                    return new ApiResponse<string>(null, null, "400", "Cannot delete discount that is being used in bookings", false, 0, 0, 0, 0, null, null);
                }

                _context.Discount.Remove(discount);
                await _context.SaveChangesAsync();

                return new ApiResponse<string>(null, null, "200", "Delete discount successfully", true, 0, 0, 0, 0, null, null);
            }
            catch (Exception ex)
            {
                return new ApiResponse<string>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        // Validate và tính toán discount
        public async Task<ApiResponse<DiscountDTO>> ValidateAndCalculateAsync(string code, decimal orderAmount)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(code))
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code is required", false, 0, 0, 0, 0, null, null);
                }

                var discount = await _context.Discount
                    .FirstOrDefaultAsync(d => d.DiscountCode == code.ToUpper());

                // Check 1: Code tồn tại?
                if (discount == null)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "404", "Discount code not found", false, 0, 0, 0, 0, null, null);
                }

                // Check 2: Status active?
                if (discount.Status != 1)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code is inactive", false, 0, 0, 0, 0, null, null);
                }

                // Check 3: Trong thời gian hiệu lực?
                var now = DateTime.UtcNow;
                if (now < discount.StartDate)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code is not yet valid", false, 0, 0, 0, 0, null, null);
                }

                if (now > discount.ExpiredDate)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code has expired", false, 0, 0, 0, 0, null, null);
                }

                // Check 4: Đơn hàng đủ điều kiện?
                if (orderAmount < discount.MinOrderAmount)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", $"Order amount must be at least {discount.MinOrderAmount:N0}₫", false, 0, 0, 0, 0, null, null);
                }

                // Check 5: Còn slot sử dụng?
                if (discount.DiscountUsage >= discount.MaxUsageLimit)
                {
                    return new ApiResponse<DiscountDTO>(null, null, "400", "Discount code has reached maximum usage limit", false, 0, 0, 0, 0, null, null);
                }

                // Tính toán discount amount
                decimal discountAmount = orderAmount * (discount.DiscountValue / 100);

                // Apply max cap nếu có
                if (discount.MaxDiscountAmount.HasValue && discountAmount > discount.MaxDiscountAmount.Value)
                {
                    discountAmount = discount.MaxDiscountAmount.Value;
                }

                // Return DiscountDTO với thông tin tính toán
                var discountDTO = MapToDTO(discount);

                return new ApiResponse<DiscountDTO>(
                    null,
                    discountDTO,
                    "200",
                    $"Discount valid. You save {discountAmount:N0}₫",
                    true,
                    0, 0, 0, 0,
                    null,
                    (int)discountAmount 
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<DiscountDTO>(null, null, "500", ex.Message, false, 0, 0, 0, 0, null, null);
            }
        }

        private DiscountDTO MapToDTO(Discount discount)
        {
            return new DiscountDTO
            {
                Id = discount.Id,
                DiscountCode = discount.DiscountCode,
                DiscountValue = discount.DiscountValue,
                MaxDiscountAmount = discount.MaxDiscountAmount,
                StartDate = discount.StartDate,
                ExpiredDate = discount.ExpiredDate,
                MinOrderAmount = discount.MinOrderAmount,
                DiscountUsage = discount.DiscountUsage,
                MaxUsageLimit = discount.MaxUsageLimit,
                Status = discount.Status,
                CreatedDate = discount.CreatedDate
            };
        }
    }
}