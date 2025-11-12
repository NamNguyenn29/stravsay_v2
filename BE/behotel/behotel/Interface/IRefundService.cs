using behotel.DTO;

public interface IRefundService
{
    // Tạo yêu cầu refund mới
    Task<RefundDTO> CreateAsync(RefundDTO refund);

    // Lấy refund theo ID
    Task<RefundDTO?> GetByIdAsync(Guid refundId);

    // Lấy danh sách refund theo PaymentID
    Task<IEnumerable<RefundDTO>> GetByPaymentIdAsync(Guid paymentId);

    // Cập nhật trạng thái refund (Processed, Failed, etc.)
    Task<bool> UpdateStatusAsync(Guid refundId, int status);
}
