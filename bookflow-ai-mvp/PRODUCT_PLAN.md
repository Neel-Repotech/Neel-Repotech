# BookFlow Beauty — product plan

## Launch wedge
Start in Chhatrapati Sambhaji Nagar with a small cluster of makeup artists. Do not expand city-wide until customer enquiries and artist response rates are healthy.

## Primary user flows
1. Artist signs up -> fills business profile -> adds services/prices/portfolio -> selects service radius -> submits for approval.
2. Admin reviews profile -> approves/rejects -> artist becomes publicly discoverable only when approved.
3. Customer selects service/date/locality/budget -> receives clear consent/privacy notice -> submits enquiry.
4. Server checks approved artists, service match, active plan, radius and date availability -> computes distance from customer/event location -> creates ordered offer queue.
5. First artist gets an offer with a configurable response window. Accept locks the enquiry to that artist. Decline/timeout moves to next eligible artist. Customer gets status updates.
6. Artist and customer confirm final price and booking directly in MVP. Platform does not hold customer funds in first release.

## Routing rules
- Rank by calculated geodesic distance, nearest first.
- Eligibility before ranking: approved, active subscription, service match, date not blocked, within travel radius, not opted out, not already offered.
- Use a server-side atomic claim/lock to prevent two artists accepting simultaneously.
- Make timeout configurable (initial test: 10 minutes); log all offers and responses.
- If nobody accepts, show customer other matching profiles and offer manual choice. Do not silently keep sharing their phone number.
- Avoid exposing precise customer coordinates to artists before a lead is accepted.

## Validation gates
Gate 1: 10 artist interviews; at least 5 willing to create a profile.
Gate 2: 3-5 real pilot artists in one locality; manually route initial enquiries with customer consent.
Gate 3: observe enquiry response time, artist acceptance, customer response and completed booking rate.
Gate 4: only test paid subscriptions after artists confirm recurring value. Track churn and lead quality, not just signups.

## Critical risks
- No demand: validate customer acquisition before building payment complexity.
- Cold-start marketplace: keep geography narrow; recruit artists first and acquire customer intent locally.
- Low-quality or duplicate leads: verification, rate limits, duplicate detection, transparent lead policy and dispute process.
- SEO uncertainty: unique useful location pages and real profiles; no promise of top rankings.
- Privacy: minimize personal data, consent before sharing, RLS, audit logs, retention policy.
- Payments: server-verified webhooks, cancellation/refund terms, invoices and tax review before launch.
