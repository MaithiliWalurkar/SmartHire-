using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartHire.Core.DTOs;
using SmartHire.Core.Entities;
using SmartHire.Core.Interfaces;
using System.Security.Claims;

namespace SmartHire.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IJobRepository _jobRepository;

        public JobsController(IJobRepository jobRepository)
        {
            _jobRepository = jobRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllJobs()
        {
            var jobs = await _jobRepository.GetAllAsync();
            var jobDtos = jobs.Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                JobType = j.JobType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                ExperienceRequired = j.ExperienceRequired,
                NumberOfOpenings = j.NumberOfOpenings,
                Department = j.Department,
                IndustryType = j.IndustryType,
                EmploymentType = j.EmploymentType,
                Education = j.Education,
                KeySkills = j.KeySkills,
                PostedDate = j.PostedDate,
                ClosingDate = j.ClosingDate,
                IsActive = j.IsActive,
                ApplicationCount = j.Applications?.Count ?? 0
            });

            return Ok(jobDtos);
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveJobs()
        {
            var jobs = await _jobRepository.GetActiveJobsAsync();
            var jobDtos = jobs.Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                JobType = j.JobType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                ExperienceRequired = j.ExperienceRequired,
                NumberOfOpenings = j.NumberOfOpenings,
                Department = j.Department,
                IndustryType = j.IndustryType,
                EmploymentType = j.EmploymentType,
                Education = j.Education,
                KeySkills = j.KeySkills,
                PostedDate = j.PostedDate,
                ClosingDate = j.ClosingDate,
                IsActive = j.IsActive,
                ApplicationCount = j.Applications?.Count ?? 0
            });

            return Ok(jobDtos);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("my-jobs")]
        public async Task<IActionResult> GetMyJobs()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var jobs = await _jobRepository.GetJobsByAdminAsync(userId);
            var jobDtos = jobs.Select(j => new JobDto
            {
                Id = j.Id,
                Title = j.Title,
                CompanyName = j.CompanyName,
                Description = j.Description,
                Requirements = j.Requirements,
                Location = j.Location,
                JobType = j.JobType,
                SalaryMin = j.SalaryMin,
                SalaryMax = j.SalaryMax,
                ExperienceRequired = j.ExperienceRequired,
                NumberOfOpenings = j.NumberOfOpenings,
                Department = j.Department,
                IndustryType = j.IndustryType,
                EmploymentType = j.EmploymentType,
                Education = j.Education,
                KeySkills = j.KeySkills,
                PostedDate = j.PostedDate,
                ClosingDate = j.ClosingDate,
                IsActive = j.IsActive,
                ApplicationCount = j.Applications?.Count ?? 0
            });

            return Ok(jobDtos);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetJobById(int id)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            var jobDto = new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                CompanyName = job.CompanyName,
                Description = job.Description,
                Requirements = job.Requirements,
                Location = job.Location,
                JobType = job.JobType,
                SalaryMin = job.SalaryMin,
                SalaryMax = job.SalaryMax,
                ExperienceRequired = job.ExperienceRequired,
                NumberOfOpenings = job.NumberOfOpenings,
                Department = job.Department,
                IndustryType = job.IndustryType,
                EmploymentType = job.EmploymentType,
                Education = job.Education,
                KeySkills = job.KeySkills,
                PostedDate = job.PostedDate,
                ClosingDate = job.ClosingDate,
                IsActive = job.IsActive,
                ApplicationCount = job.Applications?.Count ?? 0
            };

            return Ok(jobDto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateJob([FromBody] CreateJobDto createJobDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

            var job = new Job
            {
                Title = createJobDto.Title,
                CompanyName = createJobDto.CompanyName,
                Description = createJobDto.Description,
                Requirements = createJobDto.Requirements,
                Location = createJobDto.Location,
                JobType = createJobDto.JobType,
                SalaryMin = createJobDto.SalaryMin,
                SalaryMax = createJobDto.SalaryMax,
                ExperienceRequired = createJobDto.ExperienceRequired,
                NumberOfOpenings = createJobDto.NumberOfOpenings,
                Department = createJobDto.Department,
                IndustryType = createJobDto.IndustryType,
                EmploymentType = createJobDto.EmploymentType,
                Education = createJobDto.Education,
                KeySkills = createJobDto.KeySkills,
                ClosingDate = createJobDto.ClosingDate,
                PostedBy = userId,
                PostedDate = DateTime.UtcNow,
                IsActive = createJobDto.IsActive
            };

            var createdJob = await _jobRepository.CreateAsync(job);
            return CreatedAtAction(nameof(GetJobById), new { id = createdJob.Id }, createdJob);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJob(int id, [FromBody] CreateJobDto updateJobDto)
        {
            var job = await _jobRepository.GetByIdAsync(id);
            if (job == null)
                return NotFound(new { message = "Job not found" });

            job.Title = updateJobDto.Title;
            job.CompanyName = updateJobDto.CompanyName;
            job.Description = updateJobDto.Description;
            job.Requirements = updateJobDto.Requirements;
            job.Location = updateJobDto.Location;
            job.JobType = updateJobDto.JobType;
            job.SalaryMin = updateJobDto.SalaryMin;
            job.SalaryMax = updateJobDto.SalaryMax;
            job.ExperienceRequired = updateJobDto.ExperienceRequired;
            job.NumberOfOpenings = updateJobDto.NumberOfOpenings;
            job.Department = updateJobDto.Department;
            job.IndustryType = updateJobDto.IndustryType;
            job.EmploymentType = updateJobDto.EmploymentType;
            job.Education = updateJobDto.Education;
            job.KeySkills = updateJobDto.KeySkills;
            job.ClosingDate = updateJobDto.ClosingDate;
            job.IsActive = updateJobDto.IsActive;

            var updatedJob = await _jobRepository.UpdateAsync(job);
            return Ok(updatedJob);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteJob(int id)
        {
            var result = await _jobRepository.DeleteAsync(id);
            if (!result)
                return NotFound(new { message = "Job not found" });

            return Ok(new { message = "Job deleted successfully" });
        }
    }
}