# NovaLearn QA Checklist

Date: 2026-06-13

## Completed in this QA pass

- [x] Backend health check passed at `GET /health`
- [x] Frontend production build passed with `npm run build`
- [x] Frontend lint passed with `npm run lint`
- [x] Published courses API returned the seeded catalog
- [x] AI search API returned relevant results for sample queries like `generative ai` and `mern`
- [x] Guest user hitting `/allcourses` was redirected to `/signup`
- [x] Student signup flow worked in the browser
- [x] Logged-in student could open the courses catalog
- [x] Category filter worked on the courses page
- [x] AI search page returned matching courses in the UI
- [x] Course detail page loaded correctly for `MERN Stack Masterclass`
- [x] Curriculum showed 3 lectures and 1 free preview lesson
- [x] Preview video was present and playable from the free lecture block
- [x] Educator auth worked through the API
- [x] Educator protected routes worked for `currentuser` and `getcreatorcourses`
- [x] Temporary educator course create/remove API flow worked
- [x] Local CORS mismatch for `127.0.0.1:5173` vs `localhost:5173` was fixed and retested
- [x] Route-level code splitting removed the previous large main bundle warning

## Manual checks still recommended before deploy

- [ ] Google login/signup popup flow with Firebase
- [ ] Forgot password email + OTP flow
- [ ] Razorpay order creation, payment success, and payment failure flow
- [ ] Enrollment after payment and enrolled courses page
- [ ] Educator dashboard UI flow for create/edit course from the browser
- [ ] Educator lecture upload/edit flow with Cloudinary
- [ ] Profile update flow including image upload
- [ ] Mobile responsive check on home, auth, all courses, and course detail pages
- [ ] Cross-browser sanity pass in Chrome, Safari, and Edge
- [ ] Empty-state checks with no courses and no reviews

## Follow-up

- [ ] Remove temporary QA accounts from the database:
  - `qa_student_1781336994876@example.com`
  - `qa_educator_1781337600@example.com`
