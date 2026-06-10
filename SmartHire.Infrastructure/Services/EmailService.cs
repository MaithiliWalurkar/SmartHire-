using SmartHire.Core.Interfaces;
using System;
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Configuration;

namespace SmartHire.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOTPEmailAsync(string toEmail, string otp, string userName)
        {
            try
            {
                // Get email settings from configuration
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                // If email settings are not configured, fall back to console logging
                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("EMAIL SETTINGS NOT CONFIGURED - LOGGING TO CONSOLE");
                    Console.WriteLine($"EMAIL SENT TO: {toEmail}");
                    Console.WriteLine($"USER: {userName}");
                    Console.WriteLine($"OTP CODE: {otp}");
                    Console.WriteLine($"OTP EXPIRES IN: 10 minutes");
                    Console.WriteLine("===========================================");
                    return;
                }

                // Create email message
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(userName, toEmail));
                message.Subject = "Email Verification - SmartHire";

                // Create HTML body
                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>Email Verification</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {userName},</p>
                                    <p style='color: #374151; font-size: 16px;'>Thank you for registering with SmartHire!</p>
                                    <p style='color: #374151; font-size: 16px;'>Your verification code is:</p>
                                    <div style='background-color: #eef2ff; padding: 20px; border-radius: 6px; text-align: center; margin: 20px 0;'>
                                        <h1 style='color: #4f46e5; font-size: 36px; letter-spacing: 8px; margin: 0;'>{otp}</h1>
                                    </div>
                                    <p style='color: #6b7280; font-size: 14px;'>This code will expire in <strong>10 minutes</strong>.</p>
                                    <p style='color: #6b7280; font-size: 14px;'>If you didn't request this code, please ignore this email.</p>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    ",
                    TextBody = $@"
                        Hello {userName},

                        Thank you for registering with SmartHire!

                        Your verification code is: {otp}

                        This code will expire in 10 minutes.

                        If you didn't request this code, please ignore this email.

                        © 2026 SmartHire. All rights reserved.
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                // Send email using SMTP
                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending email: {ex.Message}");
                Console.WriteLine("===========================================");
                Console.WriteLine("FALLBACK - LOGGING OTP TO CONSOLE");
                Console.WriteLine($"EMAIL: {toEmail}");
                Console.WriteLine($"USER: {userName}");
                Console.WriteLine($"OTP CODE: {otp}");
                Console.WriteLine("===========================================");
            }
        }

        public async Task SendApplicationSubmittedEmailToAdminAsync(string adminEmail, string candidateName, string jobTitle, string companyName)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("📧 NEW APPLICATION NOTIFICATION (Console Mode)");
                    Console.WriteLine($"TO: {adminEmail}");
                    Console.WriteLine($"CANDIDATE: {candidateName}");
                    Console.WriteLine($"JOB: {jobTitle}");
                    Console.WriteLine($"COMPANY: {companyName}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress("Admin", adminEmail));
                message.Subject = $"New Application: {jobTitle} - {companyName}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>🎉 New Job Application Received!</h2>
                                    <p style='color: #374151; font-size: 16px;'>A new candidate has applied for a position.</p>
                                    <div style='background-color: #eef2ff; padding: 20px; border-radius: 6px; margin: 20px 0;'>
                                        <p style='margin: 10px 0;'><strong>Candidate:</strong> {candidateName}</p>
                                        <p style='margin: 10px 0;'><strong>Position:</strong> {jobTitle}</p>
                                        <p style='margin: 10px 0;'><strong>Company:</strong> {companyName}</p>
                                    </div>
                                    <p style='color: #374151; font-size: 16px;'>Please log in to the admin panel to review the application.</p>
                                    <a href='http://localhost:5173/manage-applications' style='display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;'>
                                        View Application
                                    </a>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Application notification sent to admin: {adminEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending application notification: {ex.Message}");
            }
        }

        public async Task SendApplicationStatusChangedEmailToCandidateAsync(string candidateEmail, string candidateName, string jobTitle, string companyName, string newStatus)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("📧 APPLICATION STATUS UPDATE (Console Mode)");
                    Console.WriteLine($"TO: {candidateEmail}");
                    Console.WriteLine($"CANDIDATE: {candidateName}");
                    Console.WriteLine($"JOB: {jobTitle} at {companyName}");
                    Console.WriteLine($"NEW STATUS: {newStatus}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var statusColor = newStatus switch
                {
                    "Shortlisted" => "#10b981",
                    "Hired" => "#059669",
                    "Rejected" => "#ef4444",
                    "Interviewed" => "#8b5cf6",
                    _ => "#f59e0b"
                };

                var statusEmoji = newStatus switch
                {
                    "Shortlisted" => "🎉",
                    "Hired" => "🎊",
                    "Rejected" => "😔",
                    "Interviewed" => "📅",
                    _ => "📝"
                };

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(candidateName, candidateEmail));
                message.Subject = $"Application Update: {jobTitle} - {companyName}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>{statusEmoji} Application Status Update</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {candidateName},</p>
                                    <p style='color: #374151; font-size: 16px;'>Your application status has been updated.</p>
                                    <div style='background-color: #eef2ff; padding: 20px; border-radius: 6px; margin: 20px 0;'>
                                        <p style='margin: 10px 0;'><strong>Position:</strong> {jobTitle}</p>
                                        <p style='margin: 10px 0;'><strong>Company:</strong> {companyName}</p>
                                        <p style='margin: 10px 0;'><strong>New Status:</strong> <span style='color: {statusColor}; font-weight: bold;'>{newStatus}</span></p>
                                    </div>
                                    <p style='color: #374151; font-size: 16px;'>Please log in to view more details about your application.</p>
                                    <a href='http://localhost:5173/my-applications' style='display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;'>
                                        View My Applications
                                    </a>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Status update email sent to: {candidateEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending status update email: {ex.Message}");
            }
        }

        public async Task SendWelcomeEmailAsync(string toEmail, string userName)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("📧 WELCOME EMAIL (Console Mode)");
                    Console.WriteLine($"TO: {toEmail}");
                    Console.WriteLine($"USER: {userName}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(userName, toEmail));
                message.Subject = "Welcome to SmartHire!";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>🎉 Welcome to SmartHire!</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {userName},</p>
                                    <p style='color: #374151; font-size: 16px;'>Thank you for joining SmartHire! We're excited to help you find your dream job.</p>
                                    <p style='color: #374151; font-size: 16px;'>Here's what you can do:</p>
                                    <ul style='color: #374151; font-size: 16px;'>
                                        <li>Browse available job openings</li>
                                        <li>Apply for positions that match your skills</li>
                                        <li>Track your application status</li>
                                        <li>Get notified about updates</li>
                                    </ul>
                                    <a href='http://localhost:5173/jobs' style='display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;'>
                                        Browse Jobs
                                    </a>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Welcome email sent to: {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending welcome email: {ex.Message}");
            }
        }

        public async Task SendInterviewScheduledEmailAsync(string candidateEmail, string candidateName, string jobTitle, string companyName, DateTime scheduledDate, string interviewType, string? location, string? meetingLink)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("📅 INTERVIEW SCHEDULED (Console Mode)");
                    Console.WriteLine($"TO: {candidateEmail}");
                    Console.WriteLine($"CANDIDATE: {candidateName}");
                    Console.WriteLine($"JOB: {jobTitle} at {companyName}");
                    Console.WriteLine($"DATE: {scheduledDate:f}");
                    Console.WriteLine($"TYPE: {interviewType}");
                    if (!string.IsNullOrEmpty(location)) Console.WriteLine($"LOCATION: {location}");
                    if (!string.IsNullOrEmpty(meetingLink)) Console.WriteLine($"MEETING LINK: {meetingLink}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var locationInfo = interviewType == "InPerson" && !string.IsNullOrEmpty(location)
                    ? $"<p style='margin: 10px 0;'><strong>Location:</strong> {location}</p>"
                    : "";

                var meetingInfo = interviewType == "Video" && !string.IsNullOrEmpty(meetingLink)
                    ? $"<p style='margin: 10px 0;'><strong>Meeting Link:</strong> <a href='{meetingLink}' style='color: #4f46e5;'>{meetingLink}</a></p>"
                    : "";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(candidateName, candidateEmail));
                message.Subject = $"Interview Scheduled: {jobTitle} - {companyName}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>📅 Interview Scheduled!</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {candidateName},</p>
                                    <p style='color: #374151; font-size: 16px;'>Great news! An interview has been scheduled for your application.</p>
                                    <div style='background-color: #eef2ff; padding: 20px; border-radius: 6px; margin: 20px 0;'>
                                        <p style='margin: 10px 0;'><strong>Position:</strong> {jobTitle}</p>
                                        <p style='margin: 10px 0;'><strong>Company:</strong> {companyName}</p>
                                        <p style='margin: 10px 0;'><strong>Date & Time:</strong> {scheduledDate:dddd, MMMM dd, yyyy 'at' hh:mm tt}</p>
                                        <p style='margin: 10px 0;'><strong>Interview Type:</strong> {interviewType}</p>
                                        {locationInfo}
                                        {meetingInfo}
                                    </div>
                                    <p style='color: #374151; font-size: 16px;'>Please make sure to be available at the scheduled time. Good luck!</p>
                                    <a href='http://localhost:5173/my-applications' style='display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;'>
                                        View My Applications
                                    </a>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Interview scheduled email sent to: {candidateEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending interview scheduled email: {ex.Message}");
            }
        }

        public async Task SendInterviewReminderEmailAsync(string candidateEmail, string candidateName, string jobTitle, DateTime scheduledDate, string interviewType)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("🔔 INTERVIEW REMINDER (Console Mode)");
                    Console.WriteLine($"TO: {candidateEmail}");
                    Console.WriteLine($"CANDIDATE: {candidateName}");
                    Console.WriteLine($"JOB: {jobTitle}");
                    Console.WriteLine($"DATE: {scheduledDate:f}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(candidateName, candidateEmail));
                message.Subject = $"Interview Reminder: {jobTitle}";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>🔔 Interview Reminder</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {candidateName},</p>
                                    <p style='color: #374151; font-size: 16px;'>This is a friendly reminder about your upcoming interview.</p>
                                    <div style='background-color: #fef3c7; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;'>
                                        <p style='margin: 10px 0;'><strong>Position:</strong> {jobTitle}</p>
                                        <p style='margin: 10px 0;'><strong>Date & Time:</strong> {scheduledDate:dddd, MMMM dd, yyyy 'at' hh:mm tt}</p>
                                        <p style='margin: 10px 0;'><strong>Interview Type:</strong> {interviewType}</p>
                                    </div>
                                    <p style='color: #374151; font-size: 16px;'>Please be prepared and on time. Good luck!</p>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Interview reminder sent to: {candidateEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending interview reminder: {ex.Message}");
            }
        }

        public async Task SendPasswordResetEmailAsync(string toEmail, string userName, string resetToken)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderPassword = _configuration["EmailSettings:SenderPassword"];
                var senderName = _configuration["EmailSettings:SenderName"] ?? "SmartHire";

                if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
                {
                    Console.WriteLine("===========================================");
                    Console.WriteLine("🔒 PASSWORD RESET (Console Mode)");
                    Console.WriteLine($"TO: {toEmail}");
                    Console.WriteLine($"USER: {userName}");
                    Console.WriteLine($"RESET TOKEN: {resetToken}");
                    Console.WriteLine($"RESET LINK: http://localhost:5173/reset-password?token={resetToken}");
                    Console.WriteLine("===========================================");
                    return;
                }

                var resetLink = $"http://localhost:5173/reset-password?token={resetToken}";

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(senderName, senderEmail));
                message.To.Add(new MailboxAddress(userName, toEmail));
                message.Subject = "Password Reset Request - SmartHire";

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = $@"
                        <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;'>
                                <div style='background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                    <h2 style='color: #4f46e5; margin-bottom: 20px;'>🔒 Password Reset Request</h2>
                                    <p style='color: #374151; font-size: 16px;'>Hello {userName},</p>
                                    <p style='color: #374151; font-size: 16px;'>We received a request to reset your password. Click the button below to create a new password:</p>
                                    <div style='text-align: center; margin: 30px 0;'>
                                        <a href='{resetLink}' style='display: inline-block; background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;'>
                                            Reset Password
                                        </a>
                                    </div>
                                    <p style='color: #6b7280; font-size: 14px;'>Or copy and paste this link into your browser:</p>
                                    <p style='color: #4f46e5; font-size: 14px; word-break: break-all;'>{resetLink}</p>
                                    <div style='background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;'>
                                        <p style='color: #92400e; font-size: 14px; margin: 0;'>
                                            ⚠️ <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this password reset, please ignore this email.
                                        </p>
                                    </div>
                                    <hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>
                                    <p style='color: #9ca3af; font-size: 12px; text-align: center;'>
                                        © 2026 SmartHire. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </body>
                        </html>
                    "
                };

                message.Body = bodyBuilder.ToMessageBody();

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync(smtpServer, smtpPort, MailKit.Security.SecureSocketOptions.StartTls);
                    await client.AuthenticateAsync(senderEmail, senderPassword);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }

                Console.WriteLine($"✅ Password reset email sent to: {toEmail}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error sending password reset email: {ex.Message}");
            }
        }
    }
}
