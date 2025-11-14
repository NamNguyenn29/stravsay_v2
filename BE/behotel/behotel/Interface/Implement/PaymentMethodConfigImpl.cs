using behotel.DTO;        // Chứa PaymentMethodConfigDTO
using behotel.Interface;
using behotel.Interfaces;
using behotel.Models;     // Chứa HotelManagementContext và entity PaymentMethodConfig
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace behotel.Interface.Implement
{
    public class PaymentMethodConfigImpl : IPaymentMethodConfigService
    {
        private readonly HotelManagementContext _context;
        private readonly ILogger<PaymentMethodConfigImpl> _logger;

        public PaymentMethodConfigImpl(HotelManagementContext context, ILogger<PaymentMethodConfigImpl> logger)
        {
            _context = context;
            _logger = logger;
        }


        public async Task<IEnumerable<PaymentMethodConfigDTO>> GetAllAsync()
        {
            try
            {
                var configs = await _context.PaymentMethodConfigs
                    .Select(c => new PaymentMethodConfigDTO
                    {
                        ConfigID = c.ConfigID,
                        PaymentMethodID = c.PaymentMethodID,
                        ProviderName = c.ProviderName,
                        MerchantId = c.MerchantId,
                        CallbackUrl = c.CallbackUrl,
                        Environment = c.Environment,
                        AdditionalConfig = c.AdditionalConfig,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = null
                    })
                    .ToListAsync();

                return configs;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách cấu hình phương thức thanh toán");
                throw;
            }
        }

        public async Task<PaymentMethodConfigDTO?> GetByIdAsync(Guid configId)
        {
            try
            {
                var c = await _context.PaymentMethodConfigs.FindAsync(configId);
                if (c == null) return null;

                return new PaymentMethodConfigDTO
                {
                    ConfigID = c.ConfigID,
                    PaymentMethodID = c.PaymentMethodID,
                    ProviderName = c.ProviderName,
                    MerchantId = c.MerchantId,
                    CallbackUrl = c.CallbackUrl,
                    Environment = c.Environment,
                    AdditionalConfig = c.AdditionalConfig,
                    CreatedDate = c.CreatedDate,
                    UpdatedDate = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy cấu hình phương thức thanh toán theo ID");
                throw;
            }
        }

        public async Task<PaymentMethodConfigDTO?> GetByMethodCodeAsync(string methodCode)
        {
            try
            {
                var config = await _context.PaymentMethodConfigs
                    .Include(c => c.PaymentMethod)
                    .Where(c => c.PaymentMethod.Code == methodCode)
                    .Select(c => new PaymentMethodConfigDTO
                    {
                        ConfigID = c.ConfigID,
                        PaymentMethodID = c.PaymentMethodID,
                        ProviderName = c.ProviderName,
                        MerchantId = c.MerchantId,
                        CallbackUrl = c.CallbackUrl,
                        Environment = c.Environment,
                        AdditionalConfig = c.AdditionalConfig,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = null
                    })
                    .FirstOrDefaultAsync();

                return config;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy cấu hình theo mã phương thức thanh toán");
                throw;
            }
        }

        public async Task<bool> CreateOrUpdateAsync(PaymentMethodConfigDTO config)
        {
            try
            {
                var existing = await _context.PaymentMethodConfigs
                    .FirstOrDefaultAsync(c => c.PaymentMethodID == config.PaymentMethodID);

                if (existing == null)
                {

                    var entity = new PaymentMethodConfig
                    {
                        ConfigID = Guid.NewGuid(),
                        PaymentMethodID = config.PaymentMethodID,
                        ProviderName = config.ProviderName,
                        MerchantId = config.MerchantId,
                        CallbackUrl = config.CallbackUrl,
                        Environment = config.Environment,
                        AdditionalConfig = config.AdditionalConfig,
                        CreatedDate = DateTime.UtcNow
                    };
                    await _context.PaymentMethodConfigs.AddAsync(entity);
                }
                else
                {
                    existing.ProviderName = config.ProviderName;
                    existing.MerchantId = config.MerchantId;
                    existing.CallbackUrl = config.CallbackUrl;
                    existing.Environment = config.Environment;
                    existing.AdditionalConfig = config.AdditionalConfig;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo hoặc cập nhật cấu hình phương thức thanh toán");
                return false;
            }
        }

        public async Task<bool> DeleteAsync(Guid configId)
        {
            try
            {
                var entity = await _context.PaymentMethodConfigs.FindAsync(configId);
                if (entity == null)
                    return false;

                _context.PaymentMethodConfigs.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xóa cấu hình phương thức thanh toán");
                return false;
            }
        }

        public async Task<PaymentMethodConfigDTO?> GetDecryptedConfigAsync(Guid paymentMethodId)
        {
            try
            {

                var config = await _context.PaymentMethodConfigs
                    .FirstOrDefaultAsync(c => c.PaymentMethodID == paymentMethodId);

                if (config == null) return null;

                return new PaymentMethodConfigDTO
                {
                    ConfigID = config.ConfigID,
                    PaymentMethodID = config.PaymentMethodID,
                    ProviderName = config.ProviderName,
                    MerchantId = config.MerchantId,
                    CallbackUrl = config.CallbackUrl,
                    Environment = config.Environment,
                    AdditionalConfig = config.AdditionalConfig,
                    CreatedDate = config.CreatedDate,
                    UpdatedDate = null
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy cấu hình đã giải mã cho phương thức thanh toán");
                throw;
            }
        }
    }
}
