using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SmartHire.Core.DTOs;
using SmartHire.Core.Entities;
using SmartHire.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartHire.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            // Check if email already exists
            if (await _userRepository.EmailExistsAsync(registerDto.Email))
            {
                throw new Exception("Email already exists");
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

            // Generate OTP
            var otp = GenerateOTP();
            var otpExpiry = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 minutes

            // Create user
            var user = new User
            {
                FullName = registerDto.FullName,
                Email = registerDto.Email,
                PasswordHash = passwordHash,
                PhoneNumber = registerDto.PhoneNumber,
                Role = registerDto.Role,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsEmailVerified = false,
                EmailVerificationOTP = otp,
                OTPExpiry = otpExpiry
            };

            var createdUser = await _userRepository.CreateAsync(user);

            // Send OTP email
            await _emailService.SendOTPEmailAsync(createdUser.Email, otp, createdUser.FullName);

            // Generate JWT token
            var token = GenerateJwtToken(createdUser.Id, createdUser.Email, createdUser.Role.ToString());

            return new LoginResponseDto
            {
                UserId = createdUser.Id,
                FullName = createdUser.FullName,
                Email = createdUser.Email,
                Role = createdUser.Role,
                Token = token
            };
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                throw new Exception("Invalid email or password");
            }

            if (!user.IsActive)
            {
                throw new Exception("Account is inactive");
            }

            // Check if email is verified
            if (!user.IsEmailVerified)
            {
                throw new Exception("Email not verified. Please verify your email to login.");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user.Id, user.Email, user.Role.ToString());

            return new LoginResponseDto
            {
                UserId = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                Token = token
            };
        }

        public async Task<bool> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
        {
            var user = await _userRepository.GetByEmailAsync(verifyEmailDto.Email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (user.IsEmailVerified)
            {
                throw new Exception("Email already verified");
            }

            if (user.EmailVerificationOTP != verifyEmailDto.OTP)
            {
                throw new Exception("Invalid OTP");
            }

            if (user.OTPExpiry < DateTime.UtcNow)
            {
                throw new Exception("OTP has expired. Please request a new one.");
            }

            // Mark email as verified
            user.IsEmailVerified = true;
            user.EmailVerificationOTP = null;
            user.OTPExpiry = null;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ResendOTPAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);

            if (user == null)
            {
                throw new Exception("User not found");
            }

            if (user.IsEmailVerified)
            {
                throw new Exception("Email already verified");
            }

            // Generate new OTP
            var otp = GenerateOTP();
            var otpExpiry = DateTime.UtcNow.AddMinutes(10);

            user.EmailVerificationOTP = otp;
            user.OTPExpiry = otpExpiry;

            await _userRepository.UpdateAsync(user);

            // Send OTP email
            await _emailService.SendOTPEmailAsync(user.Email, otp, user.FullName);

            return true;
        }

        private string GenerateOTP()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // 6-digit OTP
        }

        public string GenerateJwtToken(int userId, string email, string role)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyForJWTTokenGeneration12345";
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"] ?? "SmartHireAPI",
                audience: jwtSettings["Audience"] ?? "SmartHireClient",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"] ?? "60")),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        public async Task<bool> ForgotPasswordAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                // Return true even if user doesn't exist (security best practice)
                return true;
            }

            // Generate reset token
            var resetToken = Guid.NewGuid().ToString();
            user.PasswordResetToken = resetToken;
            user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Token expires in 1 hour

            await _userRepository.UpdateAsync(user);

            // Send password reset email
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.FullName, resetToken);

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string token, string newPassword)
        {
            var user = await _userRepository.GetByPasswordResetTokenAsync(token);
            if (user == null)
            {
                return false;
            }

            // Check if token is expired
            if (user.PasswordResetTokenExpiry == null || user.PasswordResetTokenExpiry < DateTime.UtcNow)
            {
                return false;
            }

            // Hash new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.PasswordResetToken = null;
            user.PasswordResetTokenExpiry = null;
            user.LastPasswordChange = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, user.PasswordHash))
            {
                return false;
            }

            // Hash and update new password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            user.LastPasswordChange = DateTime.UtcNow;

            await _userRepository.UpdateAsync(user);

            return true;
        }
    }
}