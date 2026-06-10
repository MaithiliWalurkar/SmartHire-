using System;
using System.Threading.Tasks;

namespace SmartHire.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendOTPEmailAsync(string toEmail, string otp, string userName);
        Task SendApplicationSubmittedEmailToAdminAsync(string adminEmail, string candidateName, string jobTitle, string companyName);
        Task SendApplicationStatusChangedEmailToCandidateAsync(string candidateEmail, string candidateName, string jobTitle, string companyName, string newStatus);
        Task SendWelcomeEmailAsync(string toEmail, string userName);
        Task SendInterviewScheduledEmailAsync(string candidateEmail, string candidateName, string jobTitle, string companyName, DateTime scheduledDate, string interviewType, string? location, string? meetingLink);
        Task SendInterviewReminderEmailAsync(string candidateEmail, string candidateName, string jobTitle, DateTime scheduledDate, string interviewType);
        Task SendPasswordResetEmailAsync(string toEmail, string userName, string resetToken);
    }
}
