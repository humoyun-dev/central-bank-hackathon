# 07. Data Models, Money, Dates, Errors and Idempotency

## 7.1 Maqsad

Bu hujjat agentga fintech domainning eng nozik qoidalarini tushuntiradi. Bu yerda xato qilish UI xatosi emas, business xatosiga aylanishi mumkin.

## 7.2 Money qoidasi

### Oltin qoida
Frontend business logic ichida money qiymatni **minor units** bilan boshqaradi.

Masalan:
- 12.34 USD display uchun
- 1234 backend-safe internal representation

### Nega
- floating point rounding xatolaridan qochiladi
- backend contract bilan mos ishlanadi
- summation va comparison xavfsizroq bo'ladi

### Qoidalar
- input parse paytida minor unitga o'tkaz
- display paytida human-readable format qil
- domain logicda float ishlatma
- `amountMinor` va `currencyCode`ni ajratib saqla

## 7.3 Money formatting

### Display helper kerak
Masalan:
- `formatMoney(amountMinor, currencyCode)`
- `parseMoneyToMinor(value, currencyCode)`

### UX qoidalari
- currency aniq ko'rinsin
- negative amount minus bilan ko'rsatiladi
- kerak bo'lsa rang va badge bilan support qilinadi
- large amountlarda scanability muhim

## 7.4 Multi-currency note

Agar household base currency boshqa, account currency boshqa bo'lsa:
- original amount
- account currency
- kerak bo'lsa converted info
aniq ajratilishi kerak.

Agent currency labelni chalkashtirmasligi kerak.

## 7.5 Date va time qoidasi

Backend model odatda quyidagilar bilan ishlaydi:
- `occurredAtUtc`
- `localDate`
- `timezone`

### Frontend vazifasi
- user inputni local kontekstda olish
- submitda timezone bilan birga yuborish
- analytics filterlarda local date semanticsni tushunish
- display formatni userga tushunarli qilish

### Qoidalar
- raw ISO stringni UI'ga tashlab qo'yma
- relative va absolute date balansini saqla
- "today", "this week", "this month" filter semantics clear bo'lsin

## 7.6 Household-scoped data qoidasi

Quyidagilar active householdsiz yashamaydi:
- accounts
- categories
- transactions
- debts
- budgets
- analytics

Shu sababli:
- query keyda household bo'ladi
- route paramda household bo'ladi
- page headerda context ko'rinadi
- create form household contextga tayangan bo'ladi

## 7.7 Error handling modeli

### Error turlari
1. validation error
2. domain rule error
3. auth/session error
4. permission error
5. network failure
6. unexpected server error

### UI darajasida qanday ko'rinadi
- field error: input tagida
- general form error: form head/footer ichida
- page error: error state card
- transient error: toast
- fatal error: route error boundary

## 7.8 Problem details parser

Agent universal parser yozadi.

### Parser maqsadi
- backend error shape'ni o'qish
- typed error objectga aylantirish
- UX-level message mappingni soddalashtirish

### Tavsiya etilgan maydonlar
- type
- title
- status
- detail
- instance
- timestamp

## 7.9 Idempotency nima

Sensitive write endpointga bir request ikki marta borib qolsa, backend duplicate effect bermasligi kerak.

### Qayerda kerak
- expense create
- income create
- transfer create
- debt create
- debt settlement

### Frontend vazifasi
- har submit uchun unique `Idempotency-Key`
- double-clickni disable qilish
- retry semanticsni ehtiyotkor boshqarish

## 7.10 Idempotent mutation UX

### Submit paytida
- button loading holatga o'tadi
- form disable qilinadi
- duplicate click bloklanadi
- request headerga key qo'shiladi

### Success bo'lsa
- modal yopilishi yoki form reset bo'lishi mumkin
- relevant list va summary invalidate qilinadi

### Error bo'lsa
- userga natija noaniq qolsa, aniq xabar beriladi
- "saved bo'ldi yoki yo'q" degan noaniqlik minimal bo'lishi kerak

## 7.11 Mapper qoidalari

### Raw DTO
Backend contract shape.

### Domain model
Frontend logic uchun toza shape.

### View model
UIga qulay bo'lgan computed representation.

### Nega 3 qavat foydali
- API o'zgarsa UI kamroq buziladi
- domain semantics aniq bo'ladi
- formatting logic ko'chib yurmaydi

## 7.12 Example transform philosophy

Masalan transaction list item:
- raw DTO: backend fieldlar
- domain: kind, amountMinor, accountName, occurredAt
- view model: displayAmount, displayDate, tone, iconKind

Agent UI ichida raw stringdan decisions qilmaydi. Mapping qatlamini ishlatadi.

## 7.13 Data correctness checklist

Agent har finance featureda tekshiradi:
- amount minor unitsdami
- currency separate saqlanganmi
- household context bor-mi
- date timezone bilan tushunilganmi
- error format parse qilindimi
- mutation idempotentmi
- duplicate submit bloklandimi

## 7.14 Eng xavfli antipatternlar

- `number` float bilan summation
- string date'ni to'g'ridan-to'g'ri render qilish
- server xatosini `Something went wrong` bilan yashirish
- idempotency kerak bo'lgan create flowda oddiy fetch yuborish
- raw API data bilan UI decision qilish
