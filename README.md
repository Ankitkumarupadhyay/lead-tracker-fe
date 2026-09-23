# Stylework Lead Tracker — Frontend Application

[![React](https://img.shields.io/badge/React-19.x-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%2F6.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x%2F8.x-646CFF.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-FCC72B.svg?logo=vitest&logoColor=black)](https://vitest.dev/)

Modern, high-aesthetic single-page client for the **Stylework Lead Tracker**, built with React 19, TypeScript, and a bespoke CSS design system.

---

## 1. Features & User Experience

- **Performance Metrics Dashboard**: Live overview of Total Leads, New, Contacted, Qualified, and Conversion Rate with interactive filter triggers.
- **Real-Time Live Search**: Debounced search query across lead name, email, and phone without lagging the UI.
- **Pipeline Stage Filtering**: Interactive status pills with dynamic lead count indicators.
- **Create Lead Modal**:
  - Accessible modal dialog with backdrop blur.
  - Client-side validation for name, email format, and phone length.
  - Submission state indicators.
- **Quick Status Transitions**: Instant inline dropdown on each lead row/card with optimistic UI updates and auto-rollback on error.
- **Responsive Adaptive Layout**: High-density data table on desktop; touch-friendly cards on mobile devices.
- **Toast Notification System**: Non-blocking toast notifications for successes, errors, and network alerts.
- **Dark & Light Mode**: Complete theme toggle with system preference detection and `localStorage` persistence.

---

## 2. Component Architecture

```text
frontend/
├── src/
│   ├── api/
│   │   └── leadsApi.ts               # Typed fetch client with error normalization
│   ├── components/
│   │   ├── CreateLeadModal.tsx       # Lead creation dialog with form validations
│   │   ├── FilterBar.tsx             # Search input, status pills, sort selector
│   │   ├── Header.tsx                # Brand title, API health indicator, theme toggle
│   │   ├── LeadTable.tsx             # Responsive desktop table and mobile cards
│   │   ├── LoadingSkeleton.tsx       # Shimmer loading placeholders
│   │   ├── Pagination.tsx            # Page switcher, items per page control
│   │   ├── StatsDashboard.tsx        # Pipeline metric cards
│   │   ├── StatusBadge.tsx           # Color-coded pill with glowing status dot
│   │   └── Toast.tsx                 # Auto-dismissing notification container
│   ├── hooks/
│   │   └── useDebounce.ts            # Custom debounce hook for search input
│   ├── test/
│   │   ├── CreateLeadModal.test.tsx  # Form validation & submission tests
│   │   ├── FilterBar.test.tsx        # Search & status pill callback tests
│   │   ├── StatusBadge.test.tsx      # Badge rendering tests
│   │   └── setup.ts                  # Testing library setup
│   ├── types/
│   │   └── lead.ts                   # Domain types, payload interfaces, enums
│   ├── App.tsx                       # Master container & state coordinator
│   ├── index.css                     # Bespoke design system tokens & styles
│   └── main.tsx                      # Root mount with React.StrictMode
```

---

## 3. Setup & Installation

### Prerequisites
- Node.js `v20+` or `v22+`
- npm `v10+`

### Step-by-Step Instructions

1. **Clone repository:**
   ```bash
   git clone https://github.com/Ankitkumarupadhyay/lead-tracker-fe.git
   cd lead-tracker-fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp .env.example .env
   ```
   Set `VITE_API_BASE_URL` to point to the backend server:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for Production:**
   ```bash
   npm run build
   ```

6. **Preview Production Build:**
   ```bash
   npm run preview
   ```

---

## 4. Running Automated Tests

Run the frontend component test suite:

```bash
npm run test
```

---

## 5. Deployment Guide

### Recommended Platforms: **Vercel** / **Netlify** / **Cloudflare Pages**

1. **Deploy on Vercel:**
   - Connect `https://github.com/Ankitkumarupadhyay/lead-tracker-fe.git`.
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set Environment Variable:
     - `VITE_API_BASE_URL`: `<Your Deployed Backend URL>` (e.g., `https://lead-tracker-be.onrender.com`)

---

## 6. Trade-offs & Engineering Decisions

1. **Bespoke Vanilla CSS vs. TailwindCSS:**
   - *Decision*: Crafted an organized design system in `index.css` using modern CSS Custom Properties, HSL color tokens, and utility classes.
   - *Trade-off*: Zero external CSS utility library overhead, maximum layout flexibility, faster Vite build time (under 600ms), and custom dark/light theme switching.

2. **Optimistic Status Updates:**
   - *Decision*: When moving a lead between pipeline stages, the UI updates immediately, rolling back and displaying an error toast only if the PATCH API call fails.
   - *Trade-off*: Enhances perceived speed and fluidity for sales teams handling high-frequency updates.

3. **Native Lucide-Style SVGs vs. Heavy Icon Library:**
   - *Decision*: Embedded lightweight, resolution-independent SVGs directly into components.
   - *Trade-off*: Reduced JavaScript bundle size by over 150KB, zero flash-of-unstyled-icon (FOUT).

---

## 7. Future Improvements

- [ ] **Kanban Board View**: Drag-and-drop column view for lead status stages.
- [ ] **Quick Notes & Communication Log**: Collapsible drawer per lead to record call notes.
- [ ] **Multi-Select Bulk Operations**: Update status or delete multiple leads simultaneously.
