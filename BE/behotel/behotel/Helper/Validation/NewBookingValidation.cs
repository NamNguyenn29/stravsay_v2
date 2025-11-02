using FluentValidation;
using behotel.DTO;
namespace behotel.Helper.Validation
{
    public class NewBookingValidation : AbstractValidator<NewBooking>
    {
        public NewBookingValidation() {
            RuleFor(x => x.UserId)
              .NotEmpty().WithMessage("UserId is required.")
              .Must(id => Guid.TryParse(id, out _)).WithMessage("Invalid UserId format.");

            RuleFor(x => x.RoomId)
                .NotEmpty().WithMessage("RoomId is required.")
                .Must(id => Guid.TryParse(id, out _)).WithMessage("Invalid RoomId format.");

            RuleFor(x => x.CheckInDate)
                .NotEmpty().WithMessage("Check-in date is required.")
                .GreaterThanOrEqualTo(DateTime.Today).WithMessage("Check-in date cannot be in the past.");

            RuleFor(x => x.CheckOutDate)
                .NotEmpty().WithMessage("Check-out date is required.")
                .GreaterThan(x => x.CheckInDate).WithMessage("Check-out date must be after check-in date.");

            When(x => x.services != null, () =>
            {
                RuleForEach(x => x.services)
                    .NotEmpty().WithMessage("Service ID cannot be empty.")
                    .Must(id => Guid.TryParse(id, out _))
                    .WithMessage("Invalid service ID format.");
            });

            RuleFor(x => x.DiscountID)
                .Must(id => string.IsNullOrEmpty(id) || Guid.TryParse(id, out _))
                .WithMessage("Invalid DiscountID format.");

            RuleFor(x => x.Adult)
                .GreaterThan(0).WithMessage("There must be at least one adult.");

            RuleFor(x => x.Children)
                .GreaterThanOrEqualTo(0).WithMessage("Children count cannot be negative.");
        }
    }
}
