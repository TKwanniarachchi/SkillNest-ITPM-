import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const TYPE_ICONS = { pdf: '📄', link: '🔗', notes: '📝', video: '🎥', other: '📁' };
const TYPE_COLORS = {
  pdf: { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  link: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  notes: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  video: { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  other: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};
const SUBJECTS = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics', 'Machine Learning'];
const SEMESTERS = ['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'];

function StarRating({ value, onRate, size = '1rem' }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '0.15rem' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} onClick={() => onRate && onRate(s)}
          onMouseEnter={() => onRate && setHover(s)} onMouseLeave={() => setHover(0)}
          style={{
            fontSize: size, cursor: onRate ? 'pointer' : 'default',
            color: s <= (hover || value) ? '#f59e0b' : '#e2e8f0',
            transition: 'color 0.15s ease',
            textShadow: s <= (hover || value) ? '0 1px 4px rgba(245,158,11,0.3)' : 'none'
          }}>★</span>
      ))}
    </div>
  );
}

function AIModal({ resource, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(resource.aiProcessed ? { aiSummary: resource.aiSummary, keyPoints: resource.keyPoints } : null);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/resources/${resource._id}/ai-summary`);
      setResult(res.data);
    } catch (e) { alert('AI processing failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '2rem',
        width: '100%', maxWidth: '560px', boxShadow: '0 32px 64px rgba(0,0,0,0.22)',
        animation: 'slideUp 0.3s ease'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          borderRadius: '14px', padding: '1.5rem', textAlign: 'center', marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🤖</div>
          <h2 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>AI Smart Summary</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', marginTop: '0.3rem', marginBottom: 0 }}>
            {resource.title}
          </p>
        </div>

        {!result ? (
          <>
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px',
              padding: '1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '1.25rem' }}>💡</span>
              <p style={{ fontSize: '0.83rem', color: '#1d4ed8', margin: 0, lineHeight: 1.6 }}>
                Our AI will instantly generate a concise summary and key study points from this resource to supercharge your learning.
              </p>
            </div>
            <button style={{
              width: '100%', padding: '0.85rem',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
              color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.9rem',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', transition: 'all 0.2s',
              boxShadow: loading ? 'none' : '0 4px 14px rgba(59,130,246,0.35)'
            }} onClick={generate} disabled={loading}>
              {loading ? '⏳ Generating Summary...' : '✨ Generate AI Summary'}
            </button>
          </>
        ) : (
          <div>
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
              border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{
                  background: '#dbeafe', color: '#1d4ed8', padding: '0.25rem 0.6rem',
                  borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600
                }}>📋 Summary</span>
              </div>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.7, color: '#334155', margin: 0 }}>{result.aiSummary}</p>
            </div>
            <div style={{
              background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{
                  background: '#dcfce7', color: '#15803d', padding: '0.25rem 0.6rem',
                  borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600
                }}>🔑 Key Points</span>
              </div>
              <ul style={{ paddingLeft: '1rem', margin: 0 }}>
                {result.keyPoints?.map((p, i) => (
                  <li key={i} style={{ fontSize: '0.83rem', marginBottom: '0.5rem', lineHeight: 1.6, color: '#166534' }}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button style={{
          width: '100%', marginTop: '1.25rem', padding: '0.75rem',
          background: 'transparent', color: '#64748b',
          border: '1.5px solid #e2e8f0', borderRadius: '12px',
          fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          transition: 'all 0.2s'
        }} onClick={onClose} onMouseEnter={e => { e.target.style.background = '#f8fafc'; }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState('');
  const [showAI, setShowAI] = useState(null);
  const [bookmarked, setBookmarked] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (subject) params.set('subject', subject);
      if (semester) params.set('semester', semester);
      if (type) params.set('type', type);
      const res = await axios.get(`/api/resources?${params}`);
      setResources(res.data);
      const bm = {};
      res.data.forEach(r => { bm[r._id] = r.bookmarks?.includes(user?._id); });
      setBookmarked(bm);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResources(); }, [subject, semester, type]);

  const handleBookmark = async (id) => {
    const res = await axios.post(`/api/resources/${id}/bookmark`);
    setBookmarked(b => ({ ...b, [id]: res.data.bookmarked }));
  };

  const handleRate = async (id, rating) => {
    await axios.post(`/api/resources/${id}/rate`, { rating });
    fetchResources();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    await axios.delete(`/api/resources/${id}`);
    fetchResources();
  };

  const typeStyle = (t) => TYPE_COLORS[t] || TYPE_COLORS.other;

  return (
    <Layout>
      {showAI && <AIModal resource={showAI} onClose={() => { setShowAI(null); fetchResources(); }} />}

      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563eb 60%, #3B82F6 100%)',
        borderRadius: '20px', padding: '2rem 2rem 1.75rem',
        marginBottom: '1.75rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '60px', width: '150px', height: '150px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '2rem' }}>📚</span>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0 }}>Study Resources</h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem', margin: 0, marginLeft: '2.75rem' }}>
              Browse, upload and share academic materials with your peers.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* View Toggle */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.15)',
              borderRadius: '10px', padding: '3px', gap: '2px'
            }}>
              {['grid', 'list'].map(mode => (
                <button key={mode} onClick={() => setViewMode(mode)} style={{
                  padding: '0.4rem 0.75rem', borderRadius: '8px', border: 'none',
                  background: viewMode === mode ? 'white' : 'transparent',
                  color: viewMode === mode ? '#1E3A8A' : 'rgba(255,255,255,0.8)',
                  fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                  transition: 'all 0.2s'
                }}>
                  {mode === 'grid' ? '⊞ Grid' : '☰ List'}
                </button>
              ))}
            </div>
            {(user?.role === 'tutor' || user?.role === 'admin') && (
              <button onClick={() => navigate('/resources/upload')} style={{
                padding: '0.65rem 1.25rem',
                background: 'white', color: '#1E3A8A',
                border: 'none', borderRadius: '12px', fontSize: '0.875rem',
                fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s'
              }}>
                ⬆️ Upload Resource
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
            <span style={{
              position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '1rem', pointerEvents: 'none'
            }}>🔍</span>
            <input style={{
              width: '100%', paddingLeft: '2.5rem', paddingRight: '0.9rem',
              paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none',
              transition: 'border-color 0.2s', background: '#f8fafc'
            }} placeholder="Search resources..."
              value={search} onChange={e => setSearch(e.target.value)}
              onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.background = 'white'; }}
              onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              onKeyDown={e => e.key === 'Enter' && fetchResources()} />
          </div>

          {[
            { value: subject, onChange: setSubject, options: SUBJECTS, placeholder: 'All Subjects' },
            { value: semester, onChange: setSemester, options: SEMESTERS, placeholder: 'All Semesters' },
            { value: type, onChange: setType, options: Object.keys(TYPE_ICONS), placeholder: 'All Types' },
          ].map((sel, i) => (
            <select key={i} style={{
              flex: 1, minWidth: 130, padding: '0.65rem 0.9rem',
              border: '1.5px solid #e2e8f0', borderRadius: '10px',
              fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none',
              background: '#f8fafc', cursor: 'pointer', transition: 'border-color 0.2s',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center'
            }} value={sel.value} onChange={e => sel.onChange(e.target.value)}>
              <option value="">{sel.placeholder}</option>
              {sel.options.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}

          <button onClick={fetchResources} style={{
            padding: '0.65rem 1.5rem',
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            color: 'white', border: 'none', borderRadius: '10px',
            fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit', whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)', transition: 'all 0.2s'
          }}>
            Search
          </button>
        </div>

        {/* Active Filters */}
        {(subject || semester || type) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Active filters:</span>
            {subject && <FilterChip label={subject} onRemove={() => setSubject('')} />}
            {semester && <FilterChip label={semester} onRemove={() => setSemester('')} />}
            {type && <FilterChip label={type.toUpperCase()} onRemove={() => setType('')} />}
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '1rem', padding: '0 0.25rem'
        }}>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>{resources.length}</span> resource{resources.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem', gap: '1rem' }}>
          <div style={{
            width: '44px', height: '44px', border: '3px solid #e2e8f0',
            borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '5rem 2rem',
          textAlign: 'center', border: '1px solid #f1f5f9'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <h3 style={{ color: '#334155', fontWeight: 600, marginBottom: '0.5rem' }}>No resources found</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Try adjusting your filters or search terms.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {resources.map(r => (
            <ResourceCard key={r._id} r={r} user={user} bookmarked={bookmarked}
              onBookmark={handleBookmark} onRate={handleRate}
              onDelete={handleDelete} onAI={setShowAI} navigate={navigate}
              typeStyle={typeStyle} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {resources.map(r => (
            <ResourceListItem key={r._id} r={r} user={user} bookmarked={bookmarked}
              onBookmark={handleBookmark} onRate={handleRate}
              onDelete={handleDelete} onAI={setShowAI} navigate={navigate}
              typeStyle={typeStyle} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .resource-grid-card { animation: fadeIn 0.3s ease forwards; transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .resource-grid-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .resource-list-item { transition: all 0.2s ease; }
        .resource-list-item:hover { background: #f8fafc !important; }
        .action-btn { transition: all 0.15s ease; }
        .action-btn:hover { transform: translateY(-1px); }
      `}</style>
    </Layout>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      background: '#dbeafe', color: '#1d4ed8', borderRadius: '20px',
      padding: '0.2rem 0.6rem 0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 500
    }}>
      {label}
      <button onClick={onRemove} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#3b82f6', fontSize: '1rem', lineHeight: 1, padding: '0 0.1rem',
        display: 'flex', alignItems: 'center'
      }}>×</button>
    </span>
  );
}

function ResourceCard({ r, user, bookmarked, onBookmark, onRate, onDelete, onAI, navigate, typeStyle }) {
  const ts = typeStyle(r.resourceType);
  return (
    <div className="resource-grid-card" style={{
      background: 'white', borderRadius: '16px', padding: '1.5rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9',
      display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden'
    }}>
      {/* Top accent line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
        background: 'linear-gradient(90deg, #1E3A8A, #3B82F6)'
      }} />

      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem'
        }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: ts.bg, border: `1px solid ${ts.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
          }}>
            {TYPE_ICONS[r.resourceType] || '📁'}
          </div>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, color: ts.color,
            background: ts.bg, border: `1px solid ${ts.border}`,
            padding: '0.2rem 0.55rem', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.3px'
          }}>
            {r.resourceType}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600,
            padding: '0.2rem 0.6rem', borderRadius: '20px',
            background: r.status === 'approved' ? '#d1fae5' : r.status === 'pending' ? '#fef3c7' : '#fee2e2',
            color: r.status === 'approved' ? '#065f46' : r.status === 'pending' ? '#92400e' : '#991b1b',
          }}>
            {r.status === 'approved' ? '✓ Approved' : r.status === 'pending' ? '⏳ Pending' : '✗ Rejected'}
          </span>
          <button onClick={() => onBookmark(r._id)} style={{
            background: bookmarked[r._id] ? '#fef3c7' : '#f8fafc',
            border: `1px solid ${bookmarked[r._id] ? '#fcd34d' : '#e2e8f0'}`,
            borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s'
          }}>
            {bookmarked[r._id] ? '🔖' : '📌'}
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.4rem', color: '#1e293b', lineHeight: 1.4 }}>
        {r.title}
      </h3>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.9rem', flexGrow: 1, lineHeight: 1.6 }}>
        {r.description?.slice(0, 90)}{r.description?.length > 90 ? '...' : ''}
      </p>

      {/* Meta info */}
      <div style={{
        display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap'
      }}>
        <span style={{
          fontSize: '0.72rem', color: '#475569', background: '#f1f5f9',
          padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 500
        }}>📚 {r.subject}</span>
        <span style={{
          fontSize: '0.72rem', color: '#475569', background: '#f1f5f9',
          padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 500
        }}>📅 {r.semester}</span>
      </div>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <StarRating value={Math.round(r.averageRating || 0)} onRate={(val) => onRate(r._id, val)} size="0.9rem" />
        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
          {r.averageRating?.toFixed(1) || '—'} ({r.ratings?.length || 0})
        </span>
      </div>

      {/* Tags */}
      {r.tags?.length > 0 && (
        <div style={{ marginBottom: '0.9rem', display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
          {r.tags.map(t => (
            <span key={t} style={{
              fontSize: '0.68rem', background: '#eff6ff', color: '#2563eb',
              padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 500, border: '1px solid #bfdbfe'
            }}>{t}</span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div style={{ height: '1px', background: '#f1f5f9', margin: '0.5rem 0 1rem' }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
        <button className="action-btn" onClick={() => onAI(r)} style={{
          flex: 1, padding: '0.55rem 0.75rem',
          background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
          color: 'white', border: 'none', borderRadius: '9px',
          fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
          whiteSpace: 'nowrap'
        }}>🤖 AI Summary</button>

        {r.fileUrl && (
          <a href={r.fileUrl} target="_blank" rel="noreferrer" className="action-btn" style={{
            padding: '0.55rem 0.75rem', background: '#f8fafc',
            color: '#475569', border: '1px solid #e2e8f0', borderRadius: '9px',
            fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}>⬇ Download</a>
        )}
        {r.externalLink && (
          <a href={r.externalLink} target="_blank" rel="noreferrer" className="action-btn" style={{
            padding: '0.55rem 0.75rem', background: '#f8fafc',
            color: '#475569', border: '1px solid #e2e8f0', borderRadius: '9px',
            fontSize: '0.78rem', fontWeight: 600, textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: '0.3rem', whiteSpace: 'nowrap'
          }}>🔗 Open</a>
        )}
        {(user?.role === 'admin' || r.uploadedBy?._id === user?._id) && (
          <>
            <button className="action-btn" onClick={() => navigate(`/resources/edit/${r._id}`)} style={{
              padding: '0.55rem 0.6rem', background: '#f8fafc',
              color: '#475569', border: '1px solid #e2e8f0', borderRadius: '9px',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
            }}>✏️</button>
            <button className="action-btn" onClick={() => onDelete(r._id)} style={{
              padding: '0.55rem 0.6rem', background: '#fff1f2',
              color: '#be123c', border: '1px solid #fecdd3', borderRadius: '9px',
              fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
            }}>🗑</button>
          </>
        )}
      </div>
    </div>
  );
}

function ResourceListItem({ r, user, bookmarked, onBookmark, onRate, onDelete, onAI, navigate, typeStyle }) {
  const ts = typeStyle(r.resourceType);
  return (
    <div className="resource-list-item" style={{
      background: 'white', borderRadius: '14px', padding: '1.1rem 1.4rem',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
      display: 'flex', alignItems: 'center', gap: '1.1rem'
    }}>
      {/* Icon */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: ts.bg, border: `1px solid ${ts.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
      }}>
        {TYPE_ICONS[r.resourceType] || '📁'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
          <h3 style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {r.title}
          </h3>
          <span style={{
            fontSize: '0.67rem', fontWeight: 600, color: ts.color,
            background: ts.bg, padding: '0.1rem 0.4rem', borderRadius: '4px', flexShrink: 0
          }}>{r.resourceType?.toUpperCase()}</span>
          <span style={{
            fontSize: '0.67rem', fontWeight: 600,
            padding: '0.1rem 0.5rem', borderRadius: '20px', flexShrink: 0,
            background: r.status === 'approved' ? '#d1fae5' : r.status === 'pending' ? '#fef3c7' : '#fee2e2',
            color: r.status === 'approved' ? '#065f46' : r.status === 'pending' ? '#92400e' : '#991b1b',
          }}>{r.status}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📚 {r.subject}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📅 {r.semester}</span>
          <StarRating value={Math.round(r.averageRating || 0)} onRate={(val) => onRate(r._id, val)} size="0.8rem" />
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>{r.averageRating?.toFixed(1) || '—'}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
        <button onClick={() => onAI(r)} style={{
          padding: '0.45rem 0.8rem', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
          color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.75rem',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
        }}>🤖 AI</button>
        {r.fileUrl && (
          <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{
            padding: '0.45rem 0.8rem', background: '#f8fafc',
            color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px',
            fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center'
          }}>⬇</a>
        )}
        {r.externalLink && (
          <a href={r.externalLink} target="_blank" rel="noreferrer" style={{
            padding: '0.45rem 0.8rem', background: '#f8fafc',
            color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px',
            fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center'
          }}>🔗</a>
        )}
        <button onClick={() => onBookmark(r._id)} style={{
          padding: '0.45rem 0.6rem', background: bookmarked[r._id] ? '#fef3c7' : '#f8fafc',
          border: `1px solid ${bookmarked[r._id] ? '#fcd34d' : '#e2e8f0'}`,
          borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit'
        }}>{bookmarked[r._id] ? '🔖' : '📌'}</button>
        {(user?.role === 'admin' || r.uploadedBy?._id === user?._id) && (
          <>
            <button onClick={() => navigate(`/resources/edit/${r._id}`)} style={{
              padding: '0.45rem 0.6rem', background: '#f8fafc',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.8rem', cursor: 'pointer'
            }}>✏️</button>
            <button onClick={() => onDelete(r._id)} style={{
              padding: '0.45rem 0.6rem', background: '#fff1f2',
              border: '1px solid #fecdd3', borderRadius: '8px',
              fontSize: '0.8rem', cursor: 'pointer'
            }}>🗑</button>
          </>
        )}
      </div>
    </div>
  );
}
