import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationService, interviewService } from '../services/api';
import { Briefcase, User, Mail, Calendar, FileText, AlertCircle, CheckCircle, XCircle, ExternalLink, Search, Video, Phone, MapPin } from 'lucide-react';

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
  status: number;
  appliedDate: string;
  adminNotes?: string;
}

const ManageApplications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAppForInterview, setSelectedAppForInterview] = useState<Application | null>(null);
  const [scheduledInterviews, setScheduledInterviews] = useState<Record<number, any>>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [interviewData, setInterviewData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    type: '2', // Default to Video
    location: '',
    meetingLink: '',
    phoneNumber: '',
    interviewerName: '',
    interviewerEmail: '',
    notes: ''
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationService.getAllApplications();
      setApplications(response.data);
      
      // Fetch interviews for all applications
      const interviewsMap: Record<number, any> = {};
      for (const app of response.data) {
        try {
          const interviewResponse = await interviewService.getByApplication(app.id);
          if (interviewResponse.data && interviewResponse.data.length > 0) {
            interviewsMap[app.id] = interviewResponse.data[0]; // Get the first/latest interview
          }
        } catch (err) {
          // No interview scheduled for this application
        }
      }
      setScheduledInterviews(interviewsMap);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return 'Submitted';
      case 2: return 'Under Review';
      case 3: return 'Shortlisted';
      case 4: return 'Rejected';
      case 5: return 'Interviewed';
      case 6: return 'Hired';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: return 'bg-blue-100 text-blue-700';
      case 2: return 'bg-yellow-100 text-yellow-700';
      case 3: return 'bg-green-100 text-green-700';
      case 4: return 'bg-red-100 text-red-700';
      case 5: return 'bg-purple-100 text-purple-700';
      case 6: return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleUpdateStatus = async (applicationId: number, newStatus: number) => {
    setUpdating(true);
    try {
      await applicationService.updateApplicationStatus(applicationId, {
        status: newStatus,
        adminNotes: adminNotes || undefined
      });
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === applicationId 
          ? { ...app, status: newStatus, adminNotes: adminNotes || app.adminNotes }
          : app
      ));
      
      setSelectedApp(null);
      setAdminNotes('');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const handleScheduleInterview = async () => {
    if (!selectedAppForInterview) return;

    // Validation
    if (!interviewData.scheduledDate || !interviewData.scheduledTime) {
      alert('Please select date and time for the interview');
      return;
    }

    if (!interviewData.interviewerName || !interviewData.interviewerEmail) {
      alert('Please provide interviewer details');
      return;
    }

    // Type-specific validation
    if (interviewData.type === '2' && !interviewData.meetingLink) {
      alert('Please provide meeting link for video interview');
      return;
    }
    if (interviewData.type === '1' && !interviewData.phoneNumber) {
      alert('Please provide phone number for phone interview');
      return;
    }
    if (interviewData.type === '3' && !interviewData.location) {
      alert('Please provide location for in-person interview');
      return;
    }

    try {
      const scheduledDateTime = new Date(`${interviewData.scheduledDate}T${interviewData.scheduledTime}`);
      
      const interviewPayload = {
        applicationId: selectedAppForInterview.id,
        scheduledDate: scheduledDateTime.toISOString(),
        type: parseInt(interviewData.type),
        location: interviewData.location || null,
        meetingLink: interviewData.meetingLink || null,
        phoneNumber: interviewData.phoneNumber || null,
        interviewerName: interviewData.interviewerName,
        interviewerEmail: interviewData.interviewerEmail,
        notes: interviewData.notes || null
      };

      if (isUpdating && scheduledInterviews[selectedAppForInterview.id]) {
        // Update existing interview
        await interviewService.update(scheduledInterviews[selectedAppForInterview.id].id, interviewPayload);
        alert('Interview updated successfully!');
      } else {
        // Schedule new interview
        await interviewService.schedule(interviewPayload);
        alert('Interview scheduled successfully!');
      }

      // Refresh applications and interviews
      await fetchApplications();
      setShowScheduleModal(false);
      setSelectedAppForInterview(null);
      setIsUpdating(false);
      setInterviewData({
        scheduledDate: '',
        scheduledTime: '',
        type: '2',
        location: '',
        meetingLink: '',
        phoneNumber: '',
        interviewerName: '',
        interviewerEmail: '',
        notes: ''
      });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter applications by search term
  const filteredApplications = applications.filter(app => 
    searchTerm === '' || 
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group applications by job
  const groupedApplications = filteredApplications.reduce((groups, app) => {
    const key = `${app.jobId}-${app.jobTitle}`;
    if (!groups[key]) {
      groups[key] = {
        jobId: app.jobId,
        jobTitle: app.jobTitle,
        companyName: app.companyName,
        jobLocation: app.jobLocation,
        applications: []
      };
    }
    groups[key].applications.push(app);
    return groups;
  }, {} as Record<string, { jobId: number; jobTitle: string; companyName: string; jobLocation: string; applications: Application[] }>);

  const jobGroups = Object.values(groupedApplications);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Applications</h1>
          <p className="text-gray-600 mt-2">Review and manage candidate applications</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by job title, candidate name, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total</p>
                <p className="text-3xl font-bold text-gray-900">{applications.length}</p>
              </div>
              <Briefcase className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Submitted</p>
                <p className="text-3xl font-bold text-blue-600">
                  {applications.filter(a => a.status === 1).length}
                </p>
              </div>
              <FileText className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Shortlisted</p>
                <p className="text-3xl font-bold text-green-600">
                  {applications.filter(a => a.status === 3).length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Rejected</p>
                <p className="text-3xl font-bold text-red-600">
                  {applications.filter(a => a.status === 4).length}
                </p>
              </div>
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
        </div>

        {/* Applications List - Grouped by Job */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Applications will appear here when candidates apply for jobs</p>
          </div>
        ) : (
          <div className="space-y-6">
            {jobGroups.map((group) => (
              <div key={group.jobId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Job Header */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h3 className="text-2xl font-semibold text-gray-900">{group.jobTitle}</h3>
                  <p className="text-indigo-600 font-medium mt-1">
                    {group.companyName} • {group.jobLocation}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {group.applications.length} application{group.applications.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Applications for this job */}
                <div className="space-y-4">
                  {group.applications.map((application) => (
              <div
                key={application.id}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                        {getStatusText(application.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          {application.candidateName}
                        </div>
                        <button
                          onClick={() => navigate(`/candidate-profile/${application.candidateId}`)}
                          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-xs"
                          title="View Candidate Profile"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Profile
                        </button>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        {application.candidateEmail}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied: {formatDate(application.appliedDate)}
                      </div>
                    </div>

                    {selectedApp?.id === application.id ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">Cover Letter:</h4>
                        <p className="text-gray-700 mb-4 whitespace-pre-line">{application.coverLetter}</p>
                        
                        {application.resumeFileName && (
                          <div className="mb-4 p-3 bg-white rounded border border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-gray-700">
                                <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                <span className="font-medium">Resume:</span>
                                <span className="ml-2 text-gray-600">{application.resumeFileName}</span>
                              </div>
                              <a
                                href={`http://localhost:5276/resumes/${application.resumeFileName}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Admin Notes (Optional)
                          </label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            rows={3}
                            placeholder="Add notes about this application..."
                          />
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleUpdateStatus(application.id, 2)}
                            disabled={updating}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                          >
                            Mark Under Review
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 3)}
                            disabled={updating}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 5)}
                            disabled={updating}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
                          >
                            Mark Interviewed
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 6)}
                            disabled={updating}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Hire
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(application.id, 4)}
                            disabled={updating}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              setSelectedApp(null);
                              setAdminNotes('');
                            }}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedApp(application);
                            setAdminNotes(application.adminNotes || '');
                          }}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                          View Details & Take Action →
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppForInterview(application);
                            const existingInterview = scheduledInterviews[application.id];
                            
                            if (existingInterview) {
                              // Populate form with existing interview data
                              setIsUpdating(true);
                              const interviewDate = new Date(existingInterview.scheduledDate);
                              const dateStr = interviewDate.toISOString().split('T')[0];
                              const hours = interviewDate.getHours();
                              const minutes = interviewDate.getMinutes();
                              const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                              
                              setInterviewData({
                                scheduledDate: dateStr,
                                scheduledTime: timeStr,
                                type: existingInterview.type.toString(),
                                location: existingInterview.location || '',
                                meetingLink: existingInterview.meetingLink || '',
                                phoneNumber: existingInterview.phoneNumber || '',
                                interviewerName: existingInterview.interviewerName || '',
                                interviewerEmail: existingInterview.interviewerEmail || '',
                                notes: existingInterview.notes || ''
                              });
                            } else {
                              setIsUpdating(false);
                            }
                            
                            setShowScheduleModal(true);
                          }}
                          className={`flex items-center gap-1 px-3 py-1 text-white text-sm rounded ${
                            scheduledInterviews[application.id] 
                              ? 'bg-blue-600 hover:bg-blue-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          {scheduledInterviews[application.id] ? 'Update Interview' : 'Schedule Interview'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Schedule Interview Modal */}
        {showScheduleModal && selectedAppForInterview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {isUpdating ? 'Update Interview' : 'Schedule Interview'}
                </h2>
                <p className="text-gray-600 mb-6">
                  Candidate: <span className="font-semibold">{selectedAppForInterview.candidateName}</span> • 
                  Job: <span className="font-semibold">{selectedAppForInterview.jobTitle}</span>
                </p>

                <div className="space-y-4">
                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                      <input
                        type="date"
                        value={interviewData.scheduledDate}
                        onChange={(e) => setInterviewData({ ...interviewData, scheduledDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                      <input
                        type="time"
                        value={interviewData.scheduledTime}
                        onChange={(e) => setInterviewData({ ...interviewData, scheduledTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Interview Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Type *</label>
                    <select
                      value={interviewData.type}
                      onChange={(e) => setInterviewData({ ...interviewData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">Phone Interview</option>
                      <option value="2">Video Interview</option>
                      <option value="3">In-Person Interview</option>
                    </select>
                  </div>

                  {/* Conditional Fields Based on Type */}
                  {interviewData.type === '1' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={interviewData.phoneNumber}
                        onChange={(e) => setInterviewData({ ...interviewData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {interviewData.type === '2' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link *</label>
                      <input
                        type="url"
                        value={interviewData.meetingLink}
                        onChange={(e) => setInterviewData({ ...interviewData, meetingLink: e.target.value })}
                        placeholder="https://zoom.us/j/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {interviewData.type === '3' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                      <input
                        type="text"
                        value={interviewData.location}
                        onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                        placeholder="123 Main St, City, State"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}

                  {/* Interviewer Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Name *</label>
                      <input
                        type="text"
                        value={interviewData.interviewerName}
                        onChange={(e) => setInterviewData({ ...interviewData, interviewerName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Email *</label>
                      <input
                        type="email"
                        value={interviewData.interviewerEmail}
                        onChange={(e) => setInterviewData({ ...interviewData, interviewerEmail: e.target.value })}
                        placeholder="john@company.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea
                      value={interviewData.notes}
                      onChange={(e) => setInterviewData({ ...interviewData, notes: e.target.value })}
                      placeholder="Additional information for the candidate..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleScheduleInterview}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    {isUpdating ? 'Update Interview' : 'Schedule Interview'}
                  </button>
                  <button
                    onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedAppForInterview(null);
                      setInterviewData({
                        scheduledDate: '',
                        scheduledTime: '',
                        type: '2',
                        location: '',
                        meetingLink: '',
                        phoneNumber: '',
                        interviewerName: '',
                        interviewerEmail: '',
                        notes: ''
                      });
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
