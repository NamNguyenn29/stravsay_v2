﻿namespace behotel.Helper.SendMail
{
    public interface IMailService
    {
        Task SendEmailAsync(string to, string subject, string body);
    }
}
