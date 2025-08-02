import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Globe, FileText, X, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../components/useAuth.js';

const DURATION_OPTIONS = [
  '15 min',
  '20 min',
  '30 min',
  '45 min',
  '60 min',
  '75 min',
  '90 min',
];

export const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    json_file_url: '',
    duration: '30 min',
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [lastSaved, setLastSaved] = useState(null);
  const [errors, setErrors] = useState({});

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Load session data if editing
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      const loadSession = async () => {
        try {
          const session = await sessionsAPI.getSession(id);
          setFormData({
            title: session.title,
            description: session.description,
            tags: session.tags.join(', '),
            json_file_url: session.json_file_url || '',
            duration: session.duration || '30 min',
          });
        } catch (error) {
          console.error('Failed to load session:', error);
        } finally {
          setLoading(false);
        }
      };
      loadSession();
    }
  }, [id, isEditing]);

  // Only start auto-save if all required fields are filled
  const allFieldsFilled = formData.title.trim() && formData.description.trim() && formData.tags.trim() && formData.duration;

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (!allFieldsFilled) return; // Don't save if not all fields are filled

    setAutoSaveStatus('saving');
    
    try {
      if (isEditing) {
        await sessionsAPI.updateSession(id, formData);
      } else {
        await sessionsAPI.saveDraft(formData, user.id);
      }
      
      setAutoSaveStatus('saved');
      setLastSaved(new Date());
      
      // Clear saved status after 3 seconds
      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 3000);
    } catch (error) {
      setAutoSaveStatus('error');
      console.error('Auto-save failed:', error);
    }
  }, [formData, isEditing, id, user, allFieldsFilled]);

  // Set up auto-save timer
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (allFieldsFilled) {
      const timer = setTimeout(autoSave, 5000); // Auto-save after 5 seconds of inactivity
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, autoSave, allFieldsFilled, autoSaveTimer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      if (isEditing) {
        await sessionsAPI.updateSession(id, formData);
      } else {
        await sessionsAPI.saveDraft(formData, user.id);
      }
      
      navigate('/my-sessions');
    } catch (error) {
      console.error('Save draft failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      if (isEditing) {
        await sessionsAPI.updateSession(id, formData);
        await sessionsAPI.publishSession(id);
      } else {
        const newSession = await sessionsAPI.saveDraft(formData, user.id);
        await sessionsAPI.publishSession(newSession.id);
      }
      
      navigate('/my-sessions');
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const getAutoSaveStatusIcon = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'saved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden pt-16 px-2 sm:px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2">
                {isEditing ? 'Edit Session' : 'Create New Session'}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {isEditing ? 'Update your wellness session' : 'Design and create a new wellness session'}
              </p>
            </div>
            
            <button
              onClick={() => navigate('/my-sessions')}
              className="p-3 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* Auto-save status */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              {getAutoSaveStatusIcon()}
              <span className="font-medium">
                {autoSaveStatus === 'saving' && 'Auto-saving...'}
                {autoSaveStatus === 'saved' && 'Auto-saved'}
                {autoSaveStatus === 'error' && 'Auto-save failed'}
                {autoSaveStatus === 'idle' && 'All changes saved'}
              </span>
              {lastSaved && (
                <span className="text-gray-400">
                  • Last saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-4 sm:p-8">
          <form className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                Session Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter a descriptive title for your session"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg resize-none ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe what participants can expect from this session"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                Tags *
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base sm:text-lg ${
                  errors.tags ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter tags separated by commas (e.g., yoga, morning, energizing)"
              />
              <p className="mt-2 text-sm text-gray-500">
                Use tags to help others discover your session
              </p>
              {errors.tags && (
                <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-lg font-semibold text-gray-700 mb-3">
                Duration *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg ${
                    errors.duration ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select duration</option>
                  {DURATION_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              {errors.duration && (
                <p className="mt-2 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            {/* JSON File URL */}
            <div>
              <label htmlFor="json_file_url" className="block text-lg font-semibold text-gray-700 mb-3">
                JSON File URL
              </label>
              <input
                type="url"
                id="json_file_url"
                name="json_file_url"
                value={formData.json_file_url}
                onChange={handleInputChange}
                className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="https://example.com/session-data.json"
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional: Link to a JSON file containing session data
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="inline-flex items-center px-8 py-4 border border-gray-300 rounded-xl text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <FileText size={20} className="mr-3" />
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
              </div>
              
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Globe size={20} className="mr-3" />
                {saving ? 'Publishing...' : 'Publish Session'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Text */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Tips for creating great sessions:</h3>
          <ul className="text-blue-800 space-y-2 text-lg">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Use clear, descriptive titles that explain what the session offers
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Write detailed descriptions to help participants understand what to expect
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Add relevant tags to make your session discoverable
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Your session will auto-save as you type
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              Save as draft to work on it later, or publish when ready
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 