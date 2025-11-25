//using behotel.DTO;
//using behotel.Interface;
//using behotel.Models;
//using Microsoft.EntityFrameworkCore;

//namespace behotel.Interface.Implement
//{
//    public class DiscountImpl : IDiscountService
//    {
//        private readonly HotelManagementContext _context;

//        public DiscountImpl(HotelManagementContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<DiscountDTO>> GetAllAsync()
//        {
//            var discounts = await _context.Discounts.ToListAsync();
//            return discounts.Select(MapToDTO);
//        }

//        public async Task<DiscountDTO> GetByIdAsync(Guid id)
//        {
//            var discount = await _context.Discounts.FirstOrDefaultAsync(d => d.Id == id);
//            if (discount == null)
//                throw new KeyNotFoundException($"Discount với id {id} không tồn tại.");

//            return MapToDTO(discount);
//        }

//        public async Task<DiscountDTO> GetByCodeAsync(string code)
//        {
//            var discount = await _context.Discounts.FirstOrDefaultAsync(d => d.DiscountCode == code);
//            if (discount == null)
//                throw new KeyNotFoundException($"Discount code {code} không tồn tại.");

//            return MapToDTO(discount);
//        }

//        public async Task<DiscountDTO> CreateAsync(DiscountDTO dto)
//        {
//            var discount = MapToEntity(dto);
//            discount.Id = Guid.NewGuid();
//            discount.CreatedDate = DateTime.UtcNow;

//            _context.Discounts.Add(discount);
//            await _context.SaveChangesAsync();

//            return MapToDTO(discount);
//        }

//        public async Task<DiscountDTO> UpdateAsync(Guid id, DiscountDTO dto)
//        {
//            var existingDiscount = await _context.Discounts.FirstOrDefaultAsync(d => d.Id == id);
//            if (existingDiscount == null)
//                throw new KeyNotFoundException($"Discount với id {id} không tồn tại.");

//            existingDiscount.DiscountCode = dto.DiscountCode;
//            existingDiscount.DiscountValue = dto.DiscountValue;
//            existingDiscount.MaxDiscountAmount = dto.MaxDiscountAmount;
//            existingDiscount.StartDate = dto.StartDate;
//            existingDiscount.ExpiredDate = dto.ExpiredDate;
//            existingDiscount.MinOrderAmount = dto.MinOrderAmount;
//            existingDiscount.Status = dto.Status;

//            _context.Discounts.Update(existingDiscount);
//            await _context.SaveChangesAsync();

//            return MapToDTO(existingDiscount);
//        }

//        public async Task<bool> DeleteAsync(Guid id)
//        {
//            var discount = await _context.Discounts.FirstOrDefaultAsync(d => d.Id == id);
//            if (discount == null)
//                throw new KeyNotFoundException($"Discount với id {id} không tồn tại.");

//            _context.Discounts.Remove(discount);
//            await _context.SaveChangesAsync();

//            return true;
//        }

//        public async Task<DiscountDTO> ValidateDiscountAsync(string code, decimal orderAmount)
//        {
//            var discount = await _context.Discounts.FirstOrDefaultAsync(d => d.DiscountCode == code);
//            if (discount == null)
//                throw new KeyNotFoundException($"Discount code {code} không tồn tại.");

//            if (DateTime.UtcNow > discount.ExpiredDate)
//                throw new InvalidOperationException("Discount đã hết hạn.");

//            if (discount.Status != 1)
//                throw new InvalidOperationException("Discount không hoạt động.");

//            if (orderAmount < discount.MinOrderAmount)
//                throw new InvalidOperationException($"Đơn hàng phải từ {discount.MinOrderAmount} trở lên.");

//            return MapToDTO(discount);
//        }

//        // Private mapping methods
//        private DiscountDTO MapToDTO(Discount discount)
//        {
//            return new DiscountDTO
//            {
//                Id = discount.Id,
//                DiscountCode = discount.DiscountCode,
//                DiscountValue = discount.DiscountValue,
//                MaxDiscountAmount = discount.MaxDiscountAmount,
//                StartDate = discount.StartDate,
//                ExpiredDate = discount.ExpiredDate,
//                MinOrderAmount = discount.MinOrderAmount,
//                Status = discount.Status,
//                CreatedDate = discount.CreatedDate
//            };
//        }

//        private Discount MapToEntity(DiscountDTO dto)
//        {
//            return new Discount
//            {
//                DiscountCode = dto.DiscountCode,
//                DiscountValue = dto.DiscountValue,
//                MaxDiscountAmount = dto.MaxDiscountAmount,
//                StartDate = dto.StartDate,
//                ExpiredDate = dto.ExpiredDate,
//                MinOrderAmount = dto.MinOrderAmount,
//                Status = dto.Status
//            };
//        }
//    }
//}