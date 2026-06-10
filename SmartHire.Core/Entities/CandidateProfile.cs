using System;
using System.Collections.Generic;

namespace SmartHire.Core.Entities
{
    public class CandidateProfile
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        
        // Personal Information
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public DateTime? DateOfBirth { get; set; }
        
        // Social Links
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? TwitterUrl { get; set; }
        
        // Professional Details
        public string? CurrentJobTitle { get; set; }
        public string? CurrentCompany { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? ResumeUrl { get; set; }
        
        // Preferences
        public string? PreferredJobType { get; set; }
        public string? PreferredLocation { get; set; }
        public decimal? ExpectedSalary { get; set; }
        public bool IsAvailableForWork { get; set; } = true;
        
        // Timestamps
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation Properties
        public ICollection<WorkExperience>? WorkExperiences { get; set; }
        public ICollection<Education>? Educations { get; set; }
        public ICollection<Skill>? Skills { get; set; }
        public ICollection<Project>? Projects { get; set; }
    }
}
