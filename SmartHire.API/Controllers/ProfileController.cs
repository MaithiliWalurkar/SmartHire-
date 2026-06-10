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
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ICandidateProfileRepository _profileRepository;
        private readonly IUserRepository _userRepository;

        public ProfileController(ICandidateProfileRepository profileRepository, IUserRepository userRepository)
        {
            _profileRepository = profileRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
            {
                // Create a default profile if it doesn't exist
                var user = await _userRepository.GetByIdAsync(userId);
                if (user == null) return NotFound();

                profile = new CandidateProfile
                {
                    UserId = userId,
                    IsAvailableForWork = true
                };
                profile = await _profileRepository.CreateAsync(profile);
            }

            var profileDto = MapToDto(profile);
            return Ok(profileDto);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetProfileByUserId(int userId)
        {
            var profile = await _profileRepository.GetByUserIdAsync(userId);
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var profileDto = MapToDto(profile);
            return Ok(profileDto);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
            {
                profile = new CandidateProfile { UserId = userId };
                profile = await _profileRepository.CreateAsync(profile);
            }

            // Update profile fields
            profile.Bio = updateDto.Bio;
            profile.Location = updateDto.Location;
            profile.DateOfBirth = updateDto.DateOfBirth;
            profile.LinkedInUrl = updateDto.LinkedInUrl;
            profile.GitHubUrl = updateDto.GitHubUrl;
            profile.PortfolioUrl = updateDto.PortfolioUrl;
            profile.TwitterUrl = updateDto.TwitterUrl;
            profile.CurrentJobTitle = updateDto.CurrentJobTitle;
            profile.CurrentCompany = updateDto.CurrentCompany;
            profile.YearsOfExperience = updateDto.YearsOfExperience;
            profile.PreferredJobType = updateDto.PreferredJobType;
            profile.PreferredLocation = updateDto.PreferredLocation;
            profile.ExpectedSalary = updateDto.ExpectedSalary;
            profile.IsAvailableForWork = updateDto.IsAvailableForWork;

            await _profileRepository.UpdateAsync(profile);
            return Ok(new { message = "Profile updated successfully" });
        }

        // Work Experience Endpoints
        [HttpPost("experience")]
        public async Task<IActionResult> AddWorkExperience([FromBody] WorkExperienceDto experienceDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var experience = new WorkExperience
            {
                CandidateProfileId = profile.Id,
                JobTitle = experienceDto.JobTitle,
                CompanyName = experienceDto.CompanyName,
                Location = experienceDto.Location,
                StartDate = experienceDto.StartDate,
                EndDate = experienceDto.EndDate,
                IsCurrentJob = experienceDto.IsCurrentJob,
                Description = experienceDto.Description,
                Achievements = experienceDto.Achievements
            };

            await _profileRepository.AddWorkExperienceAsync(experience);
            return Ok(new { message = "Work experience added successfully", id = experience.Id });
        }

        [HttpPut("experience/{id}")]
        public async Task<IActionResult> UpdateWorkExperience(int id, [FromBody] WorkExperienceDto experienceDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var experience = profile.WorkExperiences?.FirstOrDefault(e => e.Id == id);
            if (experience == null)
                return NotFound(new { message = "Work experience not found" });

            experience.JobTitle = experienceDto.JobTitle;
            experience.CompanyName = experienceDto.CompanyName;
            experience.Location = experienceDto.Location;
            experience.StartDate = experienceDto.StartDate;
            experience.EndDate = experienceDto.EndDate;
            experience.IsCurrentJob = experienceDto.IsCurrentJob;
            experience.Description = experienceDto.Description;
            experience.Achievements = experienceDto.Achievements;

            await _profileRepository.UpdateWorkExperienceAsync(experience);
            return Ok(new { message = "Work experience updated successfully" });
        }

        [HttpDelete("experience/{id}")]
        public async Task<IActionResult> DeleteWorkExperience(int id)
        {
            var result = await _profileRepository.DeleteWorkExperienceAsync(id);
            if (!result)
                return NotFound(new { message = "Work experience not found" });

            return Ok(new { message = "Work experience deleted successfully" });
        }

        // Education Endpoints
        [HttpPost("education")]
        public async Task<IActionResult> AddEducation([FromBody] EducationDto educationDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var education = new Education
            {
                CandidateProfileId = profile.Id,
                Degree = educationDto.Degree,
                FieldOfStudy = educationDto.FieldOfStudy,
                Institution = educationDto.Institution,
                Location = educationDto.Location,
                StartDate = educationDto.StartDate,
                EndDate = educationDto.EndDate,
                IsCurrentlyStudying = educationDto.IsCurrentlyStudying,
                Grade = educationDto.Grade,
                Description = educationDto.Description
            };

            await _profileRepository.AddEducationAsync(education);
            return Ok(new { message = "Education added successfully", id = education.Id });
        }

        [HttpPut("education/{id}")]
        public async Task<IActionResult> UpdateEducation(int id, [FromBody] EducationDto educationDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var education = profile.Educations?.FirstOrDefault(e => e.Id == id);
            if (education == null)
                return NotFound(new { message = "Education not found" });

            education.Degree = educationDto.Degree;
            education.FieldOfStudy = educationDto.FieldOfStudy;
            education.Institution = educationDto.Institution;
            education.Location = educationDto.Location;
            education.StartDate = educationDto.StartDate;
            education.EndDate = educationDto.EndDate;
            education.IsCurrentlyStudying = educationDto.IsCurrentlyStudying;
            education.Grade = educationDto.Grade;
            education.Description = educationDto.Description;

            await _profileRepository.UpdateEducationAsync(education);
            return Ok(new { message = "Education updated successfully" });
        }

        [HttpDelete("education/{id}")]
        public async Task<IActionResult> DeleteEducation(int id)
        {
            var result = await _profileRepository.DeleteEducationAsync(id);
            if (!result)
                return NotFound(new { message = "Education not found" });

            return Ok(new { message = "Education deleted successfully" });
        }

        // Skills Endpoints
        [HttpPost("skill")]
        public async Task<IActionResult> AddSkill([FromBody] SkillDto skillDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var skill = new Skill
            {
                CandidateProfileId = profile.Id,
                SkillName = skillDto.SkillName,
                Category = skillDto.Category,
                ProficiencyLevel = skillDto.ProficiencyLevel,
                YearsOfExperience = skillDto.YearsOfExperience
            };

            await _profileRepository.AddSkillAsync(skill);
            return Ok(new { message = "Skill added successfully", id = skill.Id });
        }

        [HttpPut("skill/{id}")]
        public async Task<IActionResult> UpdateSkill(int id, [FromBody] SkillDto skillDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var skill = profile.Skills?.FirstOrDefault(s => s.Id == id);
            if (skill == null)
                return NotFound(new { message = "Skill not found" });

            skill.SkillName = skillDto.SkillName;
            skill.Category = skillDto.Category;
            skill.ProficiencyLevel = skillDto.ProficiencyLevel;
            skill.YearsOfExperience = skillDto.YearsOfExperience;

            await _profileRepository.UpdateSkillAsync(skill);
            return Ok(new { message = "Skill updated successfully" });
        }

        [HttpDelete("skill/{id}")]
        public async Task<IActionResult> DeleteSkill(int id)
        {
            var result = await _profileRepository.DeleteSkillAsync(id);
            if (!result)
                return NotFound(new { message = "Skill not found" });

            return Ok(new { message = "Skill deleted successfully" });
        }

        // Project Endpoints
        [HttpPost("project")]
        public async Task<IActionResult> AddProject([FromBody] ProjectDto projectDto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var profile = await _profileRepository.GetByUserIdAsync(userId);

            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            var project = new Project
            {
                CandidateProfileId = profile.Id,
                ProjectName = projectDto.ProjectName,
                Description = projectDto.Description,
                Role = projectDto.Role,
                TechnologiesUsed = projectDto.TechnologiesUsed,
                ProjectUrl = projectDto.ProjectUrl,
                StartDate = projectDto.StartDate,
                EndDate = projectDto.EndDate,
                IsOngoing = projectDto.IsOngoing
            };

            await _profileRepository.AddProjectAsync(project);
            return Ok(new { message = "Project added successfully", projectId = project.Id });
        }

        [HttpPut("project/{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] ProjectDto projectDto)
        {
            var project = await _profileRepository.GetProjectByIdAsync(id);
            if (project == null)
                return NotFound(new { message = "Project not found" });

            project.ProjectName = projectDto.ProjectName;
            project.Description = projectDto.Description;
            project.Role = projectDto.Role;
            project.TechnologiesUsed = projectDto.TechnologiesUsed;
            project.ProjectUrl = projectDto.ProjectUrl;
            project.StartDate = projectDto.StartDate;
            project.EndDate = projectDto.EndDate;
            project.IsOngoing = projectDto.IsOngoing;

            await _profileRepository.UpdateProjectAsync(project);
            return Ok(new { message = "Project updated successfully" });
        }

        [HttpDelete("project/{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var result = await _profileRepository.DeleteProjectAsync(id);
            if (!result)
                return NotFound(new { message = "Project not found" });

            return Ok(new { message = "Project deleted successfully" });
        }

        private CandidateProfileDto MapToDto(CandidateProfile profile)
        {
            return new CandidateProfileDto
            {
                Id = profile.Id,
                UserId = profile.UserId,
                FullName = profile.User?.FullName,
                Email = profile.User?.Email,
                PhoneNumber = profile.User?.PhoneNumber,
                Bio = profile.Bio,
                Location = profile.Location,
                ProfilePictureUrl = profile.ProfilePictureUrl,
                DateOfBirth = profile.DateOfBirth,
                LinkedInUrl = profile.LinkedInUrl,
                GitHubUrl = profile.GitHubUrl,
                PortfolioUrl = profile.PortfolioUrl,
                TwitterUrl = profile.TwitterUrl,
                CurrentJobTitle = profile.CurrentJobTitle,
                CurrentCompany = profile.CurrentCompany,
                YearsOfExperience = profile.YearsOfExperience,
                ResumeUrl = profile.ResumeUrl,
                PreferredJobType = profile.PreferredJobType,
                PreferredLocation = profile.PreferredLocation,
                ExpectedSalary = profile.ExpectedSalary,
                IsAvailableForWork = profile.IsAvailableForWork,
                WorkExperiences = profile.WorkExperiences?.Select(e => new WorkExperienceDto
                {
                    Id = e.Id,
                    JobTitle = e.JobTitle,
                    CompanyName = e.CompanyName,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrentJob = e.IsCurrentJob,
                    Description = e.Description,
                    Achievements = e.Achievements
                }).ToList(),
                Educations = profile.Educations?.Select(e => new EducationDto
                {
                    Id = e.Id,
                    Degree = e.Degree,
                    FieldOfStudy = e.FieldOfStudy,
                    Institution = e.Institution,
                    Location = e.Location,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate,
                    IsCurrentlyStudying = e.IsCurrentlyStudying,
                    Grade = e.Grade,
                    Description = e.Description
                }).ToList(),
                Skills = profile.Skills?.Select(s => new SkillDto
                {
                    Id = s.Id,
                    SkillName = s.SkillName,
                    Category = s.Category,
                    ProficiencyLevel = s.ProficiencyLevel,
                    YearsOfExperience = s.YearsOfExperience
                }).ToList(),
                Projects = profile.Projects?.Select(p => new ProjectDto
                {
                    Id = p.Id,
                    ProjectName = p.ProjectName,
                    Description = p.Description,
                    Role = p.Role,
                    TechnologiesUsed = p.TechnologiesUsed,
                    ProjectUrl = p.ProjectUrl,
                    StartDate = p.StartDate,
                    EndDate = p.EndDate,
                    IsOngoing = p.IsOngoing
                }).ToList()
            };
        }
    }
}
