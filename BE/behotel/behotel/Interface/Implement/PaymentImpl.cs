using behotel.DTO;
using behotel.Interface;
using behotel.Models;
using HotelBooking.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace behotel.Interface.Implement
{
    public class PaymentImpl : IPaymentService
    {
        private readonly HotelManagementContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<PaymentImpl> _logger;
        private readonly HttpClient _httpClient;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public PaymentImpl(
            HotelManagementContext context,
            IConfiguration config,
            ILogger<PaymentImpl> logger,
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _config = config;
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<PaymentDTO> CreateAsync(PaymentDTO dto)
        {
            if (dto == null)
                throw new ArgumentNullException(nameof(dto));

            var paymentMethod = await _context.PaymentMethods
                .FirstOrDefaultAsync(m => m.PaymentMethodID == dto.PaymentMethodID);

            if (paymentMethod == null)
                throw new Exception("Phương thức thanh toán không tồn tại.");

            var payment = new Payment
            {
                PaymentID = Guid.NewGuid(),
                BookingID = dto.BookingID,
                PaymentMethodID = dto.PaymentMethodID,
                Amount = dto.Amount,
                Status = 0, // Pending
                CreatedDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            if (paymentMethod.Code.Equals("MOMO", StringComparison.OrdinalIgnoreCase))
            {
                var payUrl = await CreateMomoPaymentUrl(payment);
                dto.ProviderTransactionRef = null;
                dto.ResponsePayload = payUrl;
                dto.Status = 0;
                dto.CreatedDate = payment.CreatedDate;
                return dto;
            }
            else if (paymentMethod.Code.Equals("VNPAY", StringComparison.OrdinalIgnoreCase))
            {
                var payUrl = CreateVnPayPaymentUrl(payment); 
                dto.ResponsePayload = payUrl;
                dto.PayUrl = payUrl;
                dto.Status = 0;
                dto.CreatedDate = payment.CreatedDate;
                return dto;
            }


            else if (paymentMethod.Code.Equals("BANK_TRANSFER", StringComparison.OrdinalIgnoreCase))
            {

                string bankDetails = paymentMethod.Details ?? "Thông tin ngân hàng chưa được cấu hình";

                string paymentMemo = $"THANHTOAN {payment.PaymentID.ToString().Substring(0, 8)}";

                dto.ResponsePayload = $"Vui lòng chuyển khoản đến:\n{bankDetails}\nNội dung bắt buộc: {paymentMemo}";
                dto.PayUrl = null;
            }

            else if (paymentMethod.Code.Equals("PAY_ON_ARRIVAL", StringComparison.OrdinalIgnoreCase))
            {

                dto.ResponsePayload = "Đặt phòng thành công. Vui lòng thanh toán tại quầy lễ tân khi nhận phòng.";
                dto.PayUrl = null; 
            }

            return dto;
        }

        private async Task<string> CreateMomoPaymentUrl(Payment payment)
        {
            try
            {
                var momoSection = _config.GetSection("MomoConfig");
                string endpoint = momoSection["Endpoint"];
                string partnerCode = momoSection["PartnerCode"];
                string accessKey = momoSection["AccessKey"];
                string secretKey = momoSection["SecretKey"];
                string redirectUrl = momoSection["RedirectUrl"];
                string ipnUrl = momoSection["IpnUrl"];
                string requestType = momoSection["RequestType"];


                string amount = ((int)(payment.Amount > 0 ? payment.Amount : 1000)).ToString();

                string orderId = Guid.NewGuid().ToString();
                string requestId = DateTime.UtcNow.Ticks.ToString();
                string orderInfo = $"Thanh toan don hang {payment.BookingID}";
                string extraData = "";

                string rawHash =
                    "accessKey=" + accessKey +
                    "&amount=" + amount +
                    "&extraData=" + extraData +
                    "&ipnUrl=" + ipnUrl +
                    "&orderId=" + orderId +
                    "&orderInfo=" + orderInfo +
                    "&partnerCode=" + partnerCode +
                    "&redirectUrl=" + redirectUrl +
                    "&requestId=" + requestId +
                    "&requestType=" + requestType;

                string signature = ComputeHmacSha256(rawHash, secretKey);

                var requestBody = new
                {
                    partnerCode,
                    partnerName = "BeHotel",
                    storeId = "BeHotelTestStore",
                    requestId,
                    amount,
                    orderId,
                    orderInfo,
                    redirectUrl,
                    ipnUrl,
                    lang = "vi",
                    requestType,
                    extraData,
                    signature
                };

                var jsonBody = JsonConvert.SerializeObject(requestBody);
                _logger.LogInformation("MOMO Request JSON: " + jsonBody);
                _logger.LogInformation("MOMO Signature: " + signature);

                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync(endpoint, content);
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation("MOMO Response: " + responseContent);

                var momoResponse = JsonConvert.DeserializeObject<MomoResponse>(responseContent);

                if (momoResponse != null && momoResponse.ResultCode == 0)
                    return momoResponse.PayUrl;

                return $"Lỗi MoMo: {momoResponse?.Message ?? "Không rõ"}";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi tạo link thanh toán MoMo");
                return "Lỗi khi tạo link thanh toán MoMo.";
            }
        }
        private string CreateVnPayPaymentUrl(Payment payment)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(_config["TimeZoneId"]);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = payment.PaymentID.ToString(); 
            var pay = new VnPayLibrary(); 
            var urlCallBack = _config["Vnpay:ReturnUrl"];

            pay.AddRequestData("vnp_Version", _config["Vnpay:Version"]);
            pay.AddRequestData("vnp_Command", _config["Vnpay:Command"]);
            pay.AddRequestData("vnp_TmnCode", _config["Vnpay:TmnCode"]);
            pay.AddRequestData("vnp_Amount", ((int)payment.Amount * 100).ToString());
            pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            pay.AddRequestData("vnp_CurrCode", _config["Vnpay:CurrCode"]);
            pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(_httpContextAccessor.HttpContext));
            pay.AddRequestData("vnp_Locale", _config["Vnpay:Locale"]);
            pay.AddRequestData("vnp_OrderInfo", $"Thanh toan don hang {payment.BookingID}");
            pay.AddRequestData("vnp_OrderType", "other"); 
            pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
            pay.AddRequestData("vnp_TxnRef", tick); 

            var paymentUrl = pay.CreateRequestUrl(_config["Vnpay:BaseUrl"], _config["Vnpay:HashSecret"]);
            return paymentUrl;
        }
        public async Task<object> ProcessVnPayReturnAsync(IQueryCollection collections)
        {
            var pay = new VnPayLibrary();
            var response = pay.GetFullResponseData(collections, _config["Vnpay:HashSecret"]);

            if (response == null || !response.Success)
            {
                return response; 
            }

            try
            {
                var paymentId = Guid.Parse(response.OrderId);

                if (response.VnPayResponseCode == "00")
                {
                    await MarkAsPaidAsync(
                        paymentId,
                        response.TransactionId, 
                        JsonConvert.SerializeObject(response) 
                    );
                }
                else
                {
                    // (Tùy chọn) Cập nhật trạng thái thất bại nếu cần
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý VNPAY callback");
                response.Success = false;
            }

            return response;
        }





        private string ComputeHmacSha256(string data, string key)
        {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key)))
            {
                byte[] hashValue = hmac.ComputeHash(Encoding.UTF8.GetBytes(data));
                return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
            }
        }

        public async Task<PaymentDTO?> GetByIdAsync(Guid paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return null;

            return new PaymentDTO
            {
                PaymentID = payment.PaymentID,
                BookingID = payment.BookingID,
                PaymentMethodID = payment.PaymentMethodID,
                Amount = payment.Amount,
                Status = payment.Status,
                CreatedDate = payment.CreatedDate,
                PaidAt = payment.PaidAt,
                ProviderTransactionRef = payment.ProviderTransactionRef,
                ResponsePayload = payment.ResponsePayload
            };
        }

        public async Task<IEnumerable<PaymentDTO>> GetByBookingIdAsync(Guid bookingId)
        {
            return await _context.Payments
                .Where(p => p.BookingID == bookingId)
                .Select(p => new PaymentDTO
                {
                    PaymentID = p.PaymentID,
                    BookingID = p.BookingID,
                    PaymentMethodID = p.PaymentMethodID,
                    Amount = p.Amount,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate,
                    PaidAt = p.PaidAt,
                    ProviderTransactionRef = p.ProviderTransactionRef
                })
                .ToListAsync();
        }


        public async Task<bool> UpdateStatusAsync(Guid paymentId, int status)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;

            payment.Status = status;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAsPaidAsync(Guid paymentId, string? providerRef, string? responsePayload)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;

            payment.Status = 1; // Paid
            payment.PaidAt = DateTime.UtcNow;
            payment.ProviderTransactionRef = providerRef;
            payment.ResponsePayload = responsePayload;

            await _context.SaveChangesAsync();
            return true;
        }


        public async Task<bool> CancelAsync(Guid paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);
            if (payment == null) return false;

            if (payment.Status == 0) // Pending
            {
                payment.Status = 2; // Canceled
                await _context.SaveChangesAsync();
                return true;
            }

            return false;
        }

        private class MomoResponse
        {
            [JsonProperty("payUrl")] public string PayUrl { get; set; }
            [JsonProperty("resultCode")] public int ResultCode { get; set; }
            [JsonProperty("message")] public string Message { get; set; }
        }
        private class VnPayPaymentResponseModel
        {
            public bool Success { get; set; }
            public string PaymentMethod { get; set; }
            public string OrderDescription { get; set; }
            public string OrderId { get; set; }
            public string PaymentId { get; set; }
            public string TransactionId { get; set; }
            public string Token { get; set; }
            public string VnPayResponseCode { get; set; }
        }

        private class VnPayLibrary
        {
            private readonly SortedList<string, string> _requestData = new SortedList<string, string>(new VnPayCompare());
            private readonly SortedList<string, string> _responseData = new SortedList<string, string>(new VnPayCompare());

            public VnPayPaymentResponseModel GetFullResponseData(IQueryCollection collection, string hashSecret)
            {
                foreach (var (key, value) in collection)
                {
                    if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                    {
                        AddResponseData(key, value);
                    }
                }

                var vnp_TxnRef = GetResponseData("vnp_TxnRef");
                var vnp_TransactionNo = GetResponseData("vnp_TransactionNo");
                var vnp_ResponseCode = GetResponseData("vnp_ResponseCode");
                var vnp_SecureHash = collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value;
                var vnp_OrderInfo = GetResponseData("vnp_OrderInfo");

                bool checkSignature = ValidateSignature(vnp_SecureHash, hashSecret);

                if (!checkSignature)
                {
                    return new VnPayPaymentResponseModel() { Success = false };
                }

                return new VnPayPaymentResponseModel()
                {
                    Success = true,
                    PaymentMethod = "VnPay",
                    OrderDescription = vnp_OrderInfo,
                    OrderId = vnp_TxnRef.ToString(),
                    PaymentId = vnp_TransactionNo.ToString(),
                    TransactionId = vnp_TransactionNo.ToString(),
                    Token = vnp_SecureHash,
                    VnPayResponseCode = vnp_ResponseCode
                };
            }

            public string GetIpAddress(HttpContext context)
            {
                var ipAddress = string.Empty;
                try
                {
                    var remoteIpAddress = context.Connection.RemoteIpAddress;
                    if (remoteIpAddress != null)
                    {
                        if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                        {
                            remoteIpAddress = Dns.GetHostEntry(remoteIpAddress).AddressList
                                .FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);
                        }
                        if (remoteIpAddress != null) ipAddress = remoteIpAddress.ToString();
                        return ipAddress;
                    }
                }
                catch { }
                return "127.0.0.1";
            }

            public void AddRequestData(string key, string value)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    _requestData.Add(key, value);
                }
            }

            public void AddResponseData(string key, string value)
            {
                if (!string.IsNullOrEmpty(value))
                {
                    _responseData.Add(key, value);
                }
            }

            public string GetResponseData(string key)
            {
                return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
            }

            public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
            {
                var data = new StringBuilder();
                foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
                {
                    data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
                }
                var querystring = data.ToString();
                baseUrl += "?" + querystring;
                var signData = querystring;
                if (signData.Length > 0)
                {
                    signData = signData.Remove(data.Length - 1, 1);
                }
                var vnpSecureHash = HmacSha512(vnpHashSecret, signData);
                baseUrl += "vnp_SecureHash=" + vnpSecureHash;
                return baseUrl;
            }

            public bool ValidateSignature(string inputHash, string secretKey)
            {
                var rspRaw = GetResponseData();
                var myChecksum = HmacSha512(secretKey, rspRaw);
                return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
            }

            private string HmacSha512(string key, string inputData)
            {
                var hash = new StringBuilder();
                var keyBytes = Encoding.UTF8.GetBytes(key);
                var inputBytes = Encoding.UTF8.GetBytes(inputData);
                using (var hmac = new HMACSHA512(keyBytes))
                {
                    var hashValue = hmac.ComputeHash(inputBytes);
                    foreach (var theByte in hashValue)
                    {
                        hash.Append(theByte.ToString("x2"));
                    }
                }
                return hash.ToString();
            }

            private string GetResponseData()
            {
                var data = new StringBuilder();
                if (_responseData.ContainsKey("vnp_SecureHashType"))
                {
                    _responseData.Remove("vnp_SecureHashType");
                }
                if (_responseData.ContainsKey("vnp_SecureHash"))
                {
                    _responseData.Remove("vnp_SecureHash");
                }
                foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
                {
                    data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
                }
                if (data.Length > 0)
                {
                    data.Remove(data.Length - 1, 1);
                }
                return data.ToString();
            }
        }

        private class VnPayCompare : IComparer<string>
        {
            public int Compare(string x, string y)
            {
                if (x == y) return 0;
                if (x == null) return -1;
                if (y == null) return 1;
                var vnpCompare = CompareInfo.GetCompareInfo("en-US");
                return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
            }
        }
    

}
}
