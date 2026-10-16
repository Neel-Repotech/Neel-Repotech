import type { Artist } from './data';

/** Great-circle distance between two coordinates, in kilometres. */
export function distanceKm(a: {lat:number; lng:number}, b: {lat:number; lng:number}) {
  const rad = (n:number) => n * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat/2)**2 + Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export type Enquiry = { service: string; eventDate: string; budget: number; lat: number; lng: number; area: string };

/** Sort eligible artists nearest-first. Production must check date availability and service-area rules server-side. */
export function rankEligibleArtists(all: Artist[], enquiry: Enquiry) {
  return all
    .filter(a => a.city === 'Chhatrapati Sambhaji Nagar' && a.availability === 'Accepting enquiries')
    .map(a => ({ ...a, calculatedDistanceKm: distanceKm({lat: enquiry.lat, lng: enquiry.lng}, {lat:a.lat, lng:a.lng}) }))
    .sort((a,b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
}
