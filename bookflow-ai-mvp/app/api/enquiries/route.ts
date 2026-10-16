import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';
const areaCoords: Record<string, {lat:number; lng:number}> = {
  'Cidco': {lat:19.8762,lng:75.3433}, 'Garkheda': {lat:19.8674,lng:75.3540}, 'Osmanpura': {lat:19.8620,lng:75.3230}, 'Waluj': {lat:19.8460,lng:75.2140}, 'Aurangabad city': {lat:19.8762,lng:75.3433}, 'Pimple Gurav': {lat:18.5814,lng:73.8197}, 'Wakad': {lat:18.5995,lng:73.7625}, 'Hinjewadi': {lat:18.5913,lng:73.7389}, 'Pimpri': {lat:18.6298,lng:73.7997}, 'Pune': {lat:18.5204,lng:73.8567}
};
const distance=(a:{lat:number;lng:number},b:{lat:number;lng:number})=>{const rad=(n:number)=>n*Math.PI/180,dLat=rad(b.lat-a.lat),dLng=rad(b.lng-a.lng),h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLng/2)**2;return 6371*2*Math.asin(Math.sqrt(h));};
const clean=(v:unknown,max=500)=>typeof v==='string'?v.trim().slice(0,max):'';
export async function POST(req:NextRequest){
 try{
  const body=await req.json();
  const customer_name=clean(body.name,100),customer_phone=clean(body.phone,25),service_name=clean(body.service,100),event_date=clean(body.date,10),event_area=clean(body.area,100),event_city=clean(body.city,100)||'Chhatrapati Sambhaji Nagar',budget=body.budget===''||body.budget==null?null:Number(body.budget),notes=clean(body.notes,1500);
  if(!customer_name||customer_phone.replace(/\D/g,'').length<10||!service_name||!/^\d{4}-\d{2}-\d{2}$/.test(event_date)||!event_area)return NextResponse.json({error:'Please enter your name, valid phone, service, event date and locality.'},{status:400});
  if(Number.isNaN(Date.parse(event_date))||event_date<new Date().toISOString().slice(0,10)||(budget!==null&&(!Number.isFinite(budget)||budget<0)))return NextResponse.json({error:'Please check your event date and budget.'},{status:400});
  if(!hasSupabaseConfig())return NextResponse.json({mode:'demo',message:'Form validated, but it was not saved because Supabase is not connected. Configure the keys and run supabase/schema.sql.'});
  const db=createAdminSupabase(),coords=areaCoords[event_area]||areaCoords[event_city]||areaCoords['Aurangabad city'];
  const {data:enquiry,error}=await db.from('enquiries').insert({customer_name,customer_phone,service_name,event_date,event_area,event_city,budget,notes,event_latitude:coords.lat,event_longitude:coords.lng,status:'new'}).select('id').single();
  if(error)throw error;
  const {data:artistRows,error:artistError}=await db.from('artists').select('id,latitude,longitude,travel_radius_km,services(name,is_active),subscriptions(status,ends_at)').eq('status','approved').eq('city',event_city);
  if(artistError)throw artistError;
  const candidates=(artistRows||[]).filter((a:any)=>{
   const serviceMatch=(a.services||[]).some((s:any)=>s.is_active&&s.name.toLowerCase()===service_name.toLowerCase());
   const subscribed=(a.subscriptions||[]).some((s:any)=>['active','trial'].includes(s.status)&&(!s.ends_at||s.ends_at>=new Date().toISOString()));
   if(!serviceMatch||!subscribed||a.latitude==null||a.longitude==null)return false;
   return distance(coords,{lat:a.latitude,lng:a.longitude})<=(a.travel_radius_km||15);
  }).map((a:any)=>({...a,km:distance(coords,{lat:a.latitude,lng:a.longitude})})).sort((a:any,b:any)=>a.km-b.km);
  if(candidates.length){const now=Date.now();const rows=candidates.map((a:any,i:number)=>({enquiry_id:enquiry.id,artist_id:a.id,distance_km:Number(a.km.toFixed(2)),offer_order:i+1,status:i===0?'offered':'queued',offered_at:i===0?new Date(now).toISOString():null,expires_at:i===0?new Date(now+10*60*1000).toISOString():null}));const {error:queueError}=await db.from('enquiry_offers').insert(rows);if(queueError)throw queueError;return NextResponse.json({mode:'live',id:enquiry.id,message:`Enquiry saved. ${candidates.length} eligible artist(s) queued nearest-first. The first offer has a 10-minute response window.`});}
  return NextResponse.json({mode:'live',id:enquiry.id,message:'Enquiry saved. No approved, subscribed artist currently matches this service and travel area; the team can follow up manually.'});
 }catch(error:any){console.error('Enquiry submission failed:',error?.message||error);return NextResponse.json({error:'Could not save this enquiry. Verify your Supabase setup and schema, then try again.'},{status:500});}
}
