/**
 * Centralized content data for Template 2 (Enterprise Obsidian Theme).
 * Strictly preserves approved user copy without invented metrics,
 * unsupported guarantees, or unverified customer case studies.
 */

export interface ProjectShowcaseData {
  eyebrow: string;
  title: string;
  description: string;
  projectName: string;
  businessProblem: {
    title: string;
    description: string;
  };
  whatWasBuilt: {
    title: string;
    description: string;
  };
  engineerContribution: {
    title: string;
    description: string;
  };
  assetPlaceholder: {
    label: string;
    sublabel: string;
    specs: string;
  };
}

export interface SelectionCriterion {
  number: string;
  title: string;
  headline: string;
  description: string;
  evaluationFocus: string;
}

export interface TrainingStage {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  artifactLabel: string;
  artifactName: string;
}

export interface BusinessBenefit {
  number: string;
  title: string;
  connection: string;
  description: string;
}

export interface EngagementTrack {
  trackId: string;
  name: string;
  eyebrow: string;
  summary: string;
  highlights: string[];
}

export interface FaqItemData {
  id: string;
  question: string;
  answer: string;
  isConfirmed: boolean;
  contentGapNote?: string;
}

export const T2_PROJECT_SHOWCASE: ProjectShowcaseData = {
  eyebrow: "BUILT BY OTTOBON",
  title: "Enterprise AI systems, built for production integration.",
  description:
    "A representative look at our engineers’ work: connecting company workflows to Claude with structured tool calling, large-context reasoning, and production validation.",
  projectName: "Multi-Document Enterprise Intelligence",
  businessProblem: {
    title: "Business Problem",
    description:
      "Enterprise teams struggle to query complex, cross-functional knowledge bases without semantic drift, hallucinated references, or unmanageable token overhead.",
  },
  whatWasBuilt: {
    title: "What Was Built",
    description:
      "A multi-stage context-aware retrieval and reasoning architecture utilizing Anthropic prompt caching, deterministic tool calling, and strict output schema validation.",
  },
  engineerContribution: {
    title: "Engineer Contribution",
    description:
      "Architected the context-caching hierarchy, authored custom schema validators, and deployed the production evaluation suite for continuous output verification.",
  },
  assetPlaceholder: {
    label: "[Client Asset Placeholder: Production Interface Walkthrough / Architecture Schematic]",
    sublabel: "To be supplied from active client projects or technical demonstrations.",
    specs: "Recommended format: High-resolution SVG schematic or 16:10 / 16:9 product UI capture",
  },
};

export const T2_SELECTION_CRITERIA: SelectionCriterion[] = [
  {
    number: "01",
    title: "Built for integration",
    headline: "Engineers who evaluate existing architecture before writing code.",
    description:
      "We select developers who think in distributed workflows and understand component reuse. Rather than building isolated monoliths, they identify proven frameworks and fit cleanly into your active codebase.",
    evaluationFocus: "Assesses enterprise abstractions and existing team conventions prior to implementation.",
  },
  {
    number: "02",
    title: "A strong analytical baseline",
    headline: "Rigorous cognitive aptitude testing and diagnostic reasoning.",
    description:
      "Candidates undergo rigorous cognitive and technical aptitude assessments. We test how they break down complex, incomplete problem spaces, structure logic under pressure, and reason from first principles.",
    evaluationFocus: "Validated via objective cognitive aptitude evaluations and multi-variable analytical testing.",
  },
  {
    number: "03",
    title: "Independent problem-solvers",
    headline: "End-to-end ownership without handholding or micromanagement.",
    description:
      "We seek developers who take direct ownership of their deliverables, navigate shifting constraints, and unblock cross-functional dependencies autonomously.",
    evaluationFocus: "Demonstrated through independent unblocking, clear documentation, and end-to-end delivery.",
  },
];

export const T2_TRAINING_STAGES: TrainingStage[] = [
  {
    step: "01",
    title: "Business Case Studies (HBS-Style)",
    subtitle: "Commercial & Economic Scoping",
    description:
      "Engineers work through intensive case simulations with ambiguous requirements. They diagnose commercial objectives, model operational constraints, and align architectural decisions with business goals before writing code.",
    artifactLabel: "[Training Artifact Placeholder]",
    artifactName: "Commercial Viability & Technical Scoping Brief",
  },
  {
    step: "02",
    title: "Official Anthropic Partnership",
    subtitle: "Direct Claude Methodologies",
    description:
      "Hands-on immersion with official Anthropic engineering standards: multi-document context caching, deterministic tool use, automated evals, and system prompts engineered to minimize hallucinations.",
    artifactLabel: "[Training Artifact Placeholder]",
    artifactName: "Anthropic Claude Tool-Calling & Evaluation Suite",
  },
  {
    step: "03",
    title: "Fast Sprints, Built to Scale",
    subtitle: "Production Delivery Without Debt",
    description:
      "Engineers build functional enterprise MVPs in rapid sprint cycles. They establish clean modular scaffolding, containerized deployment pipelines, and thorough test suites that scale as workloads expand.",
    artifactLabel: "[Training Artifact Placeholder]",
    artifactName: "Containerized Production Deployment & Handover Contract",
  },
];

export const T2_BUSINESS_BENEFITS: {
  intro: string;
  lead: string;
  items: BusinessBenefit[];
} = {
  intro:
    "Engineering teams rarely fail from a lack of syntax knowledge. They struggle when developers build in a vacuum, ramp slowly, or misinterpret commercial priorities.",
  lead:
    "How our preparation model directly impacts your engineering velocity and hiring outcomes:",
  items: [
    {
      number: "01",
      title: "Lower hiring risk.",
      connection: "Rooted in cognitive aptitude filtering and case-based evaluation.",
      description:
        "Traditional hiring tests memorized trivia in theoretical interviews. Our engineers arrive pre-vetted through cognitive aptitude testing and real-world case simulations, significantly reducing the probability of an expensive mis-hire.",
    },
    {
      number: "02",
      title: "Built around your goals.",
      connection: "Rooted in HBS-style business case study training.",
      description:
        "Engineers are trained to understand the commercial objective first. They evaluate unit economics, user workflows, and system constraints to deliver code that serves your bottom line, not unneeded features in isolation.",
    },
    {
      number: "03",
      title: "A faster start.",
      connection: "Rooted in direct Anthropic toolchain and modular sprint practice.",
      description:
        "Developers already trained on Claude integration, context caching, and enterprise tool use contribute meaningful commits within days rather than spending months learning modern AI paradigms on your clock.",
    },
  ],
};

export const T2_ENGAGEMENT_PATHS: {
  tracks: EngagementTrack[];
  sharedSupport: {
    title: string;
    description: string;
    features: string[];
  };
} = {
  tracks: [
    {
      trackId: "track-a",
      name: "Deploy Ready-Trained AI Talent",
      eyebrow: "TRACK A · BENCH DEPLOYMENT",
      summary:
        "Access our pre-evaluated bench of AI engineers trained on Anthropic Claude workflows, ready to integrate into your existing development teams.",
      highlights: [
        "Pre-evaluated on modern Claude architectures",
        "Immediate introduction to team sprints",
        "Engineers accustomed to autonomous production delivery",
      ],
    },
    {
      trackId: "track-b",
      name: "Custom Hire and Upskill",
      eyebrow: "TRACK B · DEDICATED PIPELINE",
      summary:
        "When your team requires specialized domain knowledge or custom stack proficiencies, we source, screen, and train engineers to your exact specifications.",
      highlights: [
        "Tailored to your stack, domain, and data architecture",
        "Custom case-study curriculum aligned with your product roadmap",
        "Dedicated recruitment and intensive upskilling program",
      ],
    },
  ],
  sharedSupport: {
    title: "Managed Hosting and Compliance",
    description:
      "Global engagement made seamless. For cross-border engagements, Ottobon manages legal compliance, payroll administration, hardware provisioning, and local compliance so you receive a single consolidated vendor invoice.",
    features: [
      "International payroll, IP assignment, and contract compliance",
      "Managed development hardware and secure environment setup",
      "Single consolidated enterprise vendor invoicing",
    ],
  },
};

export const T2_FAQS: FaqItemData[] = [
  {
    id: "faq-anthropic",
    question: "What does it mean to be an official Anthropic partner?",
    answer:
      "Ottobon maintains a formal partnership with Anthropic. Our engineers train on official Anthropic Claude methodologies, documentation, and reference architectures, focusing on prompt caching, structured tool use, and evaluation harnesses to deliver reliable production AI systems.",
    isConfirmed: true,
  },
  {
    id: "faq-adapt",
    question: "How do engineers adapt to our existing tech stack and codebase?",
    answer:
      "Our selection model specifically prioritizes systems architecture and component integration. Engineers are trained through realistic case studies to inspect existing code conventions, read architecture documentation, and build compatible modules without requiring step-by-step guidance.",
    isConfirmed: true,
  },
  {
    id: "faq-industries",
    question: "Do you work with companies across different industries?",
    answer:
      "Yes. The case-study training methodology is cross-industry by design. Engineers learn to identify core operational and commercial goals across enterprise domains including financial services, logistics, B2B SaaS, and operational data processing.",
    isConfirmed: true,
  },
  {
    id: "faq-timeline",
    question: "What is the typical timeframe to introduce an engineer?",
    answer:
      "Timing depends on whether your team deploys directly from our active bench or commissions a custom recruitment and training cycle. Discussing requirements with our team provides exact timeline availability for your specific stack.",
    isConfirmed: false,
    contentGapNote: "[Content Gap: Exact SLA timeline to be confirmed based on client recruitment schedule]",
  },
  {
    id: "faq-fit",
    question: "How is engagement fit and engineering quality evaluated?",
    answer:
      "Every engagement begins with structured milestone reviews and aligned delivery targets established during onboarding, ensuring the engineer integrates seamlessly and meets your technical standards.",
    isConfirmed: false,
    contentGapNote: "[Content Gap: Formal commercial review policies to be finalized in client master services agreement]",
  },
];

export const T2_CLOSING_CTA = {
  headline: "Find the right AI engineers for your team.",
  subheadline:
    "Tell us about your technical roadmap, upcoming AI initiatives, and the engineering capabilities your team needs to deploy.",
  primaryAction: {
    label: "Discuss Your Requirements",
    href: "mailto:hello@ottobon.com?subject=Ottobon%20Engineering%20Requirements",
  },
  secondaryAction: {
    label: "Review Talent Bench",
    href: "#t2-built",
  },
  contactEmail: "hello@ottobon.com",
};
