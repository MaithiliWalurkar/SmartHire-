import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Calendar, FileText, AlertCircle, Clock } from 'lucide-react';

interface Application {
  id: number;
  jobId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string;
  candidateId: number;
  candidateName: string;
  candidateEmail: string;
  coverLetter: string;
  resumeFileName: string;
  status: string;
  appliedDate: string;
  adminNotes?: string;
}

const MyApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getApplicationsByCandidate(user!.userId);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string | number): string => {
    const statusStr = typeof status === 'number' ? status.toString() : status;
    switch (statusStr) {
      case '1':
      case 'Submitted':
        return 'Submitted';
      case '2':
      case 'UnderReview':
        return 'Under Review';
      case '3':
      case 'Shortlisted':
        return 'Shortlisted';
      case '4':
      case 'Rejected':
        return 'Rejected';
      case '5':
      case 'Interviewed':
        return 'Interviewed';
      case '6':
      case 'Hired':
        return 'Hired';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string | number) => {
    const statusStr = typeof status === 'number' ? status.toString() : status;
    switch (statusStr) {
      case '1':
      case 'Submitted':
        return 'bg-blue-100 text-blue-700';
      case '2':
      case 'UnderReview':
        return 'bg-yellow-100 text-yellow-700';
      case '3':
      case 'Shortlisted':
        return 'bg-green-100 text-green-700';
      case '4':
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      case '5':
      case 'Interviewed':
        return 'bg-purple-100 text-purple-700';
      case '6':
      case 'Hired':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track the status of your job applications</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{applications.length}</p>
              </div>
              <Briefcase className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Under Review</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {applications.filter(a => a.status.toString() === '2').length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Shortlisted</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(a => a.status.toString() === '3').length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {applications.filter(a => a.status.toString() === '4').length}
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No applications yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start applying for jobs to see your applications here</p>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{application.jobTitle}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                      {application.companyName} • {application.jobLocation}
                    </p>

                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      Applied on {formatDate(application.appliedDate)}
                    </div>

                    <p className="text-gray-700 line-clamp-2 mb-4">{application.coverLetter}</p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/job/${application.jobId}`)}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Job Details →
                      </button>
                      {application.resumeFileName && (
                        <a
                          href={`http://localhost:5276/resumes/${application.resumeFileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1"
                        >
                          <FileText className="w-4 h-4" />
                          Download Resume
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
