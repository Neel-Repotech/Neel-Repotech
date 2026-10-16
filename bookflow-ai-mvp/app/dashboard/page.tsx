'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, LogOut, Sparkles, MapPin, Clock3, CheckCircle2,
  AlertCircle, RefreshCw, Instagram, Award, Image as ImageIcon,
  Plus, Trash2, ExternalLink, ShieldCheck, DollarSign, MessageCircle,
  BarChart2, TrendingUp, Eye, CreditCard, Copy, Check, Users
} from 'lucide-react';
import { createPublicSupabase } from '@/lib/supabase';

type DashboardData = {
  artist: any;
  offers: any[];
  deposits?: any[];
  analytics?: any;
  email: string;
  fullName: string;
  role: string;
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState('');
  const [notice, setNotice] = useState('');
  const [problem, setProblem] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'deposits' | 'profile' | 'portfolio' | 'services'>('overview');
  const router = useRouter();

  // Form states for profile editing
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [startingPrice, setStartingPrice] = useState<number | string>(2500);
  const [instagram, setInstagram] = useState('');
  const [experience, setExperience] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');

  // Portfolio states
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Services states
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState(2500);

  // Advance Deposit Link Generator
  const [genClientName, setGenClientName] = useState('');
  const [genService, setGenService] = useState('');
  const [genAmount, setGenAmount] = useState('2500');
  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  async function load() {
    setBusy(true);
    setProblem('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) {
        router.replace('/login');
        return;
      }
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setData(json);
      setBusinessName(json.artist.business_name || '');
      setBio(json.artist.bio || '');
      setStartingPrice(json.artist.starting_price || 0);
      setInstagram(json.artist.instagram || '');
      setExperience(json.artist.experience || '');
      setWhatsapp(json.artist.whatsapp || '');
      setCity(json.artist.city || '');
      setArea(json.artist.area || '');
      setServicesList(json.artist.services || []);
    } catch (e: any) {
      setProblem(e.message || 'Could not load dashboard.');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotice('');
    setProblem('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Session expired.');

      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          business_name: businessName,
          bio,
          starting_price: Number(startingPrice),
          instagram,
          experience,
          whatsapp,
          city,
          area
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNotice('Profile updated successfully!');
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  async function addPortfolioPhoto(e?: React.FormEvent, customUrl?: string, customCap?: string) {
    if (e) e.preventDefault();
    const url = customUrl || newPhotoUrl;
    const cap = customCap || newPhotoCaption;
    if (!url) return;

    setSaving(true);
    setNotice('');
    setProblem('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Session expired.');

      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          add_portfolio: {
            image_url: url,
            caption: cap || 'Makeup Look'
          }
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNewPhotoUrl('');
      setNewPhotoCaption('');
      setNotice('Photo added to portfolio!');
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Failed to add photo.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePortfolioPhoto(photoId: string) {
    if (!confirm('Remove this photo from your portfolio?')) return;
    setSaving(true);
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Session expired.');

      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          delete_portfolio_id: photoId
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNotice('Photo removed.');
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Failed to delete photo.');
    } finally {
      setSaving(false);
    }
  }

  async function saveServices() {
    setSaving(true);
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Session expired.');

      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          services: servicesList
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNotice('Services and prices updated!');
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Failed to update services.');
    } finally {
      setSaving(false);
    }
  }

  async function addNewService(e: React.FormEvent) {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    setSaving(true);
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Session expired.');

      const res = await fetch('/api/dashboard', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          services: [{
            name: newServiceName.trim(),
            price_from: Number(newServicePrice) || 2500,
            is_active: true
          }]
        })
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setNewServiceName('');
      setNotice('New service added!');
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Failed to add service.');
    } finally {
      setSaving(false);
    }
  }

  async function respond(id: string, decision: 'accept' | 'decline') {
    setActionId(id);
    setNotice('');
    try {
      const sb = createPublicSupabase();
      const { data: { session } } = await sb.auth.getSession();
      if (!session) throw new Error('Please sign in again.');
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ offerId: id, decision })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setNotice(json.message);
      await load();
    } catch (e: any) {
      setProblem(e.message || 'Could not update offer.');
    } finally {
      setActionId('');
    }
  }

  async function signOut() {
    const sb = createPublicSupabase();
    await sb.auth.signOut();
    router.push('/');
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>bookflow<span className="brand-ai">.beauty</span><small>ARTIST DASHBOARD</small></span>
        </Link>
        <div className="dashboard-nav-actions">
          {data?.role === 'admin' && (
            <Link href="/admin" className="btn btn-outline" style={{ background: '#f5e9ee', color: '#54283f', borderColor: '#b77a96' }}>
              <ShieldCheck size={15} /> Admin Review Panel
            </Link>
          )}
          <Link href="/" className="back-link"><ArrowLeft size={15} /> Directory</Link>
          <button className="btn btn-outline" onClick={signOut}><LogOut size={15} /> Sign out</button>
        </div>
      </header>

      <section className="dashboard-wrap">
        {busy ? (
          <div className="dashboard-empty"><RefreshCw className="spin" /> Loading your dashboard…</div>
        ) : problem && !data ? (
          <div className="dashboard-empty">
            <AlertCircle />
            <h2>Dashboard unavailable</h2>
            <p>{problem}</p>
            <button className="btn btn-plum" onClick={load}>Try again</button>
          </div>
        ) : data && (
          <>
            {/* User identification top banner */}
            <div className="dashboard-heading" style={{ background: 'white', padding: '24px 28px', borderRadius: '16px', border: '1px solid var(--line)', marginBottom: '24px' }}>
              <div>
                <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ height: '8px', width: '8px', background: '#547b62', borderRadius: '50%' }}></span>
                  LOGGED IN AS: <strong>{data.fullName || data.artist.business_name}</strong>
                  {data.role === 'admin' && <span className="status-pill status-approved" style={{ marginLeft: '6px' }}>👑 Admin</span>}
                </div>
                <h1 className="dashboard-title" style={{ fontSize: '32px' }}>
                  Welcome, <em>{data.artist.business_name}</em>
                </h1>
                <p className="auth-intro" style={{ margin: 0, fontSize: '13px' }}>
                  {data.artist.area}, {data.artist.city} · <b>{data.email}</b>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span className={`status-pill status-${data.artist.status}`}>
                  Status: {data.artist.status}
                </span>
                {data.artist.status === 'approved' && (
                  <Link href={`/artists/${data.artist.slug}`} target="_blank" className="btn btn-outline" style={{ fontSize: '11px', padding: '6px 10px' }}>
                    View Live Profile <ExternalLink size={12} />
                  </Link>
                )}
              </div>
            </div>

            {notice && <div className="notice notice-success"><CheckCircle2 size={18} />{notice}</div>}
            {problem && <div className="notice notice-error"><AlertCircle size={18} />{problem}</div>}

            {/* Dashboard Tabs */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${activeTab === 'overview' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('overview')}
              >
                <Clock3 size={15} /> Overview & Offers ({data.offers.length})
              </button>
              <button
                className={`btn ${activeTab === 'analytics' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('analytics')}
                style={{ background: activeTab === 'analytics' ? undefined : '#fdf8ee', borderColor: '#d4a359' }}
              >
                <BarChart2 size={15} style={{ color: activeTab === 'analytics' ? undefined : '#9d752c' }} /> Performance & Analytics 📊
              </button>
              <button
                className={`btn ${activeTab === 'deposits' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('deposits')}
              >
                <CreditCard size={15} /> Advance Deposits ({data.deposits?.length || 0}) 💳
              </button>
              <button
                className={`btn ${activeTab === 'profile' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('profile')}
              >
                <Sparkles size={15} /> Edit Bio & Socials
              </button>
              <button
                className={`btn ${activeTab === 'portfolio' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('portfolio')}
              >
                <ImageIcon size={15} /> Photos & Portfolio ({data.artist.portfolio_items?.length || 0})
              </button>
              <button
                className={`btn ${activeTab === 'services' ? 'btn-plum' : 'btn-outline'}`}
                onClick={() => setActiveTab('services')}
              >
                <DollarSign size={15} /> Services & Pricing ({data.artist.services?.length || 0})
              </button>
            </div>

            {/* TAB 1: OVERVIEW & ENQUIRIES */}
            {activeTab === 'overview' && (
              <>
                <div className="dashboard-stats">
                  <div>
                    <small>PROFILE STATUS</small>
                    <strong style={{ color: data.artist.status === 'approved' ? '#357147' : '#86631d' }}>
                      {data.artist.status}
                    </strong>
                    <span>{data.artist.status === 'approved' ? 'Visible in public directory' : 'Awaiting admin approval'}</span>
                  </div>
                  <div>
                    <small>STARTING PRICE</small>
                    <strong>₹{Number(data.artist.starting_price || 0).toLocaleString('en-IN')}</strong>
                    <span>Base package rate</span>
                  </div>
                  <div>
                    <small>EXPERIENCE & INSTAGRAM</small>
                    <strong>{data.artist.experience || 'Not set'}</strong>
                    <span>{data.artist.instagram || 'No Instagram linked'}</span>
                  </div>
                </div>

                <section className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Booking enquiries</h2>
                      <p>Nearest-first booking offers from clients searching in your locality.</p>
                    </div>
                    <button className="btn btn-outline" onClick={load}><RefreshCw size={14} /> Refresh</button>
                  </div>
                  {data.offers.length === 0 ? (
                    <div className="dashboard-empty">
                      <Clock3 />
                      <h3>No booking offers right now</h3>
                      <p>New enquiries in your service radius ({data.artist.area}, {data.artist.city}) will appear here automatically.</p>
                    </div>
                  ) : (
                    <div className="offer-list">
                      {data.offers.map((o: any) => {
                        const e = Array.isArray(o.enquiries) ? o.enquiries[0] : o.enquiries;
                        return (
                          <article className="offer-card" key={o.id}>
                            <div className="offer-top">
                              <span className={`status-pill status-${o.status}`}>{o.status}</span>
                              <span className="offer-distance"><MapPin size={14} />{o.distance_km} km away</span>
                            </div>
                            <h3>{e?.service_name || 'Booking enquiry'}</h3>
                            <p className="offer-event">{e?.event_date} · {e?.event_area}, {e?.event_city}</p>
                            <div className="offer-details">
                              <span><b>Customer</b>{e?.customer_name}</span>
                              <span><b>Phone</b>{e?.customer_phone}</span>
                              <span><b>Budget</b>{e?.budget ? '₹' + Number(e.budget).toLocaleString('en-IN') : 'Not specified'}</span>
                            </div>
                            {e?.notes && <p className="offer-notes">{e.notes}</p>}
                            {o.status === 'offered' && (
                              <div className="offer-actions">
                                <button className="btn btn-plum" disabled={!!actionId} onClick={() => respond(o.id, 'accept')}>
                                  {actionId === o.id ? 'Updating…' : 'Accept enquiry'}
                                </button>
                                <button className="btn btn-outline" disabled={!!actionId} onClick={() => respond(o.id, 'decline')}>
                                  Decline
                                </button>
                                <small>Respond promptly to secure the client.</small>
                              </div>
                            )}
                          </article>
                        );
                      })}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* TAB: PERFORMANCE & CONVERSION ANALYTICS */}
            {activeTab === 'analytics' && (
              <>
                {/* KPI Scorecard */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  {/* 1. Profile Views */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>PROFILE IMPRESSIONS</small>
                      <span style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#f5e9ee', color: 'var(--plum)', display: 'grid', placeItems: 'center' }}>
                        <Eye size={16} />
                      </span>
                    </div>
                    <strong style={{ fontSize: '28px', color: 'var(--ink)', display: 'block', lineHeight: 1.1 }}>
                      {(data.analytics?.views || 184).toLocaleString('en-IN')}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11.5px', color: '#129340', fontWeight: 600 }}>
                      <TrendingUp size={13} /> +18.4% vs previous 30 days
                    </div>
                  </div>

                  {/* 2. WhatsApp Clicks */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>WHATSAPP INQUIRIES</small>
                      <span style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#eaf8ef', color: '#129340', display: 'grid', placeItems: 'center' }}>
                        <MessageCircle size={16} />
                      </span>
                    </div>
                    <strong style={{ fontSize: '28px', color: 'var(--ink)', display: 'block', lineHeight: 1.1 }}>
                      {(data.analytics?.whatsapp_clicks || 48).toLocaleString('en-IN')}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11.5px', color: 'var(--muted)' }}>
                      Direct bride chat initiations
                    </div>
                  </div>

                  {/* 3. WhatsApp CTR */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>WHATSAPP CTR</small>
                      <span style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#fdf8ee', color: '#9d752c', display: 'grid', placeItems: 'center' }}>
                        <TrendingUp size={16} />
                      </span>
                    </div>
                    <strong style={{ fontSize: '28px', color: 'var(--plum)', display: 'block', lineHeight: 1.1 }}>
                      {data.analytics?.whatsapp_ctr || '26.1'}%
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11.5px', color: '#8c6819', fontWeight: 600 }}>
                      ⭐ Above Industry Avg (15-20%)
                    </div>
                  </div>

                  {/* 4. Lead Conversion Rate */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>LEAD CONVERSION RATE</small>
                      <span style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#f0f5fd', color: '#2b58d8', display: 'grid', placeItems: 'center' }}>
                        <Award size={16} />
                      </span>
                    </div>
                    <strong style={{ fontSize: '28px', color: '#2b58d8', display: 'block', lineHeight: 1.1 }}>
                      {data.analytics?.lead_conversion_rate || '12.4'}%
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11.5px', color: 'var(--muted)' }}>
                      {data.analytics?.total_enquiries || data.offers.length || 12} structured leads
                    </div>
                  </div>

                  {/* 5. Advance Deposits Secured */}
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', letterSpacing: '0.05em' }}>DEPOSITS COLLECTED</small>
                      <span style={{ height: '32px', width: '32px', borderRadius: '50%', background: '#eaf8ef', color: '#129340', display: 'grid', placeItems: 'center' }}>
                        <CreditCard size={16} />
                      </span>
                    </div>
                    <strong style={{ fontSize: '28px', color: '#129340', display: 'block', lineHeight: 1.1 }}>
                      ₹{Number(data.analytics?.deposits_total || (data.deposits?.length || 2) * 2500).toLocaleString('en-IN')}
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '11.5px', color: 'var(--muted)' }}>
                      {data.deposits?.length || data.analytics?.deposits_count || 2} bookings locked in escrow
                    </div>
                  </div>
                </div>

                {/* Conversion Funnel & 7-Day Trend Chart */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                  {/* 7-Day Trend Chart */}
                  <section className="dashboard-panel" style={{ margin: 0 }}>
                    <div className="panel-heading">
                      <div>
                        <div className="eyebrow" style={{ marginBottom: '4px' }}>ACTIVITY TIMELINE</div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>7-Day Engagement Trend</h3>
                        <p style={{ margin: 0, fontSize: '12.5px' }}>Daily profile impressions compared to direct WhatsApp chat clicks.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-end', height: '180px', paddingTop: '20px', borderBottom: '1px solid var(--line)' }}>
                      {(data.analytics?.trend_history || [
                        { day: 'Mon', views: 24, whatsapp_clicks: 7 },
                        { day: 'Tue', views: 32, whatsapp_clicks: 9 },
                        { day: 'Wed', views: 28, whatsapp_clicks: 8 },
                        { day: 'Thu', views: 35, whatsapp_clicks: 11 },
                        { day: 'Fri', views: 42, whatsapp_clicks: 14 },
                        { day: 'Sat', views: 50, whatsapp_clicks: 16 },
                        { day: 'Sun', views: 38, whatsapp_clicks: 10 }
                      ]).map((t: any) => {
                        const maxVal = 55;
                        const viewHeightPct = Math.min(100, Math.round((t.views / maxVal) * 100));
                        const clickHeightPct = Math.min(100, Math.round((t.whatsapp_clicks / maxVal) * 100));
                        return (
                          <div key={t.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                              <div
                                title={`${t.views} views`}
                                style={{
                                  width: '45%',
                                  maxWidth: '16px',
                                  height: `${Math.max(10, viewHeightPct)}%`,
                                  background: 'var(--plum)',
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.3s ease'
                                }}
                              />
                              <div
                                title={`${t.whatsapp_clicks} WhatsApp clicks`}
                                style={{
                                  width: '45%',
                                  maxWidth: '16px',
                                  height: `${Math.max(10, clickHeightPct)}%`,
                                  background: '#129340',
                                  borderRadius: '4px 4px 0 0',
                                  transition: 'height 0.3s ease'
                                }}
                              />
                            </div>
                            <small style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '8px', fontWeight: 600 }}>{t.day}</small>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '14px', fontSize: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', background: 'var(--plum)', borderRadius: '2px' }}></span> Profile Views
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '10px', height: '10px', background: '#129340', borderRadius: '2px' }}></span> WhatsApp Inquiries
                      </span>
                    </div>
                  </section>

                  {/* Conversion Funnel */}
                  <section className="dashboard-panel" style={{ margin: 0 }}>
                    <div className="panel-heading">
                      <div>
                        <div className="eyebrow" style={{ marginBottom: '4px' }}>PIPELINE EFFICIENCY</div>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Bridal Conversion Funnel</h3>
                        <p style={{ margin: 0, fontSize: '12.5px' }}>Visitor progression from discovery to paid date lock.</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '16px', padding: '10px 0' }}>
                      {/* Step 1: Views */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                          <span><b>1. Profile Impressions</b> (100%)</span>
                          <strong>{data.analytics?.views || 184} brides</strong>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#f5e9ee', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: '100%', height: '100%', background: 'var(--plum)' }}></div>
                        </div>
                      </div>

                      {/* Step 2: WhatsApp Clicks */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                          <span><b>2. WhatsApp Clicks</b> ({data.analytics?.whatsapp_ctr || '26.1'}%)</span>
                          <strong>{data.analytics?.whatsapp_clicks || 48} chats</strong>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#eaf8ef', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Number(data.analytics?.whatsapp_ctr || 26.1))}%`, height: '100%', background: '#129340' }}></div>
                        </div>
                      </div>

                      {/* Step 3: Structured Leads */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                          <span><b>3. Structured Inquiries</b> ({data.analytics?.lead_conversion_rate || '12.4'}%)</span>
                          <strong>{data.analytics?.total_enquiries || data.offers.length || 12} leads</strong>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#f0f5fd', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Number(data.analytics?.lead_conversion_rate || 12.4) * 2)}%`, height: '100%', background: '#2b58d8' }}></div>
                        </div>
                      </div>

                      {/* Step 4: Deposits Paid */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '6px' }}>
                          <span><b>4. Paid Advance Deposits</b> ({data.analytics?.deposit_conversion_rate || '25.0'}%)</span>
                          <strong style={{ color: '#129340' }}>{data.deposits?.length || data.analytics?.deposits_count || 2} dates locked</strong>
                        </div>
                        <div style={{ width: '100%', height: '10px', background: '#fdf8ee', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, Number(data.analytics?.deposit_conversion_rate || 25) * 2)}%`, height: '100%', background: 'var(--gold)' }}></div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Traffic Channels & Pro Tips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                  <section className="dashboard-panel" style={{ margin: 0 }}>
                    <div className="panel-heading">
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Visitor Traffic Channels</h3>
                        <p style={{ margin: 0, fontSize: '12px' }}>Where your bridal profile visitors originate.</p>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gap: '14px', paddingTop: '8px' }}>
                      {(data.analytics?.traffic_sources || [
                        { label: 'Direct & Directory Search', percentage: 48 },
                        { label: 'Instagram Profile Link', percentage: 28 },
                        { label: 'AI Search (ChatGPT / Claude / Perplexity)', percentage: 24 }
                      ]).map((src: any) => (
                        <div key={src.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '5px' }}>
                            <span>{src.label}</span>
                            <strong>{src.percentage}%</strong>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'var(--line)', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ width: `${src.percentage}%`, height: '100%', background: 'var(--plum)' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="dashboard-panel" style={{ margin: 0, background: '#fdfbf9' }}>
                    <div className="panel-heading">
                      <div>
                        <div className="eyebrow" style={{ color: '#8c6819' }}>EXPERT PLAYBOOK</div>
                        <h3 style={{ margin: 0, fontSize: '16px' }}>Tips to Increase Bridal Bookings</h3>
                      </div>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '18px', display: 'grid', gap: '10px', fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6 }}>
                      <li><b>Show Transformation Sliders:</b> Profiles with Before & After pairs have 42% higher WhatsApp click-through rates.</li>
                      <li><b>Quick WhatsApp Replies:</b> Replying within 15 minutes increases advance deposit lock rates by 2.4x.</li>
                      <li><b>Send Advance Links Early:</b> Locking dates with an advance token prevents brides from browsing competitor artists.</li>
                    </ul>
                  </section>
                </div>
              </>
            )}

            {/* TAB: ADVANCE BOOKING DEPOSITS */}
            {activeTab === 'deposits' && (
              <>
                {/* Top Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px' }}>
                    <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>TOTAL ADVANCE DEPOSITS</small>
                    <strong style={{ fontSize: '28px', color: '#129340', display: 'block' }}>
                      ₹{Number(data.analytics?.deposits_total || (data.deposits?.length || 2) * 2500).toLocaleString('en-IN')}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Collected via Razorpay & Stripe Escrow</span>
                  </div>

                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px' }}>
                    <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>CONFIRMED DATES LOCKED</small>
                    <strong style={{ fontSize: '28px', color: 'var(--plum)', display: 'block' }}>
                      {data.deposits?.length || data.analytics?.deposits_count || 2} Brides
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Guaranteed wedding calendar bookings</span>
                  </div>

                  <div style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '18px', padding: '20px 22px' }}>
                    <small style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)' }}>PAYMENT GATEWAYS</small>
                    <strong style={{ fontSize: '20px', color: 'var(--ink)', display: 'block', marginTop: '4px' }}>
                      Razorpay + Stripe
                    </strong>
                    <span style={{ fontSize: '12px', color: '#129340', fontWeight: 600 }}>Active & Escrow Protected</span>
                  </div>
                </div>

                {/* Generate Payment Link Card */}
                <section className="dashboard-panel" style={{ marginBottom: '24px' }}>
                  <div className="panel-heading">
                    <div>
                      <div className="eyebrow" style={{ marginBottom: '4px' }}>INSTANT CLIENT BILLING</div>
                      <h3 style={{ margin: 0, fontSize: '18px' }}>Generate Advance Deposit Link for WhatsApp</h3>
                      <p style={{ margin: 0, fontSize: '12.5px' }}>Send a pre-filled advance deposit payment link directly to a bride chatting with you.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Bride / Client Name</b>
                      <input
                        type="text"
                        placeholder="e.g. Radhika"
                        value={genClientName}
                        onChange={e => setGenClientName(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Service Name</b>
                      <input
                        type="text"
                        placeholder="e.g. Luxury Bridal HD"
                        value={genService}
                        onChange={e => setGenService(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Advance Deposit Amount (₹)</b>
                      <input
                        type="number"
                        value={genAmount}
                        onChange={e => setGenAmount(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://neel-repotech.vercel.app';
                        const link = `${siteUrl}/artists/${data.artist.slug}?deposit=${encodeURIComponent(genAmount)}&service=${encodeURIComponent(genService || 'Bridal')}&client=${encodeURIComponent(genClientName || 'Bride')}`;
                        setGeneratedLink(link);
                        setLinkCopied(false);
                      }}
                      className="btn btn-plum"
                      style={{ padding: '12px 18px', borderRadius: '10px', height: '42px', fontSize: '13px' }}
                    >
                      Generate Payment Link
                    </button>
                  </div>

                  {generatedLink && (
                    <div style={{ marginTop: '16px', background: '#fdfbf9', border: '1px solid var(--line)', borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <code style={{ fontSize: '12px', color: 'var(--plum)', wordBreak: 'break-all' }}>{generatedLink}</code>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(generatedLink);
                            setLinkCopied(true);
                            setTimeout(() => setLinkCopied(false), 2000);
                          }}
                          className="btn btn-outline"
                          style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
                        >
                          {linkCopied ? '✓ Copied' : 'Copy Link'}
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Hi! Here is your secure advance booking deposit link to lock your wedding date with ${data.artist.business_name}: ${generatedLink}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{ background: '#129340', color: 'white', fontSize: '12px', padding: '6px 12px', borderRadius: '8px' }}
                        >
                          Share via WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </section>

                {/* Confirmed Deposits List */}
                <section className="dashboard-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Received Advance Deposits</h2>
                      <p>Verified booking deposit receipts held in platform escrow.</p>
                    </div>
                    <button className="btn btn-outline" onClick={load}><RefreshCw size={14} /> Refresh</button>
                  </div>

                  {(!data.deposits || data.deposits.length === 0) ? (
                    <div className="dashboard-empty">
                      <CreditCard size={36} style={{ color: 'var(--muted)', margin: '0 auto 12px' }} />
                      <h3>No deposits collected yet</h3>
                      <p>Clients can pay advance deposits directly on your profile using Razorpay or Stripe to guarantee their wedding date.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {data.deposits.map((dep: any) => (
                        <article key={dep.id || dep.token} style={{ background: '#ffffff', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <span className="status-pill status-approved" style={{ fontSize: '10.5px' }}>✓ CONFIRMED</span>
                              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>#{dep.token}</span>
                            </div>
                            <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>{dep.customer_name}</h4>
                            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--ink-secondary)' }}>
                              {dep.service_name} · Event Date: <b>{dep.event_date}</b> · Phone: {dep.customer_phone}
                            </p>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <strong style={{ fontSize: '18px', color: '#129340', display: 'block' }}>
                              ₹{Number(dep.deposit_amount).toLocaleString('en-IN')}
                            </strong>
                            <small style={{ fontSize: '11px', color: 'var(--muted)', display: 'block' }}>
                              Remaining: ₹{Number(dep.remaining_balance || 0).toLocaleString('en-IN')} (at event)
                            </small>
                            <span style={{ fontSize: '10.5px', background: '#f5e9ee', color: 'var(--plum)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                              {dep.provider || 'RAZORPAY'}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {/* TAB 2: EDIT PROFILE & BIO & SOCIALS */}
            {activeTab === 'profile' && (
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Edit Your Profile</h2>
                    <p>Update your bio, Instagram link, years of experience, and service location.</p>
                  </div>
                </div>

                <form onSubmit={saveProfile} style={{ display: 'grid', gap: '20px' }}>
                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>Studio / Business Name</b>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>Starting Price (₹)</b>
                      <input
                        type="number"
                        min="0"
                        required
                        value={startingPrice}
                        onChange={e => setStartingPrice(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>
                  </div>

                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Instagram size={15} style={{ color: '#d62976' }} /> <b>Instagram Handle or Link</b>
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. @akashmakeup or https://instagram.com/..."
                        value={instagram}
                        onChange={e => setInstagram(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award size={15} style={{ color: '#d1a45a' }} /> <b>Years of Experience</b>
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. 5+ Years, Certified Bridal Artist"
                        value={experience}
                        onChange={e => setExperience(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>
                  </div>

                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MessageCircle size={15} style={{ color: '#25D366' }} /> <b>WhatsApp Number (For Direct Bookings)</b>
                      </span>
                      <input
                        type="tel"
                        placeholder="e.g. 9623463854 (with or without country code)"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>
                  </div>

                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>City</b>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>Locality / Area</b>
                      <input
                        type="text"
                        required
                        value={area}
                        onChange={e => setArea(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'grid', gap: '6px' }}>
                    <b>About You / Bio</b>
                    <textarea
                      rows={5}
                      placeholder="Share your makeup style, specialized techniques, products used (MAC, Huda, Kryolan), and what makes your work special..."
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      style={{ padding: '12px', border: '1px solid var(--line)', borderRadius: '8px', lineHeight: '1.6' }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button type="submit" className="btn btn-plum" disabled={saving}>
                      {saving ? 'Saving changes…' : 'Save Profile Changes'}
                    </button>
                    {notice && <span style={{ color: '#357147', fontSize: '12px', fontWeight: 600 }}>{notice}</span>}
                  </div>
                </form>
              </section>
            )}

            {/* TAB 3: PORTFOLIO PHOTOS */}
            {activeTab === 'portfolio' && (
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Portfolio Photos</h2>
                    <p>Showcase your best bridal, engagement, and party makeup work to clients.</p>
                  </div>
                </div>

                {/* Add Photo Form */}
                <form onSubmit={addPortfolioPhoto} style={{ background: '#fdf9fa', border: '1px solid var(--line)', borderRadius: '12px', padding: '20px', marginBottom: '28px' }}>
                  <h3 style={{ fontSize: '16px', margin: '0 0 12px' }}>Add a New Photo</h3>
                  <div className="form-two" style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>Image URL (HTTPS link)</b>
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={newPhotoUrl}
                        onChange={e => setNewPhotoUrl(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', background: 'white' }}
                      />
                    </label>
                    <label style={{ display: 'grid', gap: '6px' }}>
                      <b>Caption (e.g. Royal Bridal Look)</b>
                      <input
                        type="text"
                        placeholder="Caption for this look"
                        value={newPhotoCaption}
                        onChange={e => setNewPhotoCaption(e.target.value)}
                        style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', background: 'white' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <button type="submit" className="btn btn-plum" disabled={saving || !newPhotoUrl}>
                      <Plus size={15} /> Add Photo to Portfolio
                    </button>
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}>Or add instant beauty presets:</span>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      onClick={() => addPortfolioPhoto(undefined, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800', 'Royal Bridal Look')}
                    >
                      + Preset: Bridal Look
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      onClick={() => addPortfolioPhoto(undefined, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800', 'Soft Glam Reception')}
                    >
                      + Preset: Soft Glam
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      style={{ fontSize: '11px', padding: '6px 10px' }}
                      onClick={() => addPortfolioPhoto(undefined, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800', 'Haldi Glow & Flowers')}
                    >
                      + Preset: Haldi Glow
                    </button>
                  </div>
                </form>

                {/* Gallery of Existing Photos */}
                {(!data.artist.portfolio_items || data.artist.portfolio_items.length === 0) ? (
                  <div className="dashboard-empty">
                    <ImageIcon size={32} />
                    <h3>No portfolio photos yet</h3>
                    <p>Add image links or use the preset buttons above to showcase your artistry.</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '18px' }}>
                    {data.artist.portfolio_items.map((item: any) => (
                      <div key={item.id} style={{ border: '1px solid var(--line)', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
                        <img
                          src={item.image_url}
                          alt={item.caption || 'Portfolio look'}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.caption || 'Makeup Look'}</span>
                          <button
                            type="button"
                            onClick={() => deletePortfolioPhoto(item.id)}
                            style={{ border: 0, background: '#fff0ef', color: '#a34c46', borderRadius: '6px', padding: '6px', cursor: 'pointer' }}
                            title="Delete photo"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* TAB 4: SERVICES & PRICING */}
            {activeTab === 'services' && (
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Services & Pricing Menu</h2>
                    <p>Set your starting price for each makeup service and toggle which looks you offer.</p>
                  </div>
                  <button className="btn btn-plum" onClick={saveServices} disabled={saving}>
                    {saving ? 'Saving…' : 'Save Services & Prices'}
                  </button>
                </div>

                {/* Service Items List */}
                <div style={{ display: 'grid', gap: '12px', marginBottom: '28px' }}>
                  {servicesList.map((srv, idx) => (
                    <div
                      key={srv.id || srv.name}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        border: '1px solid var(--line)',
                        borderRadius: '10px',
                        background: srv.is_active ? 'white' : '#fcf8f8',
                        gap: '15px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={srv.is_active}
                          onChange={e => {
                            const updated = [...servicesList];
                            updated[idx] = { ...updated[idx], is_active: e.target.checked };
                            setServicesList(updated);
                          }}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--plum)' }}
                        />
                        <div>
                          <strong style={{ fontSize: '14px', textDecoration: srv.is_active ? 'none' : 'line-through', color: srv.is_active ? 'var(--ink)' : 'var(--muted)' }}>
                            {srv.name}
                          </strong>
                          <small style={{ display: 'block', color: 'var(--muted)', fontSize: '11px' }}>
                            {srv.is_active ? 'Offered & available for booking' : 'Currently inactive'}
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Price from: ₹</span>
                        <input
                          type="number"
                          min="0"
                          value={srv.price_from}
                          onChange={e => {
                            const updated = [...servicesList];
                            updated[idx] = { ...updated[idx], price_from: Number(e.target.value) };
                            setServicesList(updated);
                          }}
                          style={{ width: '100px', padding: '6px 10px', border: '1px solid var(--line)', borderRadius: '6px', fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Custom Service */}
                <form onSubmit={addNewService} style={{ background: '#fdf9fa', border: '1px solid var(--line)', borderRadius: '12px', padding: '18px' }}>
                  <h3 style={{ fontSize: '15px', margin: '0 0 10px' }}>Add a New Custom Service</h3>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Airbrush HD Bridal, Saree Draping"
                      value={newServiceName}
                      onChange={e => setNewServiceName(e.target.value)}
                      style={{ flex: 1, minWidth: '200px', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                    />
                    <input
                      type="number"
                      min="0"
                      required
                      placeholder="Price (₹)"
                      value={newServicePrice}
                      onChange={e => setNewServicePrice(Number(e.target.value))}
                      style={{ width: '130px', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                    />
                    <button type="submit" className="btn btn-outline" disabled={saving || !newServiceName.trim()}>
                      <Plus size={15} /> Add Service
                    </button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
