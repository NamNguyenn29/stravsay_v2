using behotel.Models;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class UserRegisterValidator : AbstractValidator<UserRegister>
    {
        public UserRegisterValidator() {
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email khong dc de trong").EmailAddress().WithMessage("Email khong hop le");

            RuleFor(x => x.Password).NotEmpty().WithMessage("Mat khau khong the de trong").MinimumLength(6).WithMessage("Mat khau phai co it nhat 6 ki tu");

            
        }

        
    }
}
