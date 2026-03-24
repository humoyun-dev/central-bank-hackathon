# 04. Design System and UI Rules

## 4.1 Maqsad

Bu hujjat agentga frontendning visual tilini, component sistemani va UX qoidalarini belgilab beradi.

Bu loyiha uchun chiroyli UI yetarli emas. UI:
- consistent
- extensible
- accessible
- responsive
- product-grade
bo'lishi kerak.

## 4.2 Visual prinsiplar

### Clarity over decoration
Maqsad foydalanuvchini hayratga solish emas, ma'lumotni tez va ishonchli ko'rsatish.

### Consistency over novelty
Har section alohida dizayn bo'lib ketmasligi kerak.

### Hierarchy over density
Hamma narsani bitta ekranga tiqish emas, foydalanuvchiga scan qilishni osonlashtirish kerak.

### Calm interface
Finance UI charchatmasligi kerak. Negative attention emas, controlled emphasis kerak.

## 4.3 Tokenlar

### Spacing scale
4px base system:
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

#### Qanday ishlatiladi
- component ichida kichik gaplar
- sectionlar orasida katta gaplar
- repeated patternlarda bir xil gap

#### Noto'g'ri
- `gap-[13px]`
- `px-[19px]`

#### To'g'ri
- `gap-2`
- `p-4`
- `px-6`
- `space-y-8`

### Radius scale
Tavsiya:
- `sm = 12px`
- `md = 16px`
- `lg = 24px`
- `pill = 9999px`

Bu dashboarddagi yumaloq card va segmented control tiliga mos.

### Shadow
Shadow kam ishlatiladi.
- default surface
- elevated surface

Doim bir xil soyalar ishlatiladi. Har cardga alohida shadow ixtiro qilinmaydi.

## 4.4 Typography

### Tavsiya etilgan hierarchy
- Page title: `text-3xl font-semibold`
- Section title: `text-2xl font-semibold`
- Card title: `text-sm font-medium`
- Body text: `text-sm`
- Helper/meta: `text-xs text-muted-foreground`

### Qoidalar
- bir sahifada juda ko'p font size ishlatma
- muted textni critical content uchun ishlatma
- number-heavy cardlarda typography trust hissi bersin

## 4.5 Color system

### Semantic ranglar
- background
- surface
- surface-muted
- foreground
- muted-foreground
- border
- primary
- primary-foreground
- success
- warning
- danger

### Nega semantic system kerak
Keyin theme, dark mode yoki brand refinement kelganda UI buzilmaydi.

### Finance UI uchun eslatma
- primary color action va highlight uchun
- negative amount har doim faqat rang bilan emas, minus va context bilan ko'rsatiladi
- success/warning/danger accessibility kontrasti bilan bo'lishi kerak

## 4.6 Layout tizimi

### Desktop
- sidebar + content shell
- 12 column mental grid
- hero va card sectionlar
- 24px yoki 32px section spacing

### Tablet
- sidebar collapse
- grid zichligi kamayadi
- 2-column yoki 1-column adaptation

### Mobile
- drawer nav
- cards vertical stack
- actionlar reachable bo'lishi kerak
- chartlar qayta layout qilinadi

## 4.7 Component building order

Agent UI yaratganda shu tartibda ishlaydi:

1. token
2. primitive
3. variant
4. composite
5. section
6. page pattern

### Misol
Expense yaratish flow:
- token: spacing, radius, colors
- primitive: input, select, button
- variant: primary button, ghost button, field status
- composite: money input row, account select row
- section: expense form card
- page pattern: dashboard quick action sheet

## 4.8 Button qoidalari

### Har button uchun minimal state
- default
- hover
- focus-visible
- active
- disabled
- loading

### Variantlar
- primary
- secondary
- ghost
- destructive
- icon-only

### Qoidalar
- bir sectionda bitta dominant primary action bo'lsin
- secondary action primary bilan raqobat qilmasin
- icon-only button albatta accessible labelga ega bo'lsin

## 4.9 Form qoidalari

### Har input uchun
- label
- help yoki placeholder kerak bo'lsa
- error state
- disabled state
- required marking consistent bo'lsin

### Finance form uchun qo'shimcha qoidalar
- amount input aniq formatlangan bo'lsin
- currency ko'rinib tursin
- account tanlash xatosi tushunarli bo'lsin
- date/timezone userga chalkash bo'lmasin
- submit double click'dan himoyalangan bo'lsin

## 4.10 Card va panel qoidalari

Dashboard bu productda asosiy section patterni.

### Har panel strukturasi
- title yoki label
- optional action
- content
- optional metadata
- empty/error/loading variant

### Nega muhim
Cardlar soni ko'payganda ular bitta tizimga mansub ko'rinishi kerak.

## 4.11 Table va list qoidalari

Transactions ko'p bo'lgani uchun scanability juda muhim.

### Qoidalar
- chapdan o'ngga predictable alignment
- amountlar o'qilishi oson
- date secondary info sifatida
- actionlarni progressive disclosure bilan berish
- visual clutter yaratmaslik

## 4.12 Dashboard-specific patternlar

### Sidebar
- current page aniq active
- icon + label
- collapsed holatda ham usable

### Topbar
- search
- notifications placeholder
- user/profile
- household context visible bo'lsa yaxshi

### Balance hero
- katta raqam
- 3-4 ta quick action
- balance context

### Accounts carousel
- bank/card/cash variant
- quick scan
- last4, issuer, type metadata

### Statistics card
- period switcher
- readable chart
- supporting totals

## 4.13 Accessibility qoidalari

### Majburiy
- focus-visible
- keyboard navigation
- semantic headings
- label association
- sufficient contrast
- screen reader name

### Finance product uchun qo'shimcha
- amount text screen readerga to'g'ri o'qilishi kerak
- color-only meaning bo'lmasin
- toast faqat vizual bo'lib qolmasin, kritik holat inline ham ko'rinsin

## 4.14 UI review ritual

Agent ekran tugagach quyidagilarni tekshiradi:
- asosiy action darhol ko'rinadimi
- foydalanuvchi 5 soniyada struktura tushunadimi
- state'lar to'liqmi
- spacing consistentmi
- touch targetlar yetarlimi
- visual noise bormi
- component systematikmi yoki ad hocmi

## 4.15 Yakuniy qoida

Polished interface = chiroyli + consistent + predictable + accessible + scalable.
Shu beshtadan bittasi yo'q bo'lsa, UI hali tugallangan emas.
