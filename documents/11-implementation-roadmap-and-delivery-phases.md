# 11. Implementation Roadmap and Delivery Phases

## 11.1 Maqsad

Bu hujjat agentga ishni qaysi tartibda qurish kerakligini ko'rsatadi. Katta frontendni birdaniga qilish o'rniga, dependency va risk bo'yicha bosqichma-bosqich yurish kerak.

## 11.2 Nega bosqichma-bosqich yondashuv kerak

Fintech frontendda quyidagi narsalar bir-biriga bog'liq:
- auth
- household context
- app shell
- API layer
- shared design system
- transaction flows

Agar agent avvaldan shu foundational qatlamlarni to'g'ri qurmasa, keyingi featurelar qayta yozishga majbur qiladi.

## 11.3 Phase 0 — Foundation

### Maqsad
Loyiha skeleton va core infrastructure'ni tayyorlash.

### Ishlar
- Next.js app bootstrap
- TypeScript strict config
- ESLint, Prettier, Husky
- Tailwind setup
- shadcn/ui init
- tokens va globals
- root project structure
- env schema
- base ui primitives
- app shell skeleton

### Natija
Kod baza endi feature qabul qila oladi.

## 11.4 Phase 1 — Auth and Session

### Maqsad
Secure auth flow va protected app entry.

### Ishlar
- login page
- register page
- BFF auth routes
- secure cookie session
- refresh strategy
- logout flow
- protected route redirect
- household selection entry

### Nega oldin
Auth yo'q bo'lsa boshqa finance featurelarni real holatda tekshirib bo'lmaydi.

## 11.5 Phase 2 — Dashboard Shell and Shared Patterns

### Maqsad
User kirgandan keyingi asosiy experience.

### Ishlar
- sidebar nav
- topbar
- dashboard layout
- page header
- section card
- empty/error/loading shared components
- amount display component
- role-aware nav visibility

### Natija
Boshqa featurelar shu shellga oson joylashadi.

## 11.6 Phase 3 — Accounts and Overview

### Maqsad
Asosiy moliyaviy kontekstni ko'rsatish.

### Ishlar
- accounts fetch va mapping
- accounts list/grid/carousel
- available balance hero
- quick action triggers
- recent transactions snapshot
- overview screen assembly

### Natija
Dashboard foydali ko'rinishga keladi.

## 11.7 Phase 4 — Transactions Core

### Maqsad
Eng muhim business flowlarni ishga tushirish.

### Ishlar
- expense create
- income create
- transfer create
- category select integration
- account select integration
- idempotent mutation wrapper
- transaction list page
- filters and search params

### Nega bu eng muhim bosqich
Bu loyihaning kundalik foydalanish markazi shu.

## 11.8 Phase 5 — Debts

### Maqsad
Qarz va settlement flowlarini qo'shish.

### Ishlar
- debt list
- create debt form
- settlement dialog
- debt status UI
- post-settlement refresh

### Risk
Bu ham money mutation, shuning uchun form va idempotency discipline kuchli bo'lishi kerak.

## 11.9 Phase 6 — Budgets

### Maqsad
Planning layer qo'shish.

### Ishlar
- period switch
- limit upsert form
- budget progress cards
- category breakdown
- empty and onboarding states

### Natija
Product "tracker"dan "planner"ga o'tadi.

## 11.10 Phase 7 — Analytics

### Maqsad
Insight va trendlar.

### Ishlar
- summary cards
- category chart
- calendar aggregate
- period filters
- chart responsive behavior

### Qoida
Analytics chiroyli bo'lishi kerak, lekin ma'lumotni chalkashtirmasligi kerak.

## 11.11 Phase 8 — Settings and Members

### Maqsad
Operational management.

### Ishlar
- profile settings
- household settings
- member list
- invite flow integration
- role-aware UI affordance

## 11.12 Phase 9 — Quality hardening

### Maqsad
Production readiness.

### Ishlar
- tests
- a11y pass
- performance review
- Sentry integration
- bundle review
- UX polish
- skeleton and empty state refinement

## 11.13 Deliverable per phase

Har phase oxirida quyidagilar tayyor bo'lishi kerak:
- typed code
- visual consistency
- loading/error states
- responsive behavior
- minimal docs/update notes
- review checklist pass

## 11.14 Parallel work qoidasi

Agar bir nechta agent yoki developer parallel ishlasa:
- avval design token va shared primitives lock qilinadi
- feature ownership ajratiladi
- API types / schema contract sinxron saqlanadi
- app shell va route structure markazlashgan bo'ladi

## 11.15 Yakuniy qoida

Bosqichlarni sakrab o'tib feature qilish mumkin, lekin foundation yetarli bo'lmasa keyin narxi qimmat bo'ladi.
Shuning uchun agent tezlik va arxitektura o'rtasida muvozanatni saqlashi kerak.
