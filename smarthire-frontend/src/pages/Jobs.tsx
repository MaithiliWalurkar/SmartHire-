import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../services/api';
import { Briefcase, MapPin, Calendar, ArrowRight, Search, X, SlidersHorizontal, Users } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  companyName: string;
  description: string;
  location: string;
  employmentType: string;
  industryType: string;
  department: string;
  experienceRequired: string;
  postedDate: string;
  closingDate?: string;
  isActive: boolean;
  applicationCount: number;
}

const Jobs = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, employmentTypeFilter, industryFilter, experienceFilter, departmentFilter, sortBy, allJobs]);

  const fetchJobs = async () => {
    try {
      const response = await jobService.getActiveJobs();
      setAllJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allJobs];

    // Filter out expired jobs (jobs with closing date in the past)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    filtered = filtered.filter(job => {
      if (!job.closingDate) return true; // No closing date means always open
      const closingDate = new Date(job.closingDate);
      closingDate.setHours(0, 0, 0, 0);
      return closingDate >= today; // Only show jobs that haven't closed yet
    });

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Employment type filter
    if (employmentTypeFilter) {
      filtered = filtered.filter(job =>
        job.employmentType === employmentTypeFilter
      );
    }

    // Industry filter
    if (industryFilter) {
      filtered = filtered.filter(job =>
        job.industryType === industryFilter
      );
    }

    // Experience filter
    if (experienceFilter) {
      filtered = filtered.filter(job =>
        job.experienceRequired === experienceFilter
      );
    }

    // Department filter
    if (departmentFilter) {
      filtered = filtered.filter(job =>
        job.department === departmentFilter
      );
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime());
        break;
      case 'closing':
        filtered.sort((a, b) => {
          if (!a.closingDate) return 1;
          if (!b.closingDate) return -1;
          return new Date(a.closingDate).getTime() - new Date(b.closingDate).getTime();
        });
        break;
    }

    setFilteredJobs(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setEmploymentTypeFilter('');
    setIndustryFilter('');
    setExperienceFilter('');
    setDepartmentFilter('');
    setSortBy('newest');
  };

  const getUniqueValues = (key: keyof Job): string[] => {
    return Array.from(new Set(allJobs.map(job => job[key]).filter(Boolean))) as string[];
  };

  // Calculate total active jobs (excluding expired)
  const activeJobsCount = allJobs.filter(job => {
    if (!job.closingDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const closingDate = new Date(job.closingDate);
    closingDate.setHours(0, 0, 0, 0);
    return closingDate >= today;
  }).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading jobs...</div>
      </div>
    );
  }

  const activeFiltersCount = [searchTerm, locationFilter, employmentTypeFilter, industryFilter, experienceFilter, departmentFilter].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Available Jobs</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Browse and apply for open positions</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-3">
            {/* Search Input - Half Width */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by job title, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Filter Toggle Button - Compact */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative flex items-center justify-center gap-1.5 px-3 py-2 rounded-md border transition-colors ${
                showFilters ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              title="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown - Compact */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="closing">Closing Soon</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Enter location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Employment Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={employmentTypeFilter}
                    onChange={(e) => setEmploymentTypeFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    {getUniqueValues('employmentType').map((type) => (
                      <option key={type} value={type as string}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Industry Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Industries</option>
                    {getUniqueValues('industryType').map((industry) => (
                      <option key={industry} value={industry as string}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {getUniqueValues('experienceRequired').map((exp) => (
                      <option key={exp} value={exp as string}>{exp}</option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">All Departments</option>
                    {getUniqueValues('department').map((dept) => (
                      <option key={dept} value={dept as string}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredJobs.length}</span> of{' '}
          <span className="font-semibold text-gray-900 dark:text-white">{activeJobsCount}</span> jobs
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-transparent dark:border-gray-700"
                onClick={() => navigate(`/job/${job.id}`)}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{job.title}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">{job.companyName || 'Company Not Specified'}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Briefcase className="w-4 h-4 mr-2 flex-shrink-0" />
                    {job.employmentType} • {job.experienceRequired}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    Posted {new Date(job.postedDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    {job.applicationCount} {job.applicationCount === 1 ? 'Applicant' : 'Applicants'}
                  </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2 mb-4">{job.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {job.department}
                  </span>
                  <button className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm font-medium">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
