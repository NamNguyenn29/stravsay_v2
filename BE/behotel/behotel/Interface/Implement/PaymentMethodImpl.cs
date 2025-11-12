using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using behotel.Interface;
using behotel.Models;          
using behotel.DTO;             

namespace behotel.Interface.Implement
{
    public class PaymentMethodImpl : IPaymentMethodService
    {
        private readonly HotelManagementContext _context;
        private readonly ILogger<PaymentMethodImpl> _logger;

        public PaymentMethodImpl(HotelManagementContext context, ILogger<PaymentMethodImpl> logger)
        {
            _context = context;
            _logger = logger;
        }

        // LẤY DANH SÁCH PHƯƠNG THỨC ĐANG ACTIVE
 
        public async Task<IEnumerable<PaymentMethodDTO>> GetAllActiveAsync()
        {
            try
            {
                var methods = await _context.PaymentMethods
                    .Where(m => m.Status == 1)
                    .Select(m => new PaymentMethodDTO
                    {
                        PaymentMethodID = m.PaymentMethodID,
                        Name = m.Name,
                        Code = m.Code,
                        Details = m.Details,
                        Status = m.Status,
                        CreatedDate = m.CreatedDate
                    })
                    .ToListAsync();

                return methods;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách phương thức thanh toán đang hoạt động");
                throw;
            }
        }


        // LẤY 1 PHƯƠNG THỨC THEO ID
        public async Task<PaymentMethodDTO?> GetByIdAsync(Guid id)
        {
            try
            {
                var method = await _context.PaymentMethods.FindAsync(id);
                if (method == null)
                    return null;

                return new PaymentMethodDTO
                {
                    PaymentMethodID = method.PaymentMethodID,
                    Name = method.Name,
                    Code = method.Code,
                    Details = method.Details,
                    Status = method.Status,
                    CreatedDate = method.CreatedDate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy thông tin phương thức thanh toán theo ID");
                throw;
            }
        }


        // BẬT PHƯƠNG THỨC THANH TOÁN

        public async Task<bool> EnableAsync(Guid id)
        {
            try
            {
                var method = await _context.PaymentMethods.FindAsync(id);
                if (method == null)
                    return false;

                method.Status = 1; // Active
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi bật phương thức thanh toán");
                return false;
            }
        }

        // TẮT PHƯƠNG THỨC THANH TOÁN

        public async Task<bool> DisableAsync(Guid id)
        {
            try
            {
                var method = await _context.PaymentMethods.FindAsync(id);
                if (method == null)
                    return false;

                method.Status = 0; // Inactive
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tắt phương thức thanh toán");
                return false;
            }
        }
    }
}
