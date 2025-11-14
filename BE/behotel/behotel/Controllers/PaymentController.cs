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
        private readonly IPaymentWebhookEventService _paymentWebhookEventService;
        private readonly ILogger<PaymentController> _logger;
        private readonly IConfiguration _config;
        private readonly HotelManagementContext _context;

        public PaymentController(
            IPaymentService paymentService,
            IPaymentMethodService paymentMethodService,
            IPaymentWebhookEventService paymentWebhookService,
            ILogger<PaymentController> logger,
            IConfiguration config,
            HotelManagementContext context)
        {
            _paymentService = paymentService;
            _paymentMethodService = paymentMethodService;
            _paymentWebhookEventService = paymentWebhookService;
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
                return BadRequest(new ApiResponse<string>(null, null, "400", "Dữ liệu thanh toán không hợp lệ", false, 0, 0, 0, 0, null, null));

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
                    Code: "200",
                    Message: "Tạo thanh toán thành công",
                    IsSuccess: true,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: result.PayUrl, // nếu có link momo trả về
                    Int: null
                );

                return Ok(response);
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
                return NotFound(new ApiResponse<string>(null, null, "404", "Không tìm thấy thanh toán", false, 0, 0, 0, 0, null, null));
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


        [HttpPost("webhook/momo")]
        public async Task<IActionResult> MomoWebhook([FromBody] object payload)
        {
            // Đọc body JSON
            string jsonPayload = payload.ToString() ?? "";

            // Lấy signature từ body, không phải từ header
            var jObj = Newtonsoft.Json.Linq.JObject.Parse(jsonPayload);
            string signature = jObj["signature"]?.ToString() ?? "";

            // Ghi log webhook nhận được
            var logged = await _paymentWebhookEventService.LogEventAsync("MOMO", jsonPayload, signature);

            // Xác minh chữ ký HMAC với SecretKey trong cấu hình
            bool valid = await _paymentWebhookEventService.ValidateSignatureAsync("MOMO", jsonPayload, signature);
            if (!valid)
            {
                return BadRequest(new { message = "Invalid signature" });
            }

            // Xử lý kết quả thanh toán: cập nhật Payment.Status = 1, lưu transId, v.v.
            bool processed = await _paymentWebhookEventService.ProcessEventAsync(logged.EventID);

            return Ok(new
            {
                message = "success",
                success = processed,
                eventId = logged.EventID
            });
        }

        [HttpGet("callback/vnpay")]
        public async Task<IActionResult> VnpayCallback()
        {
            _logger.LogInformation("VNPAY Callback received");

            try
            {
                var response = await _paymentService.ProcessVnPayReturnAsync(Request.Query);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý VNPAY Callback");
                return BadRequest(new { message = "Lỗi xử lý callback" });
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
