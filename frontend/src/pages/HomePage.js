import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const features = [
    {
      icon: '🎓',
      title: 'Student Portal',
      desc: 'Access courses, submit help tickets, and track your academic progress — all in one place.',
      color: '#3b82f6',
    },
    {
      icon: '👨‍🏫',
      title: 'Tutor Connect',
      desc: 'Get matched with expert tutors for peer help, quiz assistance, and assignment guidance.',
      color: '#8b5cf6',
    },
    {
      icon: '📚',
      title: 'Resource Library',
      desc: 'Discover, share, and download study materials with AI-powered summarisation built right in.',
      color: '#06b6d4',
    },
    {
      icon: '💬',
      title: 'Real-Time Chat',
      desc: 'Collaborate instantly with tutors via live ticket chat — no waiting, no delays.',
      color: '#10b981',
    },
    {
      icon: '📊',
      title: 'Academic Tracking',
      desc: 'Monitor your GPA, track semester progress, and identify skill strengths and gaps.',
      color: '#f59e0b',
    },
    {
      icon: '🛡️',
      title: 'Admin Dashboard',
      desc: 'Full management suite for resources, users, and platform health in one control centre.',
      color: '#ef4444',
    },
  ];

  const stats = [
    { value: '500+', label: 'Active Students' },
    { value: '50+', label: 'Expert Tutors' },
    { value: '1,200+', label: 'Resources Shared' },
    { value: '98%', label: 'Satisfaction Rate' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;1,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .hp-root {
          font-family: 'DM Sans', sans-serif;
          background: #060c1a;
          color: #e2e8f0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ───── NAV ───── */
        .hp-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 0 40px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(6, 12, 26, 0.82);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.3s;
        }
        .hp-nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'Sora', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
          text-decoration: none;
        }
        .hp-nav-brand span.dot {
          color: #38bdf8;
        }
        .hp-nav-logo-icon {
          font-size: 26px;
        }
        .hp-nav-btn {
          padding: 10px 26px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(37,99,235,0.4);
        }
        .hp-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 28px rgba(37,99,235,0.55);
        }

        /* ───── HERO ───── */
        .hp-hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 100px 24px 60px;
          position: relative;
          overflow: hidden;
        }
        .hp-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(37,99,235,0.35) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(14,165,233,0.18) 0%, transparent 55%),
            radial-gradient(ellipse 40% 30% at 20% 90%, rgba(139,92,246,0.15) 0%, transparent 50%);
        }
        .hp-grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }
        .hp-hero-content {
          position: relative;
          z-index: 2;
          max-width: 820px;
        }
        .hp-badge {
          display: inline-block;
          background: rgba(56,189,248,0.12);
          border: 1px solid rgba(56,189,248,0.3);
          color: #38bdf8;
          font-size: 13px;
          font-weight: 600;
          padding: 6px 18px;
          border-radius: 50px;
          margin-bottom: 28px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .hp-hero h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(42px, 7vw, 76px);
          font-weight: 800;
          line-height: 1.08;
          color: #fff;
          margin-bottom: 24px;
          letter-spacing: -0.03em;
        }
        .hp-hero h1 .highlight {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 60%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hp-hero p {
          font-size: 18px;
          color: rgba(226,232,240,0.72);
          line-height: 1.7;
          max-width: 560px;
          margin: 0 auto 40px;
        }
        .hp-hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hp-btn-primary {
          padding: 15px 38px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          color: #fff;
          border: none;
          border-radius: 50px;
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 8px 30px rgba(37,99,235,0.45);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .hp-btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 40px rgba(37,99,235,0.55);
        }
        .hp-btn-ghost {
          padding: 15px 38px;
          background: rgba(255,255,255,0.06);
          color: #e2e8f0;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 50px;
          font-family: 'Sora', sans-serif;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .hp-btn-ghost:hover {
          background: rgba(255,255,255,0.11);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        /* floating orbs */
        .hp-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          pointer-events: none;
          animation: floatOrb 8s ease-in-out infinite;
        }
        .hp-orb-1 { width: 400px; height: 400px; background: #3b82f6; top: 10%; left: -8%; animation-delay: 0s; }
        .hp-orb-2 { width: 300px; height: 300px; background: #8b5cf6; bottom: 15%; right: -5%; animation-delay: 3s; }
        .hp-orb-3 { width: 200px; height: 200px; background: #06b6d4; top: 60%; left: 30%; animation-delay: 6s; }
        @keyframes floatOrb {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        /* ───── STATS ───── */
        .hp-stats {
          padding: 60px 40px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
        }
        .hp-stat {
          flex: 1;
          min-width: 160px;
          max-width: 240px;
          text-align: center;
          padding: 20px 30px;
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .hp-stat:last-child { border-right: none; }
        .hp-stat-value {
          font-family: 'Sora', sans-serif;
          font-size: 42px;
          font-weight: 800;
          background: linear-gradient(135deg, #38bdf8, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 8px;
        }
        .hp-stat-label {
          font-size: 14px;
          color: rgba(226,232,240,0.55);
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        /* ───── FEATURES ───── */
        .hp-features {
          padding: 100px 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hp-section-header {
          text-align: center;
          margin-bottom: 64px;
        }
        .hp-section-label {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 14px;
        }
        .hp-section-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(30px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .hp-section-title span { color: #38bdf8; }
        .hp-section-sub {
          margin-top: 16px;
          font-size: 17px;
          color: rgba(226,232,240,0.55);
          max-width: 520px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }
        .hp-feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }
        .hp-feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px 28px;
          transition: transform 0.3s, background 0.3s, border-color 0.3s;
          cursor: default;
        }
        .hp-feature-card:hover {
          transform: translateY(-6px);
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
        }
        .hp-feature-icon-wrap {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          margin-bottom: 20px;
        }
        .hp-feature-card h3 {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 10px;
        }
        .hp-feature-card p {
          font-size: 15px;
          line-height: 1.65;
          color: rgba(226,232,240,0.58);
        }

        /* ───── ROLES ───── */
        .hp-roles {
          padding: 80px 40px;
          background: linear-gradient(180deg, transparent, rgba(37,99,235,0.06), transparent);
        }
        .hp-roles-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .hp-roles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 28px;
          margin-top: 60px;
        }
        .hp-role-card {
          border-radius: 24px;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
        }
        .hp-role-card:hover {
          transform: translateY(-8px);
        }
        .hp-role-card.student {
          background: linear-gradient(145deg, #1e3a8a, #1d4ed8);
          box-shadow: 0 12px 40px rgba(37,99,235,0.3);
        }
        .hp-role-card.tutor {
          background: linear-gradient(145deg, #4c1d95, #6d28d9);
          box-shadow: 0 12px 40px rgba(109,40,217,0.3);
        }
        .hp-role-card.admin {
          background: linear-gradient(145deg, #164e63, #0e7490);
          box-shadow: 0 12px 40px rgba(14,116,144,0.3);
        }
        .hp-role-card:hover { box-shadow-size: 20px; }
        .hp-role-card::before {
          content: '';
          position: absolute;
          top: -40px; right: -40px;
          width: 160px; height: 160px;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
        }
        .hp-role-icon {
          font-size: 48px;
          margin-bottom: 18px;
          display: block;
        }
        .hp-role-card h3 {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 10px;
        }
        .hp-role-card p {
          font-size: 15px;
          color: rgba(255,255,255,0.72);
          line-height: 1.65;
          margin-bottom: 24px;
        }
        .hp-role-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hp-role-list li {
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .hp-role-list li::before {
          content: '✓';
          font-size: 12px;
          font-weight: 700;
          background: rgba(255,255,255,0.2);
          width: 20px; height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* ───── CTA ───── */
        .hp-cta {
          padding: 100px 40px;
          text-align: center;
          position: relative;
        }
        .hp-cta-inner {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .hp-cta-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 80% at 50% 50%, rgba(37,99,235,0.2) 0%, transparent 70%);
        }
        .hp-cta h2 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin-bottom: 20px;
          letter-spacing: -0.02em;
        }
        .hp-cta p {
          font-size: 18px;
          color: rgba(226,232,240,0.6);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        /* ───── FOOTER ───── */
        .hp-footer {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }
        .hp-footer-brand {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 16px;
          color: #fff;
        }
        .hp-footer-links {
          display: flex;
          gap: 24px;
        }
        .hp-footer-links a {
          font-size: 14px;
          color: rgba(226,232,240,0.45);
          text-decoration: none;
          transition: color 0.2s;
        }
        .hp-footer-links a:hover { color: #38bdf8; }
        .hp-footer-copy {
          font-size: 13px;
          color: rgba(226,232,240,0.3);
        }

        @media (max-width: 640px) {
          .hp-nav { padding: 0 20px; }
          .hp-stats { padding: 40px 20px; }
          .hp-stat { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); }
          .hp-stat:last-child { border-bottom: none; }
          .hp-features, .hp-roles { padding: 70px 20px; }
          .hp-footer { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="hp-root">
        {/* NAV */}
        <nav className="hp-nav">
          <div className="hp-nav-brand">
            <span className="hp-nav-logo-icon">🌟</span>
            SkillNest<span className="dot">.lk</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {user ? (
              <>
                <button className="hp-nav-btn" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => navigate('/dashboard')}>
                  🏠 Dashboard
                </button>
                <button className="hp-nav-btn" onClick={() => { logout(); navigate('/'); }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <button className="hp-nav-btn" onClick={() => navigate('/login')}>
                Get Started →
              </button>
            )}
          </div>
        </nav>

        {/* HERO */}
        <section className="hp-hero" ref={heroRef}>
          <div className="hp-hero-bg" />
          <div className="hp-grid-overlay" />
          <div className="hp-orb hp-orb-1" />
          <div className="hp-orb hp-orb-2" />
          <div className="hp-orb hp-orb-3" />
          <div className="hp-hero-content">
            <span className="hp-badge">🎓 SLIIT Academic Platform</span>
            <h1>
              Where Skills Are<br />
              <span className="highlight">Nurtured & Grown</span>
            </h1>
            <p>
              SkillNest.lk connects students with expert tutors, rich study resources,
              and real-time academic support — all in one powerful platform.
            </p>
            <div className="hp-hero-actions">
              {user ? (
                <button className="hp-btn-primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard →
                </button>
              ) : (
                <>
                  <button className="hp-btn-primary" onClick={() => navigate('/login')}>
                    Start Learning Today
                  </button>
                  <button className="hp-btn-ghost" onClick={() => navigate('/login')}>
                    I'm a Tutor
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="hp-stats">
          {stats.map((s) => (
            <div className="hp-stat" key={s.label}>
              <div className="hp-stat-value">{s.value}</div>
              <div className="hp-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES */}
        <section className="hp-features">
          <div className="hp-section-header">
            <div className="hp-section-label">Platform Features</div>
            <h2 className="hp-section-title">
              Everything you need to<br /><span>excel academically</span>
            </h2>
            <p className="hp-section-sub">
              A complete ecosystem built for students, tutors, and administrators
              to collaborate, learn, and grow together.
            </p>
          </div>
          <div className="hp-feature-grid">
            {features.map((f) => (
              <div className="hp-feature-card" key={f.title}>
                <div
                  className="hp-feature-icon-wrap"
                  style={{ background: `${f.color}22`, border: `1px solid ${f.color}44` }}
                >
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ROLES */}
        <section className="hp-roles">
          <div className="hp-roles-inner">
            <div className="hp-section-header">
              <div className="hp-section-label">Choose Your Path</div>
              <h2 className="hp-section-title">Built for every role</h2>
              <p className="hp-section-sub">
                Whether you're here to learn, teach, or manage — SkillNest has a tailored experience for you.
              </p>
            </div>
            <div className="hp-roles-grid">
              <div className="hp-role-card student" onClick={() => navigate('/login')}>
                <span className="hp-role-icon">🎓</span>
                <h3>Student</h3>
                <p>Access world-class resources and get help from expert tutors on demand.</p>
                <ul className="hp-role-list">
                  <li>Raise help tickets instantly</li>
                  <li>Browse & bookmark resources</li>
                  <li>Track your academic profile</li>
                  <li>Chat with tutors in real time</li>
                </ul>
              </div>
              <div className="hp-role-card tutor" onClick={() => navigate('/login')}>
                <span className="hp-role-icon">👨‍🏫</span>
                <h3>Tutor</h3>
                <p>Support students, share expertise, and manage your teaching schedule.</p>
                <ul className="hp-role-list">
                  <li>Manage student tickets</li>
                  <li>Upload study resources</li>
                  <li>Set availability status</li>
                  <li>Build your tutor profile</li>
                </ul>
              </div>
              <div className="hp-role-card admin" onClick={() => navigate('/login')}>
                <span className="hp-role-icon">🛡️</span>
                <h3>Admin</h3>
                <p>Oversee the entire platform with a comprehensive control dashboard.</p>
                <ul className="hp-role-list">
                  <li>Manage all users</li>
                  <li>Approve / reject resources</li>
                  <li>Monitor platform activity</li>
                  <li>Full CRUD access</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hp-cta">
          <div className="hp-cta-bg" />
          <div className="hp-cta-inner">
            <h2>Ready to unlock your potential?</h2>
            <p>Join hundreds of SLIIT students and tutors already using SkillNest to achieve more.</p>
            <button className="hp-btn-primary" style={{ fontSize: '17px', padding: '16px 48px' }} onClick={() => navigate('/login')}>
              Join SkillNest Today →
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hp-footer">
          <div className="hp-footer-brand">🌟 SkillNest.lk</div>
          <div className="hp-footer-links">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <span
              style={{ fontSize: '14px', color: 'rgba(226,232,240,0.45)', cursor: 'pointer' }}
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </div>
          <div className="hp-footer-copy">© 2024 SkillNest.lk — WE_314_2.2 · SLIIT</div>
        </footer>
      </div>
    </>
  );
}
