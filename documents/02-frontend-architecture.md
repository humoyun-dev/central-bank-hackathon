# 02. Frontend Architecture

## 2.1 Maqsad

Bu hujjat frontendning yuqori darajadagi arxitektura modelini belgilaydi. Agent har feature ustida ishlaganda aynan shu modelga tayanishi kerak.

## 2.2 Asosiy arxitektura qarori

Frontend uchun tavsiya etiladigan asosiy model:

- **Next.js App Router**
- **Server Components default**
- **Client Components selective**
- **BFF pattern**
- **Feature-based modular frontend**
- **Design system driven UI**
- **Typed API boundary**
- **TanStack Query for mutations and client sync**
- **React Hook Form + Zod for form workflows**

Bu kombinatsiya fintech kabi productlar uchun juda to'g'ri, chunki u:
- secure auth flow beradi
- server/client boundaryni aniq qiladi
- kodni feature bo'yicha skeyl qiladi
- typed integration beradi
- design consistency'ni boshqaradi

## 2.3 Nega Next.js App Router

### App Router foydasi
- nested layoutlar bilan dashboard shellni tabiiy qurish mumkin
- server componentlar bilan initial data fetch qilish qulay
- route-level loading va error file'lar native mavjud
- server action yoki route handler orqali secure BFF yozish oson
- Vercel bilan production integration kuchli

### Agent uchun qaror
Yangi sahifa ochilsa, agent birinchi savolni beradi:
"Bu sahifa serverda assemble qilinadimi yoki clientda interaktiv bo'ladimi?"

Default javob: **serverda assemble qilinadi**.

## 2.4 Server Components default qoidasi

### Server Component qachon ishlatiladi
- initial dashboard data
- account list
- budget summary
- analytics initial view
- settings screen initial load
- household switch context
- auth-protected SSR page composition

### Foydasi
- kamroq JS
- secure fetch
- server-side session ishlatish
- initial paint uchun kuchli
- predictable data orchestration

### Nega muhim
Finance dashboardlarda sahifa ochilganda user darhol ishonchli va fresh ma'lumot ko'rishi kerak.

## 2.5 Client Components qachon kerak

### Client kerak bo'ladigan joylar
- form interaction
- sheet/dialog open state
- tabs va local segmented controls
- charts
- interactive filters
- optimistic submit UX
- command/search input
- mobile drawer

### Qoidasi
Client boundary imkon qadar kichik bo'lishi kerak.

Noto'g'ri:
- butun page'ni `"use client"` qilish

To'g'ri:
- page serverda
- `ExpenseFormSheet` clientda
- `TrendChart` clientda
- `TransactionFilters` clientda

## 2.6 BFF layer nima va nega kerak

BFF = Backend For Frontend.

Bu loyihada frontend backend bilan to'g'ridan-to'g'ri public token orqali emas, Next.js server qatlami orqali gaplashadi.

### Nega
- access token va refresh token browser JS ichida yurmaydi
- httpOnly cookie ishlatiladi
- refresh flow serverda amalga oshadi
- bearer injection markazlashadi
- retry, logout, session cleanup boshqariladi

### Agent uchun qoidalar
- auth tokenni client codega expose qilma
- backendga bevosita browserdan sensitive request yuborishdan qoch
- session logic `services/api/server` ichida yashasin

## 2.7 Layered frontend model

Agent shu mental model bilan ishlaydi:

### Layer 1: Route assembly
`app/*`
- page, layout, loading, error
- server orchestration
- minimal composition

### Layer 2: Feature modules
`features/*`
- domain workflows
- typed data mapping
- feature UI
- forms
- feature-level hooks

### Layer 3: Shared UI
`components/shared`
- app shell
- headers
- sections
- empty and error states
- reusable layout blocks

### Layer 4: UI primitives
`components/ui`
- button
- input
- dialog
- dropdown
- tabs
- table
- drawer

### Layer 5: Services and core logic
`services/*`, `lib/*`
- API client
- session handling
- schema validation
- money/date helpers
- permissions
- constants

## 2.8 Route composition falsafasi

Route file qalin bo'lmasligi kerak.

### Route vazifasi
- params olish
- required server fetch qilish
- feature sectionlarni compose qilish
- access control / redirect qilish

### Route vazifasi bo'lmagan narsalar
- katta view logic
- raw fetch stringlari
- complex mapping
- giant markup tree
- local business helpers

## 2.9 Feature-driven architecture

Feature papkalar biznes capability bo'yicha ajratiladi.

Masalan:
- auth
- households
- accounts
- categories
- transactions
- debts
- budgets
- analytics
- settings

### Nega technical folder bilan emas
`components/`, `hooks/`, `schemas/` degan global struktura yirik appda scale qilmaydi.
Feature bo'yicha ajratish:
- ownershipni aniqlashtiradi
- related code'ni bir joyda ushlaydi
- refactor'ni osonlashtiradi
- domain reasoning'ni yaxshilaydi

## 2.10 Read va write flowni ajratish

Finance productda bu juda muhim.

### Read flow
- SSR server fetch
- typed parse
- display component

### Write flow
- client form
- zod validation
- mutation wrapper
- idempotency key
- success/error UX
- query invalidation yoki refetch

Bu ajratish kodni ham, mental modelni ham toza saqlaydi.

## 2.11 Error boundary arxitekturasi

Har layer o'z xatosini o'z darajasida tutadi.

### Route-level
- fatal load error
- auth or redirect issue
- data load failure

### Feature-level
- specific widget error state
- partial section failure

### Form-level
- inline validation
- backend domain error
- disabled/loading state

### Global
- unexpected error logging
- toast for transient failures
- sentry capture

## 2.12 Production architecture tamoyili

Agent har yechimni shu savol bilan tekshiradi:

"Bu kod 6 oydan keyin yangi developer kelganda ham tushunarli va xavfsiz bo'lib qoladimi?"

Agar javob yo'q bo'lsa, yechim qayta ko'rib chiqiladi.
