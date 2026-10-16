'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import Link from 'next/link';
import {
  MapPin, Search, Star, BadgeCheck, ArrowRight, CalendarDays,
  Sparkles, Heart, Menu, X, CheckCircle2, Clock3, Users,
  IndianRupee, ChevronDown, Shield, LogOut, User, Globe
} from 'lucide-react';
import { artists, services } from '../lib/data';
import { searchWorldLocations, allWorldCountries, curatedWorldLocations, WorldLocationItem } from '../lib/worldLocations';
import { createPublicSupabase } from '@/lib/supabase';

type Lead = { name: string; phone: string; service: string; date: string; area: string; budget: string; notes: string };
const emptyLead: Lead = { name: '', phone: '', service: 'Bridal makeup', date: '', area: 'Pune & Pimpri-Chinchwad, India', budget: '', notes: '' };
const money = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function Home() {
  const [liveArtists, setLiveArtists] = useState(artists);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Worldwide');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationWrapperRef = useRef<HTMLDivElement>(null);

  const [serviceFilter, setServiceFilter] = useState('All services');
  const [sort, setSort] = useState('recommended');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [savedArtists, setSavedArtists] = useState<Record<string, boolean>>({});

  // 1. Fetch live artists from directory
  useEffect(() => {
    fetch('/api/artists')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.mode === 'live' && Array.isArray(data.artists)) {
          setLiveArtists(data.artists);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Check authenticated user status to show who is logged in
  useEffect(() => {
    const sb = createPublicSupabase();
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetch('/api/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.authenticated) setCurrentUser(data);
          })
          .catch(() => {});
      }
    });

    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetch('/api/me', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data?.authenticated) setCurrentUser(data);
          })
          .catch(() => {});
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close location dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Real-time suggestions for auto-populating world locations
  const locationSuggestions = useMemo(() => {
    return searchWorldLocations(locationInput, 24);
  }, [locationInput]);

  function handleSelectLocation(item: WorldLocationItem) {
    const isAll = item.name === 'Worldwide (All Locations)';
    setLocationInput(isAll ? '' : item.name);
    setSelectedLocation(isAll ? 'Worldwide' : item.name);
    setIsLocationOpen(false);
    setToast(isAll ? 'Showing all worldwide artists' : `Location set to ${item.name}`);
  }

  function toggleSave(artistId: string, artistName: string) {
    setSavedArtists(prev => {
      const nextState = !prev[artistId];
      setToast(nextState ? `Saved ${artistName} to your wishlist.` : `Removed ${artistName} from saved.`);
      return { ...prev, [artistId]: nextState };
    });
  }

  async function handleSignOut() {
    const sb = createPublicSupabase();
    await sb.auth.signOut();
    setCurrentUser(null);
    setToast('Signed out successfully.');
  }

  // Filter with worldwide location dropdown support
  const { filtered, isShowingDestinationFallback } = useMemo(() => {
    const q = query.toLowerCase().trim();
    const effectiveLoc = selectedLocation !== 'Worldwide' ? selectedLocation : locationInput.trim();

    // 1. Direct location match
    let directMatches = liveArtists.filter(a => {
      const matchesQuery = !q || `${a.name} ${a.area} ${a.city} ${a.specialties.join(' ')}`.toLowerCase().includes(q);
      const matchesService = serviceFilter === 'All services' || a.specialties.some((s: string) =>
        serviceFilter.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(serviceFilter.toLowerCase().split(' ')[0])
      );

      let matchesLocation = true;
      if (effectiveLoc && effectiveLoc !== 'Worldwide') {
        const target = `${a.area || ''} ${a.city || ''} ${a.bio || ''}`.toLowerCase();
        if (effectiveLoc.includes('Pune & Pimpri-Chinchwad')) {
          matchesLocation = target.includes('pune') || target.includes('pimpri') || target.includes('wakad') || target.includes('hinjewadi');
        } else if (effectiveLoc.includes('Chhatrapati Sambhaji Nagar')) {
          matchesLocation = target.includes('chhatrapati') || target.includes('sambhaji') || target.includes('aurangabad') || target.includes('cidco') || target.includes('garkheda') || target.includes('osmanpura') || target.includes('waluj');
        } else if (effectiveLoc.toLowerCase().includes('india')) {
          matchesLocation = target.includes('india') || target.includes('pune') || target.includes('pimpri') || target.includes('chhatrapati') || target.includes('mumbai') || target.includes('nagar') || target.includes('maharashtra');
        } else {
          const cleanParts = effectiveLoc.replace(/[(),]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !['and', 'the', 'all', 'usa', 'united'].includes(w.toLowerCase()));
          matchesLocation = cleanParts.length === 0 || cleanParts.some(part => target.includes(part.toLowerCase()));
        }
      }

      return matchesQuery && matchesService && matchesLocation;
    });

    let isShowingDestinationFallback = false;

    // If an international/global country or city has no locally-based studio yet, show verified destination travel artists who travel worldwide
    if (directMatches.length === 0 && effectiveLoc && effectiveLoc !== 'Worldwide') {
      const fallbackMatches = liveArtists.filter(a => {
        const matchesQuery = !q || `${a.name} ${a.area} ${a.city} ${a.specialties.join(' ')}`.toLowerCase().includes(q);
        const matchesService = serviceFilter === 'All services' || a.specialties.some((s: string) =>
          serviceFilter.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(serviceFilter.toLowerCase().split(' ')[0])
        );
        return matchesQuery && matchesService;
      });

      if (fallbackMatches.length > 0) {
        directMatches = fallbackMatches;
        isShowingDestinationFallback = true;
      }
    }

    if (sort === 'price') directMatches = [...directMatches].sort((a, b) => a.startingPrice - b.startingPrice);
    if (sort === 'rating') directMatches = [...directMatches].sort((a, b) => b.rating - a.rating);
    if (sort === 'distance') directMatches = [...directMatches].sort((a, b) => a.distanceKm - b.distanceKm);

    return { filtered: directMatches, isShowingDestinationFallback };
  }, [query, serviceFilter, selectedLocation, locationInput, sort, liveArtists]);

  async function sendEnquiry(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, city: lead.area })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit enquiry.');
      setToast(data.message || 'Enquiry submitted.');
      setSubmitted(true);
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Could not submit enquiry.');
    }
  }

  function closeEnquiry() {
    setShowEnquiry(false);
    setSubmitted(false);
    setLead(emptyLead);
    setToast('');
  }

  return (
    <main>
      {/* Topline Announcement Bar with Global Location Selector */}
      <div className="topline">
        <span>✨ Find your artist. Feel your best. Certified Bridal & Couture Experts.</span>
        <button
          onClick={() => {
            setIsLocationOpen(true);
            document.getElementById('locationSearchInput')?.focus();
          }}
          className="topline-right"
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 0,
            padding: 0
          }}
        >
          <MapPin size={13} style={{ flexShrink: 0 }} />
          <span>{selectedLocation === 'Worldwide' ? 'Global • All World' : selectedLocation.split(',')[0]}</span>
          <ChevronDown size={13} style={{ flexShrink: 0 }} />
        </button>
      </div>

      {/* Header Sticky Navigation */}
      <header className="nav wrap">
        <a className="brand" href="#top">
          <span className="brand-mark"><Sparkles size={21} /></span>
          <span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span>
        </a>

        {/* Dynamic Navigation Bar showing logged in user status */}
        <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
          <a href="#artists" onClick={() => setMobileMenu(false)}>Find artists</a>
          <a href="#how" onClick={() => setMobileMenu(false)}>How it works</a>
          <a href="#plans" onClick={() => setMobileMenu(false)}>For artists</a>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Link
                href="/dashboard"
                className="status-pill status-approved"
                style={{ padding: '8px 12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setMobileMenu(false)}
              >
                <User size={13} />
                <span>{currentUser.user.fullName || currentUser.artist?.businessName || 'My Profile'}</span>
                {currentUser.user.role === 'admin' && (
                  <span style={{ background: '#43122b', color: 'var(--gold-light)', borderRadius: '4px', padding: '2px 5px', fontSize: '9px', fontWeight: 700 }}>
                    ADMIN
                  </span>
                )}
              </Link>

              {currentUser.user.role === 'admin' && (
                <Link
                  href="/admin"
                  className="btn btn-outline"
                  style={{ padding: '8px 12px', fontSize: '11px', background: 'var(--rose-soft)', color: 'var(--plum)' }}
                  onClick={() => setMobileMenu(false)}
                >
                  <Shield size={13} /> Admin Panel
                </Link>
              )}

              <Link
                href="/dashboard"
                className="btn btn-plum"
                style={{ padding: '8px 14px', fontSize: '11px' }}
                onClick={() => setMobileMenu(false)}
              >
                Dashboard
              </Link>

              <button
                className="btn btn-outline"
                onClick={() => { handleSignOut(); setMobileMenu(false); }}
                style={{ padding: '8px 10px', fontSize: '11px' }}
                title="Sign out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link href="/login" className="btn btn-outline" onClick={() => setMobileMenu(false)}>
                Sign in
              </Link>
              <Link href="/join" className="btn btn-dark nav-cta" onClick={() => setMobileMenu(false)}>
                List your business <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </nav>

        <button className="mobile-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* HERO SECTION */}
      <section className="hero wrap" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> LUXURY BRIDAL & BEAUTY DIRECTORY
          </div>
          <h1>
            Your moment.<br />
            <em>Your artist.</em>
          </h1>
          <p className="hero-text">
            Discover verified couture makeup artists worldwide for weddings, destination celebrations, and all the high-glam moments that matter.
          </p>

          {/* SEARCH PANEL WITH AUTO-POPULATING WORLDWIDE LOCATION DROPDOWN */}
          <div className="search-panel">
            {/* 1. AUTO-POPULATING LOCATION DROPDOWN ZONE */}
            <div className="location-field-wrapper" ref={locationWrapperRef}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', cursor: 'text' }}>
                <MapPin size={18} style={{ color: 'var(--plum)', flexShrink: 0 }} />
                <span style={{ minWidth: 0, width: '100%' }}>
                  <small>YOUR LOCATION (WORLDWIDE)</small>
                  <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <input
                      id="locationSearchInput"
                      aria-label="Search city or country worldwide"
                      value={locationInput}
                      onChange={e => {
                        setLocationInput(e.target.value);
                        setSelectedLocation(e.target.value || 'Worldwide');
                        setIsLocationOpen(true);
                      }}
                      onFocus={() => setIsLocationOpen(true)}
                      placeholder="Type city or country (e.g. India, Dubai...)"
                      style={{
                        border: 0,
                        outline: 0,
                        background: 'transparent',
                        color: 'var(--ink)',
                        width: '100%',
                        fontSize: '13px',
                        fontWeight: 600,
                        paddingRight: '48px'
                      }}
                    />
                    <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      {locationInput && (
                        <button
                          type="button"
                          onClick={() => {
                            setLocationInput('');
                            setSelectedLocation('Worldwide');
                            setIsLocationOpen(false);
                          }}
                          style={{
                            background: 'rgba(0,0,0,0.08)',
                            border: 0,
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            color: 'var(--muted)',
                            fontSize: '10px'
                          }}
                          title="Clear location"
                        >
                          ✕
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsLocationOpen(!isLocationOpen)}
                        style={{
                          background: 'transparent',
                          border: 0,
                          cursor: 'pointer',
                          color: 'var(--plum)',
                          display: 'grid',
                          placeItems: 'center',
                          padding: '2px'
                        }}
                        title="Toggle world locations dropdown"
                      >
                        <ChevronDown
                          size={15}
                          style={{
                            transform: isLocationOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.25s ease'
                          }}
                        />
                      </button>
                    </div>
                  </div>
                </span>
              </label>

              {/* AUTO-POPULATION POPUP DROPDOWN MENU */}
              {isLocationOpen && (
                <div className="location-dropdown-popup">
                  <div className="location-dropdown-header">
                    <span>{locationInput ? `Matching Locations (${locationSuggestions.length})` : 'Popular World Hubs & Countries'}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationInput('');
                        setSelectedLocation('Worldwide');
                        setIsLocationOpen(false);
                      }}
                      style={{ background: 'none', border: 0, color: 'var(--plum)', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Reset to Worldwide
                    </button>
                  </div>

                  <div style={{ display: 'grid', gap: '3px' }}>
                    {locationSuggestions.length > 0 ? (
                      locationSuggestions.map(item => (
                        <button
                          key={item.name}
                          type="button"
                          className={`location-option-item ${selectedLocation === item.name ? 'selected' : ''}`}
                          onClick={() => handleSelectLocation(item)}
                        >
                          <span className="loc-name">
                            <span style={{ fontSize: '16px' }}>{item.icon}</span>
                            <span>{item.name}</span>
                          </span>
                          <span className="loc-category">{item.category}</span>
                        </button>
                      ))
                    ) : (
                      <div style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '12px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 600 }}>No exact location match for "{locationInput}"</p>
                        <button
                          type="button"
                          className="btn btn-outline"
                          onClick={() => {
                            setSelectedLocation(locationInput);
                            setIsLocationOpen(false);
                          }}
                          style={{ fontSize: '11px', padding: '6px 12px' }}
                        >
                          Search destination artists for "{locationInput}" ✈️
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="search-divider" />

            {/* 2. SERVICE CATEGORY */}
            <label style={{ flex: '1.1' }}>
              <Sparkles size={18} style={{ color: 'var(--plum)', flexShrink: 0 }} />
              <span style={{ minWidth: 0, width: '100%' }}>
                <small>SERVICE CATEGORY</small>
                <select aria-label="Service" value={serviceFilter} onChange={e => setServiceFilter(e.target.value)}>
                  <option>All services</option>
                  {services.map(s => <option key={s}>{s}</option>)}
                </select>
              </span>
            </label>

            <span className="search-divider" />

            {/* 3. ARTIST / KEYWORD SEARCH */}
            <label style={{ flex: '1' }}>
              <Search size={18} style={{ color: 'var(--plum)', flexShrink: 0 }} />
              <span style={{ minWidth: 0, width: '100%' }}>
                <small>ARTIST / STUDIO</small>
                <input
                  aria-label="Filter by artist name"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Artist name (optional)"
                />
              </span>
            </label>

            <button className="btn btn-plum search-btn" onClick={() => document.getElementById('artists')?.scrollIntoView({ behavior: 'smooth' })}>
              <Search size={16} /> Find Artists
            </button>
          </div>

          <div className="hero-proof">
            <div className="avatar-stack">
              <span>AN</span>
              <span>JJ</span>
              <span>SM</span>
              <span>✦</span>
            </div>
            <span>
              <b>Verified Global & Local Talent, Personal Touch.</b>
              <small>Compare portfolios, verified reviews, Instagram lookbooks & starting prices.</small>
            </span>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-image" role="img" aria-label="Editorial bridal makeup portrait">
            <div className="image-overlay" />
            <div className="image-tag">
              <span className="tag-icon"><Sparkles size={18} /></span>
              <span><b>Made for your moment</b><small>Verified artists worldwide</small></span>
            </div>
          </div>
          <div className="floating-card floating-rating">
            <span className="rating-star"><Star size={16} fill="currentColor" /></span>
            <span><b>Top Rated 5.0</b><small>Verified Bride Reviews</small></span>
          </div>
          <div className="floating-card floating-book">
            <span className="book-icon"><CalendarDays size={18} /></span>
            <span><b>1-Click WhatsApp</b><small>Direct Artist Booking</small></span>
          </div>
          <span className="hero-sparkle sparkle-one">✳</span>
          <span className="hero-sparkle sparkle-two">✦</span>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust-strip">
        <div className="wrap trust-inner">
          <span><BadgeCheck size={19} /> 100% Verified Artist Profiles</span>
          <span><Globe size={19} /> Local & Worldwide Destination Bookings</span>
          <span><Heart size={19} /> Portfolio & Before-After Discovery</span>
          <span><Clock3 size={19} /> Direct WhatsApp & Instant Connection</span>
        </div>
      </section>

      {/* ARTISTS DIRECTORY SECTION */}
      <section className="artists-section wrap" id="artists">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              {selectedLocation === 'Worldwide' ? 'GLOBAL DIRECTORY' : `CURATED IN ${selectedLocation.toUpperCase().split(',')[0]}`}
            </div>
            <h2>Artists worth <em>glowing for.</em></h2>
            <p>
              {selectedLocation === 'Worldwide'
                ? 'Explore curated makeup artists and find a couture look that feels unmistakably like you.'
                : `Showing matching artists for ${selectedLocation}.`}
            </p>
          </div>
          <div className="sort-control">
            <span>Sort by</span>
            <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort artists">
              <option value="recommended">Recommended & Top Rated</option>
              <option value="price">Price: Low to High</option>
              <option value="rating">Highest Client Rating</option>
              <option value="distance">Nearest Distance</option>
            </select>
          </div>
        </div>

        {/* Destination Weddings & Travel Notification Pill */}
        {isShowingDestinationFallback && (
          <div
            className="notice"
            style={{
              background: 'var(--gold-pale)',
              border: '1px solid rgba(212, 163, 89, 0.45)',
              color: '#8c6819',
              borderRadius: '16px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '28px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} style={{ color: 'var(--gold-rich)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px' }}>
                No studio physically registered in <strong>{selectedLocation}</strong> yet. Showing verified artists who accept <strong>Worldwide Destination Weddings & Travel Bookings</strong> ✈️
              </span>
            </div>
            <button
              className="btn btn-outline"
              onClick={() => {
                setLocationInput('');
                setSelectedLocation('Worldwide');
              }}
              style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '10px', background: 'white' }}
            >
              Show All Worldwide
            </button>
          </div>
        )}

        {/* Filter Chips */}
        <div className="filter-chips">
          <button
            className={serviceFilter === 'All services' ? 'chip active' : 'chip'}
            onClick={() => setServiceFilter('All services')}
          >
            ✨ All Artists
          </button>
          {[
            { label: '👰 Bridal Glam', val: 'Bridal' },
            { label: '💍 Engagement', val: 'Engagement' },
            { label: '🌿 Haldi / Mehendi', val: 'Haldi' },
            { label: '✨ Reception', val: 'Reception' },
            { label: '💃 Party Makeup', val: 'Party' }
          ].map(s => (
            <button
              key={s.val}
              className={serviceFilter === s.val ? 'chip active' : 'chip'}
              onClick={() => setServiceFilter(serviceFilter === s.val ? 'All services' : s.val)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Artist Grid */}
        <div className="artist-grid">
          {filtered.map((a: any, i: number) => {
            const hasPhoto = a.portfolio && a.portfolio.length > 0 && a.portfolio[0].image_url;
            const isSaved = Boolean(savedArtists[a.id]);

            return (
              <article className="artist-card" key={a.id}>
                <div className={`artist-photo photo-${i % 4}`} style={{ backgroundColor: a.accent || '#f4edf0' }}>
                  {hasPhoto ? (
                    <img
                      src={a.portfolio[0].image_url}
                      alt={a.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <>
                      <span className="artist-initials">{a.initials}</span>
                      <span className="photo-caption">PORTFOLIO PREVIEW</span>
                    </>
                  )}

                  {/* Heart / Wishlist Toggle Button */}
                  <button
                    className="heart-btn"
                    aria-label={`Save ${a.name}`}
                    onClick={() => toggleSave(a.id, a.name)}
                    style={{ color: isSaved ? '#d82b6b' : 'var(--plum)' }}
                  >
                    <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                  </button>

                  {/* Verified Pro Badge */}
                  {a.verified && (
                    <span className="verified">
                      <BadgeCheck size={14} /> VERIFIED PRO
                    </span>
                  )}
                </div>

                <div className="artist-info">
                  <div className="artist-title-row">
                    <h3>
                      {a.slug ? (
                        <Link href={`/artists/${a.slug}`}>{a.name}</Link>
                      ) : (
                        a.name
                      )}
                    </h3>
                    <span className="rating">
                      <Star size={13} fill="currentColor" /> {a.rating || '5.0'}
                    </span>
                  </div>

                  <div className="artist-location">
                    <MapPin size={14} style={{ color: 'var(--gold-rich)' }} />
                    {a.area}, {a.city}
                  </div>

                  {isShowingDestinationFallback && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.04em', background: 'var(--gold-pale)', color: '#8c6819', padding: '3px 7px', borderRadius: '5px', border: '1px solid rgba(212, 163, 89, 0.3)' }}>
                        ✈️ Available for {selectedLocation.split(',')[0]}
                      </span>
                    </div>
                  )}

                  <p className="artist-bio">
                    {a.bio || 'Experienced bridal makeup specialist ready for your special day.'}
                  </p>

                  <div className="specialties">
                    {(a.specialties || []).map((s: string) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>

                  <div className="artist-bottom">
                    <div>
                      <small>STARTING FROM</small>
                      <strong>{money(a.startingPrice)}</strong>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {a.slug && (
                        <Link
                          href={`/artists/${a.slug}`}
                          className="btn btn-outline"
                          style={{ padding: '8px 12px', fontSize: '11px', borderRadius: '10px' }}
                        >
                          View Looks
                        </Link>
                      )}
                      <button
                        className="btn btn-plum"
                        onClick={() => { setSelected(a.id); setShowEnquiry(true); }}
                        style={{ padding: '8px 12px', fontSize: '11px', borderRadius: '10px' }}
                      >
                        Enquire <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <Search size={32} style={{ color: 'var(--plum)' }} />
            <h3>No artists match that filter yet</h3>
            <p>Try searching another city or country, or reset to explore all talented artists worldwide.</p>
            <button
              className="btn btn-outline"
              onClick={() => { setQuery(''); setLocationInput(''); setSelectedLocation('Worldwide'); setServiceFilter('All services'); }}
              style={{ marginTop: '12px' }}
            >
              Reset to All Worldwide
            </button>
          </div>
        )}
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="how-section" id="how">
        <div className="wrap">
          <div className="section-heading centered">
            <div className="eyebrow">EFFORTLESS EXPERIENCE</div>
            <h2>From “I need a look” to <em>“I found my artist.”</em></h2>
            <p>Three simple, transparent steps to discover and secure your makeup artist anywhere in the world.</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-num">01</span>
              <div className="step-icon"><Search size={24} /></div>
              <h3>Explore Local & Global Talent</h3>
              <p>Compare real portfolios, Before-and-After glam sliders, client reviews, Instagram lookbooks and starting prices.</p>
            </div>

            <div className="step-card">
              <span className="step-num">02</span>
              <div className="step-icon"><CalendarDays size={24} /></div>
              <h3>Share Event Details</h3>
              <p>Pick your event date, locality, and preferred aesthetic. Reach the artist directly on WhatsApp or submit a platform enquiry.</p>
            </div>

            <div className="step-card">
              <span className="step-num">03</span>
              <div className="step-icon"><Heart size={24} /></div>
              <h3>Connect & Glow</h3>
              <p>Confirm availability, finalize pricing directly with your chosen artist, and prepare to look unforgettable on your big day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOR MAKEUP ARTISTS CALLOUT */}
      <section className="artist-cta wrap" id="plans">
        <div className="cta-copy">
          <div className="eyebrow">FOR PROFESSIONAL MAKEUP ARTISTS</div>
          <h2>Your artistry deserves<br /><em>to be celebrated worldwide.</em></h2>
          <p>
            Join BookFlow Beauty to showcase your lookbook, Before-and-After transformations, Instagram feed, and receive direct enquiries from brides worldwide.
          </p>

          <ul>
            <li><CheckCircle2 size={18} /> Verified Artist Profile & Custom URL</li>
            <li><CheckCircle2 size={18} /> Services & Transparent Pricing Menu</li>
            <li><CheckCircle2 size={18} /> High-Definition Lookbook & Reviews</li>
            <li><CheckCircle2 size={18} /> Direct WhatsApp Client Bookings</li>
          </ul>

          <Link href="/join" className="btn btn-light" style={{ padding: '14px 26px', borderRadius: '14px', fontWeight: 700 }}>
            List Your Business <ArrowRight size={17} />
          </Link>
        </div>

        <div className="cta-art">
          <div className="cta-ring ring-one" />
          <div className="cta-ring ring-two" />
          <div className="cta-profile">
            <Sparkles size={46} style={{ color: 'var(--gold-light)' }} />
            <span>YOUR BRAND</span>
            <small>YOUR WORK. YOUR CLIENTS.</small>
          </div>
          <div className="mini-stat stat-one">
            <Users size={18} />
            <span><b>Global Discovery</b><small>Reach brides everywhere</small></span>
          </div>
          <div className="mini-stat stat-two">
            <IndianRupee size={18} />
            <span><b>Zero Commission</b><small>Keep 100% of your earnings</small></span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand footer-brand" href="#top">
            <span className="brand-mark"><Sparkles size={18} /></span>
            <span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span>
          </a>
          <span>© 2026 BookFlow Beauty. Curated for the modern glamour industry worldwide.</span>
          <div>
            <a href="#artists">Find artists</a>
            <Link href="/join">For artists</Link>
            <Link href="/login">Artist login</Link>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={18} style={{ color: 'var(--gold-light)' }} />
          <span>{toast}</span>
          <button onClick={() => setToast('')} aria-label="Dismiss notification" style={{ background: 'none', border: 0, color: 'white', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <X size={15} />
          </button>
        </div>
      )}

      {/* Booking Enquiry Modal */}
      {showEnquiry && (
        <div className="modal-backdrop" onClick={closeEnquiry}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeEnquiry}><X size={18} /></button>
            {!submitted ? (
              <>
                <div className="eyebrow">BOOKING ENQUIRY</div>
                <h2>Let's find your <em>artist.</em></h2>
                <p className="modal-sub">
                  Share a few details and we will route your enquiry directly to eligible, verified local & destination makeup artists.
                </p>

                <form onSubmit={sendEnquiry} className="form-grid">
                  <label>
                    Your name
                    <input
                      required
                      value={lead.name}
                      onChange={e => setLead({ ...lead, name: e.target.value })}
                      placeholder="e.g. Radhika Sharma"
                    />
                  </label>
                  <label>
                    Mobile number
                    <input
                      required
                      type="tel"
                      pattern="[0-9+() -]{8,18}"
                      value={lead.phone}
                      onChange={e => setLead({ ...lead, phone: e.target.value })}
                      placeholder="Phone with country code (e.g. +91 9876543210)"
                    />
                  </label>
                  <label>
                    Service required
                    <select value={lead.service} onChange={e => setLead({ ...lead, service: e.target.value })}>
                      {services.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                  <label>
                    Event date
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().slice(0, 10)}
                      value={lead.date}
                      onChange={e => setLead({ ...lead, date: e.target.value })}
                    />
                  </label>
                  <label>
                    Event location / Country
                    <select value={lead.area} onChange={e => setLead({ ...lead, area: e.target.value })}>
                      <option value="Worldwide Destination Wedding">✈️ Destination Wedding (International)</option>
                      {curatedWorldLocations.map(item => (
                        <option key={item.name} value={item.name}>{item.icon} {item.name}</option>
                      ))}
                      {allWorldCountries.map(c => (
                        <option key={c} value={c}>🌐 {c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Approx. budget (₹)
                    <input
                      type="number"
                      min="0"
                      value={lead.budget}
                      onChange={e => setLead({ ...lead, budget: e.target.value })}
                      placeholder="e.g. 8000"
                    />
                  </label>
                  <label className="full-field">
                    Event notes or style inspiration
                    <textarea
                      value={lead.notes}
                      onChange={e => setLead({ ...lead, notes: e.target.value })}
                      placeholder="Venue location, number of people needing makeup, preferred style (dewy/matte/traditional)..."
                      rows={3}
                    />
                  </label>
                  <button className="btn btn-plum full-field" type="submit" style={{ padding: '14px', borderRadius: '12px' }}>
                    Send Booking Enquiry <ArrowRight size={16} />
                  </button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <span className="success-icon"><CheckCircle2 size={34} /></span>
                <h2>Enquiry <em>submitted.</em></h2>
                <p>{toast || 'Your request has been routed to available verified artists.'}</p>
                <button className="btn btn-plum full-width" onClick={closeEnquiry} style={{ marginTop: '16px' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
