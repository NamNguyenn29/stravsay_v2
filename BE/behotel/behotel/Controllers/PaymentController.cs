using behotel.DTO;
using behotel.Helper;
using behotel.Interface;
using behotel.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace behotel.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IPaymentMethodService _paymentMethodService;
        private readonly ILogger<PaymentController> _logger;
        private readonly IConfiguration _config;
        private readonly HotelManagementContext _context;

        public PaymentController(
            IPaymentService paymentService,
            IPaymentMethodService paymentMethodService,
            ILogger<PaymentController> logger,
            IConfiguration config,
            HotelManagementContext context)
        {
            _paymentService = paymentService;
            _paymentMethodService = paymentMethodService;
            _logger = logger;
            _config = config;
            _context = context;
        }

        [HttpGet("methods")]
        public async Task<IActionResult> GetPaymentMethods()
        {
            var result = await _paymentMethodService.GetAllActiveAsync();
            return Ok(result);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new ApiResponse<string>(null, null, "400", "Dữ liệu thanh toán không hợp lệ", false, 0, 0, 0, 0, null, null));
            }
            if (dto.Amount <= 0)
            {
                return BadRequest(new ApiResponse<string>(null, null, "400", "Số tiền phải lớn hơn 0", false, 0, 0, 0, 0, null, null));
            }

            if (dto.BookingID == Guid.Empty)
            {
                return BadRequest(new ApiResponse<string>(null, null, "400", "BookingID không hợp lệ", false, 0, 0, 0, 0, null, null));
            }

            try
            {
                var result = await _paymentService.CreateAsync(dto);

                if (result == null)
                {
                    return BadRequest(new ApiResponse<string>(null, null, "400", "Tạo thanh toán thất bại", false, 0, 0, 0, 0, null, null));
                }

                var response = new ApiResponse<PaymentDTO>(
                    List: null,
                    Object: result,
                    Code: "201",
                    Message: "Tạo thanh toán thành công",
                    IsSuccess: true,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: result.PayUrl,
                    Int: null
                );

                return CreatedAtAction(nameof(GetPaymentById), new { paymentId = result.PaymentID }, response);
            }
            catch (ArgumentException aex)
            {
                _logger.LogWarning(aex, "Validation error when creating payment.");
                return BadRequest(new ApiResponse<string>(null, null, "400", aex.Message, false, 0, 0, 0, 0, null, null));
            }
            catch (NotSupportedException nex)
            {
                _logger.LogWarning(nex, "Unsupported payment method.");
                return BadRequest(new ApiResponse<string>(null, null, "400", nex.Message, false, 0, 0, 0, 0, null, null));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo thanh toán.");
                return StatusCode(500, new ApiResponse<string>(null, null, "500", "Lỗi server khi tạo thanh toán", false, 0, 0, 0, 0, null, null));
            }
        }

        [HttpGet("{paymentId}")]
        public async Task<IActionResult> GetPaymentById(Guid paymentId)
        {
            var result = await _paymentService.GetByIdAsync(paymentId);
            if (result == null)
            {
                return NotFound(new ApiResponse<string>(null, null, "400", "Không tìm thấy thanh toán", false, 0, 0, 0, 0, null, null));
            }

            var response = new ApiResponse<PaymentDTO>(
                List: null,
                Object: result,
                Code: "200",
                Message: "Lấy thông tin thanh toán thành công",
                IsSuccess: true,
                CurrentPage: 0,
                PageSize: 0,
                TotalPage: 0,
                TotalElement: 0,
                String: null,
                Int: null
            );

            return Ok(response);
        }


        [HttpGet("callback/momo")]
        public async Task<IActionResult> MomoCallback()
        {
            try
            {
                var resultCode = Request.Query["resultCode"].ToString();
                var orderId = Request.Query["orderId"].ToString();
                var transId = Request.Query["transId"].ToString();
                var message = Request.Query["message"].ToString();

                _logger.LogInformation($"🔔 MoMo Callback: resultCode={resultCode}, orderId={orderId}");

                if (string.IsNullOrEmpty(orderId))
                {
                    return Redirect("https://localhost:3000/user/userbooking?error=invalid_payment");
                }

                // Lưu callback info (nếu tìm thấy payment)
                try
                {
                    Guid paymentGuid;
                    if (Guid.TryParse(orderId, out paymentGuid))
                    {
                        var payment = await _context.Payments.FindAsync(paymentGuid);
                        if (payment != null)
                        {
                            var callbackData = new
                            {
                                resultCode,
                                message = System.Web.HttpUtility.UrlDecode(message),
                                transId,
                                receivedAt = DateTime.UtcNow,
                                queryString = Request.QueryString.Value
                            };

                            payment.ResponsePayload = JsonConvert.SerializeObject(callbackData);
                            payment.ProviderTransactionRef = transId;

                            _context.Payments.Update(payment);
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            _logger.LogWarning($"MoMo callback: không tìm thấy Payment với id {paymentGuid}");
                        }
                    }
                    else
                    {
                        _logger.LogWarning($"MoMo callback: orderId không parse được thành Guid: {orderId}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "⚠️ Lỗi khi lưu callback info");
                }

                // Success: đánh dấu paid bằng service (idempotent)
                if (resultCode == "0")
                {
                    try
                    {
                        if (Guid.TryParse(orderId, out var paymentId))
                        {
                            // truyền transId + toàn bộ query làm responsePayload cho traceability
                            var payload = JsonConvert.SerializeObject(new { resultCode, transId, query = Request.QueryString.Value });
                            var marked = await _paymentService.MarkAsPaidAsync(paymentId, transId, payload);
                            if (!marked)
                            {
                                _logger.LogWarning($"MoMo callback: MarkAsPaidAsync trả về false cho Payment {paymentId}");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"⚠️ Lỗi khi mark payment {orderId} là PAID");
                    }

                    _logger.LogInformation($"✅ MoMo payment SUCCESS: {orderId}");
                    return Redirect($"https://localhost:3000/user/userbooking?payment=success&id={orderId}");
                }

                // Failed/Cancelled - Cancel payment & booking
                _logger.LogWarning($"❌ MoMo payment FAILED: {orderId}, code={resultCode}");
                try
                {
                    if (Guid.TryParse(orderId, out var paymentId))
                    {
                        await _paymentService.CancelAsync(paymentId);
                        _logger.LogInformation($"✅ Payment & Booking đã được cancel (MoMo) {orderId}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"⚠️ Lỗi khi cancel payment {orderId}");
                }

                return Redirect($"https://localhost:3000/user/userbooking?payment=failed&code={resultCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Lỗi MoMo callback");
                return Redirect("https://localhost:3000/user/userbooking?error=callback_failed");
            }
        }


        [HttpGet("callback/vnpay")]
        public async Task<IActionResult> VnpayCallback()
        {
            try
            {
                var vnpayResultCode = Request.Query["vnp_ResponseCode"].ToString();
                var vnpayTxnRef = Request.Query["vnp_TxnRef"].ToString();
                var vnpayTransactionNo = Request.Query["vnp_TransactionNo"].ToString();

                _logger.LogInformation($"🔔 VNPay Callback: resultCode={vnpayResultCode}, txnRef={vnpayTxnRef}");

                if (string.IsNullOrEmpty(vnpayTxnRef))
                {
                    return Redirect("https://localhost:3000/user/userbooking?error=invalid_payment");
                }

                // ✅ Lưu callback info vào ResponsePayload
                try
                {
                    var paymentId = Guid.Parse(vnpayTxnRef);
                    var payment = await _context.Payments.FindAsync(paymentId);

                    if (payment != null)
                    {
                        var callbackData = new
                        {
                            responseCode = vnpayResultCode,
                            transactionNo = vnpayTransactionNo,
                            receivedAt = DateTime.UtcNow,
                            queryString = Request.QueryString.Value
                        };

                        payment.ResponsePayload = JsonConvert.SerializeObject(callbackData);
                        payment.ProviderTransactionRef = vnpayTransactionNo;

                        _context.Payments.Update(payment);
                        await _context.SaveChangesAsync();
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "⚠️ Lỗi khi lưu callback info");
                }

                // Process VNPay signature validation
                var response = await _paymentService.ProcessVnPayReturnAsync(Request.Query);

                // Success
                if (vnpayResultCode == "00")
                {
                    _logger.LogInformation($"✅ VNPay payment SUCCESS: {vnpayTxnRef}");
                    return Redirect($"https://localhost:3000/user/userbooking?payment=success&id={vnpayTxnRef}");
                }

                // Failed - Cancel payment & booking
                _logger.LogWarning($"❌ VNPay payment FAILED: {vnpayTxnRef}, code={vnpayResultCode}");

                try
                {
                    var paymentId = Guid.Parse(vnpayTxnRef);
                    await _paymentService.CancelAsync(paymentId);
                    _logger.LogInformation($"✅ Payment & Booking đã được cancel");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"⚠️ Lỗi khi cancel payment {vnpayTxnRef}");
                }

                return Redirect($"https://localhost:3000/user/userbooking?payment=failed&code={vnpayResultCode}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "💥 Lỗi VNPay callback");
                return Redirect("https://localhost:3000/user/userbooking?error=callback_failed");
            }
        }


        [HttpPut("cancel/{paymentId}")]
        public async Task<IActionResult> CancelPayment(Guid paymentId)
        {
            bool result = await _paymentService.CancelAsync(paymentId);
            var response = new ApiResponse<string>(
                List: null,
                Object: null,
                Code: result ? "200" : "400",
                Message: result ? "Hủy thanh toán thành công" : "Hủy thanh toán thất bại",
                IsSuccess: result,
                CurrentPage: 0,
                PageSize: 0,
                TotalPage: 0,
                TotalElement: 0,
                String: null,
                Int: null
            );

            return result ? Ok(response) : BadRequest(response);
        }
    }
}
