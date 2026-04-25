import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/shared/Layout';

const SUBJECTS = ['Data Structures', 'Networking', 'Database Management', 'Web Development',
  'Operating Systems', 'Software Engineering', 'Algorithms', 'Mathematics', 'Machine Learning'];
const SEMESTERS = ['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'];

const TYPE_INFO = {
  pdf:   { icon: '📄', label: 'PDF Document', desc: 'Upload a PDF file', color: '#be123c', bg: '#fff1f2', border: '#fecdd3' },
  link:  { icon: '🔗', label: 'External Link', desc: 'Share a URL', color: '#1d4ed8', bg: '#eff6ff', border: '#bfdbfe' },
  notes: { icon: '📝', label: 'Notes', desc: 'Upload your notes', color: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
  video: { icon: '🎥', label: 'Video', desc: 'Link a video', color: '#7e22ce', bg: '#fdf4ff', border: '#e9d5ff' },
  other: { icon: '📁', label: 'Other', desc: 'Any other resource', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' },
};

export default function UploadResourcePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', subject: '', semester: '',
    resourceType: 'pdf', externalLink: '', tags: []
  });
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
      setTagInput('');
    }
  };

  const removeTag = (t) => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== t) }));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') data.append(k, JSON.stringify(v));
        else data.append(k, v);
      });
      if (file) data.append('file', file);
      await axios.post('/api/resources', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Resource uploaded successfully! Pending admin approval.');
      setTimeout(() => navigate('/resources'), 2200);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  const needsFile = form.resourceType === 'pdf' || form.resourceType === 'notes';
  const currentType = TYPE_INFO[form.resourceType];

  return (
    <Layout>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #2563eb 60%, #3B82F6 100%)',
        borderRadius: '20px', padding: '1.75rem 2rem',
        marginBottom: '2rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50px', right: '-30px', width: '180px', height: '180px',
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none'
        }} />
        <nav style={{ marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>Dashboard &gt; </span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
            onClick={() => navigate('/resources')}>Resources</span>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}> &gt; </span>
          <span style={{ fontSize: '0.78rem', color: 'white', fontWeight: 500 }}>Upload</span>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>⬆️</span>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', margin: 0 }}>Upload Resource</h1>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: '0.2rem 0 0' }}>
              Share academic materials with your students and peers.
            </p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px',
          padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.4rem' }}>✅</span>
          <div>
            <p style={{ fontWeight: 600, color: '#15803d', fontSize: '0.9rem', margin: 0 }}>Upload Successful!</p>
            <p style={{ color: '#16a34a', fontSize: '0.82rem', margin: '0.2rem 0 0' }}>{success}</p>
          </div>
        </div>
      )}
      {error && (
        <div style={{
          background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '14px',
          padding: '1rem 1.25rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.4rem' }}>⚠️</span>
          <p style={{ color: '#be123c', fontSize: '0.875rem', margin: 0, fontWeight: 500 }}>{error}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Main Form */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '2rem',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
        }}>
          <form onSubmit={handleSubmit}>

            {/* Resource Type Selector */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.75rem' }}>
                Resource Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.6rem' }}>
                {Object.entries(TYPE_INFO).map(([key, info]) => (
                  <button type="button" key={key} onClick={() => set('resourceType', key)} style={{
                    padding: '0.75rem 0.4rem', borderRadius: '12px', cursor: 'pointer',
                    border: form.resourceType === key ? `2px solid ${info.color}` : '2px solid #e2e8f0',
                    background: form.resourceType === key ? info.bg : 'white',
                    transition: 'all 0.2s', textAlign: 'center', fontFamily: 'inherit'
                  }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{info.icon}</div>
                    <div style={{
                      fontSize: '0.68rem', fontWeight: 600,
                      color: form.resourceType === key ? info.color : '#94a3b8'
                    }}>{info.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Title *</label>
              <input required value={form.title} onChange={e => set('title', e.target.value)}
                placeholder="Enter a clear, descriptive title..." style={inputStyle}
                onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)}
                placeholder="Briefly describe what this resource covers..." rows={3}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
            </div>

            {/* Subject & Semester */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Subject *</label>
                <select required value={form.subject} onChange={e => set('subject', e.target.value)} style={selectStyle}>
                  <option value="">Select Subject</option>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Semester *</label>
                <select required value={form.semester} onChange={e => set('semester', e.target.value)} style={selectStyle}>
                  <option value="">Select Semester</option>
                  {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* File or Link */}
            {needsFile ? (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Upload File <span style={{ color: '#94a3b8', fontWeight: 400 }}>(max 10MB)</span></label>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                  style={{
                    border: `2px dashed ${dragOver ? '#3B82F6' : file ? '#86efac' : '#e2e8f0'}`,
                    borderRadius: '14px', padding: '2rem',
                    textAlign: 'center', cursor: 'pointer',
                    background: dragOver ? '#eff6ff' : file ? '#f0fdf4' : '#fafafa',
                    transition: 'all 0.2s'
                  }}>
                  <input id="file-input" type="file" accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                  {file ? (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                      <p style={{ fontWeight: 600, color: '#15803d', fontSize: '0.9rem', margin: 0 }}>{file.name}</p>
                      <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB · Click to change
                      </p>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>☁️</div>
                      <p style={{ fontWeight: 600, color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                        Drag & drop your file here
                      </p>
                      <p style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                        or click to browse · PDF, DOC, TXT supported
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>External Link</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '0.9rem', color: '#94a3b8'
                  }}>🔗</span>
                  <input type="url" value={form.externalLink}
                    onChange={e => set('externalLink', e.target.value)}
                    placeholder="https://..."
                    style={{ ...inputStyle, paddingLeft: '2.4rem' }}
                    onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>
            )}

            {/* Tags */}
            <div style={{ marginBottom: '1.75rem' }}>
              <label style={labelStyle}>Tags <span style={{ color: '#94a3b8', fontWeight: 400 }}>(optional)</span></label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  placeholder="Add a tag (e.g. sorting, trees)..."
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={e => { e.target.style.borderColor = '#3B82F6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                <button type="button" onClick={addTag} style={{
                  padding: '0.65rem 1rem', background: '#eff6ff',
                  color: '#1d4ed8', border: '1.5px solid #bfdbfe', borderRadius: '10px',
                  fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>+ Add</button>
              </div>
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {form.tags.map(t => (
                    <span key={t} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      background: '#dbeafe', color: '#1d4ed8', padding: '0.25rem 0.5rem 0.25rem 0.75rem',
                      borderRadius: '20px', fontSize: '0.78rem', fontWeight: 500, border: '1px solid #bfdbfe'
                    }}>
                      {t}
                      <button type="button" onClick={() => removeTag(t)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6',
                        fontSize: '1rem', lineHeight: 1, padding: 0, display: 'flex', alignItems: 'center'
                      }}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Row */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={() => navigate('/resources')} style={{
                padding: '0.75rem 1.5rem', background: 'white',
                color: '#64748b', border: '1.5px solid #e2e8f0', borderRadius: '12px',
                fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.2s'
              }}>Cancel</button>
              <button type="submit" disabled={loading} style={{
                flex: 1, padding: '0.75rem 1.5rem',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '0.9rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 6px 16px rgba(59,130,246,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}>
                {loading ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%', display: 'inline-block',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Uploading...
                  </>
                ) : '⬆️ Upload Resource'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Current Type Preview */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>
              Selected Type
            </h3>
            <div style={{
              background: currentType.bg, border: `1px solid ${currentType.border}`,
              borderRadius: '12px', padding: '1.25rem', textAlign: 'center'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentType.icon}</div>
              <div style={{ fontWeight: 700, color: currentType.color, fontSize: '1rem' }}>{currentType.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.3rem' }}>{currentType.desc}</div>
            </div>
          </div>

          {/* Guidelines */}
          <div style={{
            background: 'white', borderRadius: '16px', padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#374151', marginBottom: '1rem' }}>
              📋 Upload Guidelines
            </h3>
            {[
              { icon: '✅', text: 'Use a clear, descriptive title' },
              { icon: '✅', text: 'Max file size: 10 MB' },
              { icon: '✅', text: 'Supported: PDF, DOC, TXT' },
              { icon: '✅', text: 'Add relevant tags for discoverability' },
              { icon: '⏳', text: 'Resources need admin approval' },
              { icon: '🤖', text: 'AI summary available after upload' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.6rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{item.icon}</span>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* Progress Indicator */}
          <div style={{
            background: 'linear-gradient(135deg, #1E3A8A, #3B82F6)',
            borderRadius: '16px', padding: '1.5rem', color: 'white'
          }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem' }}>📊 Form Progress</h3>
            {[
              { label: 'Title', done: !!form.title },
              { label: 'Subject', done: !!form.subject },
              { label: 'Semester', done: !!form.semester },
              { label: 'File / Link', done: needsFile ? !!file : !!form.externalLink },
            ].map(({ label, done }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem' }}>{done ? '✅' : '⬜'}</span>
                <span style={{
                  fontSize: '0.8rem', color: done ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
                  fontWeight: done ? 600 : 400
                }}>{label}</span>
              </div>
            ))}
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '10px', background: 'white',
                  width: `${([!!form.title, !!form.subject, !!form.semester, needsFile ? !!file : !!form.externalLink].filter(Boolean).length / 4) * 100}%`,
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .upload-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  );
}

const labelStyle = {
  display: 'block', fontSize: '0.875rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.5rem'
};

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  border: '1.5px solid #e2e8f0', borderRadius: '10px',
  fontFamily: 'inherit', fontSize: '0.875rem',
  outline: 'none', transition: 'all 0.2s', background: 'white'
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none', cursor: 'pointer',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.85rem center'
};
