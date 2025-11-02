using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class NewSupportRequestValidation : AbstractValidator<NewSupportRequest>
    {
        public NewSupportRequestValidation ()
        {
            RuleFor(x => x.UserEmail)
           .NotEmpty().WithMessage("User email is required.")
           .EmailAddress().WithMessage("Invalid email format.")
           .MaximumLength(100).WithMessage("User email must be less than 100 characters.");

            // --- Title ---
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(150).WithMessage("Title must be less than 150 characters.");

            // --- Description ---
            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Description is required.")
                .MinimumLength(10).WithMessage("Description must be at least 10 characters.")
                .MaximumLength(1000).WithMessage("Description must be less than 1000 characters.");
        }
    
    }
}
