using System;

namespace SmartHire.Core.Entities
{
    public class Skill
    {
        public int Id { get; set; }
        public int CandidateProfileId { get; set; }
        public CandidateProfile CandidateProfile { get; set; } = null!;
        
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; } // e.g., "Technical", "Soft Skills", "Language"
        public string? ProficiencyLevel { get; set; } // e.g., "Beginner", "Intermediate", "Expert"
        public int? YearsOfExperience { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
