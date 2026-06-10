using SmartHire.Core.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Entities
{
    public class JobApplication
    {
        public int Id { get; set; }
        public int JobId { get; set; }
        public int CandidateId { get; set; }
        public string CoverLetter { get; set; } = string.Empty;
        public string ResumeFileName { get; set; } = string.Empty;
        public string ResumeFilePath { get; set; } = string.Empty;
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Submitted;
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public string? AdminNotes { get; set; }

        // Navigation properties
        public Job? Job { get; set; }
        public User? Candidate { get; set; }
    }
}
