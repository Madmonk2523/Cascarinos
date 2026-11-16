# Launch checklist

- [ ] Restaurant approves final copy, images and usage rights.
- [ ] Confirm ordering provider preference, phone, daily dine-in and holiday hours.
- [ ] Confirm whether catering deserves a separate menu/page.
- [ ] Approve privacy and accessibility pages, and review legal obligations with counsel.
- [ ] Test keyboard, zoom and screen reader with real users/devices where possible.
- [ ] Set production canonical URL and add an absolute `og:image` URL on the approved public production host. The private review image returns HTTP 401 to unauthenticated requests, so it is intentionally omitted. Verify the final image returns HTTP 200 with an image Content-Type without cookies/login, and check a social-link preview.
- [ ] Remove `noindex` meta, robots restriction and Vercel X-Robots-Tag only at authorized launch.
- [ ] Verify final Vercel deployment, ordering/directions links and real phone behavior.

No form backend or payment capture is needed for this version. Online ordering remains on the restaurant’s existing provider.
