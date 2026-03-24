# 12. Agent Task Playbooks

## 12.1 Maqsad

Bu hujjat agentga real task kelganda qanday fikrlash va qanday deliverable berishni ko'rsatadi.

## 12.2 Playbook: Yangi sahifa yaratish

### Agent savollari
- bu sahifa qaysi featurega tegishli
- server page bo'ladimi
- household context kerakmi
- qaysi data initial loadda kerak
- qaysi qismlar client interaktiv
- loading/empty/error state qanday

### Deliverable
1. route file
2. screen component
3. feature section components
4. typed fetch layer
5. state variants

### Example
`/[householdId]/budgets/page.tsx`
- server fetch
- budget summary data
- page header
- progress card grid
- empty state

## 12.3 Playbook: Form flow yaratish

### Agent savollari
- bu mutation idempotentmi
- qaysi maydonlar kerak
- money/date parsing bormi
- successdan keyin nima refresh bo'ladi
- modalmi, page formmi yoki sheetmi

### Deliverable
- zod schema
- RHF form
- mutation hook
- inline errors
- success/error handling
- loading/disabled state

### Qoida
Submit qiladigan har finance form double-submitga qarshi bo'lishi kerak.

## 12.4 Playbook: API integration yozish

### Agent savollari
- request body shape qanday
- response raw DTO qanday
- mapper kerakmi
- problem details handling qayerda
- server clientmi yoki browser clientmi

### Deliverable
- schema
- typed client fn
- mapper
- domain type
- tests kerak bo'lsa util levelda

## 12.5 Playbook: Dashboard widget yaratish

### Agent savollari
- bu widget summarymi yoki interactive panelmi
- loading skeleton qanday
- empty state bormi
- action kerakmi
- card structure common patternga mosmi

### Deliverable
- widget component
- card header pattern
- content state variants
- mobile adaptation

## 12.6 Playbook: Code review qilish

### Agent nimani tekshiradi
- route thinmi
- fetch qayerda turibdi
- raw DTO UI'ga chiqib ketmadimi
- formda zod bormi
- idempotency unutildimi
- design systemdan chiqib ketgan classlar bormi
- a11y kamchilik bormi
- bo'sh/error/loading holatlar bormi

### Review natijasi formati
1. Architecture issues
2. Type and data issues
3. UI/UX issues
4. A11y issues
5. Performance risks
6. Recommended refactor

## 12.7 Playbook: Refactor task

### Agent qoidalari
- refactor paytida behavior o'zgartirmaslikka harakat qil
- avval boundariesni tozalash
- keyin naming va extraction
- eng oxirida visual cleanup

### Nima bo'lishi mumkin
- giant componentni bo'lish
- mapper kiritish
- shared primitivega ko'chirish
- route assemblyni soddalashtirish

## 12.8 Playbook: Bug fix

### Agent avval aniqlaydi
- bug UI layerdami
- state syncdami
- mapping xatodami
- permission xatodami
- race conditionmi
- backend contract mismatchmi

### Bug fix deliverable
- root cause
- minimal safe fix
- regression risk
- test yoki guard note

## 12.9 Playbook: Design system extension

### Agent savollari
- bu yangi primitive kerakmi yoki mavjudini variant qilish yetadimi
- pattern qayta ishlatiladimi
- token va variant bilan yechiladimi
- naming tizimga mosmi

### Qoidasi
Bir feature uchun yangi one-off UI primitive yaratma.
Avval mavjud patternni ko'r.

## 12.10 Playbook: Performance review

### Agent tekshiradi
- keraksiz client component bormi
- large dependency bormi
- render ichida heavy logic bormi
- query invalidation ortiqchami
- giant chart yoki table qayerda parchalanishi mumkin

## 12.11 Playbook: Release readiness

### Agent so'nggi tekshiruv
- all critical flows ishlaydimi
- visual consistency saqlanganmi
- a11y pass bormi
- mobile usablemi
- error handling bormi
- money/date correctness tasdiqlanganmi
- auth/session securemi

## 12.12 Final operating rule

Agent hech qachon "kod ishlayapti"ni yakuniy mezon deb olmasligi kerak.
Yakuniy mezon:
- bu kod productga mosmi
- jamoa uchun maintainablemi
- finance domain uchun xavfsizmi
- UI systematikmi
- keyingi featurelar uchun tayyormi
