using SmartHire.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsActive { get; set; } = true;
        
        // Email Verification
        public bool IsEmailVerified { get; set; } = false;
        public string? EmailVerificationOTP { get; set; }
        public DateTime? OTPExpiry { get; set; }
        
        // Password Reset
        public string? PasswordResetToken { get; set; }
        public DateTime? PasswordResetTokenExpiry { get; set; }
        public DateTime? LastPasswordChange { get; set; }

        // Navigation property
        public ICollection<JobApplication>? Applications { get; set; }
    }
}
