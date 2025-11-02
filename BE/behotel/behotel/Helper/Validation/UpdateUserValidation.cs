using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class UpdateUserValidation : AbstractValidator<UpdateUser>
    {
        public UpdateUserValidation() {

            RuleFor(x => x.FullName)
            .MaximumLength(100).WithMessage("Full name must be less than 100 characters.")
            .Matches(@"^[\p{L}\s'.-]+$").When(x => !string.IsNullOrWhiteSpace(x.FullName))
            .WithMessage("Full name can only contain letters, spaces, and basic punctuation.");

            // --- Email ---
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.")
                .MaximumLength(100).WithMessage("Email must be less than 100 characters.");

            // --- DateOfBirth ---
            RuleFor(x => x.DateOfBirth)
                .LessThan(DateTime.Now)
                .When(x => x.DateOfBirth.HasValue)
                .WithMessage("Date of birth must be in the past.");

            // --- Phone ---
            RuleFor(x => x.Phone)
                .Matches(@"^0\d{9}$").When(x => !string.IsNullOrWhiteSpace(x.Phone))
                .WithMessage("Phone number must be 10 digits and start with 0.")
                .MaximumLength(15).WithMessage("Phone number must be less than 15 characters.");
        }

    }


    }
