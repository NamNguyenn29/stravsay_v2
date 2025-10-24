
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
        public async Task<SupportRequest> AddSupportRequestAsync(SupportRequest request)
        {
            _context.SupportRequest.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<bool> DeleteSupportRequestAsync(Guid id)
        {
            var supportRequest = await _context.SupportRequest.FindAsync(id);
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
    }
}
