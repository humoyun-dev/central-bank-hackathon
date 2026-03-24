# 05. Folder Structure and Routing

## 5.1 Maqsad

Bu hujjat agentga frontend kod bazasini qayerga va qanday joylashtirish kerakligini ko'rsatadi.

To'g'ri structure:
- yangi developer uchun cognitive load'ni kamaytiradi
- feature ownership'ni aniqlaydi
- refactor va scale'ni osonlashtiradi

## 5.2 Tavsiya etilgan root structure

```txt
src/
  app/
  components/
    ui/
    shared/
  features/
  services/
  lib/
  hooks/
  types/
  styles/
```

## 5.3 `app/` nima uchun

`app/` route definition joyi.

### Bu yerda bo'ladi
- page.tsx
- layout.tsx
- loading.tsx
- error.tsx
- not-found.tsx
- route handlers

### Bu yerda bo'lmasligi kerak
- katta domain business logic
- mapperlar
- feature-level schema
- huge form components

## 5.4 Tavsiya etilgan routing map

```txt
app/
  (auth)/
    login/page.tsx
    register/page.tsx

  (dashboard)/
    select-household/page.tsx
    [householdId]/
      layout.tsx
      page.tsx
      accounts/page.tsx
      transactions/page.tsx
      transfers/page.tsx
      debts/page.tsx
      budgets/page.tsx
      budgets/[budgetPeriodId]/page.tsx
      analytics/page.tsx
      categories/page.tsx
      settings/page.tsx
      settings/members/page.tsx
      settings/profile/page.tsx

  invites/
    accept/[inviteToken]/page.tsx

  api/
    auth/
    households/
    transactions/
    debts/
```

## 5.5 Nega `[householdId]` route param majburiy

Bu product tenant-scoped.
Shuning uchun:
- sahifa qaysi household kontekstda ekanini URL ko'rsatishi kerak
- reload qilinganda context yo'qolmasligi kerak
- deep-link qilish mumkin bo'lishi kerak
- multi-household userlar to'g'ri experience olishi kerak

## 5.6 `components/ui/`

Bu yerda design-system primitive'lar yashaydi.

### Misollar
- button
- input
- card
- dialog
- tabs
- badge
- avatar
- skeleton
- dropdown-menu
- drawer
- table

### Qoidasi
Bu componentlar domainni bilmaydi.

Noto'g'ri:
- `AccountCardButton`ni `components/ui`ga qo'yish

To'g'ri:
- `button.tsx` `components/ui`da
- `account-card.tsx` `features/accounts/components`da

## 5.7 `components/shared/`

Bu qatlam app-aware, lekin feature-agnostic.

### Misollar
- app-shell
- sidebar-nav
- topbar
- page-header
- section-card
- empty-state
- error-state
- amount
- status-badge
- confirm-dialog

### Qachon sharedga qo'yiladi
Agar u bir nechta featureda ishlatilsa va domainga qattiq bog'lanmagan bo'lsa.

## 5.8 `features/`

Bu kod bazaning yuragi.

### Misol structure
```txt
features/
  auth/
  households/
  dashboard/
  accounts/
  categories/
  transactions/
  debts/
  budgets/
  analytics/
  settings/
```

### Har feature ichida nimalar bo'lishi mumkin
- `api/`
- `components/`
- `forms/`
- `schemas/`
- `types/`
- `mappers/`
- `hooks/`
- `utils/`

### Qoidasi
Faqat keraklisi bo'lsin. Har papka majburiy emas.

## 5.9 `services/`

Bu layer network boundary uchun.

### Nimalar bo'ladi
- browser client wrapper
- server client wrapper
- session helpers
- endpoint builders
- problem details parser
- request utilities

### Nega kerak
Network concern'larni UI ichiga sochib yubormaslik uchun.

## 5.10 `lib/`

Pure helper va small core modules.

### Misollar
- money formatter
- date helper
- permission checker
- constantlar
- validation helper
- idempotency key generator

### Qoidasi
`lib/` dumping ground bo'lib ketmasin.

## 5.11 Route file qanchalik yupqa bo'lishi kerak

### To'g'ri route file
- params oladi
- redirect yoki auth guard qiladi
- 1-3 ta fetch qiladi
- screen componentga typed props beradi

### Noto'g'ri route file
- 300 qator markup
- fetch, mapping, permission, UI hammasi ichida
- local helperlar va transformlar to'lib yotadi

## 5.12 Feature internal structure

### Example: `features/accounts`
```txt
features/accounts/
  api/
    get-accounts.ts
    create-account.ts
  components/
    account-card.tsx
    accounts-grid.tsx
  forms/
    create-account-form.tsx
  mappers/
    map-account.ts
  schemas/
    account.dto.ts
    create-account.schema.ts
  types/
    account.ts
```

### Nega bu kuchli
- featurega oid hamma narsa birga
- refactor oson
- context switching kamayadi

## 5.13 URL state qoidasi

Shareable bo'lishi kerak bo'lgan holatlar URLda yashaydi:
- filter
- date range
- search
- sort
- tab
- selected period

### Nega
- link share qilish oson
- reloaddan keyin holat saqlanadi
- browser history to'g'ri ishlaydi

## 5.14 Naming qoidalari

### Papka
- domain yoki capability bo'yicha nomla

### Fayl
- purpose bo'yicha nomla
- `screen`, `card`, `form`, `dialog`, `table` kabi semantik suffix foydali

### Example
- `budget-progress-card.tsx`
- `settle-debt-dialog.tsx`
- `transaction-filters.tsx`

## 5.15 Scaling qoidası

Feature katta bo'lsa:
- submodulega ajrat
- shared piece chiqar
- route va screen compositionni tozalab bor

Masalan:
```txt
features/transactions/
  shared/
  expenses/
  incomes/
  transfers/
```

Bu model ayniqsa finance workflowlar uchun juda qulay.
