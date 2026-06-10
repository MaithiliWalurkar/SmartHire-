using SmartHire.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Interfaces
{
    public interface IJobRepository
    {
        Task<Job?> GetByIdAsync(int id);
        Task<IEnumerable<Job>> GetAllAsync();
        Task<IEnumerable<Job>> GetActiveJobsAsync();
        Task<IEnumerable<Job>> GetJobsByAdminAsync(int adminUserId);
        Task<Job> CreateAsync(Job job);
        Task<Job> UpdateAsync(Job job);
        Task<bool> DeleteAsync(int id);
    }
}
