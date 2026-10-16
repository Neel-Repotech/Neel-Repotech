# BookFlow Beauty

A Next.js marketplace MVP for local makeup artists and customers. Features include a searchable demo directory, artist self-registration, Supabase-backed booking enquiries, nearest-first lead offers, artist dashboard actions, admin profile approval, SEO metadata and an offer-expiry cron endpoint.

**Setup:** read [`SETUP.md`](./SETUP.md) and configure Supabase using [`supabase/schema.sql`](./supabase/schema.sql). Run `npm install` then `npm run dev`.

Without Supabase keys, the directory uses illustrative sample data and booking forms are validation-only; they do not store customer details. Do not launch publicly until Supabase, email confirmation, admin approval and queue handling are tested.

This is an MVP, not a complete commercial marketplace. It does not yet include payment processing, email/SMS/WhatsApp notifications, portfolio upload, a full availability calendar, real map/geocoding, CAPTCHA or dispute workflows. See `SETUP.md` for production checklist.
