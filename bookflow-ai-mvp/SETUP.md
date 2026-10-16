# BookFlow Beauty — launch setup

This repository is a deployable Next.js MVP for a local makeup-artist directory, artist onboarding, booking enquiries, nearest-first offer queue, artist dashboard and admin moderation. It is not a finished commercial marketplace: payments, real-time WhatsApp/SMS, verified review collection, map/geocoding and stronger anti-spam controls are not included.

## 1. Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Supabase keys, the public directory shows clearly marked illustrative demo artists. Enquiry validation works but submissions are not saved. Artist registration requires a configured database.

## 2. Create the database

1. Create a project at https://supabase.com (free tier is suitable for a pilot).
2. In Supabase → SQL Editor, run `supabase/schema.sql` once on a new project.
3. In Supabase → Project Settings → API, copy the Project URL, anon/public key and service_role key into `.env.local` using `.env.example` as a guide.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` private. Never prefix it with `NEXT_PUBLIC_` or commit `.env.local`.
5. In Supabase Auth → URL Configuration, set your local URL and later your deployed production URL. Configure email sending before collecting real registrations.

The schema enables row-level security. All private data access in this MVP goes through server routes using the service-role key after checking the signed-in user for dashboard/admin actions. Never send the service-role key to the browser.

## 3. Configure the app

`.env.local` values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
CRON_SECRET=replace-with-a-long-random-secret
```

The default sample data is for Chhatrapati Sambhaji Nagar; the registration form also includes Pune/Pimpri-Chinchwad. The city and locality coordinates are simple pilot approximations, not a geocoding service. Add and verify locality coverage before accepting customer bookings in new cities.

## 4. Approve the first artist and create an admin

New artist profiles are pending and do not appear publicly until approved. After registering your admin account through `/join` (you can use a separate email), find the user ID in Supabase → Authentication → Users and run:

```sql
update public.profiles
set role = 'admin'
where id = 'PASTE-ADMIN-USER-UUID-HERE';
```

Sign in at `/login`, then open `/admin` to approve or reject applications. Approving an artist changes the public directory status. For a production admin account, use a unique email, strong password and MFA.

## 5. Lead queue behaviour

When a customer submits an enquiry, the server saves it and looks for approved artists in the selected city who offer that exact service, have a current `trial` or `active` subscription, have coordinates, and cover the enquiry locality within their travel radius. Eligible artists are ordered by calculated straight-line distance. The first offer is active for 10 minutes; later artists remain queued. Artist dashboard actions let an artist accept or decline. Declining advances the queue. The cron route expires overdue offers and advances the queue.

The included `vercel.json` requests the queue cron every five minutes. On a host that supports cron, set `CRON_SECRET` as an environment variable and ensure the platform sends `Authorization: Bearer <CRON_SECRET>` to the route. If your host does not support cron, configure an external scheduler. Cron availability may depend on your hosting plan.

**Important:** the first release does not send email, SMS or WhatsApp alerts when an offer is assigned. Artists must check the dashboard. Add and test notification delivery before selling a lead-response SLA. The expiry worker runs on a schedule, so timeout handling is approximate to that schedule, not exact to the second.

## 6. Deploy

1. Push the project to GitHub.
2. Import the repository into Vercel or another Next.js-compatible host.
3. Add all `.env.example` values in the host's environment-variable settings; set `NEXT_PUBLIC_SITE_URL` to the real HTTPS domain.
4. Deploy, then update Supabase Auth's allowed redirect/site URLs to the deployed domain.
5. Test `/api/health`, artist registration, email confirmation/sign-in, admin approval, a real enquiry and decline/accept queue behaviour before sharing publicly.

## 7. Before charging artists

- Add CAPTCHA/rate limiting to public forms and account registration.
- Add real email/WhatsApp notifications and monitor failed deliveries.
- Add payment provider checkout and verify subscription webhooks server-side. Do not manually trust browser-submitted subscription status.
- Add an availability calendar, cancellation/dispute policy, customer consent and privacy policy.
- Verify all sample locality coordinates and add a proper geocoding/maps provider if needed.
- Add portfolio image upload with file-type/size checks and moderation.
- Add database backups, error monitoring, abuse reporting and tests for concurrent offer acceptance.
- Replace illustrative demo artist cards with real, consented artist listings before public launch.

## 8. Useful routes

- `/` public directory and booking enquiry form
- `/join` artist registration
- `/login` artist/admin sign-in
- `/dashboard` artist profile and enquiry offers
- `/admin` approve/reject artist applications (admin role required)
- `/api/health` backend status
