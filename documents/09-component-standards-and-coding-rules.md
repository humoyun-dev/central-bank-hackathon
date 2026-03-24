# 09. Component Standards and Coding Rules

## 9.1 Maqsad

Bu hujjat agentga production-grade kod qanday yozilishini, component API'lar qanday bo'lishini va naming/code structure qanday bo'lishini tushuntiradi.

## 9.2 General coding principles

### Clarity over cleverness
Aqlli ko'rinadigan kod emas, aniq va barqaror kod afzal.

### Small focused units
Katta component o'rniga kichik, ma'noli, yaxshi nomlangan bo'laklar.

### Boundaries first
Type, schema, mapper va API boundary oldindan o'ylansin.

### Maintainability
Kod bugun ishlashi yetarli emas. Ertaga o'zgartirish oson bo'lishi kerak.

## 9.3 TypeScript qoidalari

### Majburiy settings
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

### Qoidalar
- boundary'larda explicit type
- ichki implementationda inference qabul qilinadi
- `any` ishlatilmaydi
- external data validate qilinadi
- discriminated union variant-heavy logic uchun afzal

### Noto'g'ri
- `const data: any = await res.json()`

### To'g'ri
- schema parse + typed mapper

## 9.4 Component API design

### Yaxshi component API
- aniq
- minimal
- predictable
- composable

### Yomon component API
- 15 ta boolean prop
- noaniq prop nomlari
- internal state majburan tashqaridan boshqariladi
- reuse qiyin

### Misol
Yaxshi:
- `variant="primary"`
- `size="sm"`
- `loading={isPending}`

Yomon:
- `isBlue`
- `isRounded`
- `big`
- `special`

## 9.5 One component, one responsibility

### Component bitta vazifa bajarishi kerak
Masalan:
- `TransactionRow` render qiladi
- `TransactionsTable` table layout boshqaradi
- `TransactionsScreen` sectionlarni compose qiladi

### Noto'g'ri
Bitta component:
- fetch qiladi
- filter qiladi
- submit qiladi
- table render qiladi
- modal ochadi
- analytics hisoblaydi

## 9.6 Hooks qoidalari

### Qachon hook yoziladi
- reusable stateful logic bo'lsa
- side effect pattern takrorlansa

### Qachon yozilmaydi
- faqat bitta komponent ichidagi trivial local logic bo'lsa

### Hook naming
- `useXxx`
- maqsadi aniq bo'lsin
- noaniq `useData`, `useStuff` dan qoch

## 9.7 Styling qoidalari

### Tailwind systematik ishlatiladi
- spacing tokenlar
- typography hierarchy
- CVA variantlar
- class merge helper

### Noto'g'ri
- har componentda random class combination
- bir xil button 7 xil class bilan
- arbitrary values ko'payib ketishi

### To'g'ri
- button variant util
- shared card pattern
- shared panel padding rule

## 9.8 shadcn/ui usage qoidalari

### Foundation sifatida ko'r
- accessible base
- extend qil
- design systemga moslashtir

### Qilmaslik kerak
- har safar source'ni qo'lda buzish
- component semanticsini yo'qotish
- forklar sonini ko'paytirish

## 9.9 Naming conventions

### Component
- `BalanceHeroCard`
- `AccountCard`
- `SettleDebtDialog`

### Helper
- `formatMoney`
- `createIdempotencyKey`
- `mapAccountDtoToAccount`

### Avoid
- `Helper`
- `Util`
- `DataThing`
- `handleStuff`

## 9.10 Functions and utils

### Rules
- pure bo'lsa yaxshi
- kichik bo'lsin
- purpose-driven nomlansin
- unrelated util'larni bitta faylga yig'ma

## 9.11 Async code qoidalari

### Majburiy
- loading state
- error state
- race condition haqida o'ylash
- response typing
- cancellation yoki stale result haqida ehtiyot bo'lish

### Example risk
User filterlarni tez almashtirganda eski natija yangi natijani bosib ketmasligi kerak.

## 9.12 Accessibility coding qoidalari

### Har interaktiv element
- keyboard accessible
- visible focus
- semantic role to'g'ri

### Form
- label
- describedby
- error association

### Icon-only buttons
- `aria-label` majburiy

## 9.13 Performance coding qoidalari

### Premature optimization yo'q
Lekin obvious xatolar ham bo'lmasin:
- butun dashboardni client qilish
- keraksiz re-render
- giant dependency
- huge prop drilling
- render ichida qimmat computation

### Memoization
Profiling yoki repeated hot-path bo'lmasa default emas.

## 9.14 Review checklist for code

Agent yozgan kodni yuborishdan oldin:
- type safe mi
- readable mi
- API boundary tozami
- component responsibility aniqmi
- a11y bor-mi
- state to'g'ri joydami
- styling systematikmi
- domain semantics saqlanganmi

## 9.15 Yakuniy qoida

Kodning sifati uning qisqaligi bilan emas, tushunarliligi, xavfsizligi va oson evolyutsiya qilishi bilan o'lchanadi.
