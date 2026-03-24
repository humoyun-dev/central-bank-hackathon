# 08. State Management, Forms and Rendering

## 8.1 Maqsad

Bu hujjat agentga qaysi state qayerda yashashi kerakligini, qachon SSR yoki client fetch kerakligini va form workflow qanday qurilishini tushuntiradi.

## 8.2 State management falsafasi

State qanchalik yaqin joyda kerak bo'lsa, o'sha yerda yashashi kerak.

### Asosiy qoida
Global state default emas.

Ko'pincha quyidagilar yetadi:
- local component state
- route param
- search params
- server props
- React Query mutation/cache state
- form internal state

## 8.3 State turlari

### Local UI state
- modal open
- dropdown open
- selected row
- local tab
- temporary toggle

### URL state
- date range
- search
- filter
- sort
- analytics period
- tab
- pagination

### Server state
- initial dashboard data
- household summary
- accounts list
- categories list
- budget progress
- analytics aggregate

### Mutation state
- submitting
- success
- mutation error
- invalidation trigger

## 8.4 Qachon global state kerak bo'lishi mumkin

Faqat cross-cutting holatlarda:
- sidebar collapsed preference
- command palette open
- ephemeral UI theme preference
- user-scoped non-sensitive shell state

Bunda ham sodda context yoki cookie yetishi mumkin.

## 8.5 Rendering strategy

### SSR / server fetch
Quyidagilar serverda:
- dashboard overview
- accounts page initial data
- transactions page initial list
- budgets summary
- analytics initial view
- settings page

### Client rendering
Quyidagilar clientda:
- chart interactivity
- form sheets/dialogs
- debounced search input
- segmented toggle
- inline table controls

### Qoidasi
Initial data serverda, interaction clientda.

## 8.6 Caching strategy

### Fresh bo'lishi kerak bo'lgan ma'lumotlar
- current balance
- recent transactions
- debt settlement result
- budget progress after update

Bular uchun:
- `no-store` yoki controlled refetch
- optimistic assumption minimal

### Qisqa cache bo'lishi mumkin
- categories
- static settings metadata
- low-volatility references

### Historical analytics
- short revalidate bilan yurishi mumkin
- lekin user actiondan keyin invalidation aniq bo'lishi kerak

## 8.7 Form architecture

### Standard stack
- React Hook Form
- Zod schema
- typed submit handler
- mutation wrapper
- inline + global error handling

### Har formda bo'lishi kerak
- schema
- default values
- submit transform
- disabled state
- loading state
- error rendering
- success behavior

## 8.8 Finance form pattern

### Expense form
Maydonlar:
- account
- category
- amount
- note/description
- date
- timezone
- optional metadata

### Income form
Expensega o'xshash, lekin income category va source semanticsga mos.

### Transfer form
- from account
- to account
- amount
- optional fx snapshot info
- date
- note

### Debt form
- counterparty
- direction
- amount
- date
- note

### Settlement form
- debt select/context
- settlement amount
- account
- date

## 8.9 Form UX qoidalari

### Submitdan oldin
- required fieldlar aniq
- amount input tushunarli
- invalid holat inline ko'rinadi

### Submit paytida
- submit button loading
- duplicate click blok
- critical fieldlar freeze
- idempotency key attach

### Submitdan keyin
- success feedback
- relevant data refresh
- stale UI qolib ketmasin

## 8.10 Search params pattern

Shareable state URLga tushadi.

### Example
- `?period=this-month`
- `?kind=EXPENSE`
- `?tab=weekly`
- `?from=2026-03-01&to=2026-03-31`

### Nega
- copy-paste link
- browser navigation
- reload resilience
- debugging qulay

## 8.11 Query key strategy

Query keylar domain-driven bo'lishi kerak.

### Misol
- `["household", householdId, "accounts"]`
- `["household", householdId, "transactions", filters]`
- `["household", householdId, "budgets", periodId]`

### Nega muhim
Invalidation precise bo'ladi.
Noto'g'ri key strategy stale yoki ortiqcha refetchga olib keladi.

## 8.12 Optimistic UI bo'yicha ehtiyotkorlik

Finance flowsda optimistic update juda ehtiyotkor qo'llanadi.

### Qachon kerakmas
- balance mutation
- transfer
- debt settlement

### Qachon bo'lishi mumkin
- low-risk local preference
- UI-only toggles
- non-financial lightweight interaction

Default: optimistic update ishlatma, server truthga tayan.

## 8.13 Loading va skeleton qoidalari

### Skeleton qachon
- layout joyi aniq bo'lsa
- data kelmaguncha structure ko'rsatish kerak bo'lsa

### Spinner qachon
- kichik local loading
- button action
- inline refresh

### Qoidasi
Full page spinner'ni ortiqcha ishlatma.

## 8.14 Empty state qoidalari

Empty state shunchaki "No data" emas.

### U quyidagilarni tushuntiradi
- bu bo'lim nima
- nima uchun bo'sh
- foydalanuvchi keyin nima qilishi kerak

Masalan:
- "Hali transaction yo'q"
- "Birinchi expense yoki income qo'shing"

## 8.15 Final qoida

State murakkabligi oshayotgan bo'lsa, avval shuni tekshir:
- state noto'g'ri joyda yashamayaptimi
- URLga tushishi kerak bo'lgan narsa local bo'lib qolmadimi
- serverda olinishi kerak bo'lgan data clientga tushib qolmadimi
- bir ma'lumot ikki joyda bekordan-bekor saqlanmayaptimi
