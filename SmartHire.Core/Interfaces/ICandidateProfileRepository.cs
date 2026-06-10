using SmartHire.Core.Entities;
using System.Threading.Tasks;

namespace SmartHire.Core.Interfaces
{
    public interface ICandidateProfileRepository
    {
        Task<CandidateProfile?> GetByUserIdAsync(int userId);
        Task<CandidateProfile?> GetByIdAsync(int id);
        Task<CandidateProfile> CreateAsync(CandidateProfile profile);
        Task<CandidateProfile> UpdateAsync(CandidateProfile profile);
        Task<bool> DeleteAsync(int id);
        
        // Work Experience
        Task<WorkExperience> AddWorkExperienceAsync(WorkExperience experience);
        Task<WorkExperience> UpdateWorkExperienceAsync(WorkExperience experience);
        Task<bool> DeleteWorkExperienceAsync(int id);
        
        // Education
        Task<Education> AddEducationAsync(Education education);
        Task<Education> UpdateEducationAsync(Education education);
        Task<bool> DeleteEducationAsync(int id);
        
        // Skills
        Task<Skill> AddSkillAsync(Skill skill);
        Task<Skill> UpdateSkillAsync(Skill skill);
        Task<bool> DeleteSkillAsync(int id);
        
        // Projects
        Task<Project> AddProjectAsync(Project project);
        Task<Project?> GetProjectByIdAsync(int id);
        Task<Project> UpdateProjectAsync(Project project);
        Task<bool> DeleteProjectAsync(int id);
    }
}
