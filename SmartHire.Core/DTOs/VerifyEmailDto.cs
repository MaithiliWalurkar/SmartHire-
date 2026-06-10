namespace SmartHire.Core.DTOs
{
    public class VerifyEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string OTP { get; set; } = string.Empty;
    }

    public class ResendOTPDto
    {
        public string Email { get; set; } = string.Empty;
    }
}
