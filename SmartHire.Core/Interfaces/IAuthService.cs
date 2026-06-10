using SmartHire.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(int userId, string email, string role);
        Task<bool> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
        Task<bool> ResendOTPAsync(string email);
        Task<bool> ForgotPasswordAsync(string email);
        Task<bool> ResetPasswordAsync(string token, string newPassword);
        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }
}
