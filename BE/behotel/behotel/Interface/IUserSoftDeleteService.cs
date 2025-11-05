using behotel.Helper;

namespace behotel.Interface
{
    public interface IUserSoftDeleteService
    {
        Task<ApiResponse<string>> SoftDeleteUser(Guid userId);
    }
}
