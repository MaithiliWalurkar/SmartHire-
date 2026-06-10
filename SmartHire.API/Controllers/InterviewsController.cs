using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Core.DTOs;
using SmartHire.Core.Entities;
using SmartHire.Core.Enums;
using SmartHire.Core.Interfaces;
using System.Security.Claims;

namespace SmartHire.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class InterviewsController : ControllerBase
    {
        private readonly IInterviewRepository _interviewRepository;
        private readonly IJobApplicationRepository _applicationRepository;
        private readonly IEmailService _emailService;

        public InterviewsController(
            IInterviewRepository interviewRepository,
            IJobApplicationRepository applicationRepository,
            IEmailService emailService)
        {
            _interviewRepository = interviewRepository;
            _applicationRepository = applicationRepository;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllInterviews()
        {
            var interviews = await _interviewRepository.GetAllAsync();
            var interviewDtos = interviews.Select(MapToDto);
            return Ok(interviewDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInterview(int id)
        {
            var interview = await _interviewRepository.GetByIdAsync(id);
            if (interview == null)
                return NotFound(new { message = "Interview not found" });

            return Ok(MapToDto(interview));
        }

        [HttpGet("application/{applicationId}")]
        public async Task<IActionResult> GetInterviewsByApplication(int applicationId)
        {
            var interviews = await _interviewRepository.GetByApplicationIdAsync(applicationId);
            var interviewDtos = interviews.Select(MapToDto);
            return Ok(interviewDtos);
        }

        [HttpGet("candidate/my-interviews")]
        public async Task<IActionResult> GetMyInterviews()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var interviews = await _interviewRepository.GetByCandidateIdAsync(userId);
            var interviewDtos = interviews.Select(MapToDto);
            return Ok(interviewDtos);
        }

        [HttpGet("upcoming")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUpcomingInterviews()
        {
            var interviews = await _interviewRepository.GetUpcomingInterviewsAsync();
            var interviewDtos = interviews.Select(MapToDto);
            return Ok(interviewDtos);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ScheduleInterview([FromBody] CreateInterviewDto createDto)
        {
            var application = await _applicationRepository.GetByIdAsync(createDto.ApplicationId);
            if (application == null)
                return NotFound(new { message = "Application not found" });

            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var interview = new Interview
            {
                ApplicationId = createDto.ApplicationId,
                ScheduledDate = createDto.ScheduledDate,
                Duration = TimeSpan.FromMinutes(createDto.DurationMinutes),
                Type = createDto.Type,
                Location = createDto.Location,
                MeetingLink = createDto.MeetingLink,
                PhoneNumber = createDto.PhoneNumber,
                InterviewerName = createDto.InterviewerName,
                InterviewerEmail = createDto.InterviewerEmail,
                Notes = createDto.Notes,
                Status = InterviewStatus.Scheduled,
                CreatedBy = userId
            };

            var createdInterview = await _interviewRepository.CreateAsync(interview);

            // Send email notification
            try
            {
                if (application.Candidate != null && application.Job != null)
                {
                    await _emailService.SendInterviewScheduledEmailAsync(
                        application.Candidate.Email,
                        application.Candidate.FullName,
                        application.Job.Title,
                        application.Job.CompanyName ?? "Company",
                        createDto.ScheduledDate,
                        createDto.Type.ToString(),
                        createDto.Location,
                        createDto.MeetingLink
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending interview email: {ex.Message}");
            }

            return Ok(new { message = "Interview scheduled successfully", interviewId = createdInterview.Id });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateInterview(int id, [FromBody] UpdateInterviewDto updateDto)
        {
            var interview = await _interviewRepository.GetByIdAsync(id);
            if (interview == null)
                return NotFound(new { message = "Interview not found" });

            if (updateDto.ScheduledDate.HasValue)
                interview.ScheduledDate = updateDto.ScheduledDate.Value;
            
            if (updateDto.DurationMinutes.HasValue)
                interview.Duration = TimeSpan.FromMinutes(updateDto.DurationMinutes.Value);
            
            if (updateDto.Status.HasValue)
                interview.Status = updateDto.Status.Value;
            
            if (updateDto.Location != null)
                interview.Location = updateDto.Location;
            
            if (updateDto.MeetingLink != null)
                interview.MeetingLink = updateDto.MeetingLink;
            
            if (updateDto.PhoneNumber != null)
                interview.PhoneNumber = updateDto.PhoneNumber;
            
            if (updateDto.InterviewerName != null)
                interview.InterviewerName = updateDto.InterviewerName;
            
            if (updateDto.InterviewerEmail != null)
                interview.InterviewerEmail = updateDto.InterviewerEmail;
            
            if (updateDto.Notes != null)
                interview.Notes = updateDto.Notes;
            
            if (updateDto.Feedback != null)
                interview.Feedback = updateDto.Feedback;

            await _interviewRepository.UpdateAsync(interview);
            return Ok(new { message = "Interview updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CancelInterview(int id)
        {
            var interview = await _interviewRepository.GetByIdAsync(id);
            if (interview == null)
                return NotFound(new { message = "Interview not found" });

            interview.Status = InterviewStatus.Cancelled;
            await _interviewRepository.UpdateAsync(interview);

            return Ok(new { message = "Interview cancelled successfully" });
        }

        private InterviewDto MapToDto(Interview interview)
        {
            return new InterviewDto
            {
                Id = interview.Id,
                ApplicationId = interview.ApplicationId,
                CandidateName = interview.Application?.Candidate?.FullName,
                CandidateEmail = interview.Application?.Candidate?.Email,
                JobTitle = interview.Application?.Job?.Title,
                CompanyName = interview.Application?.Job?.CompanyName,
                ScheduledDate = interview.ScheduledDate,
                Duration = interview.Duration,
                Type = interview.Type,
                TypeDisplay = interview.Type.ToString(),
                Status = interview.Status,
                StatusDisplay = interview.Status.ToString(),
                Location = interview.Location,
                MeetingLink = interview.MeetingLink,
                PhoneNumber = interview.PhoneNumber,
                InterviewerName = interview.InterviewerName,
                InterviewerEmail = interview.InterviewerEmail,
                Notes = interview.Notes,
                Feedback = interview.Feedback,
                CreatedAt = interview.CreatedAt
            };
        }
    }
}
