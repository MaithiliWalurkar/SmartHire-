using SmartHire.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class RegisterDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; }
    }
}
