import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabase, hasSupabaseConfig } from '@/lib/supabase-admin';
const clean=(v:unknown,max=300)=>typeof v==='string'?v.trim().slice(0,max):'';
const slugify=(s:string)=>s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60);
export async function POST(req:NextRequest){
 try{
  if(!hasSupabaseConfig())return NextResponse.json({error:'Connect Supabase first. Follow SETUP.md.'},{status:503});
  const b=await req.json(),email=clean(b.email,254).toLowerCase(),password=clean(b.password,200),fullName=clean(b.fullName,100),businessName=clean(b.businessName,120),phone=clean(b.phone,25),city=clean(b.city,100),area=clean(b.area,100),bio=clean(b.bio,1000),services=Array.isArray(b.services)?b.services.map((s:unknown)=>clean(s,100)).filter(Boolean).slice(0,12):[],price=Number(b.startingPrice),lat=Number(b.latitude),lng=Number(b.longitude),radius=Number(b.travelRadius||15);
  if(!email.includes('@')||password.length<8||!fullName||!businessName||phone.replace(/\D/g,'').length<10||!city||!area||!services.length||!Number.isFinite(price)||price<0||!Number.isFinite(lat)||!Number.isFinite(lng))return NextResponse.json({error:'Complete required fields, select at least one service, and use a password with 8+ characters.'},{status:400});
  const db=createAdminSupabase(),{data:userData,error:userError}=await db.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:fullName,role:'artist'}});
  if(userError)return NextResponse.json({error:userError.message},{status:400});
  const userId=userData.user.id;
  const {error:profileError}=await db.from('profiles').insert({id:userId,role:'artist',full_name:fullName,phone});
  if(profileError){await db.auth.admin.deleteUser(userId);throw profileError;}
  const {data:artist,error:artistError}=await db.from('artists').insert({user_id:userId,business_name:businessName,slug:`${slugify(businessName)||'makeup-artist'}-${userId.slice(0,6)}`,bio,city,area,latitude:lat,longitude:lng,travel_radius_km:Math.max(1,Math.min(200,radius)),starting_price:Math.round(price),status:'pending'}).select('id').single();
  if(artistError){await db.auth.admin.deleteUser(userId);throw artistError;}
  const {error:serviceError}=await db.from('services').insert(services.map((name:string)=>({artist_id:artist.id,name,price_from:Math.round(price),is_active:true})));
  if(serviceError)throw serviceError;
  const {error:subError}=await db.from('subscriptions').insert({artist_id:artist.id,plan_code:'starter',status:'trial',starts_at:new Date().toISOString(),ends_at:new Date(Date.now()+14*86400000).toISOString()});
  if(subError)throw subError;
  return NextResponse.json({ok:true,message:'Registration received! Your profile is pending admin approval. You can now sign in to view your dashboard.'});
 }catch(error:any){console.error('Artist registration failed:',error?.message||error);return NextResponse.json({error:'Could not create the artist profile. Verify the database schema and try again.'},{status:500});}
}
