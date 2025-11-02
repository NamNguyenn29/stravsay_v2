using behotel.DTO;
using behotel.Helper;
using behotel.Models;
namespace behotel.Interface
{
    public interface ISupportRequestService
    {
        Task<IEnumerable<SupportRequest>> GetAllSupportRequestAsync();

        Task<ApiResponse<SupportRequest>> GetSupportRequestWithPaginaionAsync(int currentPage, int pageSize);
        Task<SupportRequest?> GetSupportRequestByIdAsync(Guid id);
        Task<SupportRequest> AddSupportRequestAsync(NewSupportRequest newSupportRequest);

        Task<SupportRequest?> ResponseRequestAsync(Guid id, string response);
        Task<bool> DeleteSupportRequestAsync(Guid id);


    }
}
