'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin, Sparkles, ArrowLeft, CheckCircle2, Instagram, Award,
  MessageCircle, Star, Plus, X, Heart, ShieldCheck
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

  const services = (artist.services || []).filter((s: any) => s.is_active);
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
      <header className="dashboard-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Sparkles size={20} /></span>
          <span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span>
        </Link>
        <Link href="/" className="back-link"><ArrowLeft size={15} /> Browse directory</Link>
      </header>

      {/* HERO SECTION */}
      <section className="profile-hero">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div className="eyebrow" style={{ margin: 0 }}>
            <CheckCircle2 size={14} /> VERIFIED ARTIST PROFILE
          </div>
          {artist.experience && (
            <span className="status-pill status-approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Award size={13} /> {artist.experience}
            </span>
          )}
          {totalReviews > 0 && (
            <span className="status-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fff5df', color: '#9d752c' }}>
              <Star size={13} fill="currentColor" /> {avgRating} ({totalReviews} reviews)
            </span>
          )}
        </div>

        <h1>{artist.business_name}</h1>
        <p className="profile-location"><MapPin size={17} />{artist.area}, {artist.city}</p>
        <p className="profile-bio">
          {artist.bio || 'Professional bridal and event makeup artist. Dedicated to high-definition, long-wear glam tailored to your natural beauty.'}
        </p>

        <div className="profile-price">
          Starting from <strong>₹{Number(artist.starting_price || 0).toLocaleString('en-IN')}</strong>
        </div>

        {/* Action Buttons: 1-Click WhatsApp & Instagram */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
          {/* Direct 1-Click WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: '#25D366',
              color: 'white',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              fontWeight: 700,
              boxShadow: '0 8px 24px #25d36633'
            }}
          >
            <MessageCircle size={18} fill="white" /> Chat on WhatsApp
          </a>

          {/* Booking Enquiry Modal Anchor */}
          <Link className="btn btn-plum" href={`/?artist=${encodeURIComponent(artist.slug)}#artists`}>
            Send Platform Enquiry →
          </Link>

          {/* Instagram Profile */}
          {instagramHref && (
            <a
              href={instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', color: '#d62976', borderColor: '#eec2d4', background: 'white' }}
            >
              <Instagram size={16} /> Instagram ({instagram.startsWith('@') ? instagram : '@' + instagram.split('/').filter(Boolean).pop()})
            </a>
          )}
        </div>
      </section>

      {/* BEFORE & AFTER GLAM TRANSFORMATION SLIDER */}
      <section className="profile-content" style={{ marginBottom: '45px' }}>
        <div className="panel-heading">
          <div>
            <h2>Before & After Transformation</h2>
            <p>Drag the slider to see raw skin compared with finished bridal glam.</p>
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '720px',
            height: '420px',
            borderRadius: '16px',
            overflow: 'hidden',
            margin: '0 auto',
            border: '2px solid var(--line)',
            boxShadow: '0 16px 40px #54283f12',
            userSelect: 'none'
          }}
        >
          {/* After Image (Background) */}
          <img
            src={beforeAfter.after}
            alt="After Glam"
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
          />
          <span style={{ position: 'absolute', bottom: '15px', right: '15px', background: '#00000088', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
            AFTER GLAM ✨
          </span>

          {/* Before Image (Clipped Overlay) */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              width: `${sliderPos}%`,
              overflow: 'hidden',
              borderRight: '3px solid white',
              boxShadow: '3px 0 10px #00000044'
            }}
          >
            <img
              src={beforeAfter.before}
              alt="Before Look"
              style={{ width: '720px', height: '420px', objectFit: 'cover' }}
            />
            <span style={{ position: 'absolute', bottom: '15px', left: '15px', background: '#00000088', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.05em' }}>
              BEFORE 🌿
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

          {/* Divider Handle Marker */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: `${sliderPos}%`,
              transform: 'translate(-50%, -50%)',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 4px 15px #00000066',
              display: 'grid',
              placeItems: 'center',
              pointerEvents: 'none',
              zIndex: 5
            }}
          >
            <span style={{ fontSize: '14px', color: 'var(--plum)' }}>⬌</span>
          </div>
        </div>
      </section>

      {/* SERVICES & PRICING */}
      <section className="profile-content">
        <div className="panel-heading">
          <div>
            <h2>Services & Starting Prices</h2>
            <p>Direct consultation and date availability can be confirmed on WhatsApp.</p>
          </div>
        </div>

        {services.length ? (
          <div className="profile-service-grid">
            {services.map((s: any) => (
              <article className="profile-service" key={s.name}>
                <span className="service-symbol"><Sparkles size={17} /></span>
                <h3>{s.name}</h3>
                <p>{s.description || 'Customized for your skin tone, outfit and event lighting.'}</p>
                <strong>From ₹{Number(s.price_from || 0).toLocaleString('en-IN')}</strong>
                {s.duration_minutes && <small>{s.duration_minutes} minutes</small>}
              </article>
            ))}
          </div>
        ) : (
          <p>Contact the artist for service details.</p>
        )}

        {/* PORTFOLIO GALLERY */}
        {portfolio.length > 0 && (
          <>
            <h2 className="portfolio-heading">Portfolio & Looks</h2>
            <div className="profile-portfolio">
              {portfolio.map((p: any) => (
                <figure key={p.image_url}>
                  <img src={p.image_url} alt={p.caption || `${artist.business_name} makeup portfolio`} loading="lazy" />
                  <figcaption>{p.caption || 'Bridal & Party Look'}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        {/* CLIENT REVIEWS & EXPERIENCES */}
        <section style={{ marginTop: '55px' }}>
          <div className="panel-heading" style={{ alignItems: 'flex-start' }}>
            <div>
              <h2>Client Reviews & Feedback</h2>
              <p>Real brides and clients who booked with {artist.business_name}.</p>
            </div>
            <button className="btn btn-outline" onClick={() => setShowReviewModal(true)}>
              <Plus size={14} /> Write a Review
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {reviews.map((r: any) => (
              <div
                key={r.id || r.author}
                style={{
                  background: 'white',
                  border: '1px solid var(--line)',
                  borderRadius: '14px',
                  padding: '20px',
                  boxShadow: '0 4px 15px #00000005'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ height: '32px', width: '32px', borderRadius: '50%', background: 'var(--rose)', color: 'var(--plum)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: '12px' }}>
                      {r.author ? r.author.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <strong style={{ fontSize: '13px' }}>{r.author}</strong>
                      <small style={{ display: 'block', color: 'var(--muted)', fontSize: '10px' }}>
                        Verified client · {r.event}
                      </small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '2px', color: '#d1a45a' }}>
                    {[...Array(Number(r.rating) || 5)].map((_, i) => (
                      <Star key={i} size={13} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p style={{ margin: '8px 0 0', color: '#57444e', lineHeight: '1.6', fontSize: '13px' }}>
                  "{r.comment}"
                </p>
                {r.date && (
                  <small style={{ display: 'block', color: 'var(--muted)', fontSize: '10px', marginTop: '8px' }}>
                    {r.date}
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <button className="modal-close" onClick={() => setShowReviewModal(false)}><X /></button>
            <div className="eyebrow">CLIENT FEEDBACK</div>
            <h2>Review <em>{artist.business_name}</em></h2>
            <p className="modal-sub">Share your experience to help future brides and clients find their match.</p>

            {reviewNotice && (
              <div className="notice notice-success" style={{ marginBottom: '16px' }}>
                <CheckCircle2 size={16} /> {reviewNotice}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} style={{ display: 'grid', gap: '14px' }}>
              <label style={{ display: 'grid', gap: '6px' }}>
                <b>Your Full Name</b>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anjali Deshmukh"
                  value={reviewName}
                  onChange={e => setReviewName(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                />
              </label>

              <div className="form-two">
                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Rating (Stars)</b>
                  <select
                    value={reviewRating}
                    onChange={e => setReviewRating(Number(e.target.value))}
                    style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Exceptional)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                  </select>
                </label>

                <label style={{ display: 'grid', gap: '6px' }}>
                  <b>Event / Occasion</b>
                  <select
                    value={reviewEvent}
                    onChange={e => setReviewEvent(e.target.value)}
                    style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
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
                <b>Your Feedback / Review</b>
                <textarea
                  rows={4}
                  required
                  placeholder="How was the look, timing, hygiene, and artist's behavior?"
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  style={{ padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', lineHeight: '1.6' }}
                />
              </label>

              <button type="submit" className="btn btn-plum full-width" disabled={submittingReview}>
                {submittingReview ? 'Publishing…' : 'Submit Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      <footer className="profile-footer">
        Prices and availability may change. BookFlow Beauty verifies artist identity and credentials upon approval.
        <Link href="/">Return to directory</Link>.
      </footer>
    </main>
  );
}
