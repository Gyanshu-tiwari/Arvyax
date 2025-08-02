import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, Trash2, Plus, FileText, Globe, Clock } from 'lucide-react';
import { sessionsAPI } from '../services/api';
import { useAuth } from '../components/useAuth';

export const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, draft, published
  const { user } = useAuth();
  const [reload, setReload] = useState(false);

  // Fetch user sessions from API
  useEffect(() => {
    const fetchUserSessions = async () => {
      setLoading(true);
      try {
        const data = await sessionsAPI.getUserSessions(user.id);
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch user sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserSessions();
    }
  }, [user, reload]);

  const handlePublish = async (sessionId) => {
    try {
      await sessionsAPI.publishSession(sessionId);
      setReload(r => !r); // Refresh list
    } catch (error) {
      console.error('Failed to publish session:', error);
    }
  };

  const handleDelete = async (sessionId) => {
    try {
      await sessionsAPI.deleteSession(sessionId);
      setReload(r => !r); // Refresh list
    } catch {
      // Optionally show error
    }
  };

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200', icon: FileText },
      published: { color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200', icon: Globe }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.color} border`}>
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Sessions</h1>
            <p className="text-lg text-gray-600">Manage your wellness sessions and drafts</p>
          </div>
          
          <Link
            to="/create-session"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={18} className="mr-2" />
            Create New Session
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2">
              {[
                { key: 'all', label: 'All Sessions', count: sessions.length },
                { key: 'draft', label: 'Drafts', count: sessions.filter(s => s.status === 'draft').length },
                { key: 'published', label: 'Published', count: sessions.filter(s => s.status === 'published').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                    filter === tab.key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs ${
                    filter === tab.key ? 'bg-white/20' : 'bg-gray-100'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
              <FileText className="h-full w-full" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No sessions yet' : `No ${filter} sessions`}
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              {filter === 'all' 
                ? 'Create your first wellness session to get started'
                : `You don't have any ${filter} sessions yet`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/create-session"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus size={18} className="mr-2" />
                Create Your First Session
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <div key={session._id || session.id} className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-semibold text-gray-900">{session.title}</h3>
                      {getStatusBadge(session.status)}
                    </div>
                    <p className="text-gray-600 mb-4 text-lg leading-relaxed">{session.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {session.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock size={16} />
                        <span>Created: {formatDate(session.createdAt)}</span>
                      </div>
                      {session.updatedAt !== session.createdAt && (
                        <div className="flex items-center space-x-2">
                          <span>Updated: {formatDate(session.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-6">
                    <Link
                      to={`/edit-session/${session._id || session.id}`}
                      className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                      title="Edit session"
                    >
                      <Edit size={18} />
                    </Link>
                    
                    <Link
                      to={`/session/${session._id || session.id}`}
                      className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                      title="View session"
                    >
                      <Eye size={18} />
                    </Link>
                    
                    {session.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(session._id || session.id)}
                        className="p-3 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
                        title="Publish session"
                      >
                        <Globe size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(session._id || session.id)}
                      className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                      title="Delete session"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                {session.json_file_url && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText size={16} />
                      <span className="font-medium">JSON File:</span>
                      <a
                        href={session.json_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline hover:no-underline"
                      >
                        {session.json_file_url}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 