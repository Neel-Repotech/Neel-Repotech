export type Artist = {
  id: string; slug?: string; name: string; area: string; city: string; distanceKm: number; rating: number;
  reviews: number; startingPrice: number; verified: boolean; availability: string;
  specialties: string[]; bio: string; initials: string; accent: string;
  lat: number; lng: number;
};
export const artists: Artist[] = [
  { id:'a1', name:'Shubhada Makeup Studio', area:'Cidco', city:'Chhatrapati Sambhaji Nagar', distanceKm:1.4, rating:4.9, reviews:38, startingPrice:3500, verified:true, availability:'Accepting enquiries', specialties:['Bridal','Engagement','Haldi'], bio:'Soft glam and traditional bridal looks, tailored to your event.', initials:'SM', accent:'#f5d7ce', lat:19.8762, lng:75.3433 },
  { id:'a2', name:'Glow by Riya', area:'Garkheda', city:'Chhatrapati Sambhaji Nagar', distanceKm:3.2, rating:4.8, reviews:24, startingPrice:2500, verified:true, availability:'Accepting enquiries', specialties:['Reception','Party','Bridal'], bio:'Modern makeup looks with long-wear products and a personal consultation.', initials:'GR', accent:'#d9e6d5', lat:19.8674, lng:75.3540 },
  { id:'a3', name:'The Blush Room', area:'Osmanpura', city:'Chhatrapati Sambhaji Nagar', distanceKm:5.8, rating:4.7, reviews:17, startingPrice:1800, verified:false, availability:'Accepting enquiries', specialties:['Party','Engagement','Haldi'], bio:'Fresh, photo-ready makeup for celebrations and special occasions.', initials:'BR', accent:'#e5d9f4', lat:19.8620, lng:75.3230 },
  { id:'a4', name:'Makeup by Ananya', area:'Waluj', city:'Chhatrapati Sambhaji Nagar', distanceKm:11.6, rating:4.9, reviews:31, startingPrice:3000, verified:true, availability:'Accepting enquiries', specialties:['Bridal','Reception','Pre-bridal'], bio:'Bridal packages, trials and event-day makeup services.', initials:'MA', accent:'#f3e3bd', lat:19.8460, lng:75.2140 },
];
export const services = ['Bridal makeup','Reception makeup','Engagement makeup','Haldi makeup','Mehendi makeup','Party makeup','Pre-bridal package'];
