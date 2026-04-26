import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';

const TYPE_ICONS  = { pdf: '📄', link: '🔗', notes: '📝', video: '🎥', other: '📁' };
const TYPE_COLORS = {
  pdf:   { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  link:  { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  notes: { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
  video: { bg: '#fdf4ff', color: '#7e22ce', border: '#e9d5ff' },
  other: { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
};

function StarRating({ value, size = '0.9rem' }) {
  return (
    <div style={{ display: 'flex', gap: '0.1rem' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{
          fontSize: size,
          color: s <= Math.round(value || 0) ? '#f59e0b' : '#e2e8f0',
        }}>★</span>
      ))}
    </div>
  );
}

export default function BookmarkedResourcesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [removing, setRemoving]     = useState(null);
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('newest');

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resources?bookmarked=true');
      setResources(res.data);
    } catch (e) {
      // fallback: fetch all resources and filter client-side
      try {
        const all = await axios.get('/api/resources');
        setResources(all.data.filter(r => r.bookmarks?.includes(user?._id)));
      } catch {}
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchBookmarks(); }, []);

  const handleRemoveBookmark = async (id) => {
    setRemoving(id);
    try {
      await axios.post(`/api/resources/${id}/bookmark`);
      setResources(prev => prev.filter(r => r._id !== id));
    } finally { setRemoving(null); }
  };

  const filtered = resources
    .filter(r =>
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.subject?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'rating')  return (b.averageRating || 0) - (a.averageRating || 0);
      if (sortBy === 'title')   return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  // Group by subject
  const grouped = filtered.reduce((acc, r) => {
    const key = r.subject || 'Uncategorised';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <Layout>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #4f46e5 100%)',
        borderRadius: '20px', padding: '2rem',
        marginBottom: '1.75rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-30px', width: '200px', height: '200px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', right: '80px', width: '140px', height: '140px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none'
        }} />

        <nav style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Dashboard &gt; </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
            onClick={() => navigate('/resources')}>Resources</span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}> &gt; </span>
          <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 500 }}>My Bookmarks</span>
        </nav>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div style={{
              width: '54px', height: '54px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem'
            }}>🔖</div>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, color: 'white', margin: 0 }}>My Bookmarks</h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
                {resources.length} saved resource{resources.length !== 1 ? 's' : ''} · quick access to your study materials
              </p>
            </div>
          </div>
          <button onClick={() => navigate('/resources')} style={{
            padding: '0.65rem 1.25rem', background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s',
            backdropFilter: 'blur(4px)'
          }}>
            📚 Browse More
          </button>
        </div>
      </div>

      {/* Search & Sort Bar */}
      {resources.length > 0 && (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '1rem 1.25rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
          marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <span style={{
              position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)',
              fontSize: '0.9rem', pointerEvents: 'none'
            }}>🔍</span>
            <input placeholder="Search bookmarks..." value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', paddingLeft: '2.4rem', paddingRight: '0.9rem',
                paddingTop: '0.6rem', paddingBottom: '0.6rem',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none', background: '#f8fafc'
              }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Sort:</span>
            {[
              { value: 'newest', label: '🕐 Newest' },
              { value: 'rating', label: '⭐ Rating' },
              { value: 'title',  label: '🔤 Title' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setSortBy(opt.value)} style={{
                padding: '0.45rem 0.9rem',
                background: sortBy === opt.value ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : '#f8fafc',
                color: sortBy === opt.value ? 'white' : '#64748b',
                border: `1px solid ${sortBy === opt.value ? 'transparent' : '#e2e8f0'}`,
                borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
              }}>{opt.label}</button>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            <b style={{ color: '#475569' }}>{filtered.length}</b> result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem', gap: '1rem' }}>
          <div style={{
            width: '44px', height: '44px', border: '3px solid #e2e8f0',
            borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
          }} />
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Loading bookmarks...</p>
        </div>
      ) : resources.length === 0 ? (
        /* Empty State */
        <div style={{
          background: 'white', borderRadius: '24px', padding: '5rem 2rem',
          textAlign: 'center', border: '1px solid #f1f5f9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔖</div>
          <h3 style={{ color: '#334155', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            No bookmarks yet
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.75rem', maxWidth: '340px', margin: '0 auto 1.75rem' }}>
            Start saving resources by clicking the bookmark icon on any resource card.
          </p>
          <button onClick={() => navigate('/resources')} style={{
            padding: '0.75rem 2rem',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            color: 'white', border: 'none', borderRadius: '14px',
            fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 6px 20px rgba(124,58,237,0.35)'
          }}>📚 Browse Resources</button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '4rem 2rem',
          textAlign: 'center', border: '1px solid #f1f5f9'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔍</div>
          <p style={{ color: '#94a3b8' }}>No bookmarks match your search.</p>
        </div>
      ) : (
        /* Grouped by subject */
        Object.entries(grouped).map(([subject, items]) => (
          <div key={subject} style={{ marginBottom: '2rem' }}>
            {/* Subject Group Header */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem'
            }}>
              <div style={{
                height: '1px', background: 'linear-gradient(90deg, #7c3aed, transparent)',
                flex: 0, width: '32px'
              }} />
              <h2 style={{
                fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed',
                textTransform: 'uppercase', letterSpacing: '1px', margin: 0
              }}>
                📚 {subject}
              </h2>
              <span style={{
                background: '#f3f0ff', color: '#7c3aed', borderRadius: '20px',
                padding: '0.1rem 0.55rem', fontSize: '0.72rem', fontWeight: 700
              }}>{items.length}</span>
              <div style={{ height: '1px', background: '#f1f5f9', flex: 1 }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem'
            }}>
              {items.map(r => {
                const tc = TYPE_COLORS[r.resourceType] || TYPE_COLORS.other;
                return (
                  <div key={r._id} style={{
                    background: 'white', borderRadius: '16px', padding: '1.25rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden',
                    transition: 'all 0.2s', animation: 'fadeIn 0.3s ease'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'; }}
                  >
                    {/* Purple top bar */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: 'linear-gradient(90deg, #7c3aed, #4f46e5)'
                    }} />

                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.9rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: tc.bg, border: `1px solid ${tc.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                        }}>
                          {TYPE_ICONS[r.resourceType] || '📁'}
                        </div>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 600, color: tc.color,
                          background: tc.bg, padding: '0.15rem 0.5rem', borderRadius: '5px',
                          textTransform: 'uppercase'
                        }}>{r.resourceType}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveBookmark(r._id)}
                        disabled={removing === r._id}
                        title="Remove bookmark"
                        style={{
                          background: removing === r._id ? '#fef3c7' : '#fff7ed',
                          border: '1px solid #fcd34d', borderRadius: '8px',
                          width: '32px', height: '32px', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          cursor: removing === r._id ? 'not-allowed' : 'pointer',
                          fontSize: '0.9rem', transition: 'all 0.2s'
                        }}>
                        {removing === r._id ? '⏳' : '🔖'}
                      </button>
                    </div>

                    {/* Title & desc */}
                    <h3 style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.35rem', lineHeight: 1.4 }}>
                      {r.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.75rem', flexGrow: 1, lineHeight: 1.6 }}>
                      {r.description?.slice(0, 80)}{r.description?.length > 80 ? '...' : ''}
                    </p>

                    {/* Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                      <StarRating value={r.averageRating} />
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {r.averageRating?.toFixed(1) || '—'} ({r.ratings?.length || 0})
                      </span>
                      <span style={{
                        fontSize: '0.68rem', fontWeight: 600,
                        padding: '0.1rem 0.5rem', borderRadius: '20px', marginLeft: 'auto',
                        background: r.status === 'approved' ? '#d1fae5' : '#fef3c7',
                        color: r.status === 'approved' ? '#065f46' : '#92400e',
                      }}>{r.status}</span>
                    </div>

                    {/* Tags */}
                    {r.tags?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginBottom: '0.75rem' }}>
                        {r.tags.slice(0, 3).map(t => (
                          <span key={t} style={{
                            fontSize: '0.67rem', background: '#f3f0ff', color: '#7c3aed',
                            padding: '0.15rem 0.5rem', borderRadius: '20px', fontWeight: 500,
                            border: '1px solid #e9d5ff'
                          }}>{t}</span>
                        ))}
                      </div>
                    )}

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#f8fafc', margin: '0.4rem 0 0.85rem' }} />

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {r.fileUrl && (
                        <a href={r.fileUrl} target="_blank" rel="noreferrer" style={{
                          flex: 1, padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          color: 'white', borderRadius: '9px', fontSize: '0.78rem',
                          fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                        }}>⬇ Download</a>
                      )}
                      {r.externalLink && (
                        <a href={r.externalLink} target="_blank" rel="noreferrer" style={{
                          flex: 1, padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                          color: 'white', borderRadius: '9px', fontSize: '0.78rem',
                          fontWeight: 600, textDecoration: 'none', textAlign: 'center',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'
                        }}>🔗 Open Link</a>
                      )}
                      <button onClick={() => navigate(`/resources`)} style={{
                        padding: '0.5rem 0.75rem', background: '#f8fafc',
                        color: '#64748b', border: '1px solid #e2e8f0',
                        borderRadius: '9px', fontSize: '0.78rem',
                        fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
                      }}>👁 View</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </Layout>
  );
}
