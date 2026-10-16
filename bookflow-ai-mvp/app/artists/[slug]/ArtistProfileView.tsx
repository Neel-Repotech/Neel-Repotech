'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MapPin, Sparkles, ArrowLeft, CheckCircle2, Instagram, Award,
  MessageCircle, Star, Plus, X, Heart, ShieldCheck, Clock, Check,
  CreditCard, Shield, Calendar, Phone, Mail, User, AlertCircle
} from 'lucide-react';

export default function ArtistProfileView({ artist }: { artist: any }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [reviews, setReviews] = useState<any[]>(artist.reviews || []);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewEvent, setReviewEvent] = useState('Bridal Makeup');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewNotice, setReviewNotice] = useState('');
  const [saved, setSaved] = useState(false);

  // Advance Booking Deposit & Payment State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const services = (artist.services || []).filter((s: any) => s.is_active);
  const defaultService = services[0] || { name: 'Bridal Couture Artistry', price_from: artist.starting_price || 20000 };
  const [depositService, setDepositService] = useState(defaultService.name);
  const [depositPrice, setDepositPrice] = useState(defaultService.price_from);
  const [depositAmount, setDepositAmount] = useState(Math.max(2500, Math.round(defaultService.price_from * 0.2)));
  const [eventDate, setEventDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [paymentProvider, setPaymentProvider] = useState<'razorpay' | 'stripe'>('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [depositReceipt, setDepositReceipt] = useState<any>(null);
  const [depositError, setDepositError] = useState('');

  // Track profile view on page mount
  useEffect(() => {
    if (artist?.id) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId: artist.id, eventType: 'profile_view' })
      }).catch(() => {});
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const dep = params.get('deposit');
      const srv = params.get('service');
      const cli = params.get('client');
      if (dep) {
        setDepositAmount(Number(dep) || 2500);
        setShowDepositModal(true);
      }
      if (srv) setDepositService(srv);
      if (cli) setClientName(cli);
    }
  }, [artist?.id]);

  function handleWhatsAppClick() {
    if (artist?.id) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistId: artist.id, eventType: 'whatsapp_click' })
      }).catch(() => {});
    }
  }

  function handleSelectServiceForDeposit(serviceName: string) {
    setDepositService(serviceName);
    const found = services.find((s: any) => s.name === serviceName);
    const price = found?.price_from || artist.starting_price || 20000;
    setDepositPrice(price);
    setDepositAmount(Math.max(2500, Math.round(price * 0.2)));
  }

  async function handlePayDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !eventDate) {
      setDepositError('Please provide your name, contact phone number, and event date.');
      return;
    }

    setIsProcessingPayment(true);
    setDepositError('');
    try {
      // 1. Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId: artist.id,
          serviceName: depositService,
          totalServicePrice: depositPrice,
          depositAmount,
          eventDate,
          customerName: clientName.trim(),
          customerPhone: clientPhone.trim(),
          customerEmail: clientEmail.trim(),
          provider: paymentProvider
        })
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create deposit order.');

      // 2. Verify payment (in live environment, executes Razorpay/Stripe checkout; in sandbox, authenticates test transaction)
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: paymentProvider,
          orderId: orderData.orderId,
          paymentId: `pay_${paymentProvider}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          artistId: artist.id,
          depositAmount,
          totalAmount: depositPrice,
          customerName: clientName.trim(),
          customerPhone: clientPhone.trim(),
          customerEmail: clientEmail.trim(),
          serviceName: depositService,
          eventDate,
          notes: clientNotes.trim()
        })
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment confirmation failed.');

      setDepositReceipt(verifyData);
    } catch (err: any) {
      setDepositError(err.message || 'Payment could not be completed.');
    } finally {
      setIsProcessingPayment(false);
    }
  }
  const portfolio = (artist.portfolio_items || []).sort((x: any, y: any) => (x.sort_order || 0) - (y.sort_order || 0));

  // WhatsApp setup
  const cleanPhone = (artist.whatsapp || artist.phone || '919623463854').replace(/[^\d]/g, '');
  const waPhone = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
  const waMsg = `Hi ${artist.business_name}, I saw your profile on BookFlow Beauty. I am looking for makeup services in ${artist.area}, ${artist.city}. Are you available for bookings?`;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(waMsg)}`;

  // Instagram
  const instagram = artist.instagram || '';
  const instagramHref = instagram
    ? (instagram.startsWith('http') ? instagram : `https://instagram.com/${instagram.replace('@', '')}`)
    : null;

  // Before & After
  const beforeAfter = artist.before_after || {
    before: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    after: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800'
  };

  // Review calculations
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalReviews).toFixed(1)
    : '5.0';

  async function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    setSubmittingReview(true);
    setReviewNotice('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistId: artist.id,
          author: reviewName.trim(),
          rating: reviewRating,
          event: reviewEvent,
          comment: reviewComment.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (data.review) {
        setReviews([data.review, ...reviews]);
      }
      setReviewNotice('Thank you! Your verified review has been published.');
      setTimeout(() => {
        setShowReviewModal(false);
        setReviewName('');
        setReviewComment('');
        setReviewNotice('');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  }

  return (
    <main className="profile-page">
      {/* Top Header */}
      <header className="nav wrap" style={{ height: '76px', marginBottom: '20px' }}>
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span>
        </Link>
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Return to directory
        </Link>
      </header>

      {/* HERO SECTION */}
      <section className="profile-hero">
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '18px' }}>
          <div className="eyebrow" style={{ margin: 0, padding: '6px 14px' }}>
            <CheckCircle2 size={14} /> VERIFIED ARTIST PROFILE
          </div>
          {artist.experience && (
            <span className="status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--rose-soft)', color: 'var(--plum)', border: '1px solid rgba(236, 221, 228, 0.8)' }}>
              <Award size={14} /> {artist.experience}
            </span>
          )}
          {totalReviews > 0 && (
            <span className="status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'var(--gold-pale)', color: '#9d752c', border: '1px solid rgba(212, 163, 89, 0.3)' }}>
              <Star size={13} fill="currentColor" /> {avgRating} ({totalReviews} verified reviews)
            </span>
          )}
          <button
            onClick={() => setSaved(!saved)}
            className="status-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: 'auto',
              background: saved ? '#fff0f5' : '#ffffff',
              color: saved ? '#d82b6b' : 'var(--muted)',
              border: '1px solid var(--line)',
              cursor: 'pointer',
              transition: 'var(--transition-smooth)'
            }}
          >
            <Heart size={14} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved to Favorites' : 'Save Artist'}
          </button>
        </div>

        <h1>{artist.business_name}</h1>
        <p className="profile-location">
          <MapPin size={17} style={{ color: 'var(--gold-rich)' }} />
          {artist.area}, {artist.city}
        </p>
        <p className="profile-bio">
          {artist.bio || 'Professional bridal and couture event makeup artist. Dedicated to high-definition, luminous long-wear glam tailored to your individual skin tone and feature harmony.'}
        </p>

        <div className="profile-price">
          Starting from <strong>₹{Number(artist.starting_price || 0).toLocaleString('en-IN')}</strong>
          <span style={{ fontSize: '11px', color: 'var(--muted)', marginLeft: '10px' }}>(Includes consultation & skin prep)</span>
        </div>

        {/* Action Buttons: 1-Click WhatsApp & Platform Enquiry & Instagram */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginTop: '14px' }}>
          {/* Direct 1-Click WhatsApp Button with Glowing Luxury Accent */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #1ec85c 0%, #129340 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 24px',
              fontWeight: 700,
              fontSize: '13.5px',
              boxShadow: '0 8px 25px rgba(30, 200, 92, 0.35)',
              borderRadius: '14px'
            }}
          >
            <MessageCircle size={19} fill="white" /> Book via WhatsApp
          </a>

          {/* Advance Booking Deposit Payment Button */}
          <button
            type="button"
            onClick={() => {
              setShowDepositModal(true);
              if (artist?.id) {
                fetch('/api/analytics/track', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ artistId: artist.id, eventType: 'deposit_attempt' })
                }).catch(() => {});
              }
            }}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #43122b 0%, #6f2b4c 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '9px',
              padding: '13px 22px',
              fontWeight: 700,
              fontSize: '13.5px',
              borderRadius: '14px',
              border: '1px solid rgba(212, 163, 89, 0.45)',
              boxShadow: '0 8px 25px rgba(67, 18, 43, 0.35)',
              cursor: 'pointer'
            }}
          >
            <CreditCard size={18} style={{ color: 'var(--gold)' }} /> Lock Date (Pay Advance)
          </button>

          {/* Booking Enquiry Modal Anchor */}
          <Link
            className="btn btn-outline"
            href={`/?artist=${encodeURIComponent(artist.slug)}#artists`}
            style={{ padding: '13px 20px', borderRadius: '14px' }}
          >
            Send Enquiry →
          </Link>

          {/* Instagram Profile */}
          {instagramHref && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#d62976',
                borderColor: '#eec2d4',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '14px',
                padding: '12px 18px'
              }}
            >
              <Instagram size={17} /> Instagram ({instagram.startsWith('@') ? instagram : '@' + instagram.split('/').filter(Boolean).pop()})
            </a>
          )}
        </div>
      </section>

      {/* BEFORE & AFTER GLAM TRANSFORMATION SLIDER */}
      <section className="profile-content" style={{ marginBottom: '56px' }}>
        <div className="panel-heading">
          <div>
            <div className="eyebrow" style={{ marginBottom: '10px' }}>COUTURE PORTFOLIO FEATURE</div>
            <h2>Interactive Transformation Slider</h2>
            <p>Drag the center handle to see real client skin prep transitioning into finished bridal glam.</p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '780px',
            height: '440px',
            borderRadius: '24px',
            overflow: 'hidden',
            margin: '0 auto',
            border: '2px solid rgba(212, 163, 89, 0.45)',
            boxShadow: '0 24px 60px rgba(41, 8, 25, 0.16)',
            userSelect: 'none',
            background: '#1a0c14'
          }}
        >
          {/* After Image (Background) */}
          <img
            src={beforeAfter.after}
            alt="After Bridal Glam"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: '18px',
              right: '18px',
              background: 'rgba(31, 8, 20, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'var(--gold-light)',
              padding: '7px 16px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              border: '1px solid rgba(212, 163, 89, 0.4)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
          >
            COUTURE GLAM ✨
          </span>

          {/* Before Image (Clipped Overlay) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${sliderPos}%`,
              overflow: 'hidden',
              borderRight: '3px solid rgba(255, 255, 255, 0.95)',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.5)'
            }}
          >
            <img
              src={beforeAfter.before}
              alt="Before Skin Prep"
              style={{ width: '780px', height: '440px', objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '18px',
                left: '18px',
                background: 'rgba(31, 8, 20, 0.8)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: '99px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
              }}
            >
              RAW / NATURAL 🌿
            </span>
          </div>

          {/* Slider Input Controller */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={e => setSliderPos(Number(e.target.value))}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'ew-resize',
              zIndex: 10
            }}
            aria-label="Drag to compare before and after looks"
          />

          {/* Divider Handle Marker with Gold Diamond Center */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${sliderPos}%`,
              transform: 'translate(-50%, -50%)',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffffff 0%, #fdf8ee 100%)',
              border: '2px solid var(--gold)',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 0 14px rgba(212, 163, 89, 0.5)',
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
              zIndex: 5,
              transition: 'transform 0.1s ease'
            }}
          >
            <span style={{ fontSize: '15px', color: 'var(--plum)', fontWeight: 800 }}>⬌</span>
          </div>
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section className="profile-content">
        <div className="panel-heading">
          <div>
            <div className="eyebrow" style={{ marginBottom: '10px' }}>SERVICE MENU</div>
            <h2>Signature Services & Starting Prices</h2>
            <p>Customize your bridal look or event styling. Group packages available upon consultation.</p>
          </div>
        </div>

        {services.length ? (
          <div className="profile-service-grid">
            {services.map((s: any) => (
              <article className="profile-service" key={s.name}>
                <span className="service-symbol"><Sparkles size={18} /></span>
                <h3>{s.name}</h3>
                <p>{s.description || 'Customized for your skin tone, outfit jewelry and wedding ceremony lighting.'}</p>
                <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--line)' }}>
                  <strong style={{ fontSize: '18px', color: 'var(--ink)' }}>
                    ₹{Number(s.price_from || 0).toLocaleString('en-IN')}
                  </strong>
                  {s.duration_minutes && (
                    <small style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--muted)', marginTop: '4px' }}>
                      <Clock size={12} /> {s.duration_minutes} minutes
                    </small>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>Contact the artist for service details.</p>
        )}

        {/* PORTFOLIO GALLERY */}
        {portfolio.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <div className="panel-heading">
              <div>
                <div className="eyebrow" style={{ marginBottom: '10px' }}>CURATED LOOKBOOK</div>
                <h2 className="portfolio-heading" style={{ margin: 0 }}>Bridal & Reception Looks</h2>
              </div>
            </div>
            <div className="profile-portfolio">
              {portfolio.map((p: any) => (
                <figure key={p.image_url}>
                  <img src={p.image_url} alt={p.caption || `${artist.business_name} makeup portfolio`} loading="lazy" />
                  <figcaption>{p.caption || 'Bridal & Party Look'}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* CLIENT REVIEWS & EXPERIENCES */}
        <section style={{ marginTop: '64px' }}>
          <div className="panel-heading" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" style={{ marginBottom: '10px' }}>REAL BRIDAL EXPERIENCES</div>
              <h2>Client Reviews & Testimonials</h2>
              <p>Authentic reviews from brides and clients who booked with {artist.business_name}.</p>
            </div>
            <button className="btn btn-outline" onClick={() => setShowReviewModal(true)}>
              <Plus size={15} /> Write a Review
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {reviews.map((r: any) => (
              <div
                key={r.id || r.author}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--line)',
                  borderRadius: '20px',
                  padding: '26px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'var(--transition-smooth)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        height: '38px',
                        width: '38px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--rose) 0%, #fadce7 100%)',
                        color: 'var(--plum)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        boxShadow: '0 4px 10px rgba(111, 43, 76, 0.12)'
                      }}
                    >
                      {r.author ? r.author.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '14px', display: 'block' }}>{r.author}</strong>
                      <small style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--green)', fontSize: '10.5px', fontWeight: 600 }}>
                        <Check size={11} /> Verified client · {r.event}
                      </small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '3px', color: 'var(--gold-rich)' }}>
                    {[...Array(Number(r.rating) || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', color: 'var(--ink-secondary)', lineHeight: '1.7', fontSize: '13.5px', fontStyle: 'italic' }}>
                  "{r.comment}"
                </p>
                {r.date && (
                  <small style={{ display: 'block', color: 'var(--muted-light)', fontSize: '10px', marginTop: 'auto', paddingTop: '12px' }}>
                    Published on {r.date}
                  </small>
                )}
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* WRITE A REVIEW MODAL */}
      {showReviewModal && (
        <div className="modal-backdrop" onClick={() => setShowReviewModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <button className="modal-close" onClick={() => setShowReviewModal(false)}><X /></button>
            <div className="eyebrow">CLIENT FEEDBACK</div>
            <h2>Review <em>{artist.business_name}</em></h2>
            <p className="modal-sub">Share your experience to help future brides and clients find their perfect look.</p>

            {reviewNotice && (
              <div className="notice notice-success" style={{ marginBottom: '18px' }}>
                <CheckCircle2 size={16} /> {reviewNotice}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} style={{ display: 'grid', gap: '16px' }}>
              <label style={{ display: 'grid', gap: '6px' }}>
                <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Your Full Name</b>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Deshmukh"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '10px' }}
                />
              </label>

              <div className="form-two">
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Rating (Stars)</b>
                  <select
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                    style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '10px' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gap: '6px' }}>
                  <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Event / Occasion</b>
                  <select
                    value={reviewEvent}
                    onChange={e => setReviewEvent(e.target.value)}
                    style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '10px' }}
                  >
                    <option>Bridal Makeup</option>
                    <option>Engagement Glam</option>
                    <option>Reception Look</option>
                    <option>Haldi / Mehendi</option>
                    <option>Party Makeup</option>
                  </select>
                </label>
              </div>

              <label style={{ display: 'grid', gap: '6px' }}>
                <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Your Feedback / Experience</b>
                <textarea
                  rows={4}
                  required
                  placeholder="How was the look, foundation match, skin prep, punctuality and hygiene?"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  style={{ padding: '12px 14px', border: '1px solid var(--line)', borderRadius: '10px', lineHeight: '1.6' }}
                />
              </label>

              <button type="submit" className="btn btn-plum full-width" disabled={submittingReview} style={{ padding: '14px' }}>
                {submittingReview ? 'Publishing Review…' : 'Submit Verified Review ✨'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADVANCE BOOKING DEPOSIT PAYMENT MODAL */}
      {showDepositModal && (
        <div className="modal-backdrop" onClick={() => !isProcessingPayment && setShowDepositModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '24px' }}>
            <button className="modal-close" disabled={isProcessingPayment} onClick={() => setShowDepositModal(false)}><X /></button>

            {depositReceipt ? (
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #129340 0%, #1ec85c 100%)', borderRadius: '50%', color: 'white', display: 'grid', placeItems: 'center', margin: '0 auto 16px', boxShadow: '0 8px 25px rgba(30, 200, 92, 0.4)' }}>
                  <CheckCircle2 size={36} />
                </div>
                <div className="eyebrow" style={{ color: '#129340' }}>✨ DATE RESERVED & LOCKED</div>
                <h2 style={{ fontSize: '26px', margin: '6px 0 10px' }}>Advance Deposit Confirmed!</h2>
                <p style={{ color: 'var(--ink-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                  Your wedding date has been secured with <strong>{artist.business_name}</strong>. An official token has been generated.
                </p>

                <div style={{ background: '#fdfbf9', border: '1px solid var(--line)', borderRadius: '16px', padding: '18px 20px', textAlign: 'left', marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Receipt Token</span>
                    <strong style={{ fontSize: '13px', color: 'var(--plum)', letterSpacing: '0.04em' }}>#{depositReceipt.receiptToken}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Service & Date</span>
                    <strong style={{ fontSize: '12.5px' }}>{depositService} · {eventDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Advance Deposit Paid</span>
                    <strong style={{ fontSize: '14px', color: '#129340' }}>₹{Number(depositReceipt.depositAmount).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Remaining Due at Event</span>
                    <strong style={{ fontSize: '13px', color: 'var(--ink)' }}>₹{Number(depositReceipt.remainingBalance).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Payment Reference</span>
                    <small style={{ fontSize: '11px', color: 'var(--muted)' }}>{depositReceipt.paymentId}</small>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <a
                    href={depositReceipt.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                    style={{
                      background: 'linear-gradient(135deg, #1ec85c 0%, #129340 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '14px',
                      fontSize: '14px',
                      fontWeight: 700,
                      borderRadius: '12px',
                      boxShadow: '0 8px 25px rgba(30, 200, 92, 0.3)'
                    }}
                  >
                    <MessageCircle size={18} fill="white" /> Send Confirmed Token on WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setShowDepositModal(false);
                      setDepositReceipt(null);
                    }}
                    style={{ padding: '12px', borderRadius: '12px' }}
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--gold-rich)' }} /> PLATFORM ESCROW DEPOSIT
                </div>
                <h2 style={{ fontSize: '24px', margin: '6px 0 8px' }}>Lock Date with <em>{artist.business_name}</em></h2>
                <p className="modal-sub" style={{ fontSize: '13px', marginBottom: '18px' }}>
                  Pay an advance booking token to reserve your wedding date and prevent other brides from booking.
                </p>

                {depositError && (
                  <div className="notice notice-error" style={{ marginBottom: '16px' }}>
                    <AlertCircle size={16} /> {depositError}
                  </div>
                )}

                <form onSubmit={handlePayDeposit} style={{ display: 'grid', gap: '14px' }}>
                  {/* Select Service */}
                  <label style={{ display: 'grid', gap: '5px' }}>
                    <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Select Bridal / Glam Service</b>
                    <select
                      value={depositService}
                      onChange={e => handleSelectServiceForDeposit(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'white' }}
                    >
                      {services.map((s: any) => (
                        <option key={s.name} value={s.name}>
                          {s.name} — ₹{Number(s.price_from || 0).toLocaleString('en-IN')}
                        </option>
                      ))}
                      {services.length === 0 && (
                        <option value="Bridal Couture Glamour">Bridal Couture Glamour — ₹{Number(artist.starting_price || 20000).toLocaleString('en-IN')}</option>
                      )}
                    </select>
                  </label>

                  {/* Wedding Date & Deposit Amount */}
                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Wedding / Event Date</b>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={eventDate}
                        onChange={e => setEventDate(e.target.value)}
                        style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Advance Deposit (₹)</b>
                      <select
                        value={depositAmount}
                        onChange={e => setDepositAmount(Number(e.target.value))}
                        style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px', background: 'white' }}
                      >
                        <option value={2500}>₹2,500 (Standard Token Deposit)</option>
                        <option value={5000}>₹5,000 (Priority Peak Season Lock)</option>
                        <option value={Math.round(depositPrice * 0.2)}>
                          ₹{Math.round(depositPrice * 0.2).toLocaleString('en-IN')} (20% Advance of Package)
                        </option>
                        <option value={Math.round(depositPrice * 0.5)}>
                          ₹{Math.round(depositPrice * 0.5).toLocaleString('en-IN')} (50% Full Confirmation)
                        </option>
                      </select>
                    </label>
                  </div>

                  {/* Payment Gateway Provider Selector (Razorpay vs Stripe) */}
                  <div style={{ display: 'grid', gap: '6px' }}>
                    <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Choose Secure Payment Method</b>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentProvider('razorpay')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: paymentProvider === 'razorpay' ? '2px solid var(--plum)' : '1px solid var(--line)',
                          background: paymentProvider === 'razorpay' ? '#fcf3f7' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <CreditCard size={18} style={{ color: 'var(--plum)' }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)' }}>Razorpay (India)</strong>
                          <small style={{ fontSize: '10.5px', color: 'var(--muted)' }}>UPI, GPay, Cards, NetBanking</small>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentProvider('stripe')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: paymentProvider === 'stripe' ? '2px solid var(--plum)' : '1px solid var(--line)',
                          background: paymentProvider === 'stripe' ? '#fcf3f7' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <ShieldCheck size={18} style={{ color: 'var(--gold-rich)' }} />
                        <div>
                          <strong style={{ fontSize: '13px', display: 'block', color: 'var(--ink)' }}>Stripe (Global)</strong>
                          <small style={{ fontSize: '10.5px', color: 'var(--muted)' }}>International Cards & Apple Pay</small>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="form-two">
                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Bride / Client Full Name</b>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Apte"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>

                    <label style={{ display: 'grid', gap: '5px' }}>
                      <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Contact Phone / WhatsApp</b>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9820123456"
                        value={clientPhone}
                        onChange={e => setClientPhone(e.target.value)}
                        style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                      />
                    </label>
                  </div>

                  <label style={{ display: 'grid', gap: '5px' }}>
                    <b style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>Email (for Instant PDF Receipt)</b>
                    <input
                      type="email"
                      placeholder="e.g. radhika@example.com"
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      style={{ padding: '11px 14px', border: '1px solid var(--line)', borderRadius: '10px', fontSize: '13px' }}
                    />
                  </label>

                  {/* Summary & Guarantee Pill */}
                  <div style={{ background: '#fdf8ee', border: '1px solid rgba(212, 163, 89, 0.4)', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#8c6819', fontWeight: 600, display: 'block' }}>TOTAL PACKAGE: ₹{depositPrice.toLocaleString('en-IN')}</span>
                      <strong style={{ fontSize: '14px', color: 'var(--ink)' }}>Due Now: ₹{depositAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <span style={{ fontSize: '10.5px', color: 'var(--green)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> Instant Escrow Receipt
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-plum full-width"
                    disabled={isProcessingPayment}
                    style={{
                      padding: '14px',
                      fontSize: '14px',
                      fontWeight: 700,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {isProcessingPayment ? (
                      <>Processing Secure Deposit…</>
                    ) : (
                      <>Pay ₹{depositAmount.toLocaleString('en-IN')} via {paymentProvider.toUpperCase()} →</>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'var(--muted)' }}>
                    <span>🔒 256-bit SSL Protected</span>
                    <span>•</span>
                    <span>Official Verified Token</span>
                    <span>•</span>
                    <span>Escrow Protected</span>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <footer className="profile-footer">
        Prices and availability may change. BookFlow Beauty verifies artist identity and credentials upon approval.
        {' '}<Link href="/" style={{ color: 'var(--plum)', fontWeight: 700 }}>Return to directory</Link>.
      </footer>
    </main>
  );
}
