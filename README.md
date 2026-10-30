# Ottobon — Company Website

The public landing page for **OTTOBON**, showcasing our unified practice-first model that bridges foundational principles with verified workplace execution.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start local development server
```bash
npm run dev
```

Open your browser at `http://localhost:5173/` to view the landing page.

### 3. Build & Typecheck
```bash
npm run build
```

### 4. Run Linter
```bash
npm run lint
```

---

## Page Architecture

The website is a unified, responsive single-page experience with smooth section navigation and an interactive modal for service exploration:

- **Header / Navigation (`src/components/Header.tsx`)**:
  - Sticky frosted glass pill navigation with active scrollspy tracking
  - Direct links to `#about`, `#offerings`, `#methodology`, `#advantage`, `#impact`, `#faq`, and `#contact`
  - Responsive mobile drawer menu
- **Hero Section (`src/components/Hero.tsx`)**:
  - Signature top notch cutout detail with atmospheric lighting
  - Clear statement of what Ottobon stands for
  - Primary & secondary CTAs + 3D isometric architecture visual
- **About Ottobon (`src/components/About.tsx`)**:
  - Articulation of the connected practice model
  - Interactive diagram linking Principles → Structured Lab → Verified Output
- **Offerings / Services (`src/components/Services.tsx`)**:
  - Presentation of Ottobon's 3 primary tracks (Core Track, Applied Studio, Specialized Lab)
  - Interactive "Explore details" modal (`src/components/ServiceModal.tsx`) with modular curriculum and deliverables
  - Structural comparison matrix table
- **Methodology (`src/components/Approach.tsx`)**:
  - Three-stage methodology (Explore, Learn, Apply) with bespoke technical schematics
- **Comparative Advantage (`src/components/Comparison.tsx`)**:
  - Side-by-side contrast between traditional passive courses vs Ottobon practice model
- **Value Proposition (`src/components/Benefits.tsx`)**:
  - 6 distinct operational competencies and benefits
- **Practical Work & Showcase (`src/components/Showcase.tsx`)**:
  - Real-world applied project deliverables
- **Frequently Asked Questions (`src/components/Faq.tsx`)**:
  - Accessible accordion addressing participation, structure, and admissions
- **Contact & Advisory (`src/components/Contact.tsx`)**:
  - Accessible contact form with live validation and pre-fill capabilities from offerings
- **Footer (`src/components/Footer.tsx`)**:
  - Clean brand links, copyright, and preview notice

---

## Content Configuration

All business copy, offerings, and disclosures live in typed configuration files:
- [src/content/ottobon.ts](src/content/ottobon.ts): Single source of truth for all content, ensuring no hardcoded business claims.
