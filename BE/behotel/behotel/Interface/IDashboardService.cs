using behotel.DTO;

namespace behotel.Interface
{
    public interface IDashboardService
    {
        Task<DashboardDTO> GetDashboardDataAsync();
    }
}