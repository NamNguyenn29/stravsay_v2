using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class DiscountService : IDiscountService
    {
        private readonly HotelManagementContext _context;

        public DiscountService(HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<Discount> CreateDiscountAsync(Discount discount)
        {
            _context.Discount.Add(discount);
            await _context.SaveChangesAsync();
            return discount;
        }

        public async Task<bool> DeleteDiscountAsync(Guid id)
        {
            var discount = await _context.Discount.FindAsync(id);
            if (discount == null)
            {
                return false;
            } 
            _context.Discount.Remove(discount);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Discount>> GetAllDiscountAsync()
        {
            return await _context.Discount.ToListAsync();
        }

        public async Task<Discount?> GetDiscountByIdAsync(Guid id)
        {
            return await _context.Discount.FindAsync(id);
        }
    }
}
