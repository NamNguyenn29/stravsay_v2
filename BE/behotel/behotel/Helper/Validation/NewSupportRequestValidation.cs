using behotel.Models;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class NewSupportRequestValidation : AbstractValidator<NewSupportRequest>
    {
        public NewSupportRequestValidation ()
        {
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is require");
            RuleFor(x => x.UserEmail).NotEmpty().WithMessage("Email is reuqire").EmailAddress().WithMessage("It is not a email");

            RuleFor(x => x.Description).NotNull().WithMessage("Description is require");
        }
    }
}
