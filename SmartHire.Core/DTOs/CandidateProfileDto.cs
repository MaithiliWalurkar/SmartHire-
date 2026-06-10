using System;
using System.Collections.Generic;

namespace SmartHire.Core.DTOs
{
    public class CandidateProfileDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string? FullName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        
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
        public bool IsAvailableForWork { get; set; }
        
        // Related Data
        public List<WorkExperienceDto>? WorkExperiences { get; set; }
        public List<EducationDto>? Educations { get; set; }
        public List<SkillDto>? Skills { get; set; }
        public List<ProjectDto>? Projects { get; set; }
    }

    public class WorkExperienceDto
    {
        public int Id { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentJob { get; set; }
        public string? Description { get; set; }
        public string? Achievements { get; set; }
    }

    public class EducationDto
    {
        public int Id { get; set; }
        public string Degree { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsCurrentlyStudying { get; set; }
        public string? Grade { get; set; }
        public string? Description { get; set; }
    }

    public class SkillDto
    {
        public int Id { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string? Category { get; set; }
        public string? ProficiencyLevel { get; set; }
        public int? YearsOfExperience { get; set; }
    }

    public class ProjectDto
    {
        public int Id { get; set; }
        public string ProjectName { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Role { get; set; }
        public string? TechnologiesUsed { get; set; }
        public string? ProjectUrl { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool IsOngoing { get; set; }
    }

    public class UpdateProfileDto
    {
        public string? Bio { get; set; }
        public string? Location { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? LinkedInUrl { get; set; }
        public string? GitHubUrl { get; set; }
        public string? PortfolioUrl { get; set; }
        public string? TwitterUrl { get; set; }
        public string? CurrentJobTitle { get; set; }
        public string? CurrentCompany { get; set; }
        public int? YearsOfExperience { get; set; }
        public string? PreferredJobType { get; set; }
        public string? PreferredLocation { get; set; }
        public decimal? ExpectedSalary { get; set; }
        public bool IsAvailableForWork { get; set; }
    }
}
