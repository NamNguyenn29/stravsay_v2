
using behotel.DTO;
using behotel.Helper;
using behotel.Models;
using Microsoft.EntityFrameworkCore;
namespace behotel.Interface.Implement
{
    public class SettingImpl : ISettingService
    {
        private readonly HotelManagementContext _context;
        public SettingImpl(HotelManagementContext context)
        {
            _context = context;
        }

        public async Task<ApiResponse<SettingDTO>> GetSettingAsync()
        {
            try
            {
                var setting = await _context.Setting.FirstOrDefaultAsync();

                if (setting == null)
                {
                    return new ApiResponse<SettingDTO>(
                        List: null,
                        Object: null,
                        Code: "400",
                        Message: "Setting not found",
                        IsSuccess: false,
                        CurrentPage: 0,
                        PageSize: 0,
                        TotalPage: 0,
                        TotalElement: 0,
                        String: null,
                        Int: null
                    );
                }

                var dto = new SettingDTO
                {
                    Id = setting.Id,
                    ContactEmail = setting.ContactEmail,
                    ContactPhone = setting.ContactPhone,
                    Address = setting.Address,
                    Status = setting.Status,
                    UpdatedDate = setting.UpdatedDate
                };

                return new ApiResponse<SettingDTO>(
                    List: null,
                    Object: dto,
                    Code: "200",
                    Message: "Get setting successfully",
                    IsSuccess: true,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SettingDTO>(
                    List: null,
                    Object: null,
                    Code: "500",
                    Message: $"Error: {ex.Message}",
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
        }

        public async Task<ApiResponse<SettingDTO>> UpdateSettingAsync(SettingDTO dto)
        {
            try
            {
                if (dto == null)
                {
                    return new ApiResponse<SettingDTO>(
                        List: null,
                        Object: null,
                        Code: "400",
                        Message: "Invalid setting data",
                        IsSuccess: false,
                        CurrentPage: 0,
                        PageSize: 0,
                        TotalPage: 0,
                        TotalElement: 0,
                        String: null,
                        Int: null
                    );
                }

                var setting = await _context.Setting.FirstOrDefaultAsync();

                if (setting == null)
                {
                    return new ApiResponse<SettingDTO>(
                        List: null,
                        Object: null,
                        Code: "400",
                        Message: "Setting not found",
                        IsSuccess: false,
                        CurrentPage: 0,
                        PageSize: 0,
                        TotalPage: 0,
                        TotalElement: 0,
                        String: null,
                        Int: null
                    );
                }

                // Update fields
                setting.ContactEmail = dto.ContactEmail;
                setting.ContactPhone = dto.ContactPhone;
                setting.Address = dto.Address;
                setting.Status = dto.Status;
                setting.UpdatedDate = DateTime.Now;

                _context.Setting.Update(setting);
                await _context.SaveChangesAsync();

                var updatedDto = new SettingDTO
                {
                    Id = setting.Id,
                    ContactEmail = setting.ContactEmail,
                    ContactPhone = setting.ContactPhone,
                    Address = setting.Address,
                    Status = setting.Status,
                    UpdatedDate = setting.UpdatedDate
                };

                return new ApiResponse<SettingDTO>(
                    List: null,
                    Object: updatedDto,
                    Code: "200",
                    Message: "Update setting successfully",
                    IsSuccess: true,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
            catch (Exception ex)
            {
                return new ApiResponse<SettingDTO>(
                    List: null,
                    Object: null,
                    Code: "500",
                    Message: $"Error: {ex.Message}",
                    IsSuccess: false,
                    CurrentPage: 0,
                    PageSize: 0,
                    TotalPage: 0,
                    TotalElement: 0,
                    String: null,
                    Int: null
                );
            }
        }
    }
}