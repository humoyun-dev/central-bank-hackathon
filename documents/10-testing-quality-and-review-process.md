# 10. Testing, Quality and Review Process

## 10.1 Maqsad

Bu hujjat agentga frontend sifatini qanday tekshirish, qaysi darajada test yozish va PR reviewda nimalarga qarash kerakligini tushuntiradi.

## 10.2 Testing falsafasi

Hammasini test bilan qoplash maqsad emas.
Muhim narsalarni to'g'ri darajada test qilish maqsad.

Finance productda quyidagilar eng kritik:
- amount transform
- permission logic
- form validation
- secure mutation flow
- key user journey'lar

## 10.3 Test pyramid

### Unit tests
Eng past qatlam.
Nimalar uchun:
- formatterlar
- parserlar
- mapperlar
- permission helperlar
- money/date util'lar
- idempotency helper

### Component tests
UI behavior uchun.
Nimalar uchun:
- form validation
- button disabled/loading
- dialog open/close
- empty/error render
- keyboard interaction

### Integration tests
Feature slice uchun.
Nimalar uchun:
- route handler behavior
- BFF error normalization
- auth refresh path
- query invalidation

### E2E tests
Real user journey.
Nimalar uchun:
- login
- household select
- create expense
- create income
- transfer
- settle debt
- budget update
- analytics filter

## 10.4 Qaysi narsalar unit test talab qiladi

### Money
- minor unit parse/format
- negative amount rendering
- currency handling

### Dates
- local date formatting
- period conversion
- timezone-safe transform

### Permissions
- role-based action visibility
- household-dependent access

### Mapping
- DTO => domain transform
- missing optional field handling

## 10.5 Component test qoidalari

Component test implementation detailni emas, user behaviorni tekshiradi.

### Yaxshi test savollari
- user required fieldni to'ldirmasa error chiqadimi
- submit paytida button disabled bo'ladimi
- error kelganda message ko'rinadimi
- keyboard bilan dialog yopiladimi

### Yomon test savollari
- internal state 3 bo'ldimi
- class string aynan shu bo'ldimi

## 10.6 E2E critical pathlar

### P0
- auth
- dashboard open
- create expense
- create income
- transfer
- debt settlement

### P1
- budgets
- analytics filter
- category management
- member settings

### P2
- polish scenarios
- edge case flows
- empty-state branches

## 10.7 Accessibility quality

A11y alohida bonus emas.

### Tekshiriladi
- heading structure
- focus order
- keyboard navigation
- color contrast
- form labels
- icon label
- toast or inline feedback semantics

### Automation
- `axe` smoke checks
- Playwright a11y checks

### Manual
- tab navigation
- screen reader naming sanity
- modal focus trap

## 10.8 Visual review

Agent vizual sifatni ham tekshiradi.

### Review savollari
- hierarchy to'g'rimi
- spacing consistentmi
- cards bir oilaga mansub ko'rinadimi
- bir xil actionlar bir xil ko'rinadimi
- mobile layout buzilmaganmi

## 10.9 Review areas

Har PR yoki deliverable quyidagilar bo'yicha ko'riladi:
- correctness
- readability
- reusability
- accessibility
- performance
- scalability
- design system consistency
- backend contract adherence

## 10.10 Release readiness checklist

Feature releasega tayyormi:
- happy path ishlaydimi
- error holatlar sinovdan o'tdimi
- loading va empty state bormi
- role-based UX tekshirildimi
- mobile ko'rildi-mi
- amount formatting to'g'rimi
- BFF request securemi
- logs va error handling bormi

## 10.11 Agent review process

Agent kod yozgandan keyin ichki review qiladi:

### Step 1
Arxitektura review:
- bu kod to'g'ri layerga tushdimi
- route va feature boundary to'g'rimi

### Step 2
Type review:
- schema parse bormi
- `any` yo'qmi
- naming to'g'rimi

### Step 3
UI review:
- state'lar bormi
- spacing consistentmi
- mobile o'ylanganmi

### Step 4
Product review:
- user vazifani tez bajaradimi
- edge case'lar qoplanganmi

## 10.12 Yakuniy qoida

Bug bo'lmagan kod ham yetarli emas.
Yaxshi frontend:
- to'g'ri
- ko'rinarli
- tushunarli
- testlanadigan
- review qilinadigan
- productga mos
bo'lishi kerak.
