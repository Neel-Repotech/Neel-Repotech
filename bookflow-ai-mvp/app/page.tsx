'use client';
import { useEffect, useMemo, useState } from 'react';
import { MapPin, Search, Star, BadgeCheck, ArrowRight, CalendarDays, Sparkles, Heart, Menu, X, CheckCircle2, Clock3, Users, IndianRupee, ChevronDown } from 'lucide-react';
import { artists, services } from '../lib/data';

type Lead = { name:string; phone:string; service:string; date:string; area:string; budget:string; notes:string };
const emptyLead: Lead = {name:'',phone:'',service:'Bridal makeup',date:'',area:'Cidco',budget:'',notes:''};
const areas = ['Cidco','Garkheda','Osmanpura','Waluj','Aurangabad city','Pimple Gurav','Wakad','Hinjewadi','Pimpri','Pune'];
const areaCity:Record<string,string> = {'Cidco':'Chhatrapati Sambhaji Nagar','Garkheda':'Chhatrapati Sambhaji Nagar','Osmanpura':'Chhatrapati Sambhaji Nagar','Waluj':'Chhatrapati Sambhaji Nagar','Aurangabad city':'Chhatrapati Sambhaji Nagar','Pimple Gurav':'Pimpri-Chinchwad','Wakad':'Pune','Hinjewadi':'Pune','Pimpri':'Pimpri-Chinchwad','Pune':'Pune'};
const money = (n:number) => '₹' + n.toLocaleString('en-IN');

export default function Home() {
  const [liveArtists,setLiveArtists] = useState(artists);
  const [query,setQuery] = useState('');
  const [serviceFilter,setServiceFilter] = useState('All services');
  const [sort,setSort] = useState('recommended');
  const [showJoin,setShowJoin] = useState(false);
  const [showEnquiry,setShowEnquiry] = useState(false);
  const [selected,setSelected] = useState<string | null>(null);
  const [lead,setLead] = useState<Lead>(emptyLead);
  const [submitted,setSubmitted] = useState(false);
  const [mobileMenu,setMobileMenu] = useState(false);
  const [toast,setToast] = useState('');

  useEffect(() => { fetch('/api/artists').then(r=>r.ok?r.json():null).then(data=>{ if(data?.mode==='live' && Array.isArray(data.artists)) setLiveArtists(data.artists); }).catch(()=>{}); }, []);

  const filtered = useMemo(() => {
    const q=query.toLowerCase().trim();
    let result=liveArtists.filter(a => (!q || `${a.name} ${a.area} ${a.city} ${a.specialties.join(' ')}`.toLowerCase().includes(q)) && (serviceFilter==='All services' || a.specialties.some(s => serviceFilter.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(serviceFilter.toLowerCase().split(' ')[0]))));
    if(sort==='price') result=[...result].sort((a,b)=>a.startingPrice-b.startingPrice);
    if(sort==='rating') result=[...result].sort((a,b)=>b.rating-a.rating);
    if(sort==='distance') result=[...result].sort((a,b)=>a.distanceKm-b.distanceKm);
    return result;
  },[query,serviceFilter,sort,liveArtists]);

  async function sendEnquiry(e:React.FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({...lead, city: areaCity[lead.area] || 'Chhatrapati Sambhaji Nagar'}) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit enquiry.');
      setToast(data.message || 'Enquiry submitted.');
      setSubmitted(true);
    } catch (error) { setToast(error instanceof Error ? error.message : 'Could not submit enquiry.'); }
  }
  function closeEnquiry(){setShowEnquiry(false);setSubmitted(false);setLead(emptyLead);setToast('');}

  return <main>
    <div className="topline"><span>✨ Find your artist. Feel your best.</span><span className="topline-right"><MapPin size={13}/> Chhatrapati Sambhaji Nagar <ChevronDown size={13}/></span></div>
    <header className="nav wrap">
      <a className="brand" href="#top"><span className="brand-mark"><Sparkles size={20}/></span><span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span></a>
      <nav className={mobileMenu?'nav-links open':'nav-links'}><a href="#artists" onClick={()=>setMobileMenu(false)}>Find artists</a><a href="#how" onClick={()=>setMobileMenu(false)}>How it works</a><a href="#plans" onClick={()=>setMobileMenu(false)}>For artists</a><button className="btn btn-dark nav-cta" onClick={()=>{setShowJoin(true);setMobileMenu(false)}}>List your business <ArrowRight size={15}/></button></nav>
      <button className="mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu?<X/>:<Menu/>}</button>
    </header>

    <section className="hero wrap" id="top">
      <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot"/> YOUR CITY'S BEAUTY DIRECTORY</div><h1>Your moment.<br/><em>Your artist.</em></h1><p className="hero-text">Discover talented makeup artists near you for weddings, celebrations and all the moments that matter.</p>
        <div className="search-panel"><label><MapPin size={18}/><span><small>YOUR LOCATION</small><input aria-label="Area or locality" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Area, locality or artist"/></span></label><span className="search-divider"/><label><Sparkles size={18}/><span><small>SERVICE</small><select aria-label="Service" value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)}><option>All services</option>{services.map(s=><option key={s}>{s}</option>)}</select></span></label><button className="btn btn-plum search-btn" onClick={()=>document.getElementById('artists')?.scrollIntoView({behavior:'smooth'})}><Search size={17}/> Find artists</button></div>
        <div className="hero-proof"><div className="avatar-stack"><span>SM</span><span>GR</span><span>BR</span><span>+</span></div><span><b>Local talent, personal touch.</b><small>Compare portfolios, services & starting prices.</small></span></div>
      </div>
      <div className="hero-art"><div className="hero-image" role="img" aria-label="Editorial bridal makeup portrait"><div className="image-overlay"/><div className="image-tag"><span className="tag-icon"><Sparkles size={16}/></span><span><b>Made for your moment</b><small>Artists near you</small></span></div></div><div className="floating-card floating-rating"><span className="rating-star"><Star size={15} fill="currentColor"/></span><span><b>4.9/5</b><small>Sample artist rating</small></span></div><div className="floating-card floating-book"><span className="book-icon"><CalendarDays size={17}/></span><span><b>Your date, your look</b><small>Enquire in minutes</small></span></div><span className="hero-sparkle sparkle-one">✳</span><span className="hero-sparkle sparkle-two">✦</span></div>
    </section>

    <section className="trust-strip"><div className="wrap trust-inner"><span><BadgeCheck size={18}/> Artist profiles</span><span><Heart size={18}/> Portfolio-first discovery</span><span><MapPin size={18}/> Local enquiries</span><span><Clock3 size={18}/> Simple booking requests</span></div></section>

    <section className="artists-section wrap" id="artists"><div className="section-heading"><div><div className="eyebrow">MEET YOUR MATCH</div><h2>Artists worth <em>glowing for.</em></h2><p>Explore local talent and find a look that feels like you.</p></div><div className="sort-control"><span>Sort by</span><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort artists"><option value="recommended">Recommended</option><option value="distance">Nearest first</option><option value="rating">Top rated</option><option value="price">Price: low to high</option></select></div></div>
      <div className="filter-chips"><button className={serviceFilter==='All services'?'chip active':'chip'} onClick={()=>setServiceFilter('All services')}>All artists</button>{['Bridal','Engagement','Haldi','Reception','Party'].map(s=><button key={s} className={serviceFilter===s?'chip active':'chip'} onClick={()=>setServiceFilter(serviceFilter===s?'All services':s)}>{s}</button>)}</div>
      <div className="artist-grid">{filtered.map((a,i)=><article className="artist-card" key={a.id}><div className={`artist-photo photo-${i%4}`} style={{backgroundColor:a.accent}}><span className="artist-initials">{a.initials}</span><button className="heart-btn" aria-label="Save artist" onClick={()=>setToast(`${a.name} saved in this demo.`)}><Heart size={17}/></button>{a.verified&&<span className="verified"><BadgeCheck size={13}/> VERIFIED</span>}<span className="photo-caption">PORTFOLIO PREVIEW</span></div><div className="artist-info"><div className="artist-title-row"><h3>{a.slug ? <a href={`/artists/${a.slug}`}>{a.name}</a> : a.name}</h3><span className="rating"><Star size={13} fill="currentColor"/> {a.rating}</span></div><div className="artist-location"><MapPin size={14}/>{a.area}, {a.city}</div><p className="artist-bio">{a.bio}</p><div className="specialties">{a.specialties.map(s=><span key={s}>{s}</span>)}</div><div className="artist-bottom"><div><small>STARTING FROM</small><strong>{money(a.startingPrice)}</strong></div><button className="btn btn-outline" onClick={()=>{setSelected(a.id);setShowEnquiry(true)}}>Enquire <ArrowRight size={14}/></button></div></div></article>)}</div>
      {filtered.length===0&&<div className="empty-state"><Search size={26}/><h3>No artists match that search yet</h3><p>Try another area or clear the service filter.</p><button className="btn btn-outline" onClick={()=>{setQuery('');setServiceFilter('All services')}}>Clear filters</button></div>}
      <div className="demo-note">Demo preview: artist names, ratings, distances and prices are illustrative sample data, not verified live listings.</div>
    </section>

    <section className="how-section" id="how"><div className="wrap"><div className="section-heading centered"><div className="eyebrow">A LITTLE LESS SEARCHING</div><h2>From “I need a look” to <em>“I found my artist.”</em></h2><p>Three simple steps to start your booking conversation.</p></div><div className="steps-grid"><div className="step-card"><span className="step-num">01</span><div className="step-icon"><Search/></div><h3>Explore local artists</h3><p>Compare services, portfolios and starting prices in one place.</p></div><div className="step-card"><span className="step-num">02</span><div className="step-icon"><CalendarDays/></div><h3>Share your event details</h3><p>Tell the artist your date, service, location and budget.</p></div><div className="step-card"><span className="step-num">03</span><div className="step-icon"><Heart/></div><h3>Connect and confirm</h3><p>Discuss availability and final pricing directly before confirming.</p></div></div></div></section>

    <section className="artist-cta wrap" id="plans"><div className="cta-copy"><div className="eyebrow">FOR MAKEUP ARTISTS</div><h2>Your talent deserves<br/><em>to be discovered.</em></h2><p>Create a profile, showcase your work and get discovered by customers searching for makeup services in your area.</p><ul><li><CheckCircle2 size={17}/> Your own artist profile</li><li><CheckCircle2 size={17}/> Services and starting prices</li><li><CheckCircle2 size={17}/> Local booking enquiries</li><li><CheckCircle2 size={17}/> Manage leads in one place</li></ul><button className="btn btn-light" onClick={()=>setShowJoin(true)}>Join as an artist <ArrowRight size={16}/></button><small className="cta-small">Pilot registration · Subscription pricing to be announced</small></div><div className="cta-art"><div className="cta-ring ring-one"/><div className="cta-ring ring-two"/><div className="cta-profile"><Sparkles size={42}/><span>YOUR BRAND</span><small>YOUR WORK. YOUR CLIENTS.</small></div><div className="mini-stat stat-one"><Users size={17}/><span><b>Local discovery</b><small>Reach nearby clients</small></span></div><div className="mini-stat stat-two"><IndianRupee size={17}/><span><b>Your pricing</b><small>Set your own rates</small></span></div></div></section>

    <footer className="footer"><div className="wrap footer-inner"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Sparkles size={18}/></span><span>bookflow<span className="brand-ai">.beauty</span><small>BEAUTY BOOKINGS, SIMPLIFIED</small></span></a><span>© 2026 BookFlow Beauty · Demo MVP</span><div><a href="#artists">Find artists</a><a href="#plans">For artists</a><button onClick={()=>setToast('Contact details will be added before public launch.')}>Contact</button></div></div></footer>

    {toast&&<div className="toast" role="status"><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast('')} aria-label="Dismiss notification"><X size={15}/></button></div>}
    {showEnquiry&&<div className="modal-backdrop" onClick={closeEnquiry}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={closeEnquiry}><X/></button>{!submitted?<><div className="eyebrow">BOOKING ENQUIRY</div><h2>Let's find your <em>artist.</em></h2><p className="modal-sub">Share a few details and we will route your enquiry to eligible local artists when the live database is connected.</p><form onSubmit={sendEnquiry} className="form-grid"><label>Your name<input required value={lead.name} onChange={e=>setLead({...lead,name:e.target.value})} placeholder="Full name"/></label><label>Mobile number<input required type="tel" pattern="[0-9+() -]{8,18}" value={lead.phone} onChange={e=>setLead({...lead,phone:e.target.value})} placeholder="Phone number"/></label><label>Service<select value={lead.service} onChange={e=>setLead({...lead,service:e.target.value})}>{services.map(s=><option key={s}>{s}</option>)}</select></label><label>Event date<input required type="date" min={new Date().toISOString().slice(0,10)} value={lead.date} onChange={e=>setLead({...lead,date:e.target.value})}/></label><label>Event locality<select value={lead.area} onChange={e=>setLead({...lead,area:e.target.value})}>{areas.map(a=><option key={a}>{a}</option>)}</select></label><label>Approx. budget (₹)<input type="number" min="0" value={lead.budget} onChange={e=>setLead({...lead,budget:e.target.value})} placeholder="e.g. 5000"/></label><label className="full-field">Anything else? <textarea value={lead.notes} onChange={e=>setLead({...lead,notes:e.target.value})} placeholder="Venue, preferred look, timing..." rows={3}/></label><button className="btn btn-plum full-field" type="submit">Send booking enquiry <ArrowRight size={16}/></button><small className="form-disclaimer full-field">Your contact details are shared only with the artist offered your enquiry. In demo mode, no data is saved.</small></form></>:<div className="success-state"><span className="success-icon"><CheckCircle2 size={32}/></span><h2>Enquiry <em>submitted.</em></h2><p>{toast || 'Your request has been processed.'}</p><p className="form-disclaimer">If the app is in demo mode, the request is validated but not stored. Connect Supabase to enable live booking enquiries.</p><button className="btn btn-plum full-width" onClick={closeEnquiry}>Done</button></div>}</div></div>}
    {showJoin&&<div className="modal-backdrop" onClick={()=>setShowJoin(false)}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setShowJoin(false)}><X/></button><div className="eyebrow">ARTIST REGISTRATION</div><h2>Get discovered. <em>Grow locally.</em></h2><p className="modal-sub">Artist self-enrollment will collect your business details, service area, portfolio and service menu. We're testing the launch area before opening paid subscriptions.</p><div className="join-list"><div><CheckCircle2/><span><b>Build your profile</b><small>Name, bio, location and portfolio photos</small></span></div><div><CheckCircle2/><span><b>List your services</b><small>Makeup types, starting prices and travel areas</small></span></div><div><CheckCircle2/><span><b>Receive local enquiries</b><small>Only after your profile is approved and the real lead system is active</small></span></div></div><label className="interest-label">Your email or Instagram handle<input id="artist-interest" placeholder="you@example.com or @yourhandle"/></label><button className="btn btn-plum full-width" onClick={()=>{window.location.href='/join'}}>Create artist profile <ArrowRight size={16}/></button><small className="form-disclaimer">Artist profiles are reviewed before public listing. No payment is taken during the MVP pilot.</small></div></div>}
  </main>;
}
