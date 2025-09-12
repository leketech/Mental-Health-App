import React, { useState, useEffect } from 'react';
import api from '../utils/auth';
import { useTheme } from '../contexts/ThemeContext';

export default function Journal() {
  const { classes } = useTheme();
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [expandedEntries, setExpandedEntries] = useState(new Set());

  const fetchJournals = async () => {
    try {
      const res = await api.get('/api/journals');
      setJournals(res.data || []);
    } catch (err) {
      console.error('Failed to fetch journals:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    setLoading(true);
    try {
      if (editingJournal) {
        await api.put(`/api/journals/${editingJournal.id}`, formData);
      } else {
        await api.post('/api/journals', formData);
      }
      
      setFormData({ title: '', body: '' });
      setShowForm(false);
      setEditingJournal(null);
      fetchJournals();
    } catch (err) {
      console.error('Failed to save journal:', err);
    }
    setLoading(false);
  };

  const handleEdit = (journal) => {
    setEditingJournal(journal);
    setFormData({ title: journal.title, body: journal.body });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;

    try {
      await api.delete(`/api/journals/${id}`);
      fetchJournals();
    } catch (err) {
      console.error('Failed to delete journal:', err);
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', body: '' });
    setShowForm(false);
    setEditingJournal(null);
  };

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEntries(newExpanded);
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${classes.transition}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl">
              📝
            </div>
            <h1 className={`text-3xl font-bold ${classes.textPrimary}`}>Journal Entries</h1>
          </div>
          <p className={`text-lg ${classes.textSecondary}`}>
            Express your thoughts and reflect on your journey.
          </p>
        </div>
        
        <button 
          onClick={() => setShowForm(true)}
          className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold ${classes.button} ${classes.transition} hover:shadow-lg transform hover:scale-105`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Entry
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${classes.card} w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${classes.textPrimary}`}>
                  {editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}
                </h2>
                <button
                  onClick={handleCancel}
                  className={`p-2 rounded-lg ${classes.hover} ${classes.transition}`}
                >
                  <svg className={`w-6 h-6 ${classes.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium ${classes.textSecondary} mb-2`}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Give your entry a title..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-3 rounded-lg ${classes.input} ${classes.transition}`}
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${classes.textSecondary} mb-2`}>
                    Your thoughts
                  </label>
                  <textarea
                    placeholder="What's on your mind? Write freely about your thoughts, feelings, and experiences..."
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    required
                    rows={8}
                    className={`w-full px-4 py-3 rounded-lg resize-none ${classes.input} ${classes.transition}`}
                  />
                </div>
                
                <div className="flex items-center justify-end space-x-4">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className={`px-6 py-3 rounded-lg font-medium ${classes.textSecondary} ${classes.hover} ${classes.transition}`}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !formData.title.trim() || !formData.body.trim()}
                    className={`px-6 py-3 rounded-lg font-semibold ${classes.transition} ${
                      loading || !formData.title.trim() || !formData.body.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : `${classes.button} hover:shadow-lg transform hover:scale-105`
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Saving...</span>
                      </div>
                    ) : (
                      editingJournal ? 'Update Entry' : 'Save Entry'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-6">
        {journals.length === 0 ? (
          <div className={`${classes.card} p-12 text-center`}>
            <div className="text-6xl mb-4">📚</div>
            <h3 className={`text-xl font-semibold ${classes.textPrimary} mb-2`}>No journal entries yet</h3>
            <p className={`${classes.textSecondary} mb-6`}>Start your journaling journey by creating your first entry!</p>
            <button 
              onClick={() => setShowForm(true)}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold ${classes.button} ${classes.transition} hover:shadow-lg transform hover:scale-105`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create First Entry
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {journals.map(journal => {
              const isExpanded = expandedEntries.has(journal.id);
              const shouldShowReadMore = journal.body.length > 150;
              
              return (
                <div 
                  key={journal.id} 
                  className={`${classes.card} p-6 ${classes.hover} ${classes.transition} hover:shadow-lg`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold ${classes.textPrimary} mb-2`}>
                        {journal.title}
                      </h3>
                      <time className={`text-sm ${classes.textMuted} flex items-center`}>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(journal.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button 
                        onClick={() => handleEdit(journal)}
                        className={`p-2 rounded-lg ${classes.hover} ${classes.transition} group`}
                        title="Edit entry"
                      >
                        <svg className={`w-4 h-4 ${classes.textMuted} group-hover:text-blue-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(journal.id)}
                        className={`p-2 rounded-lg ${classes.hover} ${classes.transition} group`}
                        title="Delete entry"
                      >
                        <svg className={`w-4 h-4 ${classes.textMuted} group-hover:text-red-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className={`${classes.textSecondary} leading-relaxed`}>
                    <p className="whitespace-pre-wrap">
                      {isExpanded ? journal.body : truncateText(journal.body)}
                    </p>
                    
                    {shouldShowReadMore && (
                      <button
                        onClick={() => toggleExpanded(journal.id)}
                        className={`mt-3 text-sm font-medium ${classes.accentPrimary} ${classes.hover} rounded px-2 py-1 ${classes.transition}`}
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
