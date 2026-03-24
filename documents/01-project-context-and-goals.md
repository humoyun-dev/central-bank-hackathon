# 01. Project Context and Goals

## 1.1 Maqsad

Bu hujjat agentga loyiha nimani yechishini, product modeli qanday ekanini va frontend nimaga xizmat qilishini tushuntiradi.

Frontendning vazifasi:
- household darajasidagi finance ma'lumotlarini ko'rsatish
- foydalanuvchiga transaction yaratish imkonini berish
- real productga xos UX berish
- visual consistency va trust hissini yaratish
- backenddagi moliyaviy xavfsizlik qoidalarini UI darajasida ham to'g'ri aks ettirish

Bu oddiy admin panel emas. Bu moliyaviy operatsiyalar bilan ishlaydigan dashboard.

## 1.2 Product model

Loyiha household-centered modelga qurilgan.

### Asosiy birliklar
- **User**: tizimga kiruvchi shaxs
- **Household**: finance objectlar bog'lanadigan tenant scope
- **Membership**: userning household ichidagi roli
- **Account**: bank account, card yoki cash wallet
- **Category**: income/expense klassifikatsiyasi
- **Expense**: householddan chiqim
- **Income**: householdga kirim
- **Transfer**: bir accountdan boshqasiga ko'chirish
- **Debt**: qarz yoki receivable
- **Budget**: period bo'yicha limitlar
- **Analytics**: summary, category, calendar style ko'rinishlar

### Nega bu model frontend uchun muhim
Agar agent household scope'ni e'tiborsiz qoldirsa:
- route noto'g'ri bo'ladi
- API querylar chalkashadi
- permission UI noto'g'ri ishlaydi
- active context yo'qoladi

Shuning uchun har finance page active household contextga bog'langan bo'lishi shart.

## 1.3 Frontendning business vazifasi

Frontend quyidagilarni bajarishi kerak:

### 1. Onboarding
- register
- login
- household tanlash yoki yaratish
- invite accept qilish

### 2. Daily usage
- available balance ko'rish
- account holatlarini ko'rish
- tez transaction yaratish
- quick transfer qilish
- transaction historyni scan qilish

### 3. Planning
- budget progress ko'rish
- spending trendlarni tahlil qilish
- category bo'yicha kuzatish

### 4. Collaboration
- household members
- role-based visibility
- shared finance experience

## 1.4 UI konsept

Berilgan dizayn card-based modern finance dashboardni ko'rsatadi.

### UI patternlari
- left sidebar navigation
- top utility bar
- hero summary card
- card carousel
- charts and list panels
- quick actions
- light, spacious, rounded visual language

### Agent uchun xulosa
Bu dizayn agentga shuni anglatadi:
- interface token-based bo'lishi kerak
- cards va sections reusable bo'lishi kerak
- desktop dashboard shell markaziy pattern bo'ladi
- mobile uchun stack variant oldindan o'ylanishi kerak

## 1.5 Core frontend objectives

### Objective 1: Trust
Finance productda UI ishonch uyg'otishi kerak.
Buning uchun:
- clear numbers
- clean hierarchy
- predictable actions
- no accidental destructive flows
- stable loading and error behavior

### Objective 2: Correctness
Noto'g'ri amount, noto'g'ri currency, noto'g'ri household context yoki double-submit moliyaviy xatoga olib keladi.
Shuning uchun:
- typed request
- idempotent mutation
- strict validation
- form disable on submit
- clear confirmation flows

### Objective 3: Scalability
Hozir MVP bo'lsa ham keyin:
- more analytics
- notifications
- advanced permissions
- recurring flows
- activity log
- marketplace-like extensions
qo'shilishi mumkin.

Shuning uchun hozirdan feature-based arxitektura kerak.

## 1.6 Agent qaysi narsani doim eslab qolishi kerak

### Household scope
URL, API, UI state va permissions hammasi household kontekst bilan ishlaydi.

### Money safety
Money qiymatlar displayda chiroyli bo'lishi mumkin, lekin logic doim `minor unit` bilan yuradi.

### Role-aware UX
Backend permissionni tekshiradi, lekin frontend ham userga noto'g'ri affordance ko'rsatmasligi kerak.

### Server-first architecture
Fintech data sensitive va requestga bog'liq. Shuning uchun server-side composition juda muhim.

## 1.7 Success criteria

Yaxshi frontend quyidagicha ko'rinadi:
- user 3 soniyada active householdni tushunadi
- asosiy balance va accountlarni darhol ko'radi
- expense yoki transfer yaratish flowi tez va aniq ishlaydi
- historyni scan qilish oson
- chartlar ko'rinish uchun emas, qaror uchun xizmat qiladi
- UI professional, consistent va bugga chidamli ko'rinadi

## 1.8 Failure patterns

Agent quyidagi xatolardan qochishi kerak:
- contextsiz generic dashboard
- visual jihatdan chiroyli, lekin inconsistent UI
- float asosidagi money logic
- tokenlarni client storagega yozish
- giant page components
- read va write logicni chalkashtirish
- design system o'rniga bir martalik class yig'indisi
