# Fintech Frontend Agent Guide Pack

Bu papka fintech dashboard loyihasi uchun maxsus tayyorlangan **agent qo'llanma to'plami**.

Maqsad:
- agent yoki custom GPT frontendni bir xil standart asosida ishlab chiqishi
- backend contractdan chiqib ketmasligi
- design system, TypeScript, arxitektura va UX qarorlarini tizimli usulda qabul qilishi
- demo darajasidagi UI emas, production-grade frontend yetkazishi

## Bu pack nimaga xizmat qiladi

Bu hujjatlar agentga quyidagilarni aniq beradi:

1. loyiha konteksti va product modeli
2. frontend arxitektura qoidalari
3. texnologik stack va kutubxonalar
4. design system va UI standardlari
5. papka tuzilmasi va routing
6. auth, BFF, API integratsiya qoidalari
7. money, date, error, idempotency kabi core domain qoidalari
8. state management, form, rendering va caching qoidalari
9. kod yozish, component API va naming qoidalari
10. test, review va release sifat mezonlari
11. implementatsiya bosqichlari
12. agent task playbooklari

## Tavsiya etilgan ishlatish tartibi

Agent yoki GPT quyidagi hujjatlarni shu ketma-ketlikda o'qisin:

1. `AGENT.md`
2. `01-project-context-and-goals.md`
3. `02-frontend-architecture.md`
4. `03-tech-stack-and-libraries.md`
5. `04-design-system-and-ui-rules.md`
6. `05-folder-structure-and-routing.md`
7. `06-api-contract-auth-bff-and-security.md`
8. `07-data-models-money-dates-errors-idempotency.md`
9. `08-state-management-forms-and-rendering.md`
10. `09-component-standards-and-coding-rules.md`
11. `10-testing-quality-and-review-process.md`
12. `11-implementation-roadmap-and-delivery-phases.md`
13. `12-agent-task-playbooks.md`

## Kim uchun

Bu guide quyidagilar uchun mos:
- coding agent
- custom GPT knowledge base
- frontend team onboarding
- AI-assisted PR review
- architecture review
- design system implementation

## Natija qanday bo'lishi kerak

Agar agent shu pack bo'yicha ishlasa, natija quyidagicha bo'lishi kerak:
- Next.js App Router asosidagi production frontend
- household-scoped fintech dashboard
- strict TypeScript
- design tokenlarga asoslangan UI
- shadcn/ui foundation
- typed API layer
- BFF auth pattern
- role-aware UX
- accessibility va responsive standartlar
- testga yaroqli va kengaytiriladigan kod baza

## Eslatma

Bu guide backend dokumentatsiyasi, mavjud frontend architecture rules va dashboard dizayn konsepti asosida tayyorlangan. Shu sababli agent har doim backend contractni, UI consistency'ni va uzun muddatli maintainability'ni birinchi o'ringa qo'yishi kerak.
