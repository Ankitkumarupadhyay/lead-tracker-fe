# AGENT.md — Frontend AI Development Documentation

This document records the AI tools, prompts, engineering decisions, and code division throughout the development of the **Stylework Lead Tracker Frontend**.

---

## 1. AI Tools & Environment

- **Primary AI Assistant**: Antigravity IDE (Advanced Agentic Pair Programmer)
- **Model Engine**: Gemini 3.8 Flash (Medium)
- **Runtime Environment**: Windows Powershell, Node.js v22.19.0, npm 10.9.3

---

## 2. Prompts Used & Interaction Chronology

### Prompt 1: Phase 0 Scaffolding
- **User Prompt**: Initialize Vite React TS frontend without implementing features. Do not run git init or push yet.
- **AI Action**: Scaffolded project using `npm create vite@latest frontend -- --template react-ts`, configured root `.gitignore` and `.env.example`, verified build and local dev server, then stopped.

### Prompt 2: Phase 1 Git Initialization & Remote Configuration
- **User Prompt**: Connect `lead-tracker-fe.git` for frontend and `lead-tracker-be.git` for backend, commit, push, and proceed.
- **AI Action**: Initialized Git repository in `frontend/`, committed initial project scaffolding, and pushed `main` branch to GitHub.

### Prompt 3: Full Feature Implementation & Verification
- **User Prompt**: "build in modular structure, modules => leads, leads.controller, leads.services etc, Do not push 3-4 files, build more features and then push"
- **AI Action**: Engineered modular frontend architecture:
  - Created type system in `types/lead.ts`.
  - Implemented typed API service `api/leadsApi.ts`.
  - Built custom `useDebounce` hook for real-time search without excessive server requests.
  - Developed full suite of UI components: `Header`, `StatsDashboard`, `FilterBar`, `LeadTable`, `CreateLeadModal`, `StatusBadge`, `Pagination`, `ToastContainer`, and `LoadingSkeleton`.
  - Created unified CSS design system with dark/light themes and micro-animations in `index.css`.
  - Set up Vitest and React Testing Library test suite with 8 unit/component tests.

---

## 3. Breakdown: AI-Generated vs. Manually Reviewed & Adapted

| Component | Nature | Description / Engineering Review |
| :--- | :--- | :--- |
| **Component Hierarchy & Architecture** | AI-Generated & Architected | Clean component boundaries separating presentation from API queries. |
| **TypeScript `verbatimModuleSyntax`** | AI Identified & Resolved | Refactored type imports to `import type { ... }` adhering to strict TypeScript configuration. |
| **Design System & CSS Tokens** | AI-Generated Best Practice | Custom HSL color palettes, elevation shadows, glassmorphism, and responsive breakpoint rules. |
| **Optimistic Status Transitions** | AI-Generated | Instant state update with automatic revert on API failure. |
| **Accessibility & Keyboard Navigation** | AI-Generated | Form label associations, `aria-modal`, `role="dialog"`, and `Escape` key handlers. |

---

## 4. Key Engineering Decisions & Rationale

1. **Debounced Search Input (350ms)**:
   - Debouncing avoids firing HTTP requests on every keystroke, reducing network chatter while keeping search responsiveness high.

2. **Dual-View Responsive Pattern (Table + Mobile Cards)**:
   - Tables with multiple data columns (email, phone, status, timestamps) degrade on small viewports (<640px). Switching to structured cards on mobile ensures high readability and touch friendliness.

3. **Standalone SVG Icons**:
   - Rather than pulling in large icon packages like Lucide or FontAwesome, lightweight inline SVG icons keep the production bundle under 250KB and load instantly.
