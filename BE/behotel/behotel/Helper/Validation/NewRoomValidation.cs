using behotel.Models;
using FluentValidation;

namespace behotel.Helper.Validation
{
    public class NewRoomValidation : AbstractValidator<RoomRequest>
    {
        public NewRoomValidation() { 
            RuleFor(x => x.RoomName).NotEmpty().WithMessage("Room name can not be empty");
            RuleFor(x => x.RoomNumber).NotEmpty().WithMessage("Room number can not be empty");
            RuleFor(x => x.RoomTypeID).NotEmpty().WithMessage("Room type can not be empty");
            RuleFor(x => x.Description).NotEmpty().WithMessage("Room description can not be empty");
            RuleFor(x => x.Floor).NotEmpty().WithMessage("Room floor can not be empty");

        }
    }
}
