# 03. Tech Stack and Libraries

## 3.1 Maqsad

Bu hujjat agent uchun standart kutubxona tanlovini belgilaydi. Har bir dependency nima uchun olingani va qayerda ishlatilishi tushuntiriladi.

## 3.2 Core stack

### Next.js
Asosiy framework.
Vazifasi:
- routing
- layout
- server rendering
- route handlers
- deployment readiness

### React
UI runtime.
Vazifasi:
- component model
- compositional architecture
- interactive state

### TypeScript
Majburiy qatlam.
Vazifasi:
- type safety
- domain model aniqligi
- maintainability
- refactor xavfsizligi

## 3.3 Styling and UI foundation

### Tailwind CSS
Utility-first styling system.

#### Nega tanlanadi
- tokenized class usage
- fast implementation
- design systemga mos variantlar qurish oson
- repeated patternsni CVA bilan strukturalash mumkin

#### Qoidalar
- random arbitrary qiymatlar minimum
- spacing va radius tokenlarga tayanadi
- repeated visual pattern helper bilan ajratiladi

### shadcn/ui
Foundation component collection.

#### Nega tanlanadi
- accessible base
- source-owned komponentlar
- Radix primitives ustiga qurilgan
- design systemga moslab extend qilish mumkin

#### Qoidalar
- copy qilib tashlab qo'yma
- foundation sifatida ko'r
- styling va variantlarni tizimli kengaytir

### Radix UI
Accessibility primitivlari.

#### Qayerda kerak
- dialog
- popover
- dropdown
- tabs
- tooltip
- select
- navigation menu

## 3.4 Class composition utilities

### clsx
Conditional classlarni boshqarish uchun.

### tailwind-merge
Tailwind class collisionni tozalash uchun.

### class-variance-authority
Variant-based component API yozish uchun.

#### Nega juda muhim
Button, badge, card, status pill kabi patternlarda:
- `variant`
- `size`
- `tone`
- `state`
bir xil usulda boshqariladi.

Bu design system disciplinani kuchaytiradi.

## 3.5 Data and async layer

### TanStack Query
Client-side async state va mutation orchestration uchun.

#### Qayerda ishlatiladi
- create/update/delete mutationlar
- optimistic UI bo'lmagan controlled invalidation
- dialog/form submit lifecycle
- local stale cache sync

#### Qoidalar
- dashboard initial readni serverda hal qil
- client queryni faqat interaktiv data uchun ishlat
- query keylar aniq va domain-driven bo'lsin

### Zod
Runtime validation va schema definition.

#### Qayerda ishlatiladi
- API response parse
- form input schema
- env validation
- DTO mapping

#### Nega kerak
TypeScript compile-time beradi, Zod esa runtime boundaryni himoya qiladi.

### React Hook Form
Form state uchun.

#### Nega kerak
- performant
- simple
- zod bilan yaxshi ishlaydi
- field-level boshqaruv qulay

## 3.6 UX helpers

### Sonner
Toast notification.

#### Qayerda
- successful save
- transient error
- retry tavsiya qilinadigan holat

### lucide-react
Icon system.

#### Qoidasi
- icon only buttonlarda `aria-label`
- bir xil line weight va style consistency

### react-number-format
Money input uchun.

#### Nega
- human-friendly money input
- decimal mask
- thousand separator
- input UX yaxshilanadi

### date-fns
Date parsing va formatting.

#### Nega
- yengil
- pure utility
- predictable API

### Recharts
Dashboard visualization uchun.

#### Qoidasi
- chart dizayn systemga mos bo'lsin
- chart faqat bezak bo'lmasin
- tooltip, axis va legends readable bo'lsin

### @tanstack/react-table
Dense transaction list va admin-like table patternlar uchun.

#### Nega
- table logic yaxshi ajratiladi
- sorting/filtering/pagination extensible

## 3.7 URL state helper

### nuqs
Typed search params uchun.

#### Nega
- filter state shareable bo'ladi
- analytics tablar URLga tushadi
- back/forward navigation to'g'ri ishlaydi

## 3.8 Quality stack

### ESLint
Static quality enforcement.

### Prettier
Formatting consistency.

### Husky
Pre-commit hook.

### lint-staged
Staged file bo'yicha tezkor check.

### commitlint
Commit convention.

### Sentry
Production error monitoring.

#### Nega kerak
Fintech flowdagi noma'lum xatolarni silent qoldirib bo'lmaydi.

## 3.9 Testing stack

### Vitest
Unit va integration testlar.

### Testing Library
UI behavior testlari.

### user-event
Real user interactionga yaqin test.

### MSW
Network mocking.

### Playwright
E2E flow.

### axe-core
A11y tekshiruvlari.

## 3.10 Tavsiya etilmaydigan narsalar

### Redux
Hozirgi scope uchun ortiqcha bo'lishi mumkin.

### MobX
Predictability va team scale uchun tavsiya etilmaydi.

### localStorage auth
Xavfsizlik sababi bilan ishlatilmaydi.

### Ko'p chart library
Bitta stack bilan consistency yaxshiroq.

## 3.11 Dependency tanlash qoidası

Agent yangi dependency qo'shishdan oldin shu savollarni beradi:
- existing stack bilan yechsa bo'ladimi
- dependency real muammoni yechyaptimi
- bundle va maintenance cost oqlanadimi
- security va ecosystem stabilmi
- team uchun tushunarli bo'ladimi

Agar bu savollarga kuchli javob bo'lmasa, dependency qo'shilmaydi.
