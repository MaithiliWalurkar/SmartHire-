using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int TotalApplications { get; set; }
        public int TotalCandidates { get; set; }
        public int PendingApplications { get; set; }
        public int ShortlistedApplications { get; set; }
    }
}
