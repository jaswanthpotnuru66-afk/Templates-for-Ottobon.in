import { useState, useRef } from "react";
import { useRobustVideo } from "../hooks/useRobustVideo";
import {
  PromptInspectorWidget,
  ContextSimulatorWidget,
  SprintTimelineWidget,
  GuardrailWidget,
} from "../components/capabilities/CapabilitiesWidgets";

const HERO_VIDEO_4K_SRC = "/Targo-Hero-4K.mp4";
const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_050407_500d0339-ab28-41c1-9688-132a74a3b5aa.mp4";
const ABOUT_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260823_063501_2e2c8971-de1e-473a-8611-a0c9ae7ee186.mp4";
const CURRENT_YEAR = new Date().getFullYear();

const HERO_METRICS = [
  { value: "Top 1%", label: "Selection rate", sub: "Cognitive aptitude & case simulations" },
  { value: "Official", label: "Anthropic partner", sub: "Direct Claude enterprise methodologies" },
  { value: "1–2 wks", label: "Deployment window", sub: "Pre-vetted engineering bench" },
  { value: "Zero ramp", label: "Production readiness", sub: "Trained to integrate day one" },
];

const HOW_WE_CHOOSE = [
  {
    id: "hwc-1",
    tag: "Systems Architecture",
    title: "Built for integration & component reuse.",
    body: "We look for developers who think in distributed workflows and know when to leverage proven frameworks instead of reinventing infrastructure from scratch.",
    rubricPass: "Evaluates existing enterprise abstractions before authoring custom code.",
    rubricReject: "Defaulting to monoliths or rebuilding proven components in isolation.",
    signal: "PASS · Top 1% Systems Architecture",
  },
  {
    id: "hwc-2",
    tag: "Commercial Alignment",
    title: "A rigorous analytical baseline (HBS-Style).",
    body: "Candidates analyze messy, ambiguous business constraints and design solutions aligned with margin, unit economics, and operational reality.",
    rubricPass: "Translates ambiguous P&L requirements into deterministic technical contracts.",
    rubricReject: "Writing theoretical code that optimizes benchmarks but ignores business value.",
    signal: "PASS · Commercial ROI Benchmark",
  },
  {
    id: "hwc-3",
    tag: "Autonomous Execution",
    title: "Independent problem-solvers.",
    body: "We select developers who take end-to-end ownership, navigate shifting constraints, and deliver production results without needing step-by-step supervision.",
    rubricPass: "Unblocks ambiguous dependencies independently; delivers documented APIs.",
    rubricReject: "Freezing when requirements lack detailed step-by-step tickets.",
    signal: "PASS · Autonomous Enterprise Delivery",
  },
];

const HOW_WE_TRAIN = [
  {
    id: "hwt-1",
    phase: "Phase 01",
    badge: "Diagnostic Labs",
    title: "Business case studies (HBS-style).",
    body: "Engineers work through intensive real-world case simulations with incomplete data. They diagnose the commercial objective, model constraints, and align technical architecture before writing a single line of code.",
    milestone: "Diagnostic commercial brief & technical scoping contract signed.",
    tags: ["HBS Case Method", "Unit Economics", "Constraint Diagnosis"],
  },
  {
    id: "hwt-2",
    phase: "Phase 02",
    badge: "Official Partnership",
    title: "Official Anthropic partnership curriculum.",
    body: "Direct training on Anthropic Claude standards: structured prompt design, multi-document context caching, deterministic tool calling, and evaluation harnesses to eliminate hallucinations.",
    milestone: "Zero-hallucination Claude tool-calling pipeline with automated evals.",
    tags: ["Claude 3.5 Sonnet", "Context Caching", "Evals & Guardrails"],
  },
  {
    id: "hwt-3",
    phase: "Phase 03",
    badge: "Production Sprints",
    title: "Fast sprints, built for production scale.",
    body: "Engineers build working enterprise MVPs in short 14-day sprint cycles while establishing clean modular scaffolding that avoids accumulating technical debt as workloads expand.",
    milestone: "Containerized, SOC-2 compliant deployment ready for client cloud handover.",
    tags: ["14-Day MVP Sprints", "Zero Tech Debt", "CI/CD Handover"],
  },
];

const CAPABILITIES = [
  {
    id: "cap-1",
    num: "01",
    metric: "Sub-Second Structured Output",
    label: "Prompt engineering & Claude integration",
    detail: "Connecting your workflows directly to Claude with well-structured, reliable prompts, tool use, and deterministic output schemas.",
    tags: ["Claude 3.5 Sonnet", "Tool Calling", "System Prompts", "Evals"],
    deliverable: "Production-ready prompt suites with automated evals",
    visualSnippet: '{ "tool": "analyze_pipeline", "confidence": 0.994, "status": "verified" }',
  },
  {
    id: "cap-2",
    num: "02",
    metric: "200K+ Token Context",
    label: "Large-context reasoning pipelines",
    detail: "Processing long documents, regulatory transcripts, and multi-source datasets without losing accuracy or semantic context.",
    tags: ["Document Intelligence", "Vector Search", "Multi-Hop RAG", "Chunking"],
    deliverable: "End-to-end extraction pipelines with < 0.5% hallucination rate",
    visualSnippet: "200,000+ Tokens · Multi-Document Cross-Referencing",
  },
  {
    id: "cap-3",
    num: "03",
    metric: "2–4 Week Turnaround",
    label: "Rapid MVP delivery",
    detail: "Working prototypes in short sprints, designed to grow without accumulating technical debt or architectural compromises.",
    tags: ["FastAPI / Next.js", "Async Queues", "vLLM / Bedrock", "Production CI/CD"],
    deliverable: "Fully functional enterprise prototype ready for user testing",
    visualSnippet: "Sprint 1: Architecture → Sprint 2: Production MVP",
  },
  {
    id: "cap-4",
    num: "04",
    metric: "SOC-2 & Guardrails",
    label: "Enterprise safety & compliance",
    detail: "Output validation, audit trails, PII redaction, and policy guardrails built into the pipeline from day one.",
    tags: ["PII Masking", "Audit Logging", "Schema Enforcement", "Human-in-the-Loop"],
    deliverable: "Automated compliance validation with immutable audit logs",
    visualSnippet: "PII Sanitized · Schema Verified · Policy Enforced",
  },
];

const WHY_MATTERS = [
  {
    id: "wm-1",
    tag: "Risk Mitigation",
    badge: "Risk Reduction",
    stat: "Zero Mis-Hire Risk",
    vsOld: "Theoretical Q&A",
    vsNew: "Applied Case Practice",
    title: "Lower hiring risk.",
    body: "Traditional hiring leans on interviews that test theory. Our engineers arrive with applied, case-based practice, which reduces the risk of a mis-hire.",
    takeaway: "First-month structured evaluation with replacement guarantee.",
  },
  {
    id: "wm-2",
    tag: "Commercial Alignment",
    badge: "Commercial Focus",
    stat: "100% Business-First",
    vsOld: "Code in a Vacuum",
    vsNew: "P&L & Margin Focused",
    title: "Built around your goals.",
    body: "They learn the business objective first, so they build solutions that serve your bottom line, not features in a vacuum.",
    takeaway: "Technical scoping designed around bottom-line enterprise ROI.",
  },
  {
    id: "wm-3",
    tag: "Velocity",
    badge: "Time to Value",
    stat: "Zero-Ramp Speed",
    vsOld: "3–6 Month Ramp-Up",
    vsNew: "Day 1 Claude Integration",
    title: "A faster start.",
    body: "Engineers already trained on Claude and rapid integration get productive sooner than new hires starting from zero.",
    takeaway: "Immediate deployment into production sprint cycles.",
  },
];

const TRACKS = [
  {
    id: "track-a",
    label: "Track A",
    category: "Talent Bench",
    title: "Deploy ready-trained AI talent.",
    body: "Access our pre-vetted bench of upskilled AI engineers, ready to join your existing development teams.",
    points: ["Pre-evaluated on Claude workflows", "Available within 1–2 weeks", "First-month fit guarantee"],
  },
  {
    id: "track-b",
    label: "Track B",
    category: "Custom Pipeline",
    title: "Custom hire and upskill.",
    body: "If you need a profile outside our current bench, we run our hiring and training framework to find and train talent for your exact technical and cultural needs.",
    points: ["Tailored technical requirements", "Custom case-study curriculum", "4–8 week recruitment cycle"],
  },
  {
    id: "track-c",
    label: "Track C",
    category: "Global Operations",
    title: "Managed hosting and compliance.",
    body: "If hiring internationally is a hurdle, we host the talent locally and handle payroll, infrastructure and legal compliance, so you receive a single vendor invoice.",
    points: ["Local compliance & payroll", "Single international vendor invoice", "Managed hardware & infrastructure"],
  },
];

const FAQS = [
  {
    id: "faq-1",
    q: "What does it mean to be an official Anthropic partner?",
    a: "Ottobon has a formal relationship with Anthropic that gives our engineers access to official training materials, documentation and model updates. Our training programme is built directly on Anthropic recommended practices, designed to reduce hallucinations and improve output reliability.",
  },
  {
    id: "faq-2",
    q: "How quickly can an engineer be deployed?",
    a: "Engineers on our current bench can typically be introduced within one to two weeks. Custom profiles where we run a dedicated hiring and training cycle take four to eight weeks depending on the technical specification.",
  },
  {
    id: "faq-3",
    q: "What if the engineer is not the right fit?",
    a: "We build in a structured review at the end of the first month. If there is a fit issue, we will replace the engineer at no additional cost. Our selection and training process is designed to minimise this risk, but we stand behind the placement.",
  },
  {
    id: "faq-4",
    q: "Do you work with companies outside a specific industry?",
    a: "Yes. The case-study training is cross-industry by design. Engineers are trained to diagnose business goals before writing code, which makes them effective across sectors including finance, operations, healthcare and logistics.",
  },
];

function FaqItem({ item }: { item: (typeof FAQS)[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"ob-faq-item" + (open ? " is-open" : "")}>
      <button
        type="button"
        className="ob-faq-question"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-controls={"faq-answer-" + item.id}
        id={"faq-btn-" + item.id}
      >
        <span className="ob-faq-q-text">{item.q}</span>
        <span className="ob-faq-indicator" aria-hidden="true">
          <svg
            className="ob-faq-icon"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <path d="M5 10h10" />
            <path d="M10 5v10" className="ob-faq-icon-vert" />
          </svg>
        </span>
      </button>
      <div
        className={"ob-faq-answer-collapse" + (open ? " is-expanded" : "")}
        id={"faq-answer-" + item.id}
        role="region"
        aria-labelledby={"faq-btn-" + item.id}
      >
        <div className="ob-faq-answer-inner">
          <p className="ob-faq-body">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export function Template1() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);
  useRobustVideo(heroVideoRef);
  useRobustVideo(aboutVideoRef);

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="ob-page">
      {/* === HERO SECTION === */}
      <section id="top" className="ob-hero" aria-label="Hero">
        <video
          ref={heroVideoRef}
          className="ob-hero-video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_4K_SRC} type="video/mp4" />
          <source src={HERO_VIDEO_SRC} type="video/mp4" />
        </video>
        <div className="ob-hero-scrim" aria-hidden="true" />

        {/* Clean, Floating Frosted Navbar */}
        <header className="ob-navbar" role="banner">
          <a href="#top" onClick={scrollTo("top")} className="ob-logo-group" aria-label="Ottobon Home">
            <div className="ob-logo-circle" aria-hidden="true">
              <span className="ob-logo-ellipse" />
            </div>
            <span className="ob-logo-text">ottobon</span>
            <span className="ob-logo-partner-tag">Official Anthropic Partner</span>
          </a>

          <nav className="ob-nav-links" aria-label="Main navigation">
            <a href="#how-we-choose" onClick={scrollTo("how-we-choose")} className="ob-nav-link">
              How We Choose
            </a>
            <a href="#how-we-train" onClick={scrollTo("how-we-train")} className="ob-nav-link">
              Training
            </a>
            <a href="#capabilities" onClick={scrollTo("capabilities")} className="ob-nav-link">
              Capabilities
            </a>
            <a href="#work-with-us" onClick={scrollTo("work-with-us")} className="ob-nav-link">
              Work With Us
            </a>
          </nav>

          <button
            type="button"
            className="ob-nav-contact-btn"
            onClick={scrollTo("work-with-us")}
            aria-label="Contact us"
          >
            <span>Contact Us</span>
            <svg
              className="ob-nav-contact-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden="true"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>

          <button
            type="button"
            className="ob-mobile-burger"
            onClick={() => setMobileMenuOpen((p) => !p)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="ob-burger-bar" />
            <span className="ob-burger-bar" />
          </button>

          {mobileMenuOpen && (
            <div className="ob-mobile-menu" role="dialog" aria-modal="true">
              <a href="#top" onClick={scrollTo("top")}>Home</a>
              <a href="#how-we-choose" onClick={scrollTo("how-we-choose")}>How We Choose</a>
              <a href="#how-we-train" onClick={scrollTo("how-we-train")}>Training</a>
              <a href="#capabilities" onClick={scrollTo("capabilities")}>Capabilities</a>
              <a href="#why-it-matters" onClick={scrollTo("why-it-matters")}>Why It Matters</a>
              <a href="#work-with-us" onClick={scrollTo("work-with-us")}>Work With Us</a>
              <a href="#faq" onClick={scrollTo("faq")}>FAQ</a>
            </div>
          )}
        </header>

        {/* Hero Content Area */}
        <div className="ob-hero-content">
          {/* Subtle Accreditation Badge */}
          <div className="ob-hero-badge">
            <span className="ob-badge-dot" />
            <span className="ob-badge-text">Official Anthropic Partner</span>
            <span className="ob-badge-divider" aria-hidden="true">·</span>
            <span className="ob-badge-sub">Enterprise AI Talent</span>
          </div>

          {/* Cleanly Aligned Hero Headline */}
          <h1 className="ob-hero-headline">
            <span className="ob-hl-line">Elite AI Engineers.</span>
            <span className="ob-hl-line">
              Ready for enterprise <span className="ob-hl-accent">deployment.</span>
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="ob-hero-sub">
            Ottobon trains AI engineers to be problem-solvers, not just coders. As an{" "}
            <strong className="ob-sub-strong">official Anthropic partner</strong>, we prepare
            developers to fit into your team and start delivering.
          </p>

          {/* Action CTAs */}
          <div className="ob-hero-ctas">
            <button
              type="button"
              className="ob-btn-primary"
              onClick={scrollTo("how-we-choose")}
              id="hero-cta-talent"
            >
              <span>Review Talent Profiles</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ob-btn-arrow" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>

            <button
              type="button"
              className="ob-btn-secondary"
              onClick={scrollTo("work-with-us")}
              id="hero-cta-cases"
            >
              <span>View Our Case Studies</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ob-btn-arrow" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* === DEDICATED PROOF METRICS STRIP (No collision with 3D pedestal) === */}
      <section className="ob-proof-strip" aria-label="Key Proof Metrics">
        <div className="ob-proof-strip-inner">
          {HERO_METRICS.map((metric, idx) => (
            <div key={idx} className="ob-metric-item">
              <div className="ob-metric-val">{metric.value}</div>
              <div className="ob-metric-label">{metric.label}</div>
              <div className="ob-metric-sub">{metric.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* === SECTION 2: HOW WE CHOOSE OUR ENGINEERS (Architectural Selection Ledger) === */}
      <section id="how-we-choose" className="ob-section ob-section--light" aria-label="How We Choose Our Engineers">
        <div className="ob-section-inner ob-two-col">
          <div className="ob-col-heading">
            <span className="ob-eyebrow">Selection Architecture</span>
            <h2 className="ob-section-heading">
              How we choose our engineers
            </h2>
            <p className="ob-col-lead">
              We look past theoretical trivia. Every candidate is evaluated on applied systems thinking,
              rapid architectural reasoning, and autonomous execution.
            </p>
            <div className="ob-ledger-stat-callout">
              <span>Acceptance Yield: Top 0.8%</span>
              <span style={{ color: "#94A3B8" }}>·</span>
              <span>4-Stage Diagnostic Case Filter</span>
            </div>
          </div>

          <div className="ob-col-content">
            <div className="ob-ledger-container">
              {HOW_WE_CHOOSE.map((item, i) => (
                <div key={item.id} className="ob-ledger-row">
                  <div className="ob-ledger-header">
                    <div className="ob-ledger-meta">
                      <span className="ob-ledger-num">{`0${i + 1}`}</span>
                      <span className="ob-ledger-badge">{item.tag}</span>
                    </div>
                    <span className="ob-ledger-signal">
                      <span>✓</span> {item.signal}
                    </span>
                  </div>
                  <h3 className="ob-ledger-title">{item.title}</h3>
                  <p className="ob-ledger-body">{item.body}</p>
                  <div className="ob-ledger-rubric">
                    <div className="ob-rubric-pass">
                      <strong>Validated:</strong> {item.rubricPass}
                    </div>
                    <div className="ob-rubric-reject">
                      <strong>Filtered:</strong> {item.rubricReject}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 3: HOW WE TRAIN THEM (Studio Syllabus Timeline) === */}
      <section id="how-we-train" className="ob-section ob-section--dark" aria-label="How We Train Them">
        <div className="ob-section-inner ob-two-col ob-two-col--reverse">
          <div className="ob-col-content">
            <span className="ob-eyebrow" style={{ color: "#94A3B8" }}>Pedagogy &amp; Curriculum</span>
            <h2 className="ob-section-heading ob-section-heading--light">
              How we train them
            </h2>
            <div className="ob-timeline-wrapper">
              <div className="ob-timeline-track" aria-hidden="true" />
              {HOW_WE_TRAIN.map((item, idx) => (
                <div key={item.id} className="ob-timeline-item">
                  <div className="ob-timeline-node">{`0${idx + 1}`}</div>
                  <div className="ob-timeline-card">
                    <div className="ob-timeline-header">
                      <span className="ob-timeline-phase-pill">{item.phase}</span>
                      <span className="ob-timeline-badge">{item.badge}</span>
                    </div>
                    <h3 className="ob-timeline-title">{item.title}</h3>
                    <p className="ob-timeline-body">{item.body}</p>
                    <div className="ob-timeline-footer">
                      <span className="ob-timeline-footer-dot" />
                      <span>{item.milestone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ob-col-media">
            <div className="ob-video-frame">
              <video
                ref={aboutVideoRef}
                className="ob-about-video"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="AI engineer training visualisation"
              >
                <source src={ABOUT_VIDEO_SRC} type="video/mp4" />
              </video>
              <div className="ob-video-caption">
                <span className="ob-timeline-footer-dot" />
                <span>Anthropic Claude Methods &amp; Case Analysis · Official Partner</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 4: CAPABILITIES AND PROOF (Bento Grid) === */}
      <section id="capabilities" className="ob-section ob-section--light" aria-label="Capabilities and Proof">
        <div className="ob-section-inner">
          <div className="ob-caps-header">
            <div>
              <span className="ob-eyebrow">Core Capabilities</span>
              <h2 className="ob-section-heading">Capabilities & proof</h2>
            </div>
            <p className="ob-caps-lead">
              Don’t take our word for it. Start with a small, scoped project and judge the results.
            </p>
          </div>

          <div className="ob-bento-grid">
            {CAPABILITIES.map((cap) => (
              <div key={cap.id} className="ob-bento-card">
                <div className="ob-bento-card-top">
                  <div className="ob-bento-meta">
                    <span className="ob-bento-num">{cap.num}</span>
                    <span className="ob-bento-metric">{cap.metric}</span>
                  </div>
                  <div className="ob-bento-icon-wrapper" aria-hidden="true">
                    {cap.id === "cap-1" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ob-bento-svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    )}
                    {cap.id === "cap-2" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ob-bento-svg">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    )}
                    {cap.id === "cap-3" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ob-bento-svg">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    )}
                    {cap.id === "cap-4" && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ob-bento-svg">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    )}
                  </div>
                </div>

                <h3 className="ob-bento-title">{cap.label}</h3>
                <p className="ob-bento-body">{cap.detail}</p>

                {/* Interactive Capability Widget */}
                {cap.id === "cap-1" && <PromptInspectorWidget theme="light" />}
                {cap.id === "cap-2" && <ContextSimulatorWidget theme="light" />}
                {cap.id === "cap-3" && <SprintTimelineWidget theme="light" />}
                {cap.id === "cap-4" && <GuardrailWidget theme="light" />}

                {/* Tech Chips */}
                <div className="ob-bento-tags">
                  {cap.tags.map((t, idx) => (
                    <span key={idx} className="ob-bento-tag">{t}</span>
                  ))}
                </div>

                {/* SLA Deliverable Footer */}
                <div className="ob-bento-footer">
                  <span className="ob-deliverable-label">SLA Deliverable</span>
                  <span className="ob-deliverable-value">{cap.deliverable}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pilot Project CTA banner */}
          <div className="ob-pilot-banner">
            <div className="ob-pilot-content">
              <div className="ob-pilot-pill-group">
                <span className="ob-eyebrow" style={{ color: "#94A3B8" }}>Scoped Engagement</span>
                <span className="ob-pilot-guarantee">30-Day Fit Guarantee</span>
              </div>
              <h3 className="ob-pilot-title">Start with a pilot project</h3>
              <p className="ob-pilot-desc">
                A single, scoped engagement with no long-term commitment required. We scope it together,
                your team evaluates the output, and you decide whether to continue.
              </p>
            </div>
            <button
              type="button"
              className="ob-btn-primary ob-btn-pilot"
              onClick={scrollTo("work-with-us")}
              id="pilot-cta-btn"
            >
              <span>Propose a Pilot</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ob-btn-arrow" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* === SECTION 5: WHY IT MATTERS FOR YOUR BUSINESS (Executive 3-Column Value Grid) === */}
      <section id="why-it-matters" className="ob-section ob-section--mid" aria-label="Why It Matters for Your Business">
        <div className="ob-section-inner">
          <div className="ob-wm-header">
            <div>
              <span className="ob-eyebrow">Commercial Value</span>
              <h2 className="ob-section-heading">Why it matters for your business</h2>
            </div>
            <p className="ob-wm-lead">
              Traditional engineering hiring is slow, speculative, and prone to mis-hires.
              Ottobon provides immediate capacity with proven enterprise problem-solvers.
            </p>
          </div>

          <div className="ob-wm-grid">
            {WHY_MATTERS.map((item) => (
              <div key={item.id} className="ob-wm-card">
                <div className="ob-wm-card-top">
                  <span className="ob-wm-badge">{item.badge}</span>
                  <span className="ob-wm-stat">{item.stat}</span>
                </div>
                <div className="ob-wm-vs">
                  <span className="ob-wm-vs-old">{item.vsOld}</span>
                  <span className="ob-wm-vs-arrow" aria-hidden="true">→</span>
                  <span className="ob-wm-vs-new">{item.vsNew}</span>
                </div>
                <h3 className="ob-wm-title">{item.title}</h3>
                <p className="ob-wm-body">{item.body}</p>
                <div className="ob-wm-footer">
                  <span className="ob-wm-takeaway-label">Key Outcome</span>
                  <span className="ob-wm-takeaway">{item.takeaway}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === SECTION 6: HOW TO WORK WITH US === */}
      <section id="work-with-us" className="ob-section ob-section--dark" aria-label="How to Work With Us">
        <div className="ob-section-inner">
          <div className="ob-work-header">
            <span className="ob-eyebrow" style={{ color: "#94A3B8" }}>Engagement Models</span>
            <h2 className="ob-section-heading ob-section-heading--light">
              How to work with us
            </h2>
            <p className="ob-work-lead">
              Flexible structures tailored to your technical timeline, team setup, and compliance needs.
            </p>
          </div>

          <div className="ob-tracks-grid">
            {TRACKS.map((track) => (
              <div key={track.id} className="ob-track-card" id={track.id}>
                <div className="ob-track-top">
                  <span className="ob-track-label">{track.label}</span>
                  <span className="ob-track-cat">{track.category}</span>
                </div>
                <h3 className="ob-track-title">{track.title}</h3>
                <p className="ob-track-body">{track.body}</p>
                <ul className="ob-track-points">
                  {track.points.map((pt, idx) => (
                    <li key={idx} className="ob-track-point">
                      <svg className="ob-check-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M3.5 8.5l3 3 6-6" />
                      </svg>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="ob-track-action">
                  <a href="mailto:hello@ottobon.com" className="ob-track-cta">
                    <span>Discuss this track</span>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ob-btn-arrow" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Bar */}
          <div className="ob-contact-bar">
            <div>
              <h3 className="ob-contact-title">Ready to evaluate engineer profiles?</h3>
              <p className="ob-contact-sub">Direct discussion with our technical leads. No sales runaround.</p>
            </div>
            <a href="mailto:hello@ottobon.com" className="ob-btn-primary ob-btn-contact" id="contact-email-btn">
              <span>Get in Touch</span>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="ob-btn-arrow" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* === SECTION 7: FAQ === */}
      <section id="faq" className="ob-section ob-section--light" aria-label="Frequently Asked Questions">
        <div className="ob-section-inner ob-faq-inner">
          <div className="ob-faq-header">
            <span className="ob-eyebrow">Frequently Asked Questions</span>
            <h2 className="ob-section-heading">
              Answers & details
            </h2>
            <p className="ob-faq-lead">
              Key details on partnership accreditation, deployment timelines, and replacement guarantees.
            </p>
          </div>

          <div className="ob-faq-list">
            {FAQS.map((item) => (
              <FaqItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="ob-footer" role="contentinfo">
        <div className="ob-footer-inner">
          <div className="ob-footer-brand">
            <a href="#top" onClick={scrollTo("top")} className="ob-logo-group" aria-label="Ottobon back to top">
              <div className="ob-logo-circle" aria-hidden="true">
                <span className="ob-logo-ellipse" />
              </div>
              <span className="ob-logo-text">ottobon</span>
            </a>
            <p className="ob-footer-tagline">
              Official Anthropic Partner. Preparing elite AI engineers for enterprise deployment.
            </p>
          </div>

          <nav className="ob-footer-nav" aria-label="Footer navigation">
            <a href="#how-we-choose" onClick={scrollTo("how-we-choose")} className="ob-footer-link">How We Choose</a>
            <a href="#how-we-train" onClick={scrollTo("how-we-train")} className="ob-footer-link">Training</a>
            <a href="#capabilities" onClick={scrollTo("capabilities")} className="ob-footer-link">Capabilities</a>
            <a href="#why-it-matters" onClick={scrollTo("why-it-matters")} className="ob-footer-link">Why It Matters</a>
            <a href="#work-with-us" onClick={scrollTo("work-with-us")} className="ob-footer-link">Work With Us</a>
            <a href="#faq" onClick={scrollTo("faq")} className="ob-footer-link">FAQ</a>
          </nav>
        </div>

        <div className="ob-footer-bottom">
          <p className="ob-footer-copy">{`© ${CURRENT_YEAR} Ottobon Inc. All rights reserved.`}</p>
          <div className="ob-footer-meta">
            <span>San Francisco</span>
            <span className="ob-meta-dot" aria-hidden="true">·</span>
            <span>London</span>
            <span className="ob-meta-dot" aria-hidden="true">·</span>
            <span>Global Placement</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
