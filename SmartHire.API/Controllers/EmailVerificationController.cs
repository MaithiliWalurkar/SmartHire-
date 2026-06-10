using Microsoft.AspNetCore.Mvc;
using SmartHire.Core.DTOs;
using SmartHire.Core.Interfaces;

namespace SmartHire.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailVerificationController : ControllerBase
    {
        private readonly IAuthService _authService;

        public EmailVerificationController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
        {
            try
            {
                var result = await _authService.VerifyEmailAsync(verifyEmailDto);
                return Ok(new { message = "Email verified successfully", success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }
        }

        [HttpPost("resend-otp")]
        public async Task<IActionResult> ResendOTP([FromBody] ResendOTPDto resendOTPDto)
        {
            try
            {
                var result = await _authService.ResendOTPAsync(resendOTPDto.Email);
                return Ok(new { message = "OTP sent successfully", success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message, success = false });
            }
        }
    }
}
