using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class UpdateRoomValidation : AbstractValidator<UpdateRoom>
    {
        public UpdateRoomValidation()
        {
            RuleFor(x => x.RoomName)
        .NotEmpty().WithMessage("Room name is required.")
        .MaximumLength(100).WithMessage("Room name must be less than 100 characters.");

            // --- RoomNumber ---
            RuleFor(x => x.RoomNumber)
                .NotNull().WithMessage("Room number is required.")
                .GreaterThan(0).WithMessage("Room number must be greater than 0.");

            // --- RoomTypeID ---
            RuleFor(x => x.RoomTypeID)
                .NotEmpty().WithMessage("Room type ID is required.")
                .MaximumLength(50).WithMessage("Room type ID must be less than 50 characters.");

            // --- Status ---
            RuleFor(x => x.Status)
           .InclusiveBetween(0, 3)
           .WithMessage("Status must be between 0 and 3.");

            // --- Description ---
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MinimumLength(10).WithMessage("Description must be at least 10 characters.")
                .MaximumLength(500).WithMessage("Description must be less than 500 characters.");

            RuleFor(x => x.Floor)
        .NotNull().WithMessage("Floor is required.")
        .GreaterThanOrEqualTo(1).WithMessage("Floor number must be at least 1.")
        .LessThanOrEqualTo(100).WithMessage("Floor number must not exceed 100.");
        }

    }
}
