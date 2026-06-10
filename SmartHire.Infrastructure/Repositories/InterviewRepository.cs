using Microsoft.EntityFrameworkCore;
using SmartHire.Core.Entities;
using SmartHire.Core.Enums;
using SmartHire.Core.Interfaces;
using SmartHire.Infrastructure.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHire.Infrastructure.Repositories
{
    public class InterviewRepository : IInterviewRepository
    {
        private readonly ApplicationDbContext _context;

        public InterviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Interview?> GetByIdAsync(int id)
        {
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .FirstOrDefaultAsync(i => i.Id == id);
        }

        public async Task<IEnumerable<Interview>> GetAllAsync()
        {
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .OrderBy(i => i.ScheduledDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Interview>> GetByApplicationIdAsync(int applicationId)
        {
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .Where(i => i.ApplicationId == applicationId)
                .OrderBy(i => i.ScheduledDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Interview>> GetByCandidateIdAsync(int candidateId)
        {
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .Where(i => i.Application.CandidateId == candidateId)
                .OrderBy(i => i.ScheduledDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync()
        {
            var now = DateTime.UtcNow;
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .Where(i => i.ScheduledDate >= now && i.Status == InterviewStatus.Scheduled)
                .OrderBy(i => i.ScheduledDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            return await _context.Interviews
                .Include(i => i.Application)
                    .ThenInclude(a => a.Candidate)
                .Include(i => i.Application)
                    .ThenInclude(a => a.Job)
                .Where(i => i.ScheduledDate >= startDate && i.ScheduledDate <= endDate)
                .OrderBy(i => i.ScheduledDate)
                .ToListAsync();
        }

        public async Task<Interview> CreateAsync(Interview interview)
        {
            _context.Interviews.Add(interview);
            await _context.SaveChangesAsync();
            return interview;
        }

        public async Task<Interview> UpdateAsync(Interview interview)
        {
            interview.UpdatedAt = DateTime.UtcNow;
            _context.Interviews.Update(interview);
            await _context.SaveChangesAsync();
            return interview;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var interview = await _context.Interviews.FindAsync(id);
            if (interview == null) return false;

            _context.Interviews.Remove(interview);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
