using behotel.Models;
using Microsoft.EntityFrameworkCore;

namespace behotel.Interface.Implement
{
    public class ServiceImpl : IServiceService
    {
        private readonly HotelManagementContext _context;
        public ServiceImpl(HotelManagementContext context)
        {
            _context = context;
        }
        public async Task<Service> CreateServiceAsync(Service service)
        {
            _context.Service.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<bool> DeleteServiceAsync(Guid id)
        {
           var room = await _context.Service.FindAsync(id);
            if(room == null)
            {
                return false;
            }
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Service>> GetAllServiceAsync()
        {
            return await _context.Service.ToListAsync();
        }

        public async Task<Service?> GetServiceByIdAsync(Guid id)
        {
            return await _context.Service.FindAsync(id);
        }
    }
}
