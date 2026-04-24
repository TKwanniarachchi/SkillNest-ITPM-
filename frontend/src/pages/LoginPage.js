import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  { key: 'student', icon: '🎓', label: 'Student', desc: 'Access courses & resources' },
  { key: 'tutor', icon: '👨‍🏫', label: 'Tutor', desc: 'Support & guide students' },
];

const ADMIN_ROLE = { key: 'admin', icon: '🛡️', label: 'Admin', desc: 'Manage the platform' };

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setMode('login');
    setError('');
    setForm({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          role: selectedRole.key,
        });

        alert(`${selectedRole.label} account created successfully ✅`);
        setMode('login');
        setForm({ name: '', email: '', password: '' });
      } else {
        const data = await login(form.email, form.password);

        if (data?.role !== selectedRole.key) {
          setError(`This account is not registered as a ${selectedRole.label}.`);
          setLoading(false);
          return;
        }

        alert(`${selectedRole.label} login successful ✅`);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0f2a6b 0%, #123b9b 50%, #1b5fc9 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 24px;
          position: relative;
          overflow-x: hidden;
        }

        .auth-container {
          width: 100%;
          max-width: 1000px;
          position: relative;
          z-index: 1;
        }

        .brand-box {
          text-align: center;
          margin-bottom: 34px;
          color: white;
        }

        .brand-logo {
          font-size: 54px;
          margin-bottom: 10px;
        }

        .brand-title {
          font-size: 40px;
          font-weight: 800;
          margin: 0;
        }

        .brand-subtitle {
          margin-top: 10px;
          font-size: 16px;
          color: rgba(255,255,255,0.85);
        }

        .role-cards {
          display: flex;
          justify-content: center;
          align-items: stretch;
          gap: 24px;
          margin-top: 30px;
          flex-wrap: wrap;
        }

        .role-card {
          width: 100%;
          max-width: 280px;
          min-height: 220px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 28px 20px;
          text-align: center;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .role-card:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.18);
        }

        .role-card.selected {
          border: 2px solid #ffffff;
          background: rgba(255, 255, 255, 0.22);
        }

        .role-icon {
          font-size: 44px;
          margin-bottom: 14px;
        }

        .role-card h3 {
          margin: 0 0 8px 0;
          font-size: 22px;
          font-weight: 700;
        }

        .role-card p {
          margin: 0;
          font-size: 14px;
          color: rgba(255,255,255,0.82);
        }

        .helper-text {
          text-align: center;
          color: rgba(255,255,255,0.75);
          margin-top: 18px;
          font-size: 14px;
        }

        .admin-inline-card {
          display: flex;
          align-items: center;
          gap: 14px;
          max-width: 440px;
          margin: 22px auto 0;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 16px;
          padding: 14px 20px;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
        }
        .admin-inline-card:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.28);
          transform: translateY(-2px);
        }
        .admin-inline-card.admin-selected {
          border-color: #ffffff;
          background: rgba(255,255,255,0.18);
        }
        .admin-inline-icon {
          font-size: 24px;
          flex-shrink: 0;
        }
        .admin-inline-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .admin-inline-text strong {
          font-size: 14px;
          color: #ffffff;
          font-weight: 700;
        }
        .admin-inline-text span {
          font-size: 12px;
          color: rgba(255,255,255,0.6);
        }
        .admin-inline-arrow {
          font-size: 22px;
          color: rgba(255,255,255,0.5);
          font-weight: 300;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 20, 58, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 20;
          padding: 20px;
          backdrop-filter: blur(6px);
        }

        .modal {
          width: 100%;
          max-width: 500px;
          background: #ffffff;
          border-radius: 28px;
          padding: 34px 30px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.28);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .modal-title {
          margin: 0;
          font-size: 32px;
          font-weight: 800;
          color: #163a8a;
        }

        .modal-subtitle {
          margin-top: 8px;
          font-size: 14px;
          color: #6b7280;
        }

        .alert-error {
          background: #fde8e8;
          color: #b42318;
          border: 1px solid #f3b4b4;
          padding: 12px 14px;
          border-radius: 12px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 8px;
        }

        .form-control {
          width: 100%;
          height: 52px;
          border: 1.5px solid #d1d5db;
          border-radius: 14px;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
          background: #f9fafb;
        }

        .modal-footer {
          display: flex;
          gap: 12px;
          margin-top: 22px;
        }

        .btn {
          border: none;
          border-radius: 14px;
          height: 50px;
          padding: 0 18px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-primary {
          flex: 1;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }

        .btn-outline {
          flex: 1;
          background: #eef2ff;
          color: #1d4ed8;
          border: 1px solid #c7d2fe;
        }

        .link-text {
          text-align: center;
          margin-top: 14px;
          font-size: 14px;
          color: #1d4ed8;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .modal-footer {
            flex-direction: column;
          }
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-container">
          <div className="brand-box">
            <div className="brand-logo">🌟</div>
            <h1 className="brand-title">SkillNest.lk</h1>
            <p className="brand-subtitle">Nurturing Skills & Empowering Futures</p>
          </div>

          <div className="role-cards">
            {ROLES.map((role) => (
              <div
                key={role.key}
                className={`role-card ${selectedRole?.key === role.key ? 'selected' : ''}`}
                onClick={() => handleRoleClick(role)}
              >
                <div className="role-icon">{role.icon}</div>
                <h3>{role.label}</h3>
                <p>{role.desc}</p>
              </div>
            ))}
          </div>

          <p className="helper-text">Select your role to continue</p>

          <div
            className={`admin-inline-card ${selectedRole?.key === 'admin' ? 'admin-selected' : ''}`}
            onClick={() => handleRoleClick(ADMIN_ROLE)}
          >
            <span className="admin-inline-icon">🛡️</span>
            <div className="admin-inline-text">
              <strong>Administrator Access</strong>
              <span>Sign in to manage the platform</span>
            </div>
            <span className="admin-inline-arrow">›</span>
          </div>
        </div>

        {selectedRole && (
          <div className="modal-overlay" onClick={() => setSelectedRole(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedRole.icon}</div>
                <h2 className="modal-title">
                  {mode === 'login'
                    ? `${selectedRole.label} Login`
                    : `Create ${selectedRole.label} Account`}
                </h2>
                <p className="modal-subtitle">
                  Please continue with your {selectedRole.label.toLowerCase()} account details.
                </p>
              </div>

              {error && <div className="alert-error">{error}</div>}

              {mode === 'forgot' ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    onClick={() => setError('Password reset feature is not available right now.')}
                  >
                    Send Reset Link
                  </button>

                  <p className="link-text" onClick={() => setMode('login')}>
                    ← Back to Login
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setSelectedRole(null)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
                    </button>
                  </div>

                  <p
                    className="link-text"
                    onClick={() => {
                      setMode(mode === 'login' ? 'register' : 'login');
                      setError('');
                    }}
                  >
                    {mode === 'login'
                      ? "Don't have an account? Register"
                      : 'Already have an account? Login'}
                  </p>

                  {mode === 'login' && (
                    <p
                      className="link-text"
                      onClick={() => {
                        setMode('forgot');
                        setError('');
                      }}
                    >
                      Forgot password?
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}