using SmartHire.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.Interfaces
{
    public interface IJobApplicationRepository
    {
        Task<JobApplication?> GetByIdAsync(int id);
        Task<IEnumerable<JobApplication>> GetAllAsync();
        Task<IEnumerable<JobApplication>> GetByJobIdAsync(int jobId);
        Task<IEnumerable<JobApplication>> GetByCandidateIdAsync(int candidateId);
        Task<JobApplication> CreateAsync(JobApplication application);
        Task<JobApplication> UpdateAsync(JobApplication application);
        Task<bool> HasAppliedAsync(int jobId, int candidateId);
    }
}
