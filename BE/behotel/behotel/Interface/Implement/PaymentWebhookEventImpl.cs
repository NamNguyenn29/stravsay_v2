using behotel.DTO;
using behotel.Interface;
using behotel.Interfaces;
using behotel.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace behotel.Interface.Implement
{
    public class PaymentWebhookEventImpl : IPaymentWebhookEventService
    {
        private readonly HotelManagementContext _context;
        private readonly ILogger<PaymentWebhookEventImpl> _logger;

        public PaymentWebhookEventImpl(HotelManagementContext context, ILogger<PaymentWebhookEventImpl> logger)
        {
            _context = context;
            _logger = logger;
        }

        // =============================
        // GHI NHẬN MỘT WEBHOOK MỚI
        // =============================
        public async Task<PaymentWebhookEventDTO> LogEventAsync(string provider, string payload, string? signature)
        {
            try
            {
                var eventEntity = new PaymentWebhookEvent
                {
                    EventID = Guid.NewGuid(),
                    PaymentMethodID = await GetPaymentMethodIdByProviderAsync(provider) ?? Guid.Empty,
                    Payload = payload,
                    Signature = signature,
                    Processed = false,
                    ProcessingResult = null,
                    CreatedDate = DateTime.UtcNow
                };

                await _context.PaymentWebhookEvents.AddAsync(eventEntity);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Webhook từ {provider} đã được lưu thành công.");

                return new PaymentWebhookEventDTO
                {
                    EventID = eventEntity.EventID,
                    PaymentMethodID = eventEntity.PaymentMethodID,
                    Payload = eventEntity.Payload,
                    Signature = eventEntity.Signature,
                    Processed = eventEntity.Processed,
                    ProcessingResult = eventEntity.ProcessingResult,
                    CreatedDate = eventEntity.CreatedDate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu webhook event.");
                throw;
            }
        }

        // =============================
        // XÁC MINH CHỮ KÝ (SIGNATURE)
        // =============================
        public async Task<bool> ValidateSignatureAsync(string provider, string payload, string signature)
        {
            try
            {
                // Tìm secret key từ bảng PaymentMethodConfig
                var config = await _context.PaymentMethodConfigs
                    .Include(c => c.PaymentMethod)
                    .FirstOrDefaultAsync(c => c.PaymentMethod.Code == provider);

                if (config == null || string.IsNullOrEmpty(config.AdditionalConfig))
                {
                    _logger.LogWarning($"Không tìm thấy cấu hình cho provider: {provider}");
                    return false;
                }

                // Giả lập secret key nằm trong AdditionalConfig dạng JSON {"SecretKey":"xxxx"}
                string? secretKey = null;
                try
                {
                    var json = System.Text.Json.JsonDocument.Parse(config.AdditionalConfig);
                    if (json.RootElement.TryGetProperty("SecretKey", out var keyProp))
                        secretKey = keyProp.GetString();
                }
                catch
                {
                    _logger.LogWarning("Không thể đọc SecretKey từ AdditionalConfig.");
                }

                if (string.IsNullOrEmpty(secretKey))
                    return false;

                var computed = ComputeHmacSha256(payload, secretKey);
                return computed.Equals(signature, StringComparison.OrdinalIgnoreCase);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xác minh chữ ký webhook.");
                return false;
            }
        }

        // =============================
        // XỬ LÝ SỰ KIỆN WEBHOOK
        // =============================
        public async Task<bool> ProcessEventAsync(Guid eventId)
        {
            try
            {
                var evt = await _context.PaymentWebhookEvents.FindAsync(eventId);
                if (evt == null)
                {
                    _logger.LogWarning($"Không tìm thấy webhook event ID: {eventId}");
                    return false;
                }

                if (evt.Processed)
                {
                    _logger.LogInformation($"Webhook event {eventId} đã được xử lý trước đó.");
                    return true;
                }

                // Ở đây bạn có thể parse evt.Payload để lấy thông tin giao dịch (OrderId, Amount, Status,...)
                // Giả sử payload chứa {"OrderId":"...","Status":"success"}
                bool paymentUpdated = false;
                try
                {
                    var json = System.Text.Json.JsonDocument.Parse(evt.Payload);
                    if (json.RootElement.TryGetProperty("OrderId", out var orderProp))
                    {
                        var orderId = orderProp.GetString();

                        var payment = await _context.Payments
                            .FirstOrDefaultAsync(p => p.MerchantReference == orderId);

                        if (payment != null)
                        {
                            payment.Status = 1; // Success
                            payment.PaidAt = DateTime.UtcNow;
                            _context.Payments.Update(payment);
                            await _context.SaveChangesAsync();
                            paymentUpdated = true;
                        }
                    }
                }
                catch (Exception jsonEx)
                {
                    _logger.LogWarning(jsonEx, "Không thể parse payload webhook.");
                }

                evt.Processed = true;
                evt.ProcessingResult = paymentUpdated
                    ? "Payment updated successfully."
                    : "No matching payment found.";
                _context.PaymentWebhookEvents.Update(evt);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý webhook event.");
                return false;
            }
        }

        // =============================
        // LẤY DANH SÁCH WEBHOOK CHƯA XỬ LÝ
        // =============================
        public async Task<IEnumerable<PaymentWebhookEventDTO>> GetUnprocessedEventsAsync()
        {
            try
            {
                var events = await _context.PaymentWebhookEvents
                    .Where(e => !e.Processed)
                    .Select(e => new PaymentWebhookEventDTO
                    {
                        EventID = e.EventID,
                        PaymentMethodID = e.PaymentMethodID,
                        Payload = e.Payload,
                        Signature = e.Signature,
                        Processed = e.Processed,
                        ProcessingResult = e.ProcessingResult,
                        CreatedDate = e.CreatedDate
                    })
                    .ToListAsync();

                return events;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy danh sách webhook chưa xử lý.");
                throw;
            }
        }

        // =============================
        // LẤY WEBHOOK THEO ID
        // =============================
        public async Task<PaymentWebhookEventDTO?> GetByIdAsync(Guid eventId)
        {
            try
            {
                var e = await _context.PaymentWebhookEvents.FindAsync(eventId);
                if (e == null) return null;

                return new PaymentWebhookEventDTO
                {
                    EventID = e.EventID,
                    PaymentMethodID = e.PaymentMethodID,
                    Payload = e.Payload,
                    Signature = e.Signature,
                    Processed = e.Processed,
                    ProcessingResult = e.ProcessingResult,
                    CreatedDate = e.CreatedDate
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lấy webhook theo ID.");
                throw;
            }
        }

        // HÀM PHỤ: LẤY PaymentMethodID THEO TÊN NHÀ CUNG CẤP (provider)

        private async Task<Guid?> GetPaymentMethodIdByProviderAsync(string provider)
        {
            var method = await _context.PaymentMethods.FirstOrDefaultAsync(m => m.Code == provider);
            return method?.PaymentMethodID;
        }

        // HÀM PHỤ: TÍNH HMAC SHA256
        private string ComputeHmacSha256(string message, string secretKey)
        {
            var keyBytes = Encoding.UTF8.GetBytes(secretKey);
            var messageBytes = Encoding.UTF8.GetBytes(message);
            using var hmac = new HMACSHA256(keyBytes);
            var hashBytes = hmac.ComputeHash(messageBytes);
            return BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
        }
    }
}
