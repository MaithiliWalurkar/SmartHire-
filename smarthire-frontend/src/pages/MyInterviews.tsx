import { useState, useEffect } from 'react';
import { interviewService } from '../services/api';
import { Calendar, Clock, MapPin, Video, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Interview {
  id: number;
  applicationId: number;
  jobTitle?: string;
  companyName?: string;
  scheduledDate: string;
  duration: string;
  type: number;
  typeDisplay: string;
  status: number;
  statusDisplay: string;
  location?: string;
  meetingLink?: string;
  phoneNumber?: string;
  interviewerName?: string;
  interviewerEmail?: string;
  notes?: string;
}

const MyInterviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await interviewService.getMyInterviews();
      setInterviews(response.data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInterviewIcon = (type: number) => {
    switch (type) {
      case 1: return <Phone className="w-5 h-5" />;
      case 2: return <Video className="w-5 h-5" />;
      case 3: return <MapPin className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: number, statusDisplay: string) => {
    const badges = {
      1: 'bg-blue-100 text-blue-700', // Scheduled
      2: 'bg-green-100 text-green-700', // Completed
      3: 'bg-red-100 text-red-700', // Cancelled
      4: 'bg-yellow-100 text-yellow-700', // Rescheduled
      5: 'bg-gray-100 text-gray-700', // NoShow
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1: return <Clock className="w-4 h-4" />;
      case 2: return <CheckCircle className="w-4 h-4" />;
      case 3: return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return interview.status === 1 && new Date(interview.scheduledDate) > new Date();
    if (filter === 'completed') return interview.status === 2;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading interviews...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Interviews</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">View and manage your scheduled interviews</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 font-medium ${
                filter === 'all'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Interviews ({interviews.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-3 font-medium ${
                filter === 'upcoming'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming ({interviews.filter(i => i.status === 1 && new Date(i.scheduledDate) > new Date()).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 font-medium ${
                filter === 'completed'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({interviews.filter(i => i.status === 2).length})
            </button>
          </div>
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {filteredInterviews.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Interviews Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' && "You don't have any scheduled interviews yet."}
                {filter === 'upcoming' && "You don't have any upcoming interviews."}
                {filter === 'completed' && "You don't have any completed interviews."}
              </p>
            </div>
          ) : (
            filteredInterviews.map((interview) => (
              <div key={interview.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        {getInterviewIcon(interview.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{interview.jobTitle}</h3>
                        <p className="text-gray-600">{interview.companyName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{formatDate(interview.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{formatTime(interview.scheduledDate)}</span>
                      </div>
                    </div>

                    {/* Interview Details */}
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Interview Type</p>
                          <p className="font-medium text-gray-900 dark:text-white">{interview.typeDisplay}</p>
                        </div>
                        {interview.interviewerName && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Interviewer</p>
                            <p className="font-medium text-gray-900 dark:text-white">{interview.interviewerName}</p>
                          </div>
                        )}
                      </div>

                      {interview.type === 3 && interview.location && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {interview.location}
                          </p>
                        </div>
                      )}

                      {interview.type === 2 && interview.meetingLink && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Meeting Link</p>
                          <a 
                            href={interview.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium text-indigo-600 hover:underline flex items-center gap-2"
                          >
                            <Video className="w-4 h-4" />
                            Join Meeting
                          </a>
                        </div>
                      )}

                      {interview.type === 1 && interview.phoneNumber && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                          <p className="font-medium text-gray-900 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {interview.phoneNumber}
                          </p>
                        </div>
                      )}

                      {interview.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Notes</p>
                          <p className="text-gray-700">{interview.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(interview.status, interview.statusDisplay)}`}>
                      {getStatusIcon(interview.status)}
                      {interview.statusDisplay}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyInterviews;
