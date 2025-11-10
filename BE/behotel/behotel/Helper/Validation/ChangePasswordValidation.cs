using behotel.DTO;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class ChangePasswordValidation : AbstractValidator<ChangePasswordModel>
    {
        public ChangePasswordValidation()
        {
    //        // --- Password ---
    //        RuleFor(x => x.currentPassword)
    //.NotEmpty().WithMessage("Password is required.")
    //.MinimumLength(8).WithMessage("Password must be at least 8 characters.")
    //.Matches(@"[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
    //.Matches(@"[a-z]").WithMessage("Password must contain at least one lowercase letter.")
    //.Matches(@"\d").WithMessage("Password must contain at least one number.")
    //.Matches(@"[!@#$%^&*]").WithMessage("Password must contain at least one special character.")
    //.MaximumLength(100).WithMessage("Password must be less than 100 characters.");


    //        RuleFor(x => x.newPasswords)
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