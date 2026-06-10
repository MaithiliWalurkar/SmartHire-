using System;
using SmartHire.Core.Enums;

namespace SmartHire.Core.DTOs
{
    public class InterviewDto
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public string? CandidateName { get; set; }
        public string? CandidateEmail { get; set; }
        public string? JobTitle { get; set; }
        public string? CompanyName { get; set; }
        
        public DateTime ScheduledDate { get; set; }
        public TimeSpan Duration { get; set; }
        
        public InterviewType Type { get; set; }
        public string TypeDisplay { get; set; } = string.Empty;
        public InterviewStatus Status { get; set; }
        public string StatusDisplay { get; set; } = string.Empty;
        
        public string? Location { get; set; }
        public string? MeetingLink { get; set; }
        public string? PhoneNumber { get; set; }
        
        public string? InterviewerName { get; set; }
        public string? InterviewerEmail { get; set; }
        
        public string? Notes { get; set; }
        public string? Feedback { get; set; }
        
        public DateTime CreatedAt { get; set; }
    }

    public class CreateInterviewDto
    {
        public int ApplicationId { get; set; }
        public DateTime ScheduledDate { get; set; }
        public int DurationMinutes { get; set; } = 60;
        public InterviewType Type { get; set; }
        public string? Location { get; set; }
        public string? MeetingLink { get; set; }
        public string? PhoneNumber { get; set; }
        public string? InterviewerName { get; set; }
        public string? InterviewerEmail { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateInterviewDto
    {
        public DateTime? ScheduledDate { get; set; }
        public int? DurationMinutes { get; set; }
        public InterviewStatus? Status { get; set; }
        public string? Location { get; set; }
        public string? MeetingLink { get; set; }
        public string? PhoneNumber { get; set; }
        public string? InterviewerName { get; set; }
        public string? InterviewerEmail { get; set; }
        public string? Notes { get; set; }
        public string? Feedback { get; set; }
    }
}
