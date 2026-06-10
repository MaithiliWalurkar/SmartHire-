using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Entities
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty; // Full-time, Part-time, Contract
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? ExperienceRequired { get; set; } // e.g., "2-5 years"
        public int? NumberOfOpenings { get; set; }
        public string? Department { get; set; } // e.g., "Engineering - Software & QA"
        public string? IndustryType { get; set; } // e.g., "IT Services & Consulting"
        public string? EmploymentType { get; set; } // e.g., "Full Time, Permanent"
        public string? Education { get; set; } // e.g., "Any Graduate"
        public string? KeySkills { get; set; } // Comma-separated skills
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ClosingDate { get; set; }
        public bool IsActive { get; set; } = true;
        public int PostedBy { get; set; } // Admin User ID

        // Navigation property
        public ICollection<JobApplication>? Applications { get; set; }
    }
}
