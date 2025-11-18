
using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using behotel.Query;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using static Org.BouncyCastle.Math.EC.ECCurve;

namespace behotel.Interface.Implement
{
    public class SupportRequestImpl : ISupportRequestService
    {
        private readonly HotelManagementContext _context;
        private readonly IConfiguration _configuration;
        public SupportRequestImpl(HotelManagementContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<SupportRequest> AddSupportRequestAsync(NewSupportRequest newSupportRequest)
        {
            SupportRequest supportRequest = new SupportRequest()
            {
                Id = new Guid(),
                Title = newSupportRequest.Title,
                UserEmail = newSupportRequest.UserEmail,
                Description = newSupportRequest.Description,
                Status = 0,
                CreatedDate = DateTime.Now,
            };

            _context.SupportRequest.Add(supportRequest);
            await _context.SaveChangesAsync();
            return supportRequest;
        }

        public async Task<bool> DeleteSupportRequestAsync(Guid id)
        {
            var supportRequest = await GetSupportRequestByIdAsync(id);
            if (supportRequest == null)
            {
                return false;
            }
            _context.SupportRequest.Remove(supportRequest);
            await _context.SaveChangesAsync();
            return true;

        }

        public async Task<IEnumerable<SupportRequest>> GetAllSupportRequestAsync()
        {
            return await _context.SupportRequest.ToListAsync();
        }

        public async Task<SupportRequest?> GetSupportRequestByIdAsync(Guid id)
        {
            return await _context.SupportRequest.FindAsync(id);
        }

        public async Task<ApiResponse<SupportRequest>> GetSupportRequestWithPaginaionAsync(int currentPage, int pageSize)
        {
            if (currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Current page and page size is require", false, 0, 0, 0, 0, null, null);
            }
            var allSupportRequests = await GetAllSupportRequestAsync();
            var totalItem = allSupportRequests.Count();
            var totalPage = (int)Math.Ceiling((double)totalItem / pageSize);

            var supportRequestWithPagination = allSupportRequests.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
            return new ApiResponse<SupportRequest>(supportRequestWithPagination, null, "200", "Get support requests successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);
        }

        public async Task<SupportRequest?> ResponseRequestAsync(Guid id, string response)
        {
            var supportRequest = await GetSupportRequestByIdAsync(id);
            if (supportRequest == null)
            {
                return null;
            }
            supportRequest.Response = response;
            supportRequest.Status = 1;
            await _context.SaveChangesAsync();
            return supportRequest;
        }

        public async Task<ApiResponse<SupportRequest>> SerchSupportRequestByKeyword(string filter, int currentPage, int pageSize)
        {

            if (string.IsNullOrEmpty(filter))
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Keyword  is required", false, 0, 0, 0, 0, null, null);
            }
            if (currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<SupportRequest>(null, null, "400", "Current page and page Size is required", false, 0, 0, 0, 0, null, null);
            }
            using IDbConnection connection = new SqlConnection(_configuration.GetConnectionString("DBConnection"));
            connection.Open();
            var requests = (await connection.QueryAsync<SupportRequest>(
            SupportRequestSqlQuery.SupportRequestSearch,
            new { Keyword = $"%{filter.Trim()}%" }
            )).ToList();
            var totalItem = requests.Count();
            var totalPage = (int)Math.Ceiling((double)totalItem / pageSize);

            int skip = (currentPage - 1) * pageSize;
            var pagedResult = requests.Skip(skip).Take(pageSize).ToList();
            return new ApiResponse<SupportRequest>((List<SupportRequest>?)pagedResult, null, "200", "Filter support requests successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);
        }
    }

}
