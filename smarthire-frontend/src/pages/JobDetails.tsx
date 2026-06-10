import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobService, applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, MapPin, DollarSign, Calendar, Clock, 
  FileText, ArrowLeft, CheckCircle, AlertCircle, Upload 
} from 'lucide-react';

interface Job {
  id: number;
  title: string;
  companyName: string;
  description: string;
  requirements: string;
  location: string;
  jobType: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceRequired?: string;
  numberOfOpenings?: number;
  department?: string;
  industryType?: string;
  employmentType?: string;
  education?: string;
  keySkills?: string;
  postedDate: string;
  closingDate?: string;
  isActive: boolean;
}

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isCandidate, user } = useAuth();
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [coverLetterError, setCoverLetterError] = useState('');
  
  const MIN_COVER_LETTER_LENGTH = 50;
  const MAX_COVER_LETTER_LENGTH = 2000;

  useEffect(() => {
    fetchJob();
    if (isCandidate && user) {
      checkIfApplied();
    }
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobService.getJobById(parseInt(id!));
      const jobData = response.data;
      
      // Check if job is expired for candidates
      if (isCandidate && jobData.closingDate) {
        const closingDate = new Date(jobData.closingDate);
        const today = new Date();
        closingDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        if (closingDate < today) {
          setError('This job posting has closed and is no longer accepting applications.');
          setTimeout(() => {
            navigate('/jobs');
          }, 3000);
          return;
        }
      }
      
      setJob(jobData);
    } catch (error) {
      console.error('Error fetching job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const checkIfApplied = async () => {
    try {
      const response = await applicationService.getApplicationsByCandidate(user!.userId);
      const applied = response.data.some((app: any) => app.jobId === parseInt(id!));
      setHasApplied(applied);
    } catch (error) {
      console.error('Error checking application status:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload a PDF or Word document');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setResume(file);
      setError('');
    }
  };

  const validateCoverLetter = (text: string) => {
    const trimmedText = text.trim();
    
    if (!trimmedText) {
      setCoverLetterError('Cover letter is required');
      return false;
    }
    
    if (trimmedText.length < MIN_COVER_LETTER_LENGTH) {
      setCoverLetterError(`Cover letter must be at least ${MIN_COVER_LETTER_LENGTH} characters (currently ${trimmedText.length})`);
      return false;
    }
    
    if (trimmedText.length > MAX_COVER_LETTER_LENGTH) {
      setCoverLetterError(`Cover letter must not exceed ${MAX_COVER_LETTER_LENGTH} characters`);
      return false;
    }
    
    setCoverLetterError('');
    return true;
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCoverLetter(text);
    
    // Real-time validation
    if (text.trim().length > 0 && text.trim().length < MIN_COVER_LETTER_LENGTH) {
      setCoverLetterError(`At least ${MIN_COVER_LETTER_LENGTH} characters required`);
    } else if (text.length > MAX_COVER_LETTER_LENGTH) {
      setCoverLetterError(`Maximum ${MAX_COVER_LETTER_LENGTH} characters allowed`);
    } else {
      setCoverLetterError('');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    if (!validateCoverLetter(coverLetter)) {
      setError('Please fix the cover letter errors before submitting');
      return;
    }

    setApplying(true);

    try {
      const formData = new FormData();
      formData.append('jobId', id!);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resume);

      await applicationService.createApplication(formData);
      
      setSuccess('Application submitted successfully!');
      setShowApplyForm(false);
      setCoverLetter('');
      setResume(null);
      
      setTimeout(() => {
        navigate('/my-applications');
      }, 2000);
    } catch (err: any) {
      console.error('Application error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.title || err.message || 'Failed to submit application';
      setError(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Jobs
        </button>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Job Details Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{job.companyName || 'Company Not Specified'}</p>
            
            {/* Job Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start text-gray-700">
                <MapPin className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{job.location}</p>
                </div>
              </div>
              
              <div className="flex items-start text-gray-700">
                <Briefcase className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Job Type</p>
                  <p className="font-medium">{job.jobType}</p>
                </div>
              </div>
              
              <div className="flex items-start text-gray-700">
                <DollarSign className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Salary</p>
                  <p className="font-medium">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                </div>
              </div>
              
              {job.experienceRequired && (
                <div className="flex items-start text-gray-700">
                  <Calendar className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{job.experienceRequired}</p>
                  </div>
                </div>
              )}
              
              {job.employmentType && (
                <div className="flex items-start text-gray-700">
                  <Briefcase className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Employment Type</p>
                    <p className="font-medium">{job.employmentType}</p>
                  </div>
                </div>
              )}
              
              {job.numberOfOpenings && (
                <div className="flex items-start text-gray-700">
                  <FileText className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Openings</p>
                    <p className="font-medium">{job.numberOfOpenings}</p>
                  </div>
                </div>
              )}
              
              {job.department && (
                <div className="flex items-start text-gray-700">
                  <Briefcase className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{job.department}</p>
                  </div>
                </div>
              )}
              
              {job.industryType && (
                <div className="flex items-start text-gray-700">
                  <Briefcase className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Industry</p>
                    <p className="font-medium">{job.industryType}</p>
                  </div>
                </div>
              )}
              
              {job.education && (
                <div className="flex items-start text-gray-700">
                  <FileText className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Education</p>
                    <p className="font-medium">{job.education}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-start text-gray-700">
                <Calendar className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Posted</p>
                  <p className="font-medium">{formatDate(job.postedDate)}</p>
                </div>
              </div>
              
              {job.closingDate && (
                <div className="flex items-start text-gray-700">
                  <Clock className="w-5 h-5 mr-3 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Closing Date</p>
                    <p className="font-medium">{formatDate(job.closingDate)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Key Skills */}
            {job.keySkills && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Key Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.keySkills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {isCandidate && !showApplyForm && (
              hasApplied ? (
                <div className="w-full md:w-auto bg-green-100 text-green-700 px-8 py-3 rounded-lg flex items-center justify-center gap-2 border-2 border-green-300">
                  <CheckCircle className="w-5 h-5" />
                  Already Applied
                </div>
              ) : (
                <button
                  onClick={() => setShowApplyForm(true)}
                  className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  Apply for this Position
                </button>
              )
            )}
          </div>

          <hr className="my-6" />

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
          </div>
        </div>

        {/* Application Form */}
        {showApplyForm && isCandidate && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Your Application</h2>
            
            <form onSubmit={handleApply} className="space-y-6">
              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={coverLetter}
                  onChange={handleCoverLetterChange}
                  rows={8}
                  maxLength={MAX_COVER_LETTER_LENGTH}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    coverLetterError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Tell us why you're a great fit for this position... (minimum 50 characters)"
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <div>
                    {coverLetterError && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {coverLetterError}
                      </p>
                    )}
                    {!coverLetterError && coverLetter.trim().length >= MIN_COVER_LETTER_LENGTH && (
                      <p className="text-green-600 text-sm flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        Looks good!
                      </p>
                    )}
                  </div>
                  <p className={`text-sm ${
                    coverLetter.length > MAX_COVER_LETTER_LENGTH * 0.9 ? 'text-orange-600 font-medium' : 'text-gray-500'
                  }`}>
                    {coverLetter.length} / {MAX_COVER_LETTER_LENGTH}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum {MIN_COVER_LETTER_LENGTH} characters required. Explain your interest, relevant experience, and why you're a good fit.
                </p>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    id="resume-upload"
                    required
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    {resume ? (
                      <div>
                        <p className="text-green-600 font-medium">{resume.name}</p>
                        <p className="text-sm text-gray-500">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 font-medium">Click to upload resume</p>
                        <p className="text-sm text-gray-500">PDF, DOC, or DOCX (Max 5MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowApplyForm(false);
                    setError('');
                    setCoverLetter('');
                    setResume(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
