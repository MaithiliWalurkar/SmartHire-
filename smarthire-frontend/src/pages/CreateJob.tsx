import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobService } from '../services/api';
import { Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

const CreateJob = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    requirements: '',
    location: '',
    jobType: 'Full-Time',
    salaryMin: '',
    salaryMax: '',
    experienceRequired: '',
    numberOfOpenings: '',
    department: '',
    industryType: '',
    employmentType: 'Full Time',
    education: '',
    keySkills: '',
    closingDate: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      fetchJob();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJobById(parseInt(id!));
      const job = response.data;
      setFormData({
        title: job.title,
        companyName: job.companyName || '',
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        jobType: job.jobType,
        salaryMin: job.salaryMin?.toString() || '',
        salaryMax: job.salaryMax?.toString() || '',
        experienceRequired: job.experienceRequired || '',
        numberOfOpenings: job.numberOfOpenings?.toString() || '',
        department: job.department || '',
        industryType: job.industryType || '',
        employmentType: job.employmentType || 'Full Time',
        education: job.education || '',
        keySkills: job.keySkills || '',
        closingDate: job.closingDate ? job.closingDate.split('T')[0] : '',
        isActive: job.isActive,
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Validate closing date in real-time
    if (name === 'closingDate' && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setFieldErrors({ ...fieldErrors, closingDate: 'Closing date cannot be in the past' });
      } else {
        const newErrors = { ...fieldErrors };
        delete newErrors.closingDate;
        setFieldErrors(newErrors);
      }
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear field error when user starts typing
    if (fieldErrors[name] && name !== 'closingDate') {
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
    setError('');
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Job title is required';
    }

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company name is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Job description is required';
    }

    if (!formData.requirements.trim()) {
      errors.requirements = 'Job requirements are required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      if (min > max) {
        errors.salaryMin = 'Minimum salary cannot be greater than maximum salary';
      }
    }

    // Validate closing date - cannot be in the past
    if (formData.closingDate) {
      const selectedDate = new Date(formData.closingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
      
      if (selectedDate < today) {
        errors.closingDate = 'Closing date cannot be in the past';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const jobData = {
        title: formData.title,
        companyName: formData.companyName,
        description: formData.description,
        requirements: formData.requirements,
        location: formData.location,
        jobType: formData.jobType,
        salaryMin: formData.salaryMin ? parseFloat(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? parseFloat(formData.salaryMax) : undefined,
        experienceRequired: formData.experienceRequired || undefined,
        numberOfOpenings: formData.numberOfOpenings ? parseInt(formData.numberOfOpenings) : undefined,
        department: formData.department || undefined,
        industryType: formData.industryType || undefined,
        employmentType: formData.employmentType || undefined,
        education: formData.education || undefined,
        keySkills: formData.keySkills || undefined,
        closingDate: formData.closingDate || undefined,
        isActive: formData.isActive,
      };

      if (isEditMode) {
        await jobService.updateJob(parseInt(id!), jobData);
        setSuccess('Job updated successfully!');
      } else {
        await jobService.createJob(jobData);
        setSuccess('Job created successfully!');
      }

      setTimeout(() => {
        navigate('/manage-jobs');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} job`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? 'Edit Job' : 'Create New Job'}
              </h1>
            </div>
            <p className="text-gray-600">
              {isEditMode ? 'Update job details' : 'Fill in the details to post a new job'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Senior Software Engineer"
              />
              {fieldErrors.title && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.title}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  fieldErrors.companyName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g., Tekskills India"
              />
              {fieldErrors.companyName && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.companyName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  fieldErrors.requirements ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List the required skills, experience, and qualifications..."
              />
              {fieldErrors.requirements && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.requirements}</p>
              )}
            </div>

            {/* Location and Job Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    fieldErrors.location ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., New York, NY"
                />
                {fieldErrors.location && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary ($)
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    fieldErrors.salaryMin ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                />
                {fieldErrors.salaryMin && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.salaryMin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary ($)
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="80000"
                />
              </div>
            </div>

            {/* Experience and Openings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Required
                </label>
                <input
                  type="text"
                  name="experienceRequired"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., 2-5 years"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Openings
                </label>
                <input
                  type="number"
                  name="numberOfOpenings"
                  value={formData.numberOfOpenings}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1"
                  min="1"
                />
              </div>
            </div>

            {/* Department and Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Engineering - Software & QA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Type
                </label>
                <input
                  type="text"
                  name="industryType"
                  value={formData.industryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., IT Services & Consulting"
                />
              </div>
            </div>

            {/* Employment Type and Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  name="employmentType"
                  value={formData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Full Time, Permanent">Full Time, Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Any Graduate, B.Tech, MBA"
                />
              </div>
            </div>

            {/* Key Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Skills
              </label>
              <input
                type="text"
                name="keySkills"
                value={formData.keySkills}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., C#, ASP.NET, JavaScript, React (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">Enter skills separated by commas</p>
            </div>

            {/* Closing Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Application Closing Date
              </label>
              <input
                type="date"
                name="closingDate"
                value={formData.closingDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  fieldErrors.closingDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {fieldErrors.closingDate && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {fieldErrors.closingDate}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1">Select a future date for application deadline</p>
            </div>

            {/* Is Active */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                Active (Job will be visible to candidates)
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving...' : isEditMode ? 'Update Job' : 'Create Job'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/manage-jobs')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
