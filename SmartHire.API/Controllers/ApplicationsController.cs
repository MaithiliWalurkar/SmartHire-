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
    public class ApplicationsController : ControllerBase
    {
        private readonly IJobApplicationRepository _applicationRepository;
        private readonly IWebHostEnvironment _environment;
        private readonly IEmailService _emailService;
        private readonly IUserRepository _userRepository;
        private readonly IJobRepository _jobRepository;

        public ApplicationsController(
            IJobApplicationRepository applicationRepository, 
            IWebHostEnvironment environment,
            IEmailService emailService,
            IUserRepository userRepository,
            IJobRepository jobRepository)
        {
            _applicationRepository = applicationRepository;
            _environment = environment;
            _emailService = emailService;
            _userRepository = userRepository;
            _jobRepository = jobRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllApplications()
        {
            var applications = await _applicationRepository.GetAllAsync();
            var applicationDtos = applications.Select(a => new JobApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job?.Title ?? "",
                CompanyName = a.Job?.CompanyName ?? "",
                JobLocation = a.Job?.Location ?? "",
                CandidateId = a.CandidateId,
                CandidateName = a.Candidate?.FullName ?? "",
                CandidateEmail = a.Candidate?.Email ?? "",
                CoverLetter = a.CoverLetter,
                ResumeFileName = a.ResumeFileName,
                Status = a.Status,
                AppliedDate = a.AppliedDate,
                AdminNotes = a.AdminNotes
            });

            return Ok(applicationDtos);
        }

        [HttpGet("job/{jobId}")]
        public async Task<IActionResult> GetApplicationsByJob(int jobId)
        {
            var applications = await _applicationRepository.GetByJobIdAsync(jobId);
            var applicationDtos = applications.Select(a => new JobApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job?.Title ?? "",
                CompanyName = a.Job?.CompanyName ?? "",
                JobLocation = a.Job?.Location ?? "",
                CandidateId = a.CandidateId,
                CandidateName = a.Candidate?.FullName ?? "",
                CandidateEmail = a.Candidate?.Email ?? "",
                CoverLetter = a.CoverLetter,
                ResumeFileName = a.ResumeFileName,
                Status = a.Status,
                AppliedDate = a.AppliedDate,
                AdminNotes = a.AdminNotes
            });

            return Ok(applicationDtos);
        }

        [HttpGet("candidate/{candidateId}")]
        public async Task<IActionResult> GetApplicationsByCandidate(int candidateId)
        {
            var applications = await _applicationRepository.GetByCandidateIdAsync(candidateId);
            var applicationDtos = applications.Select(a => new JobApplicationDto
            {
                Id = a.Id,
                JobId = a.JobId,
                JobTitle = a.Job?.Title ?? "",
                CompanyName = a.Job?.CompanyName ?? "",
                JobLocation = a.Job?.Location ?? "",
                CandidateId = a.CandidateId,
                CandidateName = a.Candidate?.FullName ?? "",
                CandidateEmail = a.Candidate?.Email ?? "",
                CoverLetter = a.CoverLetter,
                ResumeFileName = a.ResumeFileName,
                Status = a.Status,
                AppliedDate = a.AppliedDate,
                AdminNotes = a.AdminNotes
            });

            return Ok(applicationDtos);
        }

        [Authorize(Roles = "Candidate")]
        [HttpPost]
        public async Task<IActionResult> CreateApplication([FromForm] CreateApplicationDto createApplicationDto, IFormFile? resume)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            // Check if already applied
            var hasApplied = await _applicationRepository.HasAppliedAsync(createApplicationDto.JobId, userId);
            if (hasApplied)
                return BadRequest(new { message = "You have already applied for this job" });

            string resumeFileName = "";
            string resumeFilePath = "";

            // Handle resume upload
            if (resume != null && resume.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "resumes");
                Directory.CreateDirectory(uploadsFolder);

                resumeFileName = $"{userId}_{DateTime.Now.Ticks}_{resume.FileName}";
                resumeFilePath = Path.Combine(uploadsFolder, resumeFileName);

                using (var fileStream = new FileStream(resumeFilePath, FileMode.Create))
                {
                    await resume.CopyToAsync(fileStream);
                }
            }

            var application = new JobApplication
            {
                JobId = createApplicationDto.JobId,
                CandidateId = userId,
                CoverLetter = createApplicationDto.CoverLetter,
                ResumeFileName = resumeFileName,
                ResumeFilePath = resumeFilePath,
                Status = ApplicationStatus.Submitted,
                AppliedDate = DateTime.UtcNow
            };

            var createdApplication = await _applicationRepository.CreateAsync(application);
            
            // Send email notification to admin
            try
            {
                var job = await _jobRepository.GetByIdAsync(createApplicationDto.JobId);
                var candidate = await _userRepository.GetByIdAsync(userId);
                var admins = await _userRepository.GetAllAsync();
                var adminUser = admins.FirstOrDefault(u => u.Role == UserRole.Admin);
                
                if (adminUser != null && job != null && candidate != null)
                {
                    await _emailService.SendApplicationSubmittedEmailToAdminAsync(
                        adminUser.Email,
                        candidate.FullName,
                        job.Title,
                        job.CompanyName ?? "Company"
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email notification: {ex.Message}");
                // Don't fail the application submission if email fails
            }
            
            return Ok(new { message = "Application submitted successfully", applicationId = createdApplication.Id });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateApplicationStatus(int id, [FromBody] UpdateApplicationStatusDto statusDto)
        {
            var application = await _applicationRepository.GetByIdAsync(id);
            if (application == null)
                return NotFound(new { message = "Application not found" });

            var oldStatus = application.Status;
            application.Status = statusDto.Status;
            application.AdminNotes = statusDto.AdminNotes;

            var updatedApplication = await _applicationRepository.UpdateAsync(application);
            
            // Send email notification to candidate if status changed
            if (oldStatus != statusDto.Status)
            {
                try
                {
                    var candidate = application.Candidate ?? await _userRepository.GetByIdAsync(application.CandidateId);
                    var job = application.Job ?? await _jobRepository.GetByIdAsync(application.JobId);
                    
                    if (candidate != null && job != null)
                    {
                        await _emailService.SendApplicationStatusChangedEmailToCandidateAsync(
                            candidate.Email,
                            candidate.FullName,
                            job.Title,
                            job.CompanyName ?? "Company",
                            statusDto.Status.ToString()
                        );
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending status change email: {ex.Message}");
                    // Don't fail the status update if email fails
                }
            }
            
            return Ok(new { message = "Application status updated successfully" });
        }
    }

    public class UpdateApplicationStatusDto
    {
        public ApplicationStatus Status { get; set; }
        public string? AdminNotes { get; set; }
    }
}