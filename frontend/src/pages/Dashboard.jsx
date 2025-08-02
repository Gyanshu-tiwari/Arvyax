import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Clock, User, Tag } from 'lucide-react';
import { sessionsAPI } from '../services/api';

export const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [likeLoading, setLikeLoading] = useState({});


  // Fetch sessions from API
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const data = await sessionsAPI.getPublicSessions();
      setSessions(data);
    } catch {
      // Error fetching sessions
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (sessionId) => {
    setLikeLoading((prev) => ({ ...prev, [sessionId]: true }));
    try {
      const updatedSession = await sessionsAPI.likeSession(sessionId);
      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s._id === sessionId ? { ...s, likes: updatedSession.likes } : s
        )
      );
    } catch {
      // Optionally show error
    } finally {
      setLikeLoading((prev) => ({ ...prev, [sessionId]: false }));
    }
  };

  const allTags = ['all', ...new Set(sessions.flatMap(session => session.tags))];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || session.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wellness sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header with background image */}
        <div className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/80 to-indigo-900/80"></div>
          </div>
          <div className="relative z-10 px-4 sm:px-8 py-10 md:py-16 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 md:mb-4">
              Discover Wellness Sessions
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Explore and join wellness sessions created by our community of health and wellness experts
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/80 backdrop-blur-sm"
            />
          </div>
          
          <div className="relative min-w-[180px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white/80 backdrop-blur-sm"
            >
              {allTags.map(tag => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All Categories' : tag.charAt(0).toUpperCase() + tag.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="text-center py-10 md:py-16">
            <div className="mx-auto h-32 w-32 text-gray-300 mb-6">
              <Search className="h-full w-full" />
            </div>
            <h3 className="text-2xl font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredSessions.map((session) => (
              <div key={session._id || session.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col">
                <div className="aspect-video bg-gray-200 relative overflow-hidden">
                  <img
                    src={session.image || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop'}
                    alt={session.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-medium text-gray-700 flex items-center space-x-1 shadow-lg">
                    <Clock size={14} />
                    <span>{session.duration || '30 min'}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                <div className="p-4 md:p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 line-clamp-2 leading-tight">
                      {session.title}
                    </h3>
                    <button
                      className={`text-gray-400 hover:text-red-500 transition-colors p-1 ${likeLoading[session._id || session.id] ? 'opacity-50 pointer-events-none' : ''}`}
                      onClick={() => handleLike(session._id || session.id)}
                      disabled={likeLoading[session._id || session.id]}
                      title="Like this session"
                    >
                      <Heart size={20} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 h-12 line-clamp-2 leading-relaxed">
                    {session.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <User size={14} />
                      <span>{session.user?.name || session.user?.email || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Heart size={14} />
                      <span>{session.likes?.length || 0}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200"
                      >
                        <Tag size={10} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    to={`/session/${session._id || session.id}`}
                    className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 md:py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-base md:text-lg"
                  >
                    Join Session
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 