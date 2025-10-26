using FluentValidation;
using behotel.DTO;
namespace behotel.Helper.Validation
{
    public class UserDTOValidation : AbstractValidator<UserDTO>
    {
        public UserDTOValidation() { 
            RuleFor(x => x.Email).NotEmpty().WithMessage("Email khong dc de trong").EmailAddress().WithMessage("Email ko hop le");


        }
    }
}
