using System;

namespace SmartHire.Core.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public int CandidateProfileId { get; set; }
        public CandidateProfile CandidateProfile { get; set; } = null!;
        
        public string ProjectName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Role { get; set; } // e.g., "Team Lead", "Developer"
        public string? TechnologiesUsed { get; set; } // Comma-separated
        public string? ProjectUrl { get; set; } // GitHub, live demo, etc.
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsOngoing { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
