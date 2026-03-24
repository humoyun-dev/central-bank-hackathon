# 06. API Contract, Auth, BFF and Security

## 6.1 Maqsad

Bu hujjat agentga backend bilan qanday ishlash, auth'ni qayerda saqlash va secure integrationni qanday qurishni tushuntiradi.

Fintech frontend uchun bu hujjat eng kritik hujjatlardan biri.

## 6.2 Backend bilan ishlash falsafasi

Frontend backendni faqat "some REST API" deb ko'rmasligi kerak.
Bu loyihada backend:
- household-scoped
- JWT based
- refresh token rotation'li
- idempotent write'li
- RFC7807 error model'li
- minor unit money model'li

Demak frontend contractga juda ehtiyotkor bo'lishi shart.

## 6.3 Auth flow

### Login
Client login formdan email va password yuboradi.

### Server tarafdagi jarayon
- Next.js BFF login requestni backendga yuboradi
- backend `accessToken` va `refreshToken` qaytaradi
- frontend server ularni secure cookie'ga yozadi

### Keyingi requestlar
- cookie serverda o'qiladi
- access token backend requestga qo'shiladi
- client tokenni bilmaydi

### Refresh
401 yoki expired holatda refresh serverda ishlaydi.

### Logout
- backend logout endpoint chaqiriladi
- cookie tozalanadi
- protected sahifalardan chiqariladi

## 6.4 Nega localStorage emas

### Xavf
- XSS bo'lsa token o'g'irlanadi
- session logikasi clientga sochiladi
- secure retry flow qiyinlashadi

### To'g'ri yo'l
- httpOnly secure cookies
- BFF orqali token injection
- server-side refresh

Bu ayniqsa moliyaviy operatsiyalar uchun juda muhim.

## 6.5 BFF route handler pattern

Frontendda same-origin API route'lar bo'ladi.

### Masalan
- `/api/auth/login`
- `/api/auth/logout`
- `/api/transactions/expenses`
- `/api/debts/settlement`

### Bu route'larning vazifasi
- backendga proxy bo'lish
- session/tokenni boshqarish
- idempotency keyni qo'shish yoki tekshirish
- errorlarni normalize qilish
- clientga stable shape qaytarish

## 6.6 API client layer

### Server client
`services/api/server/client.ts`
- cookie o'qiydi
- bearer header qo'shadi
- refresh qiladi
- secure request yuboradi
- zod bilan parse qiladi

### Browser client
`services/api/browser/client.ts`
- same-origin BFF endpointga uradi
- generic fetch wrapper beradi
- problem detailsni parse qiladi
- form mutationlarida ishlatiladi

## 6.7 DTO va UI model ajratilishi

Backenddan kelgan response ko'pincha raw DTO bo'ladi.

### Nega mapper kerak
- snake_case => camelCase
- backendga xos namingni UI'dan yashirish
- schema validation
- domain semanticni aniq qilish

### Pattern
1. dto schema
2. parser
3. mapper
4. UI type

### Misol
`current_balance_minor` frontend ichida `currentBalanceMinor` bo'lib ishlatiladi.

## 6.8 Error format

Backend `application/problem+json` tipida xato qaytaradi.

### Frontend vazifasi
- shu formatni universal parse qilish
- field error va general errorni ajratish
- userga tushunarli xabar berish
- 401/403/404/409 holatlarni alohida handling qilish

### UX bo'yicha
- serverdan kelgan technical message to'liq ko'rsatish har doim to'g'ri emas
- kerak bo'lsa human-friendly mapping qilinadi

## 6.9 Protected routes

Protected sahifalarda agent quyidagilarni ta'minlaydi:
- session borligini tekshiradi
- household accessni tekshiradi
- membership bo'lmasa redirect yoki forbidden state ko'rsatadi
- sensitive screen'lar serverda himoyalanadi

## 6.10 Permission-aware UI

Rolelar:
- OWNER
- ADMIN
- MEMBER
- VIEWER

### Frontend vazifasi
- taqiqlangan action buttonni ko'rsatib qo'ymaslik
- read-only userlar uchun disabled yoki hidden affordance berish
- destructive admin actionlar uchun confirm flow qilish

### Eslatma
Frontenddagi permission check UX uchun. Final source of truth baribir backend.

## 6.11 Auth-aware layout

Dashboard layout quyidagilarni biladi:
- active user
- active household
- membership role
- visible nav items
- route guard state

Bu ma'lumotlar layout yoki server context darajasida assemble qilinadi.

## 6.12 API versioning va kelajak

Hozir OpenAPI generated client bo'lmasa ham, frontend shunday quriladi:
- raw fetch stringlar kamaytiriladi
- endpointlar markazlashadi
- schema boundary mavjud bo'ladi

Keyin OpenAPI kelsa migration oson bo'ladi.

## 6.13 Security checklist

Agent secure implementation tugatganda quyidagini tekshiradi:
- token browser JSga chiqmadimi
- refresh serverdami
- bearer header secure inject bo'lyaptimi
- protected route SSR guard qildimi
- 401 handling bormi
- logout sessionni tozalaydimi
- role-based affordance to'g'rimi
- clientda sensitive env ishlatilmaganmi

## 6.14 Failure patternlar

Agent quyidagilarni qilmaydi:
- backend URLni har componentda yozib yurmaydi
- tokenlarni client hook ichida saqlamaydi
- API response'ni parse qilmasdan ishlatmaydi
- permissionni faqat UI hide bilan cheklamaydi
- `catch {}` bilan xatoni yutib yubormaydi
