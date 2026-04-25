import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/shared/Layout';

const STATUS_CONFIG = {
  pending:  { label: 'Pending Review', icon: '⏳', color: '#92400e', bg: '#fef3c7', border: '#fcd34d', count_bg: '#fef3c7', count_color: '#92400e' },
  approved: { label: 'Approved',       icon: '✅', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7', count_bg: '#d1fae5', count_color: '#065f46' },
  rejected: { label: 'Rejected',       icon: '❌', color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', count_bg: '#fee2e2', count_color: '#991b1b' },
};

const TYPE_COLORS = {
  pdf:   { bg: '#fff1f2', color: '#be123c' },
  link:  { bg: '#eff6ff', color: '#1d4ed8' },
  notes: { bg: '#f0fdf4', color: '#15803d' },
  video: { bg: '#fdf4ff', color: '#7e22ce' },
  other: { bg: '#f8fafc', color: '#475569' },
};
const TYPE_ICONS = { pdf: '📄', link: '🔗', notes: '📝', video: '🎥', other: '📁' };

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [counts, setCounts] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [res, allRes] = await Promise.all([
        axios.get(`/api/resources?status=${filter}`),
        Promise.allSettled([
          axios.get('/api/resources?status=pending'),
          axios.get('/api/resources?status=approved'),
          axios.get('/api/resources?status=rejected'),
        ])
      ]);
      setResources(res.data);
      setCounts({
        pending:  allRes[0].status === 'fulfilled' ? allRes[0].value.data.length : 0,
        approved: allRes[1].status === 'fulfilled' ? allRes[1].value.data.length : 0,
        rejected: allRes[2].status === 'fulfilled' ? allRes[2].value.data.length : 0,
      });
    } catch (e) { }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, [filter]);

  const approve = async (id, status) => {
    setActionLoading(id + status);
    try {
      await axios.post(`/api/resources/${id}/approve`, { status });
      fetchAll();
    } finally { setActionLoading(null); }
  };

  const del = async (id) => {
    if (!window.confirm('Permanently delete this resource?')) return;
    setActionLoading(id + 'del');
    try {
      await axios.delete(`/api/resources/${id}`);
      fetchAll();
    } finally { setActionLoading(null); }
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563eb 60%, #3B82F6 100%)',
        borderRadius: '20px', padding: '1.75rem 2rem',
        marginBottom: '2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <nav style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Dashboard &gt; Admin &gt; </span>
          <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 500 }}>Resource Approval</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🛡️</span>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: 0 }}>Resource Approval</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              Review, approve or reject submitted academic resources.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.75rem' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} style={{
            background: 'white', borderRadius: '16px', padding: '1.25rem 1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: `1px solid ${cfg.border}`,
            cursor: 'pointer', transition: 'all 0.2s',
            transform: filter === key ? 'translateY(-2px)' : 'none',
            boxShadow: filter === key ? `0 8px 24px rgba(0,0,0,0.1)` : '0 4px 16px rgba(0,0,0,0.06)',
          }} onClick={() => setFilter(key)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, margin: '0 0 0.3rem' }}>
                  {cfg.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: cfg.color, margin: 0, lineHeight: 1 }}>
                  {counts[key]}
                </p>
              </div>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
              }}>
                {cfg.icon}
              </div>
            </div>
            {filter === key && (
              <div style={{
                marginTop: '0.75rem', height: '3px', borderRadius: '2px',
                background: `linear-gradient(90deg, #1E3A8A, #3B82F6)`
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '0.35rem', marginBottom: '1.5rem',
        background: 'white', borderRadius: '14px', padding: '0.35rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
        width: 'fit-content'
      }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button key={key} onClick={() => setFilter(key)} style={{
            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
            background: filter === key ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)' : 'transparent',
            color: filter === key ? 'white' : '#64748b',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            <span>{cfg.icon}</span>
            {cfg.label}
            <span style={{
              background: filter === key ? 'rgba(255,255,255,0.25)' : cfg.bg,
              color: filter === key ? 'white' : cfg.color,
              fontSize: '0.7rem', fontWeight: 700,
              padding: '0.1rem 0.45rem', borderRadius: '20px', minWidth: '20px', textAlign: 'center'
            }}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {STATUS_CONFIG[filter].icon}
          </div>
          <h3 style={{ color: '#334155', fontWeight: 600, marginBottom: '0.5rem' }}>
            No {filter} resources
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {filter === 'pending' ? 'All caught up! No resources awaiting review.' :
             filter === 'approved' ? 'No approved resources yet.' : 'No rejected resources.'}
          </p>
        </div>
      ) : (
        <div style={{
          background: 'white', borderRadius: '20px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9',
          overflow: 'hidden'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr 0.8fr 1.5fr',
            padding: '0.9rem 1.5rem',
            background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
            gap: '0.75rem'
          }}>
            {['Resource', 'Subject', 'Semester', 'Type', 'Uploaded By', 'Status', 'Actions'].map(h => (
              <span key={h} style={{
                fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.5px'
              }}>{h}</span>
            ))}
          </div>

          {/* Rows */}
          {resources.map((r, idx) => {
            const tc = TYPE_COLORS[r.resourceType] || TYPE_COLORS.other;
            const sc = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
            return (
              <div key={r._id} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 0.7fr 1fr 0.8fr 1.5fr',
                padding: '1rem 1.5rem', gap: '0.75rem',
                alignItems: 'center',
                borderBottom: idx < resources.length - 1 ? '1px solid #f8fafc' : 'none',
                transition: 'background 0.15s',
                background: 'white'
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                onMouseLeave={e => e.currentTarget.style.background = 'white'}
              >
                {/* Title */}
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#1e293b', margin: 0, marginBottom: '0.2rem' }}>
                    {r.title}
                  </p>
                  {r.description && (
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                      {r.description.slice(0, 55)}{r.description.length > 55 ? '...' : ''}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{r.subject}</p>

                {/* Semester */}
                <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{r.semester}</p>

                {/* Type */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: tc.bg, color: tc.color,
                  padding: '0.2rem 0.6rem', borderRadius: '8px',
                  fontSize: '0.72rem', fontWeight: 600, width: 'fit-content'
                }}>
                  {TYPE_ICONS[r.resourceType] || '📁'} {r.resourceType}
                </span>

                {/* Uploaded By */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', color: 'white', fontWeight: 700, flexShrink: 0
                  }}>
                    {r.uploadedBy?.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>
                    {r.uploadedBy?.name || 'Unknown'}
                  </p>
                </div>

                {/* Status */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: sc.bg, color: sc.color,
                  padding: '0.25rem 0.65rem', borderRadius: '20px',
                  fontSize: '0.72rem', fontWeight: 700, width: 'fit-content'
                }}>
                  {sc.icon} {r.status}
                </span>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                  {r.status !== 'approved' && (
                    <button onClick={() => approve(r._id, 'approved')}
                      disabled={actionLoading === r._id + 'approved'}
                      style={{
                        padding: '0.4rem 0.7rem',
                        background: actionLoading === r._id + 'approved' ? '#d1fae5' : 'linear-gradient(135deg, #059669, #10b981)',
                        color: 'white', border: 'none', borderRadius: '8px',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '0.2rem',
                        boxShadow: '0 2px 8px rgba(16,185,129,0.25)', whiteSpace: 'nowrap'
                      }}>
                      ✓ Approve
                    </button>
                  )}
                  {r.status !== 'rejected' && (
                    <button onClick={() => approve(r._id, 'rejected')}
                      disabled={actionLoading === r._id + 'rejected'}
                      style={{
                        padding: '0.4rem 0.7rem',
                        background: '#fff', color: '#64748b',
                        border: '1.5px solid #e2e8f0', borderRadius: '8px',
                        fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.2s', whiteSpace: 'nowrap'
                      }}>
                      ✗ Reject
                    </button>
                  )}
                  <button onClick={() => del(r._id)} disabled={actionLoading === r._id + 'del'} style={{
                    padding: '0.4rem 0.6rem',
                    background: '#fff1f2', color: '#be123c',
                    border: '1px solid #fecdd3', borderRadius: '8px',
                    fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                  }}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
}
