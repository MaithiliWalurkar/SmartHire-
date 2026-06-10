import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/api';
import { Briefcase, Users, FileText, Clock, CheckCircle, TrendingUp, Calendar, Award } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface Stats {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalCandidates: number;
  pendingApplications: number;
  shortlistedApplications: number;
}

interface Analytics {
  statusBreakdown: {
    Submitted: number;
    UnderReview: number;
    Shortlisted: number;
    Rejected: number;
    Interviewed: number;
    Hired: number;
  };
  topJobs: Array<{
    jobId: number;
    jobTitle: string;
    companyName: string;
    applicationCount: number;
  }>;
  applicationsTrend: Array<{
    date: string;
    count: number;
  }>;
  recentApplications: Array<{
    id: number;
    jobTitle: string;
    companyName: string;
    candidateName: string;
    status: string;
    appliedDate: string;
  }>;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getAnalytics()
      ]);
      console.log('Stats:', statsResponse.data);
      console.log('Analytics:', analyticsResponse.data);
      setStats(statsResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Jobs', value: stats?.totalJobs || 0, icon: Briefcase, color: 'bg-blue-500', change: '+12%' },
    { title: 'Active Jobs', value: stats?.activeJobs || 0, icon: Briefcase, color: 'bg-green-500', change: '+8%' },
    { title: 'Total Applications', value: stats?.totalApplications || 0, icon: FileText, color: 'bg-purple-500', change: '+23%' },
    { title: 'Total Candidates', value: stats?.totalCandidates || 0, icon: Users, color: 'bg-orange-500', change: '+15%' },
    { title: 'Pending Review', value: stats?.pendingApplications || 0, icon: Clock, color: 'bg-yellow-500', change: '-5%' },
    { title: 'Shortlisted', value: stats?.shortlistedApplications || 0, icon: CheckCircle, color: 'bg-indigo-500', change: '+18%' },
  ];

  // Prepare pie chart data
  const pieData = analytics?.statusBreakdown ? [
    { name: 'Submitted', value: analytics.statusBreakdown.Submitted, color: '#3B82F6' },
    { name: 'Under Review', value: analytics.statusBreakdown.UnderReview, color: '#F59E0B' },
    { name: 'Shortlisted', value: analytics.statusBreakdown.Shortlisted, color: '#10B981' },
    { name: 'Rejected', value: analytics.statusBreakdown.Rejected, color: '#EF4444' },
    { name: 'Interviewed', value: analytics.statusBreakdown.Interviewed, color: '#8B5CF6' },
    { name: 'Hired', value: analytics.statusBreakdown.Hired, color: '#059669' },
  ] : [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'UnderReview': return 'bg-yellow-100 text-yellow-700';
      case 'Shortlisted': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Interviewed': return 'bg-purple-100 text-purple-700';
      case 'Hired': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive overview of your recruitment system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Applications Trend Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Applications Trend (Last 7 Days)</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics?.applicationsTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} name="Applications" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Application Status Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Award className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Application Status Distribution</h2>
            </div>
            {pieData.length > 0 && pieData.some(d => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData.filter(d => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                  <p>No application data available yet</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Top Jobs and Recent Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Jobs by Applications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Top Jobs by Applications</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics?.topJobs || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jobTitle" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applicationCount" fill="#6366F1" name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
            </div>
            <div className="space-y-3">
              {analytics?.recentApplications && analytics.recentApplications.length > 0 ? (
                analytics.recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{app.candidateName}</p>
                      <p className="text-xs text-gray-600">{app.jobTitle} • {app.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(app.appliedDate)}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-[280px] text-gray-500">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                    <p>No recent applications</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/create-job')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              Post New Job
            </button>
            <button
              onClick={() => navigate('/manage-applications')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
            >
              <FileText className="w-5 h-5" />
              View Applications
            </button>
            <button
              onClick={() => navigate('/manage-jobs')}
              className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Briefcase className="w-5 h-5" />
              Manage Jobs
            </button>
            <button
              onClick={() => navigate('/jobs')}
              className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Users className="w-5 h-5" />
              View All Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
