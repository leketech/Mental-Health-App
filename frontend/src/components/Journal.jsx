import React, { useState, useEffect } from 'react';
import api from '../utils/auth';

export default function Journal() {
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(false);

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
        // Update existing journal
        await api.put(`/api/journals/${editingJournal.id}`, formData);
        alert('Journal updated successfully!');
      } else {
        // Create new journal
        await api.post('/api/journals', formData);
        alert('Journal created successfully!');
      }
      
      setFormData({ title: '', body: '' });
      setShowForm(false);
      setEditingJournal(null);
      fetchJournals();
    } catch (err) {
      console.error('Failed to save journal:', err);
      alert('Failed to save journal. Please try again.');
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
      alert('Journal deleted successfully!');
      fetchJournals();
    } catch (err) {
      console.error('Failed to delete journal:', err);
      alert('Failed to delete journal. Please try again.');
    }
  };

  const handleCancel = () => {
    setFormData({ title: '', body: '' });
    setShowForm(false);
    setEditingJournal(null);
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>📖 Journal Entries</h2>
        <button 
          onClick={() => setShowForm(true)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4a6fa5', 
            color: 'white', 
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
          New Entry
        </button>
      </div>

      {showForm && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: 20, 
          borderRadius: 5, 
          marginBottom: 20 
        }}>
          <h3>{editingJournal ? 'Edit Journal Entry' : 'New Journal Entry'}</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Entry Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ 
                width: '100%', 
                padding: 10, 
                marginBottom: 10, 
                border: '1px solid #ddd',
                borderRadius: 3
              }}
            />
            <textarea
              placeholder="Write your thoughts..."
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              required
              rows="6"
              style={{ 
                width: '100%', 
                padding: 10, 
                marginBottom: 10, 
                border: '1px solid #ddd',
                borderRadius: 3,
                resize: 'vertical'
              }}
            />
            <div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#28a745', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: 3,
                  marginRight: 10,
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Saving...' : (editingJournal ? 'Update' : 'Save')}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: 3,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div>
        {journals.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            No journal entries yet. Create your first entry!
          </p>
        ) : (
          journals.map(journal => (
            <div 
              key={journal.id} 
              style={{ 
                backgroundColor: 'white', 
                border: '1px solid #ddd', 
                borderRadius: 5, 
                padding: 15, 
                marginBottom: 15,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>{journal.title}</h4>
                  <p style={{ margin: '0 0 10px 0', lineHeight: 1.5, color: '#555' }}>
                    {journal.body}
                  </p>
                  <small style={{ color: '#888' }}>
                    {new Date(journal.created_at).toLocaleDateString()} at {new Date(journal.created_at).toLocaleTimeString()}
                  </small>
                </div>
                <div style={{ marginLeft: 15 }}>
                  <button 
                    onClick={() => handleEdit(journal)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#ffc107', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: 3,
                      marginRight: 5,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(journal.id)}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: 3,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
