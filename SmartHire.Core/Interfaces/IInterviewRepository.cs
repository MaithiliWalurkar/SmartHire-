using SmartHire.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SmartHire.Core.Interfaces
{
    public interface IInterviewRepository
    {
        Task<Interview?> GetByIdAsync(int id);
        Task<IEnumerable<Interview>> GetAllAsync();
        Task<IEnumerable<Interview>> GetByApplicationIdAsync(int applicationId);
        Task<IEnumerable<Interview>> GetByCandidateIdAsync(int candidateId);
        Task<IEnumerable<Interview>> GetUpcomingInterviewsAsync();
        Task<IEnumerable<Interview>> GetInterviewsByDateRangeAsync(DateTime startDate, DateTime endDate);
        Task<Interview> CreateAsync(Interview interview);
        Task<Interview> UpdateAsync(Interview interview);
        Task<bool> DeleteAsync(int id);
    }
}
