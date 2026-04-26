import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * ResourceStatsWidget
 * A self-contained analytics panel for the Resource Management System.
 * Drop it anywhere — Dashboard, sidebar panel, or a dedicated stats page.
 *
 * Usage:
 *   import ResourceStatsWidget from '../components/shared/ResourceStatsWidget';
 *   <ResourceStatsWidget compact={false} />
 *
 * Props:
 *   compact  {boolean}  – renders a slim 2-column summary (default: false)
 */
export default function ResourceStatsWidget({ compact = false }) {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    axios.get('/api/resources')
      .then(r => setResources(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* ── Derived stats ── */
  const total     = resources.length;
  const approved  = resources.filter(r => r.status === 'approved').length;
  const pending   = resources.filter(r => r.status === 'pending').length;
  const rejected  = resources.filter(r => r.status === 'rejected').length;

  const byType = resources.reduce((acc, r) => {
    acc[r.resourceType] = (acc[r.resourceType] || 0) + 1;
    return acc;
  }, {});

  const bySubject = resources.reduce((acc, r) => {
    if (r.subject) acc[r.subject] = (acc[r.subject] || 0) + 1;
    return acc;
  }, {});

  const totalRatings  = resources.reduce((s, r) => s + (r.ratings?.length || 0), 0);
  const avgRating     = resources.length
    ? resources.reduce((s, r) => s + (r.averageRating || 0), 0) / resources.filter(r => r.averageRating > 0).length || 0
    : 0;

  const topSubject = Object.entries(bySubject).sort((a, b) => b[1] - a[1])[0];
  const topType    = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];

  const TYPE_ICONS  = { pdf: '📄', link: '🔗', notes: '📝', video: '🎥', other: '📁' };
  const TYPE_COLORS = {
    pdf:   '#be123c', link: '#1d4ed8', notes: '#15803d', video: '#7e22ce', other: '#475569'
  };
  const TYPE_BG = {
    pdf:   '#fff1f2', link: '#eff6ff', notes: '#f0fdf4', video: '#fdf4ff', other: '#f8fafc'
  };

  if (loading) {
    return (
      <div style={{
        background: 'white', borderRadius: '16px', padding: '2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)'
      }}>
        <div style={{
          width: '32px', height: '32px', border: '3px solid #e2e8f0',
          borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'rspin 0.8s linear infinite'
        }} />
        <style>{`@keyframes rspin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── COMPACT MODE ── */
  if (compact) {
    return (
      <div style={{
        background: 'white', borderRadius: '16px', padding: '1.25rem',
        border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>📊 Resource Stats</h3>
          <button onClick={() => navigate('/resources')} style={{
            fontSize: '0.72rem', color: '#3B82F6', background: 'none',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600
          }}>View all →</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
          {[
            { label: 'Total',    value: total,    color: '#1E3A8A', bg: '#eff6ff' },
            { label: 'Approved', value: approved, color: '#065f46', bg: '#d1fae5' },
            { label: 'Pending',  value: pending,  color: '#92400e', bg: '#fef3c7' },
            { label: 'Avg ⭐',   value: avgRating > 0 ? avgRating.toFixed(1) : '—', color: '#7c3aed', bg: '#f3f0ff' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: stat.bg, borderRadius: '10px', padding: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, marginTop: '0.15rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── FULL MODE ── */
  const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
  const maxSubjectCount = topSubject ? topSubject[1] : 1;

  return (
    <div>
      {/* Section header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>📊 Resource Analytics</h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>
            Overview of all academic resources on the platform
          </p>
        </div>
        <button onClick={() => navigate('/admin/resources')} style={{
          padding: '0.55rem 1.1rem', background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
          color: 'white', border: 'none', borderRadius: '10px', fontSize: '0.8rem',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
        }}>Manage →</button>
      </div>

      {/* Top KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: '📦', label: 'Total Resources', value: total,        sub: 'all statuses',  grad: 'linear-gradient(135deg, #1E3A8A, #3B82F6)' },
          { icon: '✅', label: 'Approved',         value: approved,     sub: `${approvalRate}% approval rate`, grad: 'linear-gradient(135deg, #059669, #10b981)' },
          { icon: '⏳', label: 'Pending Review',   value: pending,      sub: 'awaiting admin', grad: 'linear-gradient(135deg, #d97706, #f59e0b)' },
          { icon: '⭐', label: 'Avg Rating',        value: avgRating > 0 ? avgRating.toFixed(1) : '—', sub: `${totalRatings} total ratings`, grad: 'linear-gradient(135deg, #7c3aed, #4f46e5)' },
        ].map(kpi => (
          <div key={kpi.label} style={{
            background: kpi.grad, borderRadius: '16px', padding: '1.25rem',
            color: 'white', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: '-15px', right: '-15px', width: '80px', height: '80px',
              borderRadius: '50%', background: 'rgba(255,255,255,0.08)', pointerEvents: 'none'
            }} />
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{kpi.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '0.3rem', opacity: 0.9 }}>{kpi.label}</div>
            <div style={{ fontSize: '0.68rem', opacity: 0.65, marginTop: '0.15rem' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

        {/* Resource Types Breakdown */}
        <div style={{
          background: 'white', borderRadius: '16px', padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.1rem' }}>
            📂 By Resource Type
          </h3>
          {total === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', padding: '1.5rem' }}>No data yet</p>
          ) : (
            Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={type} style={{ marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: TYPE_BG[type] || '#f8fafc',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.9rem'
                      }}>{TYPE_ICONS[type] || '📁'}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: TYPE_COLORS[type] || '#475569' }}>{count}</span>
                      <span style={{ fontSize: '0.7rem', color: '#cbd5e1', minWidth: '32px', textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                  <div style={{ background: '#f1f5f9', borderRadius: '10px', height: '7px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '10px',
                      background: TYPE_COLORS[type] || '#475569',
                      width: `${pct}%`, transition: 'width 0.6s ease'
                    }} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Status Donut + Subjects */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Approval Status */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', flex: 1
          }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '1rem' }}>
              🔄 Approval Status
            </h3>
            {[
              { label: 'Approved', count: approved,  color: '#10b981', bg: '#d1fae5' },
              { label: 'Pending',  count: pending,   color: '#f59e0b', bg: '#fef3c7' },
              { label: 'Rejected', count: rejected,  color: '#ef4444', bg: '#fee2e2' },
            ].map(s => (
              <div key={s.label} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.6rem 0.75rem', borderRadius: '10px',
                background: s.bg, marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: s.color
                  }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{s.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: s.color }}>{s.count}</span>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {total > 0 ? Math.round((s.count / total) * 100) : 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Top Highlights */}
          <div style={{
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            borderRadius: '16px', padding: '1.25rem', color: 'white'
          }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.85rem' }}>🏆 Top Highlights</h3>
            {[
              { icon: '📚', label: 'Most Popular Subject', value: topSubject ? topSubject[0] : '—' },
              { icon: '📁', label: 'Most Common Type',    value: topType ? `${TYPE_ICONS[topType[0]]} ${topType[0]}` : '—' },
              { icon: '⭐', label: 'Total Ratings',       value: totalRatings },
              { icon: '📊', label: 'Approval Rate',       value: `${approvalRate}%` },
            ].map(h => (
              <div key={h.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                  {h.icon} {h.label}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>
                  {h.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top subjects bar chart */}
      {Object.keys(bySubject).length > 0 && (
        <div style={{
          background: 'white', borderRadius: '16px', padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9',
          marginTop: '1.25rem'
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.1rem' }}>
            🎓 Resources by Subject
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {Object.entries(bySubject).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([subj, count], i) => {
              const pct = Math.round((count / maxSubjectCount) * 100);
              const hues = ['#1E3A8A','#2563eb','#3B82F6','#60a5fa','#7c3aed','#059669'];
              return (
                <div key={subj} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
                    minWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>{subj}</span>
                  <div style={{ flex: 1, background: '#f1f5f9', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: '10px',
                      background: hues[i] || '#3B82F6',
                      width: `${pct}%`, transition: 'width 0.6s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', minWidth: '20px', textAlign: 'right' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}