'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, CheckCircle2, RefreshCw, Sparkles, AlertCircle,
  Search, Shield, ShieldAlert, Edit, Trash2, ExternalLink,
  Phone, Mail, MapPin, Instagram, Award, LogOut
} from 'lucide-react';
import { createPublicSupabase } from '@/lib/supabase';

export default function AdminPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [adminInfo, setAdminInfo] = useState<any>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(true);
  const [working, setWorking] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Edit modal state
  const [editingArtist, setEditingArtist] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({
    business_name: '',
    bio: '',
    starting_price: 2500,
    city: '',
    area: '',
    instagram: '',
    experience: ''
  });

  const router = useRouter();

  async function load() {
    setBusy(true);
    setError('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const r = await fetch('/api/admin/artists', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Admin access required.');
      setRows(d.artists || []);
      setAdminInfo(d.admin || null);
    } catch (e: any) {
      setError(e.message || 'Could not load admin portal.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    setWorking(id);
    setError('');
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const r = await fetch('/api/admin/artists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ artistId: id, status })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setNotice(d.message || `Status updated to ${status}.`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Update failed.');
    } finally {
      setWorking('');
    }
  }

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'artist' : 'admin';
    if (!confirm(`Change role to ${newRole.toUpperCase()}?`)) return;

    setWorking(id);
    setError('');
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const r = await fetch('/api/admin/artists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({ artistId: id, role: newRole })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setNotice(`Role updated to ${newRole}.`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Role update failed.');
    } finally {
      setWorking('');
    }
  }

  function startEdit(artist: any) {
    setEditingArtist(artist);
    setEditForm({
      business_name: artist.business_name || '',
      bio: artist.bio || '',
      starting_price: artist.starting_price || 0,
      city: artist.city || '',
      area: artist.area || '',
      instagram: artist.instagram || '',
      experience: artist.experience || ''
    });
  }

  async function saveArtistEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingArtist) return;

    setWorking(editingArtist.id);
    setError('');
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const r = await fetch('/api/admin/artists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          artistId: editingArtist.id,
          ...editForm
        })
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setNotice('Artist profile details saved by admin.');
      setEditingArtist(null);
      await load();
    } catch (e: any) {
      setError(e.message || 'Edit failed.');
    } finally {
      setWorking('');
    }
  }

  async function deleteArtist(id: string, name: string) {
    if (!confirm(`Are you sure you want to PERMANENTLY delete "${name}"? This cannot be undone.`)) return;

    setWorking(id);
    setError('');
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      const r = await fetch(`/api/admin/artists?artistId=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token || ''}` }
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setNotice(`Artist ${name} deleted.`);
      await load();
    } catch (e: any) {
      setError(e.message || 'Delete failed.');
    } finally {
      setWorking('');
    }
  }

  async function signOut() {
    const sb = createPublicSupabase();
    await sb.auth.signOut();
    router.push('/');
  }

  // Filtered rows
  const filteredRows = rows.filter(a => {
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    const q = search.toLowerCase().trim();
    const matchesSearch = !q ||
      (a.business_name || '').toLowerCase().includes(q) ||
      (a.full_name || '').toLowerCase().includes(q) ||
      (a.email || '').toLowerCase().includes(q) ||
      (a.city || '').toLowerCase().includes(q) ||
      (a.area || '').toLowerCase().includes(q) ||
      (a.phone || '').includes(q);
    return matchesStatus && matchesSearch;
  });

  const totalCount = rows.length;
  const approvedCount = rows.filter(r => r.status === 'approved').length;
  const pendingCount = rows.filter(r => r.status === 'pending').length;
  const otherCount = rows.filter(r => ['rejected', 'suspended'].includes(r.status)).length;

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>bookflow<span className="brand-ai">.beauty</span><small>ADMIN SUPER-CONTROL</small></span>
        </Link>
        <div className="dashboard-nav-actions">
          <Link href="/dashboard" className="btn btn-outline">
            My Artist Dashboard
          </Link>
          <Link href="/" className="back-link"><ArrowLeft size={15} /> Directory</Link>
          <button className="btn btn-outline" onClick={signOut}><LogOut size={15} /> Sign out</button>
        </div>
      </header>

      <section className="dashboard-wrap">
        {/* Admin Header Banner */}
        <div className="dashboard-heading" style={{ background: 'white', padding: '24px 28px', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '24px' }}>
          <div>
            <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={14} style={{ color: 'var(--plum)' }} />
              LOGGED IN AS SUPER ADMIN: <strong>{adminInfo?.fullName || adminInfo?.email}</strong>
            </div>
            <h1 className="dashboard-title" style={{ fontSize: '32px' }}>
              Artist & User <em>Management.</em>
            </h1>
            <p className="auth-intro" style={{ margin: 0 }}>
              Full control over all artist profiles, status approvals, bio edits, and admin permissions.
            </p>
          </div>
          <button className="btn btn-outline" onClick={load}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {notice && <div className="notice notice-success"><CheckCircle2 size={18} />{notice}</div>}
        {error && <div className="notice notice-error"><AlertCircle size={18} />{error}</div>}

        {/* Stats Metrics */}
        <div className="dashboard-stats" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
          <div onClick={() => setFilterStatus('all')} style={{ cursor: 'pointer', border: filterStatus === 'all' ? '2px solid var(--plum)' : '1px solid var(--line)' }}>
            <small>TOTAL REGISTERED</small>
            <strong>{totalCount}</strong>
            <span>All artist accounts</span>
          </div>
          <div onClick={() => setFilterStatus('approved')} style={{ cursor: 'pointer', border: filterStatus === 'approved' ? '2px solid #547b62' : '1px solid var(--line)' }}>
            <small style={{ color: '#547b62' }}>APPROVED & LIVE</small>
            <strong style={{ color: '#357147' }}>{approvedCount}</strong>
            <span>Active in public directory</span>
          </div>
          <div onClick={() => setFilterStatus('pending')} style={{ cursor: 'pointer', border: filterStatus === 'pending' ? '2px solid #d1a45a' : '1px solid var(--line)' }}>
            <small style={{ color: '#9d752c' }}>PENDING REVIEW</small>
            <strong style={{ color: '#86631d' }}>{pendingCount}</strong>
            <span>Awaiting admin decision</span>
          </div>
          <div onClick={() => setFilterStatus('rejected')} style={{ cursor: 'pointer', border: filterStatus === 'rejected' ? '2px solid #a34c46' : '1px solid var(--line)' }}>
            <small style={{ color: '#a34c46' }}>SUSPENDED / REJECTED</small>
            <strong style={{ color: '#a34c46' }}>{otherCount}</strong>
            <span>Hidden from public</span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by business name, artist name, email, city, or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px 11px 36px',
                border: '1px solid var(--line)',
                borderRadius: '10px',
                background: 'white',
                fontSize: '13px'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn ${filterStatus === 'all' ? 'btn-plum' : 'btn-outline'}`}
              onClick={() => setFilterStatus('all')}
              style={{ fontSize: '11px', padding: '8px 12px' }}
            >
              All ({totalCount})
            </button>
            <button
              className={`btn ${filterStatus === 'pending' ? 'btn-plum' : 'btn-outline'}`}
              onClick={() => setFilterStatus('pending')}
              style={{ fontSize: '11px', padding: '8px 12px' }}
            >
              Pending ({pendingCount})
            </button>
            <button
              className={`btn ${filterStatus === 'approved' ? 'btn-plum' : 'btn-outline'}`}
              onClick={() => setFilterStatus('approved')}
              style={{ fontSize: '11px', padding: '8px 12px' }}
            >
              Approved ({approvedCount})
            </button>
            <button
              className={`btn ${filterStatus === 'rejected' ? 'btn-plum' : 'btn-outline'}`}
              onClick={() => setFilterStatus('rejected')}
              style={{ fontSize: '11px', padding: '8px 12px' }}
            >
              Suspended/Rejected
            </button>
          </div>
        </div>

        {/* Artists List */}
        {busy ? (
          <div className="dashboard-empty"><RefreshCw className="spin" /> Loading artist profiles…</div>
        ) : filteredRows.length === 0 ? (
          <div className="dashboard-empty">
            <CheckCircle2 size={32} />
            <h3>No artists found</h3>
            <p>Try clearing your search query or switching status filters.</p>
          </div>
        ) : (
          <div className="offer-list">
            {filteredRows.map(a => (
              <article className="offer-card" key={a.id} style={{ background: 'white', position: 'relative' }}>
                <div className="offer-top" style={{ alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`status-pill status-${a.status}`}>
                      ● {a.status.toUpperCase()}
                    </span>
                    {a.role === 'admin' ? (
                      <span className="status-pill status-approved" style={{ background: '#f5e9ee', color: '#54283f' }}>
                        👑 SUPER ADMIN
                      </span>
                    ) : (
                      <span className="status-pill" style={{ fontSize: '9px' }}>
                        Artist Account
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      onClick={() => startEdit(a)}
                    >
                      <Edit size={13} /> Edit Profile
                    </button>
                    {a.status === 'approved' && (
                      <Link href={`/artists/${a.slug}`} target="_blank" className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 10px' }}>
                        View Live <ExternalLink size={12} />
                      </Link>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', margin: '0 0 4px' }}>{a.business_name}</h3>
                    <p className="offer-event" style={{ margin: 0 }}>
                      <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      {a.area}, {a.city} · Starting from <b>₹{Number(a.starting_price || 0).toLocaleString('en-IN')}</b>
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: 'var(--muted)', flexWrap: 'wrap' }}>
                    {a.email && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} /> {a.email}
                      </span>
                    )}
                    {a.phone && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} /> {a.phone}
                      </span>
                    )}
                    {a.instagram && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#d62976' }}>
                        <Instagram size={13} /> {a.instagram}
                      </span>
                    )}
                    {a.experience && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#86631d' }}>
                        <Award size={13} /> {a.experience}
                      </span>
                    )}
                  </div>
                </div>

                {a.bio ? (
                  <p style={{ margin: '14px 0', fontSize: '12px', color: '#57444e', lineHeight: '1.6', background: '#faf5f7', padding: '10px 14px', borderRadius: '8px' }}>
                    {a.bio}
                  </p>
                ) : (
                  <p style={{ margin: '10px 0', fontSize: '11px', color: 'var(--muted)', fontStyle: 'italic' }}>
                    No bio provided yet.
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: 'var(--muted)', margin: '10px 0' }}>
                  <span><b>Services:</b> {a.services_count} active</span> · 
                  <span><b>Portfolio Photos:</b> {a.portfolio_count}</span> · 
                  <span><b>Registered:</b> {new Date(a.created_at).toLocaleDateString('en-IN')}</span>
                </div>

                {/* Admin Action Buttons */}
                <div className="offer-actions" style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', marginTop: '14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {a.status !== 'approved' && (
                    <button
                      className="btn btn-plum"
                      disabled={working === a.id}
                      onClick={() => setStatus(a.id, 'approved')}
                      style={{ background: '#357147' }}
                    >
                      <CheckCircle2 size={14} /> Approve Profile
                    </button>
                  )}

                  {a.status !== 'pending' && (
                    <button
                      className="btn btn-outline"
                      disabled={working === a.id}
                      onClick={() => setStatus(a.id, 'pending')}
                      style={{ color: '#86631d' }}
                    >
                      Set as Pending
                    </button>
                  )}

                  {a.status !== 'suspended' && (
                    <button
                      className="btn btn-outline"
                      disabled={working === a.id}
                      onClick={() => setStatus(a.id, 'suspended')}
                      style={{ color: '#a34c46' }}
                    >
                      Suspend Artist
                    </button>
                  )}

                  {a.status !== 'rejected' && (
                    <button
                      className="btn btn-outline"
                      disabled={working === a.id}
                      onClick={() => setStatus(a.id, 'rejected')}
                      style={{ color: '#a34c46' }}
                    >
                      Reject
                    </button>
                  )}

                  <button
                    className="btn btn-outline"
                    disabled={working === a.id}
                    onClick={() => toggleRole(a.id, a.role)}
                    style={{ marginLeft: 'auto' }}
                  >
                    {a.role === 'admin' ? (
                      <><ShieldAlert size={13} /> Revoke Admin</>
                    ) : (
                      <><Shield size={13} /> Grant Admin Access</>
                    )}
                  </button>

                  <button
                    className="btn btn-outline"
                    disabled={working === a.id}
                    onClick={() => deleteArtist(a.id, a.business_name)}
                    style={{ color: '#a34c46', borderColor: '#f1d2d0' }}
                    title="Delete permanently"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Admin Edit Artist Modal */}
      {editingArtist && (
        <div className="modal-backdrop" onClick={() => setEditingArtist(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="eyebrow">ADMIN DIRECT CONTROL</div>
            <h2>Edit <em>{editingArtist.business_name}</em></h2>
            <p className="modal-sub">Update this artist's profile information directly on their behalf.</p>

            <form onSubmit={saveArtistEdit} style={{ display: 'grid', gap: '16px' }}>
              <div className="form-two">
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Studio Name</b>
                  <input
                    type="text"
                    required
                    value={editForm.business_name}
                    onChange={e => setEditForm({ ...editForm, business_name: e.target.value })}
                  />
                </label>
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Starting Price (₹)</b>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editForm.starting_price}
                    onChange={e => setEditForm({ ...editForm, starting_price: Number(e.target.value) })}
                  />
                </label>
              </div>

              <div className="form-two">
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Instagram Handle / Link</b>
                  <input
                    type="text"
                    value={editForm.instagram}
                    onChange={e => setEditForm({ ...editForm, instagram: e.target.value })}
                  />
                </label>
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Experience (e.g. 5+ Years)</b>
                  <input
                    type="text"
                    value={editForm.experience}
                    onChange={e => setEditForm({ ...editForm, experience: e.target.value })}
                  />
                </label>
              </div>

              <div className="form-two">
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>City</b>
                  <input
                    type="text"
                    required
                    value={editForm.city}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                  />
                </label>
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Locality / Area</b>
                  <input
                    type="text"
                    required
                    value={editForm.area}
                    onChange={e => setEditForm({ ...editForm, area: e.target.value })}
                  />
                </label>
              </div>

              <label style={{ display: 'grid', gap: '6px' }}>
                <b>Artist Bio</b>
                <textarea
                  rows={4}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                />
              </label>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingArtist(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-plum" disabled={working === editingArtist.id}>
                  {working === editingArtist.id ? 'Saving…' : 'Save Changes as Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
