using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Core.DTOs;
using SmartHire.Core.Enums;
using SmartHire.Core.Interfaces;

namespace SmartHire.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly IJobRepository _jobRepository;
        private readonly IJobApplicationRepository _applicationRepository;
        private readonly IUserRepository _userRepository;

        public DashboardController(
            IJobRepository jobRepository,
            IJobApplicationRepository applicationRepository,
            IUserRepository userRepository)
        {
            _jobRepository = jobRepository;
            _applicationRepository = applicationRepository;
            _userRepository = userRepository;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var allJobs = await _jobRepository.GetAllAsync();
            var allApplications = await _applicationRepository.GetAllAsync();
            var allUsers = await _userRepository.GetAllAsync();

            var stats = new DashboardStatsDto
            {
                TotalJobs = allJobs.Count(),
                ActiveJobs = allJobs.Count(j => j.IsActive),
                TotalApplications = allApplications.Count(),
                TotalCandidates = allUsers.Count(u => u.Role == UserRole.Candidate),
                PendingApplications = allApplications.Count(a => a.Status == ApplicationStatus.Submitted),
                ShortlistedApplications = allApplications.Count(a => a.Status == ApplicationStatus.Shortlisted)
            };

            return Ok(stats);
        }

        [HttpGet("analytics")]
        public async Task<IActionResult> GetAnalytics()
        {
            var allJobs = await _jobRepository.GetAllAsync();
            var allApplications = await _applicationRepository.GetAllAsync();

            // Application status breakdown
            var statusBreakdown = new
            {
                Submitted = allApplications.Count(a => a.Status == ApplicationStatus.Submitted),
                UnderReview = allApplications.Count(a => a.Status == ApplicationStatus.UnderReview),
                Shortlisted = allApplications.Count(a => a.Status == ApplicationStatus.Shortlisted),
                Rejected = allApplications.Count(a => a.Status == ApplicationStatus.Rejected),
                Interviewed = allApplications.Count(a => a.Status == ApplicationStatus.Interviewed),
                Hired = allApplications.Count(a => a.Status == ApplicationStatus.Hired)
            };

            // Top jobs by application count
            var topJobs = allJobs
                .Select(j => new
                {
                    JobId = j.Id,
                    JobTitle = j.Title,
                    CompanyName = j.CompanyName,
                    ApplicationCount = j.Applications?.Count ?? 0
                })
                .OrderByDescending(j => j.ApplicationCount)
                .Take(5)
                .ToList();

            // Applications trend (last 7 days)
            var last7Days = Enumerable.Range(0, 7)
                .Select(i => DateTime.UtcNow.Date.AddDays(-i))
                .Reverse()
                .ToList();

            var applicationsTrend = last7Days.Select(date => new
            {
                Date = date.ToString("MMM dd"),
                Count = allApplications.Count(a => a.AppliedDate.Date == date)
            }).ToList();

            // Recent applications (last 5)
            var recentApplications = allApplications
                .OrderByDescending(a => a.AppliedDate)
                .Take(5)
                .Select(a => new
                {
                    Id = a.Id,
                    JobTitle = a.Job?.Title ?? "",
                    CompanyName = a.Job?.CompanyName ?? "",
                    CandidateName = a.Candidate?.FullName ?? "",
                    Status = a.Status.ToString(),
                    AppliedDate = a.AppliedDate
                })
                .ToList();

            return Ok(new
            {
                StatusBreakdown = statusBreakdown,
                TopJobs = topJobs,
                ApplicationsTrend = applicationsTrend,
                RecentApplications = recentApplications
            });
        }
    }
}