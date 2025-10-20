using behotel.Models;
namespace behotel.Interface
{
    public interface IServiceService
    {
        Task<IEnumerable<Service>> GetAllServiceAsync();
        Task<Service?> GetServiceByIdAsync(Guid id);
        Task<Service> CreateServiceAsync(Service service);
        Task<bool> DeleteServiceAsync(Guid id);
    }
}
