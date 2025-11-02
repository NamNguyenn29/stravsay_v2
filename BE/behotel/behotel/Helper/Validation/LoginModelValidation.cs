using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class LoginModelValidation : AbstractValidator<LoginModel>
    {
        public LoginModelValidation() {

            RuleFor(x => x.Email)
              .NotEmpty().WithMessage("Email is required.")
              .EmailAddress().WithMessage("Invalid email format.")
              .MaximumLength(100).WithMessage("Email must be less than 100 characters.");

            //// --- Password ---
            //RuleFor(x => x.Password)
            //    .NotEmpty().WithMessage("Password is required.")
            //    .MinimumLength(8).WithMessage("Password must be at least 8 characters.")
            //    .Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
            //    .Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
            //    .Matches(@"\d").WithMessage("Password must contain at least one number.")
            //    .Matches(@"[!@#$%^&*]").WithMessage("Password must contain at least one special character.")
            //    .MaximumLength(100).WithMessage("Password must be less than 100 characters.");
        }
    }
}
