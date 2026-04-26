import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/shared/Layout';
import ResourceStatsWidget from '../components/shared/ResourceStatsWidget';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets,   setTickets]   = useState([]);
  const [resources, setResources] = useState([]);
  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      axios.get('/api/tickets'),
      axios.get('/api/resources'),
      user?.role === 'admin' ? axios.get('/api/users') : Promise.resolve({ data: [] }),
    ]).then(([t, r, u]) => {
      if (t.status === 'fulfilled') setTickets(t.value.data);
      if (r.status === 'fulfilled') setResources(r.value.data);
      if (u.status === 'fulfilled') setUsers(u.value.data);
    }).finally(() => setLoading(false));
  }, [user]);

  const openTickets = tickets.filter(t => t.status === 'open').length;
  const inProgress  = tickets.filter(t => t.status === 'in_progress').length;
  const resolved    = tickets.filter(t => t.status === 'resolved').length;
  const pendingRes  = resources.filter(r => r.status === 'pending').length;
  const completion  = user?.academicProfile?.profileCompletion || 0;

  const TICKET_STATUS_CONFIG = {
    open:        { color: '#92400e', bg: '#fef3c7', label: 'Open' },
    in_progress: { color: '#1d4ed8', bg: '#dbeafe', label: 'In Progress' },
    resolved:    { color: '#065f46', bg: '#d1fae5', label: 'Resolved' },
    closed:      { color: '#475569', bg: '#f1f5f9', label: 'Closed' },
  };

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? 'Good morning' : greetingHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <Layout>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563eb 55%, #3B82F6 100%)',
        borderRadius: '20px', padding: '2rem',
        marginBottom: '1.75rem', position: 'relative', overflow: 'hidden'
      }}>
        {/* decorative circles */}
        {[
          { w: 220, h: 220, top: -60, right: -40, op: 0.05 },
          { w: 140, h: 140, top: 30,  right: 80,  op: 0.04 },
          { w: 90,  h: 90,  top: -20, right: 180, op: 0.06 },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute', width: c.w, height: c.h,
            top: c.top, right: c.right, borderRadius: '50%',
            background: `rgba(255,255,255,${c.op})`, pointerEvents: 'none'
          }} />
        ))}

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', margin: '0 0 0.3rem' }}>
              {greeting} 👋
            </p>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'white', margin: '0 0 0.4rem' }}>
              {user?.name?.split(' ')[0]}!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', margin: 0 }}>
              Here's what's happening on SkillNest today.
            </p>
          </div>

          {/* Profile completion pill */}
          <div style={{
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: '16px',
            padding: '1rem 1.5rem', textAlign: 'center', minWidth: '150px'
          }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>
              {completion}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.3rem' }}>
              Profile Complete
            </div>
            <div style={{
              marginTop: '0.6rem', background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px', height: '5px', overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', background: 'white', borderRadius: '10px',
                width: `${completion}%`, transition: 'width 0.6s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: user?.role === 'admin'
          ? 'repeat(5, 1fr)'
          : 'repeat(4, 1fr)',
        gap: '1rem', marginBottom: '1.75rem'
      }}>
        {[
          { icon: '🎫', label: 'Total Tickets', value: tickets.length,   color: '#1E3A8A', bg: '#eff6ff',  border: '#bfdbfe' },
          { icon: '🔓', label: 'Open',          value: openTickets,      color: '#92400e', bg: '#fef3c7',  border: '#fcd34d' },
          { icon: '⚙️', label: 'In Progress',   value: inProgress,       color: '#1d4ed8', bg: '#dbeafe',  border: '#93c5fd' },
          { icon: '✅', label: 'Resolved',       value: resolved,         color: '#065f46', bg: '#d1fae5',  border: '#6ee7b7' },
          ...(user?.role === 'admin' ? [
            { icon: '👥', label: 'Users', value: users.length, color: '#7e22ce', bg: '#fdf4ff', border: '#e9d5ff' }
          ] : []),
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white', borderRadius: '16px', padding: '1.25rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            border: `1px solid ${stat.border}`,
            borderTop: `3px solid ${stat.color}`,
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, margin: '0 0 0.35rem', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {stat.label}
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, margin: 0, lineHeight: 1 }}>
                  {stat.value}
                </p>
              </div>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: stat.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.2rem'
              }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Recent Tickets */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.5rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>🎫 Recent Tickets</h2>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.2rem 0 0' }}>Your latest support requests</p>
            </div>
            <button onClick={() => navigate('/tickets')} style={{
              padding: '0.45rem 1rem', background: '#f8fafc',
              color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
            }}>View All</button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <div style={{
                width: '32px', height: '32px', border: '3px solid #e2e8f0',
                borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'dbspin 0.8s linear infinite'
              }} />
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎫</div>
              <p style={{ fontSize: '0.875rem' }}>No tickets yet.</p>
              <button onClick={() => navigate('/tickets/new')} style={{
                marginTop: '0.75rem', padding: '0.5rem 1.25rem',
                background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                color: 'white', border: 'none', borderRadius: '10px',
                fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit'
              }}>Create First Ticket</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tickets.slice(0, 5).map(t => {
                const sc = TICKET_STATUS_CONFIG[t.status] || TICKET_STATUS_CONFIG.closed;
                return (
                  <div key={t._id}
                    onClick={() => navigate(`/tickets/${t._id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.85rem 1rem', borderRadius: '12px',
                      background: '#f8fafc', cursor: 'pointer', transition: 'all 0.15s',
                      border: '1px solid transparent'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: sc.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.1rem'
                    }}>🎫</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1e293b' }}>
                          {t.ticketNumber}
                        </span>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700,
                          padding: '0.15rem 0.55rem', borderRadius: '20px',
                          background: sc.bg, color: sc.color
                        }}>{sc.label}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {t.subject}
                      </p>
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#cbd5e1', flexShrink: 0 }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Quick Actions */}
          <div style={{
            background: 'white', borderRadius: '20px', padding: '1.5rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
          }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem' }}>⚡ Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {user?.role === 'student' && ([
                { label: '🎫 Request Help',     path: '/tickets/new',    primary: true },
                { label: '📚 Browse Resources', path: '/resources',      primary: false },
                { label: '🔖 My Bookmarks',     path: '/resources/bookmarks', primary: false },
                { label: '👤 Edit Profile',     path: '/profile',        primary: false },
              ])}
              {user?.role === 'tutor' && ([
                { label: '🎫 View Tickets',      path: '/tickets',          primary: true },
                { label: '⬆️ Upload Resource',   path: '/resources/upload', primary: false },
                { label: '📚 Browse Resources',  path: '/resources',        primary: false },
              ])}
              {user?.role === 'admin' && ([
                { label: '👥 Manage Users',       path: '/admin/users',     primary: true },
                { label: '✅ Approve Resources',  path: '/admin/resources', primary: false },
                { label: '🎫 View All Tickets',   path: '/tickets',         primary: false },
                { label: '📚 Browse Resources',   path: '/resources',       primary: false },
              ])}
              {(user?.role === 'student' ? [
                { label: '🎫 Request Help',     path: '/tickets/new',    primary: true },
                { label: '📚 Browse Resources', path: '/resources',      primary: false },
                { label: '🔖 My Bookmarks',     path: '/resources/bookmarks', primary: false },
                { label: '👤 Edit Profile',     path: '/profile',        primary: false },
              ] : user?.role === 'tutor' ? [
                { label: '🎫 View Tickets',      path: '/tickets',          primary: true },
                { label: '⬆️ Upload Resource',   path: '/resources/upload', primary: false },
                { label: '📚 Browse Resources',  path: '/resources',        primary: false },
              ] : [
                { label: '👥 Manage Users',       path: '/admin/users',     primary: true },
                { label: '✅ Approve Resources',  path: '/admin/resources', primary: false },
                { label: '🎫 View All Tickets',   path: '/tickets',         primary: false },
              ]).map(action => (
                <button key={action.path} onClick={() => navigate(action.path)} style={{
                  padding: '0.7rem 1rem',
                  background: action.primary
                    ? 'linear-gradient(135deg, #1E3A8A, #3B82F6)'
                    : '#f8fafc',
                  color: action.primary ? 'white' : '#475569',
                  border: action.primary ? 'none' : '1px solid #e2e8f0',
                  borderRadius: '12px', fontSize: '0.85rem',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s', textAlign: 'left',
                  boxShadow: action.primary ? '0 4px 12px rgba(59,130,246,0.25)' : 'none'
                }}>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Resource Compact Widget */}
          <ResourceStatsWidget compact={true} />

          {/* Pending Resources Alert (admin only) */}
          {user?.role === 'admin' && pendingRes > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #d97706, #f59e0b)',
              borderRadius: '16px', padding: '1.25rem', color: 'white',
              cursor: 'pointer'
            }} onClick={() => navigate('/admin/resources')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.75rem' }}>⏳</span>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>
                    {pendingRes} Resource{pendingRes !== 1 ? 's' : ''} Pending
                  </p>
                  <p style={{ fontSize: '0.78rem', opacity: 0.8, margin: '0.2rem 0 0' }}>
                    Tap to review and approve
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resource Analytics — admin and tutors */}
      {(user?.role === 'admin' || user?.role === 'tutor') && (
        <div style={{
          background: 'white', borderRadius: '20px', padding: '1.75rem',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9'
        }}>
          <ResourceStatsWidget compact={false} />
        </div>
      )}

      <style>{`
        @keyframes dbspin { to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  );
}