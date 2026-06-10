using SmartHire.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public UserRole Role { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
