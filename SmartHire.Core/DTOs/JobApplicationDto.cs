using SmartHire.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class JobApplicationDto
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string JobLocation { get; set; } = string.Empty;
        public int CandidateId { get; set; }
        public string CandidateName { get; set; } = string.Empty;
        public string CandidateEmail { get; set; } = string.Empty;
        public string CoverLetter { get; set; } = string.Empty;
        public string ResumeFileName { get; set; } = string.Empty;
        public ApplicationStatus Status { get; set; }
        public DateTime AppliedDate { get; set; }
        public string? AdminNotes { get; set; }
    }
}
