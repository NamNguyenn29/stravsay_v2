
using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class SupportRequestImpl : ISupportRequestService
    {
        private readonly HotelManagementContext _context;
        public SupportRequestImpl(HotelManagementContext context)
        {
            _context = context;
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
            if(supportRequest == null)
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
            if(currentPage <= 0 || pageSize <= 0)
            {
                return new ApiResponse<SupportRequest>(null,null,"400","Current page and page size is require",false,0,0,0,0,null,null);
            }
            var allSupportRequests = await GetAllSupportRequestAsync();
            var totalItem = allSupportRequests.Count();
            var totalPage = (int)Math.Ceiling((double)totalItem / pageSize);

            var supportRequestWithPagination = allSupportRequests.Skip((currentPage - 1)*pageSize).Take(pageSize).ToList();
            return new ApiResponse<SupportRequest>(supportRequestWithPagination, null, "200", "Get support requests successfully", true, currentPage, pageSize, totalPage, totalItem, null, null);
        }

        public async Task<SupportRequest?> ResponseRequestAsync(Guid id, string response)
        {
            var supportRequest = await GetSupportRequestByIdAsync(id);
            if(supportRequest == null) 
                    {
                return null;
            }
            supportRequest.Response = response;
            await _context.SaveChangesAsync();
            return supportRequest;
        }
    }
}
