using Microsoft.EntityFrameworkCore;
using SmartHire.Core.Entities;
using SmartHire.Core.Interfaces;
using SmartHire.Infrastructure.Data;


namespace SmartHire.Infrastructure.Repositories
{
    public class JobApplicationRepository : IJobApplicationRepository
    {
        private readonly ApplicationDbContext _context;

        public JobApplicationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<JobApplication?> GetByIdAsync(int id)
        {
            return await _context.JobApplications
                .Include(ja => ja.Job)
                .Include(ja => ja.Candidate)
                .FirstOrDefaultAsync(ja => ja.Id == id);
        }

        public async Task<IEnumerable<JobApplication>> GetAllAsync()
        {
            return await _context.JobApplications
                .Include(ja => ja.Job)
                .Include(ja => ja.Candidate)
                .OrderByDescending(ja => ja.AppliedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetByJobIdAsync(int jobId)
        {
            return await _context.JobApplications
                .Include(ja => ja.Candidate)
                .Where(ja => ja.JobId == jobId)
                .OrderByDescending(ja => ja.AppliedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<JobApplication>> GetByCandidateIdAsync(int candidateId)
        {
            return await _context.JobApplications
                .Include(ja => ja.Job)
                .Where(ja => ja.CandidateId == candidateId)
                .OrderByDescending(ja => ja.AppliedDate)
                .ToListAsync();
        }

        public async Task<JobApplication> CreateAsync(JobApplication application)
        {
            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<JobApplication> UpdateAsync(JobApplication application)
        {
            _context.JobApplications.Update(application);
            await _context.SaveChangesAsync();
            return application;
        }

        public async Task<bool> HasAppliedAsync(int jobId, int candidateId)
        {
            return await _context.JobApplications
                .AnyAsync(ja => ja.JobId == jobId && ja.CandidateId == candidateId);
        }
    }
}
