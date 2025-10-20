using behotel.Models;
namespace behotel.Interface
{
    public interface ISupportRequestService
    {
        Task<IEnumerable<SupportRequest>> GetAllSupportRequestAsync();
        Task<SupportRequest?> GetSupportRequestByIdAsync(Guid id);
        Task<SupportRequest> AddSupportRequestAsync(SupportRequest request);
        Task<bool> DeleteSupportRequestAsync(Guid id);
    }
}
