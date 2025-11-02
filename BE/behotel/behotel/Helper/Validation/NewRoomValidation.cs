using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class NewRoomValidation : AbstractValidator<RoomRequest>
    {
        public NewRoomValidation()
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

            // --- ImageUrl ---
            RuleFor(x => x.ImageUrl)
                .NotNull().WithMessage("Image list is required.")
                .Must(images => images.Length > 0).WithMessage("At least one image URL is required.")
                .ForEach(rule =>
                {
                    rule.NotEmpty().WithMessage("Image URL cannot be empty.")
                        .Must(url => Uri.IsWellFormedUriString(url, UriKind.RelativeOrAbsolute))
                        .WithMessage("Each image URL must be a valid path or URL.") ;
                });

            // --- Floor ---
            RuleFor(x => x.Floor)
                .NotNull().WithMessage("Floor is required.")
                .GreaterThanOrEqualTo(1).WithMessage("Floor number must be at least 1.")
                .LessThanOrEqualTo(100).WithMessage("Floor number must not exceed 100.");

        }
    }
}
