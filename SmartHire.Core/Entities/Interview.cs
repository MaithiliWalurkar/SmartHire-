using System;
using SmartHire.Core.Enums;

namespace SmartHire.Core.Entities
{
    public class Interview
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public JobApplication Application { get; set; } = null!;
        
        public DateTime ScheduledDate { get; set; }
        public TimeSpan Duration { get; set; } = TimeSpan.FromHours(1); // Default 1 hour
        
        public InterviewType Type { get; set; }
        public InterviewStatus Status { get; set; } = InterviewStatus.Scheduled;
        
        public string? Location { get; set; } // For in-person interviews
        public string? MeetingLink { get; set; } // For video interviews
        public string? PhoneNumber { get; set; } // For phone interviews
        
        public string? InterviewerName { get; set; }
        public string? InterviewerEmail { get; set; }
        
        public string? Notes { get; set; }
        public string? Feedback { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public int? CreatedBy { get; set; } // Admin user ID
    }
}
