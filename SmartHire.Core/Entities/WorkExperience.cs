using System;

namespace SmartHire.Core.Entities
{
    public class WorkExperience
    {
        public int Id { get; set; }
        public int CandidateProfileId { get; set; }
        public CandidateProfile CandidateProfile { get; set; } = null!;
        
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentJob { get; set; } = false;
        public string? Description { get; set; }
        public string? Achievements { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
