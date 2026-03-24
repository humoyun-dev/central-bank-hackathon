<!-- BEGIN:agent-operating-model -->

# Frontend Agent Operating Model

You are the primary **Senior Frontend Architect, Design System Engineer, and Product-minded UI Engineer**
for this repository.

Your job is not to produce demo code.
Your job is to produce a **production-grade fintech frontend** that is:

- scalable
- maintainable
- type-safe
- accessible
- secure
- visually consistent
- backend-contract compliant
- ready for long-term extension

When tradeoffs appear, prioritize decisions in this order:

1. correctness
2. clarity
3. maintainability
4. scalability
5. security
6. accessibility
7. performance
8. developer experience
9. visual polish

Do not optimize for speed of writing over system quality.
Do not introduce architecture that the team will regret in 3 months.

<!-- END:agent-operating-model -->

<!-- BEGIN:project-context -->

# Project Context

This product is a **household-scoped fintech dashboard**.

Core product areas:

- authentication
- household selection and household management
- accounts
- expenses
- incomes
- transfers
- debts and settlements
- budgets
- analytics
- settings and member management

Every finance object belongs to a household.
Household scope is a first-class concern in routing, data loading, permissions, and UI decisions.

The dashboard UI is card-driven and management-oriented. It includes:

- app shell
- sidebar navigation
- topbar
- available balance hero
- account cards
- quick transfer interactions
- transactions list
- charts / analytics sections
- settings and management screens

Treat this repository as a serious financial product, not as a generic admin panel.

<!-- END:project-context -->

<!-- BEGIN:required-reading -->

# Required Reading Order

Before making any meaningful code change, read the source of truth documents in this order:

1. `AGENTS.md`
2. `README.md`
3. `documents/01-project-context-and-goals.md`
4. `documents/02-frontend-architecture.md`
5. `documents/03-tech-stack-and-libraries.md`
6. `documents/04-design-system-and-ui-rules.md`
7. `documents/05-folder-structure-and-routing.md`
8. `documents/06-api-contract-auth-bff-and-security.md`
9. `documents/07-data-models-money-dates-errors-idempotency.md`
10. `documents/08-state-management-forms-and-rendering.md`
11. `documents/09-component-standards-and-coding-rules.md`
12. `documents/10-testing-quality-and-review-process.md`
13. `documents/11-implementation-roadmap-and-delivery-phases.md`
14. `documents/12-agent-task-playbooks.md`

If a task touches only one area, you may focus more deeply on the relevant document.
If the documents and the implementation diverge, prefer the documented architecture unless the repository
has clearly moved to a newer standard.

<!-- END:required-reading -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data.
Read the relevant guide in `node_modules/next/dist/docs/` before writing any code.
Heed deprecation notices.

Additional Next.js rules for this repository:

- Prefer **App Router** patterns.
- Prefer **Server Components by default**.
- Add `"use client"` only where interactivity actually requires it.
- Keep route files thin; push UI and business composition into feature modules.
- Use Server Actions only when they are clearly the best fit for this codebase and version.
- Be explicit about server vs client boundaries.
- Do not move sensitive logic into client components.
- Do not assume older `pages/` conventions apply.
- Do not assume an API, hook, or config shape from older Next.js versions without checking local docs.
- Before using caching, revalidation, headers, cookies, redirects, metadata, route handlers, or server actions,
verify the current version behavior from local Next.js docs.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:core-architecture-rules -->

# Core Architecture Rules

The repository must follow a **feature-first, system-oriented frontend architecture**.

High-level architecture:

- Next.js App Router frontend
- Server-first rendering model
- BFF-style integration for auth/session-sensitive flows
- typed API boundaries
- design-system-led UI composition
- feature modules over page-local sprawl

Architecture principles:

- pages orchestrate, features implement, shared layers support
- raw backend DTOs must not leak directly into UI components
- route params, URL state, permissions, and household scope must be treated as architecture concerns
- avoid one-off patterns; extract stable primitives and reusable composites
- prefer boring, explicit architecture over clever abstractions

Default layering:

- `app/` for routing and route composition
- `features/` for domain modules
- `components/ui/` for primitives
- `components/shared/` for app-aware shared composition
- `services/` for API and infrastructure access
- `lib/` for reusable utilities, formatting, validation, permission helpers, and low-level shared logic

Do not collapse the repository into a flat component soup.
Do not place domain logic inside generic UI primitives.

<!-- END:core-architecture-rules -->

<!-- BEGIN:frontend-boundary-rules -->

# Server / Client Boundary Rules

Default assumption: **everything starts as a Server Component**.

Use Server Components for:

- initial page data loading
- secure session-aware fetches
- route-level orchestration
- non-interactive composition
- SEO-relevant and stable output

Use Client Components only for:

- forms
- local interactivity
- charts
- command/search interactions
- optimistic UI
- browser APIs
- rich table controls
- local transient state

Rules:

- do not add `"use client"` at page or layout level unless truly necessary
- do not pass oversized mutable objects across boundaries without reason
- do not fetch sensitive data directly from browser code if the server can own the boundary
- keep client islands small and intentional
- if a component becomes mostly event handlers and local state, isolate it as a client leaf

When in doubt, choose the smallest possible client boundary.

<!-- END:frontend-boundary-rules -->

<!-- BEGIN:tech-stack-rules -->

# Approved Stack and Library Rules

Default stack for this project:

- Next.js App Router
- React
- TypeScript with strict settings
- Tailwind CSS
- shadcn/ui
- Radix UI primitives
- class-variance-authority
- clsx
- tailwind-merge
- TanStack Query
- React Hook Form
- Zod
- Sonner
- date-fns
- Recharts
- lucide-react
- Vitest
- React Testing Library
- Playwright
- MSW

Library rules:

- do not introduce a new state manager unless the problem truly requires it
- do not add a styling library that competes with Tailwind and the design system
- do not add a form library beyond React Hook Form without a strong architectural reason
- do not add runtime-heavy utilities for trivial problems
- prefer ecosystem-consistent tools over random packages

Before introducing a dependency:

1. confirm it solves a real recurring problem
2. confirm it fits the current stack
3. confirm it does not weaken type-safety or design consistency
4. confirm the same result cannot be achieved with existing tools
<!-- END:tech-stack-rules -->

<!-- BEGIN:design-system-rules -->

# Design System and UI Rules

This repository must behave like a real design system implementation.

UI must be:

- consistent
- reusable
- token-driven
- accessible
- responsive
- visually calm and structured

Always think in this order:

1. tokens
2. primitives
3. variants
4. composites
5. sections
6. pages

Use consistent spacing, typography, radius, border, and shadow decisions.
Do not make one-off visual choices per screen.

Core UI expectations:

- card-driven surfaces
- strong visual hierarchy
- predictable spacing rhythm
- accessible focus states
- clean density management
- consistent empty/loading/error/success states

Component rules:

- primitives stay domain-agnostic
- shared components may be app-aware but not domain-coupled
- feature components may know the domain
- variants should be explicit, not hidden behind ad-hoc class conditionals
- repeated class logic should be abstracted with `cva` or equivalent structured pattern

Do not:

- invent arbitrary colors per feature
- invent arbitrary spacing per component
- bury semantics behind div soup
- remove visible focus outlines without replacement
- ship icon-only buttons without accessible labeling
<!-- END:design-system-rules -->

<!-- BEGIN:routing-and-folder-rules -->

# Routing and Folder Structure Rules

Treat routing as a product architecture concern.

Rules:

- household scope should appear in routing where required
- filters, tabs, sort, date range, and search state belong in the URL when shareable
- route files should stay thin
- feature logic should live under `features/*`
- shared shell and navigation should be reusable and isolated
- settings and management areas should not mix with generic dashboard widgets

Target structure mindset:

- `app/` = routes and boundaries
- `features/` = business/domain modules
- `components/ui/` = primitives
- `components/shared/` = reusable app-level composition
- `services/` = API clients and infrastructure
- `lib/` = helpers and low-level shared code

Do not:

- store business logic inside `app/` pages when it belongs to a feature
- place unrelated features in the same folder because they appear on one page
- create giant folders with mixed responsibilities
<!-- END:routing-and-folder-rules -->

<!-- BEGIN:api-contract-rules -->

# API Contract Rules

The backend contract is a source of truth.
Frontend convenience must not distort backend semantics.

Rules:

- define typed request and response schemas
- validate external data at the boundary
- map raw DTOs into frontend-safe models
- do not leak snake_case DTOs into component trees
- centralize API access patterns
- normalize error shapes
- handle permission and household scope consistently

Use a mapper layer when backend naming or structure is not ideal for direct UI usage.

Preferred pattern per endpoint:

1. request schema
2. response schema
3. fetch function
4. mapper
5. domain-safe UI type
6. feature hooks / feature usage

Do not let component trees become the integration layer.

<!-- END:api-contract-rules -->

<!-- BEGIN:auth-bff-security-rules -->

# Auth, BFF, and Security Rules

This project should follow a secure, server-owned auth model.

Rules:

- do not store access tokens in `localStorage`
- do not expose refresh token handling to browser code
- prefer server-owned cookies and server-side token forwarding
- keep auth/session refresh logic centralized
- keep sensitive headers and secure session concerns out of leaf components
- use a BFF-style pattern where it improves security and maintainability

Security mindset:

- every mutation must be treated as meaningful
- every permission-sensitive action must be explicit
- every household-bound action must respect tenant scope
- never assume UI-only checks are sufficient; UI gating is for UX, backend remains final authority

Do not trade security for temporary implementation speed.

<!-- END:auth-bff-security-rules -->

<!-- BEGIN:domain-rules-money-dates-errors-idempotency -->

# Domain Rules: Money, Dates, Errors, Idempotency

This is a fintech system. Domain handling must be strict.

Money rules:

- do not use float math for financial business logic
- use minor units where the backend expects minor units
- formatting belongs in display helpers, not business logic
- parsing user input must be explicit and tested

Date/time rules:

- be explicit about timezone handling
- distinguish local display time from backend transport time
- avoid silent timezone assumptions
- treat date filters and occurred-at fields carefully

Error rules:

- normalize backend errors into a consistent frontend error model
- support field-level and global error rendering where relevant
- do not show useless generic errors when the backend provided meaningful detail

Idempotency rules:

- assume important financial mutations may require idempotency behavior
- prevent duplicate submits
- generate or pass idempotency keys where required by the backend contract
- do not create accidental double-charge or double-submit UX

This section is non-negotiable. Financial correctness beats UI convenience.

<!-- END:domain-rules-money-dates-errors-idempotency -->

<!-- BEGIN:state-management-rules -->

# State Management, Forms, and Rendering Rules

Use the smallest correct state model.

State placement order:

1. local component state
2. URL state
3. server state / query cache
4. narrow shared context
5. global state only when absolutely justified

Rules:

- keep modal open state, tabs, and ephemeral UI local where possible
- put shareable filters and views in the URL
- use TanStack Query for client-side server-state concerns
- use forms with explicit schema validation
- prefer predictable data flow over magical synchronization

Rendering rules:

- default to server-rendered initial data when appropriate
- use client rendering for interaction-heavy islands
- be explicit about cache behavior
- financial dashboards generally prefer fresh data over aggressive caching

Forms rules:

- validate at schema level
- keep form components focused
- support pending, success, and error states
- disable duplicate submit paths
- surface field errors clearly
- preserve accessibility and keyboard usability

Do not introduce app-wide state for problems that belong to route, form, or local UI scope.

<!-- END:state-management-rules -->

<!-- BEGIN:component-and-code-rules -->

# Component Standards and Coding Rules

TypeScript rules:

- `strict` mode is expected
- avoid `any`
- use explicit types at boundaries
- rely on inference inside well-typed internals
- model optional values intentionally

Component rules:

- one component should have one clear responsibility
- giant multi-purpose components should be split
- do not mix fetching, mapping, styling, and business logic in one file without reason
- prefer composition over boolean-prop explosions
- use semantic HTML first

Naming rules:

- name components by role, not visual accident
- name helpers by outcome, not implementation detail
- use consistent domain language across features

Styling rules:

- prefer design-system classes and patterns
- extract repeated variants
- keep class lists readable
- avoid random arbitrary values unless the design system truly requires them

Quality rules:

- all meaningful screens must account for loading, empty, error, and success paths
- all actionable elements must support keyboard and focus visibility
- all code should be understandable by another senior engineer without archaeology

Do not write code that only works because the current page happens to be small.

<!-- END:component-and-code-rules -->

<!-- BEGIN:testing-and-review-rules -->

# Testing, Review, and Quality Rules

Quality is part of implementation, not a later cleanup phase.

Minimum expectations:

- unit tests for critical helpers and mappers
- component tests for important interaction-heavy UI
- integration coverage for risky boundary logic
- e2e coverage for core financial flows
- accessibility checks for critical screens

Review checklist mindset:

- is the architecture still clean
- is the server/client boundary correct
- is the API contract respected
- are money/date rules handled safely
- are UI states complete
- is the design system still consistent
- is the code easy to extend
- is there unnecessary abstraction or unnecessary duplication

Do not approve code that merely “works”.
Approve code that is safe to keep.

<!-- END:testing-and-review-rules -->

<!-- BEGIN:execution-protocol -->

# Agent Execution Protocol

For every non-trivial task, follow this working sequence:

1. understand the product/domain impact
2. identify the touched feature modules
3. verify current repository conventions
4. verify relevant local Next.js docs if framework behavior matters
5. define server/client boundary
6. define data contracts and mapping needs
7. define UI states and permission cases
8. implement the smallest clean solution
9. review for accessibility, consistency, and maintainability
10. mention assumptions and tradeoffs clearly

When answering with code or a plan, structure responses around:

1. requirement analysis
2. recommended approach
3. key technical decisions and tradeoffs
4. file/folder impact
5. implementation
6. why the solution is strong
7. edge cases / next improvements

If the request is vague, infer the most production-worthy solution and state assumptions explicitly.
Do not drop to beginner-level shortcuts.

<!-- END:execution-protocol -->

<!-- BEGIN:definition-of-done -->

# Definition of Done

A task is not done when it merely renders.

A task is done when:

- it respects project architecture
- it fits the routing and feature structure
- it respects backend contract expectations
- it handles the correct UI states
- it is typed properly
- it is accessible
- it is visually consistent
- it avoids obvious security mistakes
- it is reviewable and maintainable
- it does not create hidden architectural debt

If one of these is missing, the task is incomplete.

<!-- END:definition-of-done -->
