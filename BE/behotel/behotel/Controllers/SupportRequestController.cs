using behotel.DTO;
using behotel.Helper;
using behotel.Helper.SendMail;
using behotel.Interface;
using behotel.Models;
using FluentValidation;
using Humanizer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace behotel.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SupportRequestController : ControllerBase
    {
        private readonly ISupportRequestService _supportRequestService;
        private readonly IMailService _mailService;
        public SupportRequestController(ISupportRequestService supportRequestService, IMailService mailService)
        {
            _supportRequestService = supportRequestService;
            _mailService = mailService;
        }
        [Authorize(Roles ="ADMIN")]
        [HttpGet]
        public async Task<ApiResponse<SupportRequest>> GetAll(int currentPage, int pageSize)
        {
            return await _supportRequestService.GetSupportRequestWithPaginaionAsync(currentPage, pageSize);

        }
        [Authorize
            ]
        [HttpGet("{id}")]
        public async Task<ApiResponse<SupportRequest>> GetResponseById(string id)
        {
            ApiResponse<SupportRequest> _apiResponse;
            if (String.IsNullOrWhiteSpace(id))
            {
                return _apiResponse = new ApiResponse<SupportRequest>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, 0);
            }
            Guid idGuid = Guid.Parse(id);
            var supportRequest = await _supportRequestService.GetSupportRequestByIdAsync(idGuid);
            if (supportRequest == null)
            {
                return _apiResponse = new ApiResponse<SupportRequest>(null, null, "404", "Request not found", false, 0, 0, 0, 0, null, null);
            }
            _apiResponse = new ApiResponse<SupportRequest>(null, supportRequest, "200", "Get request successfully", true, 0, 0, 0, 1, null, null);
            return _apiResponse;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ApiResponse<SupportRequest>> CreateSupportRequest([FromBody] NewSupportRequest newSupportRequest)
        {
            if (!ModelState.IsValid)
            {
                var errorMessages = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                var combinedErros = string.Join(",", errorMessages);
                return new ApiResponse<SupportRequest>(null, null, "400", combinedErros, false, 0, 0, 0, 0, null, null);
            }
            var supportRequest = await _supportRequestService.AddSupportRequestAsync(newSupportRequest);
            if (supportRequest == null)
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Failed to create new support request", false, 0, 0, 0, 0, null, null);
            }
            var subject = "Travstay Support Request Received";

            var body = $@"
            <div style='font-family: Arial, sans-serif; color: #333; line-height:1.6;'>
                <h2>Xin chào {supportRequest.UserEmail} 👋,</h2>
                <p>Cảm ơn bạn đã liên hệ với <strong>Travstay</strong>! </p>
                <p>Chúng tôi đã nhận được yêu cầu hỗ trợ của bạn và đang xem xét nội dung chi tiết. 
                   Bộ phận hỗ trợ sẽ phản hồi bạn trong thời gian sớm nhất.</p>

                <div style='margin:20px 0; padding:15px; background:#f5f9ff; border:1px solid #dce7ff; border-radius:6px;'>
                    <p><strong>Chủ đề:</strong> {supportRequest.Title}</p>
                    <p><strong>Thời gian gửi:</strong> {supportRequest.CreatedDate}</p>
                </div>

       

       
                <hr style='margin-top:30px; border:none; border-top:1px solid #eee;' />

                <p style='font-size:13px; color:#777;'>
                    Nếu bạn không gửi yêu cầu hỗ trợ nào, vui lòng bỏ qua email này.<br/>
                    Mọi thắc mắc, vui lòng liên hệ chúng tôi qua email:
                    <a href='mailto:hotel.trastay.com' style='color:#007BFF;'>support@travstay.com</a>
                </p>

                <p style='margin-top:20px; font-size:14px;'>Trân trọng,<br/>
                <strong>Đội ngũ Hỗ trợ Travstay</strong></p>
            </div>
        ";
            await _mailService.SendEmailAsync(supportRequest.UserEmail, subject, body);
            return new ApiResponse<SupportRequest>(null, supportRequest, "200", "Create new support request successfully", true, 0, 0, 0, 1, null, null);

        }
        [Authorize(Roles ="ADMIN")]
        [HttpPut("{id}")]
        public async Task<ApiResponse<SupportRequest>> ResponseSupportRequest(string id, [FromBody] string response)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            if (String.IsNullOrWhiteSpace(response))
            {
                return new ApiResponse<SupportRequest>(null, null, "404", "response is require", false, 0, 0, 0, 0, null, null);
            }
            var supportRequest = await _supportRequestService.ResponseRequestAsync(idGuid, response);
            if (supportRequest == null)
            {
                return new ApiResponse<SupportRequest>(null, null, "404", "Support request not found", false, 0, 0, 0, 0, null, null);
            }
            var subject = $"Phản hồi từ Travstay về yêu cầu hỗ trợ #{supportRequest.Title}";

            var body = $@"
            <div style='font-family: Arial, sans-serif; color: #333; line-height:1.6;'>
                <h2>Xin chào {supportRequest.CreatedDate} 👋,</h2>

                <p>Chúng tôi đã xem xét yêu cầu hỗ trợ của bạn và có phản hồi như sau:</p>

                <div style='margin:20px 0; padding:15px; background:#f5f9ff; border:1px solid #dce7ff; border-radius:6px;'>
             
                    <p><strong>Chủ đề:</strong> {supportRequest.Title}</p>
                    <p><strong>Trạng thái hiện tại:</strong> {supportRequest.Status}</p>
                </div>

                <h3 style='color:#007BFF;'>📩 Nội dung phản hồi từ Travstay</h3>
                <div style='margin:10px 0; padding:15px; background:#fefefe; border-left:4px solid #007BFF;'>
                    <p style='white-space:pre-line;'>{supportRequest.Response}</p>
                </div>

       

      

                <hr style='margin-top:30px; border:none; border-top:1px solid #eee;' />

                <p style='font-size:13px; color:#777;'>
                    Nếu bạn có thêm câu hỏi hoặc cần hỗ trợ thêm, vui lòng phản hồi trực tiếp email này.<br/>
                    Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn.
                </p>

                <p style='margin-top:20px; font-size:14px;'>Trân trọng,<br/>
                <strong>Đội ngũ Hỗ trợ Travstay</strong></p>

                <p style='margin-top:10px; font-size:12px; color:#999;'>
                    Email này được gửi tự động từ hệ thống hỗ trợ Travstay.<br/>
                    Vui lòng không chia sẻ thông tin cá nhân hoặc mật khẩu qua email này.
                </p>
            </div>
        ";


            await _mailService.SendEmailAsync(supportRequest.UserEmail, subject, body);
            return new ApiResponse<SupportRequest>(null, supportRequest, "200", "Response support request successfully", true, 0, 0, 0, 1, null, null);
        }
        [Authorize(Roles ="ADMIN")]
        [HttpDelete("id")]
        public async Task<ApiResponse<SupportRequest>> DeleteSupportRequest(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Id is require", false, 0, 0, 0, 0, null, null);
            }
            Guid idGuid = Guid.Parse(id);
            var isDeleteSuccess = await _supportRequestService.DeleteSupportRequestAsync(idGuid);
            if(!isDeleteSuccess)
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Failed to delete support request", false, 0, 0, 0, 0, null, null);

            }
            return new ApiResponse<SupportRequest>(null, null, "200", "Delete support request successfully", true, 0, 0, 0, 0, null, null);

        }

    }
}
