import { useState } from "react";
import "../styles/template2.css";
import { VercelMonolith } from "../components/VercelMonolith";
import {
  T2_PROJECT_SHOWCASE,
  T2_SELECTION_CRITERIA,
  T2_TRAINING_STAGES,
  T2_BUSINESS_BENEFITS,
  T2_ENGAGEMENT_PATHS,
  T2_FAQS,
  T2_CLOSING_CTA,
} from "../data/template2Content";

const CURRENT_YEAR = new Date().getFullYear();

const T2_HERO_CAPABILITIES = [
  {
    theme: "Business thinking.",
    copy: "Engineers analyze real-world constraints and align technical architecture with business goals before writing code.",
  },
  {
    theme: "Applied engineering.",
    copy: "Trained on official Anthropic Claude methods, context reasoning, and enterprise safety practices to deliver reliable AI output.",
  },
  {
    theme: "Team integration.",
    copy: "Systems thinkers who quickly understand your codebase and embed into your active sprints to deliver without handholding.",
  },
];

export function Template2() {
  // Hero interactive state (Frozen behavior)
  const [heroActiveIndex, setHeroActiveIndex] = useState<number | null>(null);
  const [heroHoverIndex, setHeroHoverIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // FAQ Accordion state
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-anthropic");

  const effectiveActiveIdx = heroHoverIndex !== null ? heroHoverIndex : heroActiveIndex;

  const handleCapabilityClick = (idx: number) => {
    setHeroActiveIndex((prev) => (prev === idx ? null : idx));
  };

  const handleCapabilityKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCapabilityClick(idx);
    }
  };

  const handleFaqToggle = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="t2-page">
      <div className="t2-bg-grid" aria-hidden="true" />

      {/* ============================================================
          HERO SECTION (APPROVED & FROZEN)
          ============================================================ */}
      <div id="t2-top" className="t2-hero-dark-shell">
        <div className="t2-hero-ambient-aura" aria-hidden="true" />

        {/* Slim Top Navigation Bar */}
        <header className="t2-navbar t2-container">
          <div className="t2-nav-left">
            <a href="#t2-top" className="t2-logo" aria-label="Ottobon">
              <svg
                className="t2-logo-mark"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" fill="currentColor" fillOpacity="0.12" />
                <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" />
                <line x1="12" y1="22" x2="12" y2="12" />
                <line x1="12" y1="12" x2="21" y2="7" />
                <line x1="12" y1="12" x2="3" y2="7" />
              </svg>
              <span className="t2-logo-text">Ottobon</span>
            </a>

            <nav className={`t2-nav-links ${mobileMenuOpen ? "open" : ""}`}>
              <a href="#t2-built" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Showcase
              </a>
              <a href="#t2-choose" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Selection
              </a>
              <a href="#t2-train" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Curriculum
              </a>
              <a href="#t2-why" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Why Ottobon
              </a>
              <a href="#t2-tracks" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Hiring Tracks
              </a>
              <a href="#t2-faq" className="t2-nav-link" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
            </nav>
          </div>

          <div className="t2-nav-right">
            <a href="mailto:hello@ottobon.com" className="t2-nav-demo-btn">
              Get in Touch
            </a>
            <a href="#t2-built" className="t2-nav-signup-btn">
              Review Bench
            </a>

            <button
              type="button"
              className="t2-mobile-menu-toggle"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`t2-hamburger-line ${mobileMenuOpen ? "open" : ""}`} />
              <span className={`t2-hamburger-line ${mobileMenuOpen ? "open" : ""}`} />
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="t2-mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="t2-mobile-nav-menu" onClick={(e) => e.stopPropagation()}>
              <a href="#t2-built" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Showcase
              </a>
              <a href="#t2-choose" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Selection
              </a>
              <a href="#t2-train" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Curriculum
              </a>
              <a href="#t2-why" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Why Ottobon
              </a>
              <a href="#t2-tracks" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                Hiring Tracks
              </a>
              <a href="#t2-faq" className="t2-mobile-nav-item" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <div className="t2-mobile-nav-actions">
                <a href="#t2-built" className="t2-v-btn-primary" onClick={() => setMobileMenuOpen(false)}>
                  Review Bench
                </a>
                <a href="mailto:hello@ottobon.com" className="t2-v-btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                  Get in Touch
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Vercel-Faithful Hero Section */}
        <section className="t2-agentic-hero t2-container">
          <div className="t2-agentic-content-row">
            {/* Left Column: Headline, Supporting Copy, and Dual Pill CTAs */}
            <div className="t2-agentic-left">
              <h1 className="t2-v-headline">
                <span className="t2-v-line">Elite AI Engineers.</span>
                <span className="t2-v-line">Ready for Enterprise</span>
                <span className="t2-v-line">Deployment.</span>
              </h1>
              <p className="t2-v-subheadline">
                Ottobon trains AI engineers to be problem-solvers, not just coders. As an official Anthropic partner, we prepare developers to fit into your team and start delivering.
              </p>
              <div className="t2-v-actions">
                <a href="#t2-built" className="t2-v-btn-primary">
                  Review Talent Profiles
                </a>
                <a href="#t2-why" className="t2-v-btn-secondary">
                  View Our Outcomes
                </a>
              </div>
            </div>

            {/* Center Column: Central Triangular Monolith (Frozen) */}
            <div className="t2-monolith-col" aria-hidden="true">
              <VercelMonolith
                activeSide={heroActiveIndex}
                hoveredSide={heroHoverIndex}
              />
            </div>

            {/* Right Column: 3 Clean Capability Statements */}
            <div className="t2-agentic-right">
              <nav
                className="t2-v-interactive-nav"
                aria-label="Platform capabilities"
                onMouseLeave={() => setHeroHoverIndex(null)}
              >
                {T2_HERO_CAPABILITIES.map((item, idx) => {
                  const isExpanded = effectiveActiveIdx === idx;
                  const isDimmed = effectiveActiveIdx !== null && !isExpanded;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`t2-v-capability-row ${
                        isExpanded ? "expanded" : isDimmed ? "dimmed" : "resting"
                      }`}
                      onClick={() => handleCapabilityClick(idx)}
                      onMouseEnter={() => setHeroHoverIndex(idx)}
                      onFocus={() => setHeroHoverIndex(idx)}
                      onBlur={() => setHeroHoverIndex(null)}
                      onKeyDown={(e) => handleCapabilityKeyDown(e, idx)}
                      aria-expanded={isExpanded}
                    >
                      <div className="t2-v-row-header">
                        <span className="t2-v-row-title">{item.theme}</span>
                      </div>
                      <div
                        className={`t2-v-row-content ${isExpanded ? "expanded" : ""}`}
                        aria-hidden={!isExpanded}
                      >
                        <p className="t2-v-row-desc">{item.copy}</p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </section>
      </div>

      {/* ============================================================
          1. BUILT BY OTTOBON (Dark Showcase)
          ============================================================ */}
      <section id="t2-built" className="t2-section t2-dark-section t2-built-section">
        <div className="t2-container">
          <div className="t2-built-header">
            <span className="t2-section-eyebrow">{T2_PROJECT_SHOWCASE.eyebrow}</span>
            <h2 className="t2-section-title">{T2_PROJECT_SHOWCASE.title}</h2>
            <p className="t2-section-lead">{T2_PROJECT_SHOWCASE.description}</p>
          </div>

          <div className="t2-built-case-frame">
            <div className="t2-built-case-meta">
              <div className="t2-built-tag-row">
                <span className="t2-built-pill">Project Showcase</span>
                <span className="t2-built-pill t2-pill-muted">{T2_PROJECT_SHOWCASE.projectName}</span>
              </div>

              <div className="t2-built-point">
                <h3 className="t2-built-point-title">{T2_PROJECT_SHOWCASE.businessProblem.title}</h3>
                <p className="t2-built-point-desc">{T2_PROJECT_SHOWCASE.businessProblem.description}</p>
              </div>

              <div className="t2-built-point">
                <h3 className="t2-built-point-title">{T2_PROJECT_SHOWCASE.whatWasBuilt.title}</h3>
                <p className="t2-built-point-desc">{T2_PROJECT_SHOWCASE.whatWasBuilt.description}</p>
              </div>

              <div className="t2-built-point">
                <h3 className="t2-built-point-title">{T2_PROJECT_SHOWCASE.engineerContribution.title}</h3>
                <p className="t2-built-point-desc">{T2_PROJECT_SHOWCASE.engineerContribution.description}</p>
              </div>
            </div>

            <div className="t2-built-asset-col">
              <div className="t2-asset-placeholder">
                <div className="t2-placeholder-icon" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div className="t2-placeholder-heading">{T2_PROJECT_SHOWCASE.assetPlaceholder.label}</div>
                <p className="t2-placeholder-sub">{T2_PROJECT_SHOWCASE.assetPlaceholder.sublabel}</p>
                <div className="t2-placeholder-dimensions">{T2_PROJECT_SHOWCASE.assetPlaceholder.specs}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. HOW WE CHOOSE OUR ENGINEERS (Light Editorial Rows)
          ============================================================ */}
      <section id="t2-choose" className="t2-section t2-light-section t2-choose-section">
        <div className="t2-container">
          <div className="t2-choose-header">
            <span className="t2-section-eyebrow">SELECTION STANDARDS</span>
            <h2 className="t2-section-title">How we choose our engineers.</h2>
            <p className="t2-section-lead">
              We evaluate engineers on foundational aptitude and real-world execution, selecting candidates equipped to deliver in enterprise environments.
            </p>
          </div>

          <div className="t2-editorial-rows">
            {T2_SELECTION_CRITERIA.map((criterion) => (
              <article key={criterion.number} className="t2-editorial-row">
                <div className="t2-row-number">{criterion.number}</div>
                <div className="t2-row-header">
                  <h3 className="t2-row-title">{criterion.title}</h3>
                  <p className="t2-row-headline">{criterion.headline}</p>
                </div>
                <div className="t2-row-body">
                  <p className="t2-row-desc">{criterion.description}</p>
                  <div className="t2-row-evaluation">
                    <strong>Evaluation Focus:</strong> {criterion.evaluationFocus}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3. HOW WE TRAIN THEM (Dark Compact Triptych)
          ============================================================ */}
      <section id="t2-train" className="t2-section t2-dark-section t2-train-section">
        <div className="t2-container">
          <div className="t2-train-header">
            <span className="t2-section-eyebrow">CURRICULUM &amp; METHODOLOGY</span>
            <h2 className="t2-section-title">How we train them.</h2>
            <p className="t2-section-lead">
              Preparation translates directly into useful work. Training connects business case reasoning, Anthropic Claude practice, and production delivery into a single progression.
            </p>
          </div>

          <div className="t2-train-triptych">
            {T2_TRAINING_STAGES.map((stage) => (
              <div key={stage.step} className="t2-train-stage">
                <div className="t2-train-stage-num">{stage.step}</div>
                <div className="t2-train-stage-header">
                  <h3 className="t2-train-stage-title">{stage.title}</h3>
                  <span className="t2-train-stage-subtitle">{stage.subtitle}</span>
                </div>
                <p className="t2-train-stage-body">{stage.description}</p>
                <div className="t2-train-artifact-box">
                  <span className="t2-artifact-label">{stage.artifactLabel}</span>
                  <span className="t2-artifact-name">{stage.artifactName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4. WHY IT MATTERS FOR YOUR BUSINESS (Dark Asymmetric Hierarchy)
          ============================================================ */}
      <section id="t2-why" className="t2-section t2-dark-section t2-why-section">
        <div className="t2-container">
          <div className="t2-why-header">
            <span className="t2-section-eyebrow">BUSINESS OUTCOMES</span>
            <h2 className="t2-section-title">Why it matters for your business.</h2>
          </div>

          <div className="t2-why-intro-card">
            <p className="t2-why-intro-statement">{T2_BUSINESS_BENEFITS.intro}</p>
            <p className="t2-why-intro-lead">{T2_BUSINESS_BENEFITS.lead}</p>
          </div>

          <div className="t2-why-benefits-grid">
            {T2_BUSINESS_BENEFITS.items.map((benefit) => (
              <div key={benefit.number} className="t2-why-benefit-card">
                <div className="t2-why-benefit-num">{benefit.number}</div>
                <h3 className="t2-why-benefit-title">{benefit.title}</h3>
                <div className="t2-why-benefit-connection">{benefit.connection}</div>
                <p className="t2-why-benefit-desc">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          5. HOW TO WORK WITH US (Light Dual Tracks & Support)
          ============================================================ */}
      <section id="t2-tracks" className="t2-section t2-light-section t2-tracks-section">
        <div className="t2-container">
          <div className="t2-tracks-header">
            <span className="t2-section-eyebrow">ENGAGEMENT MODELS</span>
            <h2 className="t2-section-title">How to work with us.</h2>
            <p className="t2-section-lead">
              Choose the model that aligns with your engineering timeline, tech stack, and hiring requirements.
            </p>
          </div>

          <div className="t2-tracks-dual">
            {T2_ENGAGEMENT_PATHS.tracks.map((track) => (
              <div key={track.trackId} className="t2-track-card">
                <div className="t2-track-eyebrow">{track.eyebrow}</div>
                <h3 className="t2-track-title">{track.name}</h3>
                <p className="t2-track-summary">{track.summary}</p>
                <ul className="t2-track-list">
                  {track.highlights.map((highlight, idx) => (
                    <li key={idx} className="t2-track-item">
                      <svg className="t2-track-item-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="t2-shared-support-bar">
            <h3 className="t2-shared-support-title">{T2_ENGAGEMENT_PATHS.sharedSupport.title}</h3>
            <p className="t2-shared-support-desc">{T2_ENGAGEMENT_PATHS.sharedSupport.description}</p>
            <div className="t2-shared-features-row">
              {T2_ENGAGEMENT_PATHS.sharedSupport.features.map((feature, idx) => (
                <div key={idx} className="t2-shared-feature-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. FAQ (Light Accessible Accordion)
          ============================================================ */}
      <section id="t2-faq" className="t2-section t2-light-section t2-faq-section">
        <div className="t2-container">
          <div className="t2-faq-header" style={{ textAlign: "center", marginBottom: "48px" }}>
            <span className="t2-section-eyebrow">COMMON QUESTIONS</span>
            <h2 className="t2-section-title" style={{ margin: "0 auto 16px auto" }}>Frequently asked questions.</h2>
            <p className="t2-section-lead" style={{ margin: "0 auto" }}>
              Clear answers on our partnership, engineer selection, and deployment process.
            </p>
          </div>

          <div className="t2-faq-list">
            {T2_FAQS.map((faq) => {
              const isOpen = openFaqId === faq.id;
              const contentId = `faq-content-${faq.id}`;
              const triggerId = `faq-trigger-${faq.id}`;

              return (
                <div key={faq.id} className={`t2-faq-item ${isOpen ? "is-open" : ""}`}>
                  <button
                    type="button"
                    id={triggerId}
                    className="t2-faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => handleFaqToggle(faq.id)}
                  >
                    <span>{faq.question}</span>
                    <svg
                      className={`t2-faq-icon ${isOpen ? "is-open" : ""}`}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div id={contentId} role="region" aria-labelledby={triggerId} className="t2-faq-content">
                      <p style={{ margin: 0 }}>{faq.answer}</p>
                      {!faq.isConfirmed && faq.contentGapNote && (
                        <div className="t2-faq-gap-badge">{faq.contentGapNote}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          7. CLOSING CTA & FOOTER (Dark Obsidian)
          ============================================================ */}
      <section id="t2-contact" className="t2-section t2-dark-section t2-cta-section">
        <div className="t2-container">
          <h2 className="t2-cta-headline">{T2_CLOSING_CTA.headline}</h2>
          <p className="t2-cta-sub">{T2_CLOSING_CTA.subheadline}</p>
          <div className="t2-cta-actions">
            <a href={T2_CLOSING_CTA.primaryAction.href} className="t2-cta-btn-primary">
              {T2_CLOSING_CTA.primaryAction.label}
            </a>
            <a href={T2_CLOSING_CTA.secondaryAction.href} className="t2-cta-btn-secondary">
              {T2_CLOSING_CTA.secondaryAction.label}
            </a>
          </div>
        </div>
      </section>

      {/* Verified Footer */}
      <footer className="t2-footer">
        <div className="t2-container t2-footer-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>Ottobon</span>
            <span style={{ color: "#52525B" }}>—</span>
            <span>Official Anthropic Partner</span>
          </div>
          <div>© {CURRENT_YEAR} Ottobon Inc. All rights reserved.</div>
          <div>
            Contact:{" "}
            <a href={`mailto:${T2_CLOSING_CTA.contactEmail}`} style={{ color: "#D4D4D8", textDecoration: "none" }}>
              {T2_CLOSING_CTA.contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
