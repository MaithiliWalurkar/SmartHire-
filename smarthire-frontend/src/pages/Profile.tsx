import { useState, useEffect } from 'react';
import { profileService } from '../services/api';
import { User, MapPin, Briefcase, GraduationCap, Award, Link as LinkIcon, Mail, Phone, Calendar, Edit, Plus, Trash2, Save, X } from 'lucide-react';

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

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [formData, setFormData] = useState<any>({});
  const [newExperience, setNewExperience] = useState<WorkExperience | null>(null);
  const [newEducation, setNewEducation] = useState<Education | null>(null);
  const [newSkill, setNewSkill] = useState<Skill | null>(null);
  const [newProject, setNewProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await profileService.getMyProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    // Validation
    if (!formData.location || formData.location.trim() === '') {
      alert('Location is required');
      return;
    }
    
    if (formData.linkedInUrl && !isValidUrl(formData.linkedInUrl)) {
      alert('Please enter a valid LinkedIn URL');
      return;
    }
    
    if (formData.gitHubUrl && !isValidUrl(formData.gitHubUrl)) {
      alert('Please enter a valid GitHub URL');
      return;
    }
    
    if (formData.portfolioUrl && !isValidUrl(formData.portfolioUrl)) {
      alert('Please enter a valid Portfolio URL');
      return;
    }
    
    if (formData.expectedSalary && formData.expectedSalary < 0) {
      alert('Expected salary must be a positive number');
      return;
    }
    
    try {
      await profileService.updateProfile(formData);
      await fetchProfile();
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddExperience = async () => {
    if (!newExperience) return;
    
    // Validation
    if (!newExperience.jobTitle || newExperience.jobTitle.trim() === '') {
      alert('Job Title is required');
      return;
    }
    
    if (!newExperience.companyName || newExperience.companyName.trim() === '') {
      alert('Company Name is required');
      return;
    }
    
    if (!newExperience.startDate) {
      alert('Start Date is required');
      return;
    }
    
    if (!newExperience.isCurrentJob && !newExperience.endDate) {
      alert('End Date is required (or mark as current job)');
      return;
    }
    
    if (newExperience.endDate && new Date(newExperience.endDate) < new Date(newExperience.startDate)) {
      alert('End Date cannot be before Start Date');
      return;
    }
    
    try {
      await profileService.addWorkExperience(newExperience);
      await fetchProfile();
      setNewExperience(null);
      alert('Work experience added!');
    } catch (error) {
      console.error('Error adding experience:', error);
      alert('Failed to add work experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Delete this work experience?')) return;
    try {
      await profileService.deleteWorkExperience(id);
      await fetchProfile();
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const handleAddEducation = async () => {
    if (!newEducation) return;
    
    // Validation
    if (!newEducation.degree || newEducation.degree.trim() === '') {
      alert('Degree is required');
      return;
    }
    
    if (!newEducation.fieldOfStudy || newEducation.fieldOfStudy.trim() === '') {
      alert('Field of Study is required');
      return;
    }
    
    if (!newEducation.institution || newEducation.institution.trim() === '') {
      alert('Institution is required');
      return;
    }
    
    if (!newEducation.startDate) {
      alert('Start Date is required');
      return;
    }
    
    if (!newEducation.isCurrentlyStudying && !newEducation.endDate) {
      alert('End Date is required (or mark as currently studying)');
      return;
    }
    
    if (newEducation.endDate && new Date(newEducation.endDate) < new Date(newEducation.startDate)) {
      alert('End Date cannot be before Start Date');
      return;
    }
    
    try {
      await profileService.addEducation(newEducation);
      await fetchProfile();
      setNewEducation(null);
      alert('Education added!');
    } catch (error) {
      console.error('Error adding education:', error);
      alert('Failed to add education');
    }
  };

  const handleDeleteEducation = async (id: number) => {
    if (!confirm('Delete this education?')) return;
    try {
      await profileService.deleteEducation(id);
      await fetchProfile();
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill) return;
    
    // Validation
    if (!newSkill.skillName || newSkill.skillName.trim() === '') {
      alert('Skill Name is required');
      return;
    }
    
    if (!newSkill.category) {
      alert('Category is required');
      return;
    }
    
    if (!newSkill.proficiencyLevel) {
      alert('Proficiency Level is required');
      return;
    }
    
    try {
      await profileService.addSkill(newSkill);
      await fetchProfile();
      setNewSkill(null);
      alert('Skill added!');
    } catch (error) {
      console.error('Error adding skill:', error);
      alert('Failed to add skill');
    }
  };

  const handleAddProject = async () => {
    if (!newProject) return;
    
    // Validation
    if (!newProject.projectName || newProject.projectName.trim() === '') {
      alert('Project Name is required');
      return;
    }
    
    try {
      await profileService.addProject(newProject);
      await fetchProfile();
      setNewProject(null);
      alert('Project added!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await profileService.deleteProject(id);
      await fetchProfile();
      alert('Project deleted!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await profileService.deleteSkill(id);
      await fetchProfile();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{profile?.fullName || 'Your Name'}</h1>
                <p className="text-gray-600">{profile?.currentJobTitle || 'Job Title'}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  {profile?.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile?.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {editMode ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              profile?.isAvailableForWork ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {profile?.isAvailableForWork ? '🟢 Available for Work' : '⚪ Not Available'}
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
                {editMode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={formData.bio || ''}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          required
                          placeholder="e.g., New York, NY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                        <input
                          type="text"
                          value={formData.currentJobTitle || ''}
                          onChange={(e) => setFormData({ ...formData, currentJobTitle: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                        <input
                          type="text"
                          value={formData.currentCompany || ''}
                          onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          value={formData.yearsOfExperience || ''}
                          onChange={(e) => setFormData({ ...formData, yearsOfExperience: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                        <input
                          type="url"
                          value={formData.linkedInUrl || ''}
                          onChange={(e) => setFormData({ ...formData, linkedInUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input
                          type="url"
                          value={formData.gitHubUrl || ''}
                          onChange={(e) => setFormData({ ...formData, gitHubUrl: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.isAvailableForWork}
                          onChange={(e) => setFormData({ ...formData, isAvailableForWork: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium text-gray-700">Available for Work</span>
                      </label>
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile?.bio && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {profile?.currentCompany && (
                        <div>
                          <p className="text-sm text-gray-600">Current Company</p>
                          <p className="font-medium">{profile.currentCompany}</p>
                        </div>
                      )}
                      {profile?.yearsOfExperience && (
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-medium">{profile.yearsOfExperience} years</p>
                        </div>
                      )}
                    </div>
                    {(profile?.linkedInUrl || profile?.gitHubUrl) && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Links</h3>
                        <div className="flex gap-4">
                          {profile.linkedInUrl && (
                            <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                              <LinkIcon className="w-4 h-4" />
                              LinkedIn
                            </a>
                          )}
                          {profile.gitHubUrl && (
                            <a href={profile.gitHubUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                              <LinkIcon className="w-4 h-4" />
                              GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Work Experience</h3>
                  <button
                    onClick={() => setNewExperience({
                      jobTitle: '',
                      companyName: '',
                      startDate: '',
                      isCurrentJob: false
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Experience
                  </button>
                </div>

                {newExperience && (
                  <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50 mb-4">
                    <h4 className="font-medium mb-3">New Experience <span className="text-xs text-gray-600">(* Required fields)</span></h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Job Title *</label>
                        <input
                          type="text"
                          placeholder="e.g., Software Engineer"
                          value={newExperience.jobTitle}
                          onChange={(e) => setNewExperience({ ...newExperience, jobTitle: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., Google Inc."
                          value={newExperience.companyName}
                          onChange={(e) => setNewExperience({ ...newExperience, companyName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
                        <input
                          type="date"
                          value={newExperience.startDate}
                          onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date {!newExperience.isCurrentJob && '*'}</label>
                        <input
                          type="date"
                          value={newExperience.endDate || ''}
                          onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled={newExperience.isCurrentJob}
                          required={!newExperience.isCurrentJob}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={newExperience.isCurrentJob}
                        onChange={(e) => setNewExperience({ ...newExperience, isCurrentJob: e.target.checked, endDate: undefined })}
                      />
                      <span className="text-sm">Currently working here</span>
                    </label>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleAddExperience} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save
                      </button>
                      <button onClick={() => setNewExperience(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {profile?.workExperiences?.map((exp) => (
                  <div key={exp.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{exp.jobTitle}</h4>
                        <p className="text-indigo-600">{exp.companyName}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {exp.isCurrentJob ? ' Present' : ` ${new Date(exp.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </p>
                        {exp.description && <p className="text-gray-700 mt-2">{exp.description}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteExperience(exp.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!profile?.workExperiences || profile.workExperiences.length === 0) && !newExperience && (
                  <p className="text-gray-500 text-center py-8">No work experience added yet</p>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Education</h3>
                  <button
                    onClick={() => setNewEducation({
                      degree: '',
                      fieldOfStudy: '',
                      institution: '',
                      startDate: '',
                      isCurrentlyStudying: false
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Education
                  </button>
                </div>

                {newEducation && (
                  <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50 mb-4">
                    <h4 className="font-medium mb-3">New Education <span className="text-xs text-gray-600">(* Required fields)</span></h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Degree *</label>
                        <input
                          type="text"
                          placeholder="e.g., Bachelor of Science"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study *</label>
                        <input
                          type="text"
                          placeholder="e.g., Computer Science"
                          value={newEducation.fieldOfStudy}
                          onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Institution *</label>
                        <input
                          type="text"
                          placeholder="e.g., Stanford University"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date *</label>
                        <input
                          type="date"
                          value={newEducation.startDate}
                          onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date {!newEducation.isCurrentlyStudying && '*'}</label>
                        <input
                          type="date"
                          value={newEducation.endDate || ''}
                          onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled={newEducation.isCurrentlyStudying}
                          required={!newEducation.isCurrentlyStudying}
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 mt-2">
                      <input
                        type="checkbox"
                        checked={newEducation.isCurrentlyStudying}
                        onChange={(e) => setNewEducation({ ...newEducation, isCurrentlyStudying: e.target.checked, endDate: undefined })}
                      />
                      <span className="text-sm">Currently studying</span>
                    </label>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleAddEducation} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save
                      </button>
                      <button onClick={() => setNewEducation(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {profile?.educations?.map((edu) => (
                  <div key={edu.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                        <p className="text-indigo-600">{edu.institution}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(edu.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                          {edu.isCurrentlyStudying ? ' Present' : ` ${new Date(edu.endDate!).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                        </p>
                        {edu.grade && <p className="text-sm text-gray-600 mt-1">Grade: {edu.grade}</p>}
                      </div>
                      <button
                        onClick={() => handleDeleteEducation(edu.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {(!profile?.educations || profile.educations.length === 0) && !newEducation && (
                  <p className="text-gray-500 text-center py-8">No education added yet</p>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Skills</h3>
                  <button
                    onClick={() => setNewSkill({
                      skillName: '',
                      category: 'Technical',
                      proficiencyLevel: 'Intermediate'
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>

                {newSkill && (
                  <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50 mb-4">
                    <h4 className="font-medium mb-3">New Skill <span className="text-xs text-gray-600">(* Required fields)</span></h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Skill Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., React.js"
                          value={newSkill.skillName}
                          onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          value={newSkill.category}
                          onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        >
                          <option value="Technical">Technical</option>
                          <option value="Soft Skills">Soft Skills</option>
                          <option value="Language">Language</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Proficiency *</label>
                        <select
                          value={newSkill.proficiencyLevel}
                          onChange={(e) => setNewSkill({ ...newSkill, proficiencyLevel: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Years of Experience</label>
                        <input
                          type="number"
                          placeholder="e.g., 3"
                          min="0"
                          max="50"
                          value={newSkill.yearsOfExperience || ''}
                          onChange={(e) => setNewSkill({ ...newSkill, yearsOfExperience: e.target.value ? parseInt(e.target.value) : undefined })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleAddSkill} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save
                      </button>
                      <button onClick={() => setNewSkill(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {profile?.skills?.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-full">
                      <span className="font-medium">{skill.skillName}</span>
                      <span className="text-xs text-gray-600">
                        ({skill.proficiencyLevel}
                        {skill.yearsOfExperience && ` • ${skill.yearsOfExperience} yr${skill.yearsOfExperience > 1 ? 's' : ''}`})
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {(!profile?.skills || profile.skills.length === 0) && !newSkill && (
                  <p className="text-gray-500 text-center py-8">No skills added yet</p>
                )}
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Projects</h3>
                  <button
                    onClick={() => setNewProject({
                      projectName: '',
                      isOngoing: false
                    })}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {newProject && (
                  <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50 mb-4">
                    <h4 className="font-medium mb-3">New Project <span className="text-xs text-gray-600">(* Required fields)</span></h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Project Name *</label>
                        <input
                          type="text"
                          placeholder="e.g., E-commerce Website"
                          value={newProject.projectName}
                          onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                        <input
                          type="text"
                          placeholder="e.g., Full Stack Developer"
                          value={newProject.role || ''}
                          onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        placeholder="Describe the project..."
                        value={newProject.description || ''}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Technologies Used</label>
                        <input
                          type="text"
                          placeholder="e.g., React, Node.js, MongoDB"
                          value={newProject.technologiesUsed || ''}
                          onChange={(e) => setNewProject({ ...newProject, technologiesUsed: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Project URL</label>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={newProject.projectUrl || ''}
                          onChange={(e) => setNewProject({ ...newProject, projectUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={newProject.startDate || ''}
                          onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={newProject.endDate || ''}
                          onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                          disabled={newProject.isOngoing}
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newProject.isOngoing}
                            onChange={(e) => setNewProject({ ...newProject, isOngoing: e.target.checked, endDate: e.target.checked ? undefined : newProject.endDate })}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                          />
                          <span className="text-sm">Ongoing</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={handleAddProject} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        Save
                      </button>
                      <button onClick={() => setNewProject(null)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {profile?.projects?.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-lg">{project.projectName}</h4>
                          {project.role && <p className="text-sm text-gray-600">{project.role}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteProject(project.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {project.description && <p className="text-gray-700 mb-2">{project.description}</p>}
                      {project.technologiesUsed && (
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-600">Technologies: </span>
                          <span className="text-sm text-gray-700">{project.technologiesUsed}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {project.startDate && (
                          <span>{new Date(project.startDate).toLocaleDateString()} - {project.isOngoing ? 'Present' : project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</span>
                        )}
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                            <LinkIcon className="w-3 h-3" />
                            View Project
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {(!profile?.projects || profile.projects.length === 0) && !newProject && (
                  <p className="text-gray-500 text-center py-8">No projects added yet</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
