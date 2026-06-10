import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { profileService } from '../services/api';
import { User, MapPin, Mail, Phone, Briefcase, GraduationCap, Award, Link as LinkIcon, Calendar, ExternalLink } from 'lucide-react';

interface Profile {
  id: number;
  userId: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  location?: string;
  dateOfBirth?: string;
  linkedInUrl?: string;
  gitHubUrl?: string;
  portfolioUrl?: string;
  twitterUrl?: string;
  currentJobTitle?: string;
  currentCompany?: string;
  yearsOfExperience?: number;
  preferredJobType?: string;
  preferredLocation?: string;
  expectedSalary?: number;
  isAvailableForWork: boolean;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: Skill[];
  projects?: Project[];
}

interface WorkExperience {
  id?: number;
  jobTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentJob: boolean;
  description?: string;
  achievements?: string;
}

interface Education {
  id?: number;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
}

interface Skill {
  id?: number;
  skillName: string;
  category?: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
}

interface Project {
  id?: number;
  projectName: string;
  description?: string;
  role?: string;
  technologiesUsed?: string;
  projectUrl?: string;
  startDate?: string;
  endDate?: string;
  isOngoing: boolean;
}

const CandidateProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getProfileByUserId(parseInt(userId!));
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">This candidate profile could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.fullName}</h1>
              {profile.currentJobTitle && (
                <p className="text-xl text-gray-600 mb-3">{profile.currentJobTitle}</p>
              )}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                )}
                {profile.phoneNumber && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {profile.phoneNumber}
                  </div>
                )}
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              profile.isAvailableForWork ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {profile.isAvailableForWork ? '🟢 Available for Work' : '⚪ Not Available'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {['overview', 'experience', 'education', 'skills', 'projects'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {profile.bio && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About</h3>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.currentCompany && (
                    <div>
                      <p className="text-sm text-gray-600">Current Company</p>
                      <p className="font-medium">{profile.currentCompany}</p>
                    </div>
                  )}
                  {profile.yearsOfExperience && (
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium">{profile.yearsOfExperience} years</p>
                    </div>
                  )}
                  {profile.preferredJobType && (
                    <div>
                      <p className="text-sm text-gray-600">Preferred Job Type</p>
                      <p className="font-medium">{profile.preferredJobType}</p>
                    </div>
                  )}
                  {profile.expectedSalary && (
                    <div>
                      <p className="text-sm text-gray-600">Expected Salary</p>
                      <p className="font-medium">${profile.expectedSalary.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {(profile.linkedInUrl || profile.gitHubUrl || profile.portfolioUrl) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {profile.linkedInUrl && (
                        <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100">
                          <LinkIcon className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      {profile.gitHubUrl && (
                        <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900">
                          <LinkIcon className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                          <LinkIcon className="w-4 h-4" />
                          Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
                {profile.workExperiences && profile.workExperiences.length > 0 ? (
                  profile.workExperiences.map((exp) => (
                    <div key={exp.id} className="border-l-4 border-indigo-600 pl-4 py-2">
                      <h4 className="font-semibold text-lg">{exp.jobTitle}</h4>
                      <p className="text-indigo-600 font-medium">{exp.companyName}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrentJob ? 'Present' : new Date(exp.endDate!).toLocaleDateString()}
                      </p>
                      {exp.description && <p className="text-gray-700">{exp.description}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No work experience added</p>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Education</h3>
                {profile.educations && profile.educations.length > 0 ? (
                  profile.educations.map((edu) => (
                    <div key={edu.id} className="border-l-4 border-green-600 pl-4 py-2">
                      <h4 className="font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h4>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(edu.startDate).toLocaleDateString()} - {edu.isCurrentlyStudying ? 'Present' : new Date(edu.endDate!).toLocaleDateString()}
                      </p>
                      {edu.grade && <p className="text-sm text-gray-600">Grade: {edu.grade}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No education added</p>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill) => (
                      <div key={skill.id} className="px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
                        <span className="font-medium">{skill.skillName}</span>
                        <span className="text-xs text-gray-600 ml-2">
                          ({skill.proficiencyLevel}
                          {skill.yearsOfExperience && ` • ${skill.yearsOfExperience} yr${skill.yearsOfExperience > 1 ? 's' : ''}`})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8 w-full">No skills added</p>
                  )}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Projects</h3>
                {profile.projects && profile.projects.length > 0 ? (
                  profile.projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-lg">{project.projectName}</h4>
                      {project.role && <p className="text-sm text-gray-600">{project.role}</p>}
                      {project.description && <p className="text-gray-700 mt-2">{project.description}</p>}
                      {project.technologiesUsed && (
                        <div className="mt-2">
                          <span className="text-sm font-medium text-gray-600">Technologies: </span>
                          <span className="text-sm text-gray-700">{project.technologiesUsed}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                        {project.startDate && (
                          <span>{new Date(project.startDate).toLocaleDateString()} - {project.isOngoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
                        )}
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No projects added</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
