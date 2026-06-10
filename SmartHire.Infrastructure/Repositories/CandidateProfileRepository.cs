using Microsoft.EntityFrameworkCore;
using SmartHire.Core.Entities;
using SmartHire.Core.Interfaces;
using SmartHire.Infrastructure.Data;
using System.Threading.Tasks;

namespace SmartHire.Infrastructure.Repositories
{
    public class CandidateProfileRepository : ICandidateProfileRepository
    {
        private readonly ApplicationDbContext _context;

        public CandidateProfileRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CandidateProfile?> GetByUserIdAsync(int userId)
        {
            return await _context.CandidateProfiles
                .Include(p => p.User)
                .Include(p => p.WorkExperiences)
                .Include(p => p.Educations)
                .Include(p => p.Skills)
                .Include(p => p.Projects)
                .FirstOrDefaultAsync(p => p.UserId == userId);
        }

        public async Task<CandidateProfile?> GetByIdAsync(int id)
        {
            return await _context.CandidateProfiles
                .Include(p => p.User)
                .Include(p => p.WorkExperiences)
                .Include(p => p.Educations)
                .Include(p => p.Skills)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<CandidateProfile> CreateAsync(CandidateProfile profile)
        {
            _context.CandidateProfiles.Add(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<CandidateProfile> UpdateAsync(CandidateProfile profile)
        {
            profile.UpdatedAt = System.DateTime.UtcNow;
            _context.CandidateProfiles.Update(profile);
            await _context.SaveChangesAsync();
            return profile;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var profile = await _context.CandidateProfiles.FindAsync(id);
            if (profile == null) return false;

            _context.CandidateProfiles.Remove(profile);
            await _context.SaveChangesAsync();
            return true;
        }

        // Work Experience
        public async Task<WorkExperience> AddWorkExperienceAsync(WorkExperience experience)
        {
            _context.WorkExperiences.Add(experience);
            await _context.SaveChangesAsync();
            return experience;
        }

        public async Task<WorkExperience> UpdateWorkExperienceAsync(WorkExperience experience)
        {
            _context.WorkExperiences.Update(experience);
            await _context.SaveChangesAsync();
            return experience;
        }

        public async Task<bool> DeleteWorkExperienceAsync(int id)
        {
            var experience = await _context.WorkExperiences.FindAsync(id);
            if (experience == null) return false;

            _context.WorkExperiences.Remove(experience);
            await _context.SaveChangesAsync();
            return true;
        }

        // Education
        public async Task<Education> AddEducationAsync(Education education)
        {
            _context.Educations.Add(education);
            await _context.SaveChangesAsync();
            return education;
        }

        public async Task<Education> UpdateEducationAsync(Education education)
        {
            _context.Educations.Update(education);
            await _context.SaveChangesAsync();
            return education;
        }

        public async Task<bool> DeleteEducationAsync(int id)
        {
            var education = await _context.Educations.FindAsync(id);
            if (education == null) return false;

            _context.Educations.Remove(education);
            await _context.SaveChangesAsync();
            return true;
        }

        // Skills
        public async Task<Skill> AddSkillAsync(Skill skill)
        {
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();
            return skill;
        }

        public async Task<Skill> UpdateSkillAsync(Skill skill)
        {
            _context.Skills.Update(skill);
            await _context.SaveChangesAsync();
            return skill;
        }

        public async Task<bool> DeleteSkillAsync(int id)
        {
            var skill = await _context.Skills.FindAsync(id);
            if (skill == null) return false;

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();
            return true;
        }

        // Project Methods
        public async Task<Project> AddProjectAsync(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<Project?> GetProjectByIdAsync(int id)
        {
            return await _context.Projects.FindAsync(id);
        }

        public async Task<Project> UpdateProjectAsync(Project project)
        {
            _context.Projects.Update(project);
            await _context.SaveChangesAsync();
            return project;
        }

        public async Task<bool> DeleteProjectAsync(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return false;

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
