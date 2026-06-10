using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Requirements { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty;
        public decimal? SalaryMin { get; set; }
        public decimal? SalaryMax { get; set; }
        public string? ExperienceRequired { get; set; }
        public int? NumberOfOpenings { get; set; }
        public string? Department { get; set; }
        public string? IndustryType { get; set; }
        public string? EmploymentType { get; set; }
        public string? Education { get; set; }
        public string? KeySkills { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime? ClosingDate { get; set; }
        public bool IsActive { get; set; }
        public int ApplicationCount { get; set; }
    }
}
