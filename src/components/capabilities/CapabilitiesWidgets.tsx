import { useState } from "react";

interface WidgetProps {
  theme?: "light" | "dark";
}

/**
 * Widget 1: Prompt Engineering & Claude Tool-Calling Inspector
 */
export function PromptInspectorWidget({ theme = "light" }: WidgetProps) {
  const [activeTab, setActiveTab] = useState<"schema" | "output">("output");
  const [isSimulating, setIsSimulating] = useState(false);
  const [latency, setLatency] = useState(218);

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setLatency(Math.floor(210 + Math.random() * 25));
      setIsSimulating(false);
    }, 380);
  };

  return (
    <div className={`cap-widget cap-widget--${theme}`}>
      <div className="cap-widget-head">
        <div className="cap-widget-tabs" role="tablist">
          <button
            type="button"
            className={`cap-tab-btn ${activeTab === "output" ? "active" : ""}`}
            onClick={() => setActiveTab("output")}
          >
            Structured Output
          </button>
          <button
            type="button"
            className={`cap-tab-btn ${activeTab === "schema" ? "active" : ""}`}
            onClick={() => setActiveTab("schema")}
          >
            Tool Schema
          </button>
        </div>

        <button
          type="button"
          className="cap-run-btn"
          onClick={handleSimulate}
          disabled={isSimulating}
          title="Simulate inference request"
        >
          <span className={`cap-status-dot ${isSimulating ? "pulsing" : ""}`} />
          <span>{isSimulating ? "Verifying..." : "Run Evals"}</span>
        </button>
      </div>

      <div className="cap-code-block">
        {activeTab === "output" ? (
          <pre className="cap-pre">
            <code>
              {`{
  "tool_use": "analyze_pipeline",
  "status": "deterministic_valid",
  "latency_ms": ${latency},
  "confidence_score": 0.998,
  "schema_eval": "PASS (100%)"
}`}
            </code>
          </pre>
        ) : (
          <pre className="cap-pre">
            <code>
              {`{
  "name": "analyze_pipeline",
  "description": "Deterministic enterprise parser",
  "parameters": {
    "type": "object",
    "required": ["tenant_id", "schema_ver"],
    "strict": true
  }
}`}
            </code>
          </pre>
        )}
      </div>

      <div className="cap-widget-foot">
        <span className="cap-foot-badge">Claude 3.5 Sonnet Tool Calling</span>
        <span className="cap-foot-meta">{latency}ms · 0 Hallucinations</span>
      </div>
    </div>
  );
}

/**
 * Widget 2: Large-Context Reasoning Simulator (200K+ Tokens)
 */
export function ContextSimulatorWidget({ theme = "light" }: WidgetProps) {
  const [tokenTier, setTokenTier] = useState<32 | 128 | 200>(200);

  const tierInfo = {
    32: {
      tokens: "32,400 tokens",
      label: "Quarterly SEC 10-K",
      pct: 32,
      latency: "0.82s",
      recall: "99.98%",
      docs: ["Q3_10K_Filing.pdf", "Audit_Notes.txt"],
    },
    128: {
      tokens: "128,600 tokens",
      label: "Multi-Jurisdiction Regulatory Code",
      pct: 68,
      latency: "1.34s",
      recall: "99.92%",
      docs: ["FINRA_Rulebook.pdf", "EU_AI_Act_2024.pdf", "Internal_SOP.docx"],
    },
    200: {
      tokens: "200,000+ tokens",
      label: "Enterprise Multi-Repo & Legal Corpus",
      pct: 100,
      latency: "1.85s",
      recall: "99.85%",
      docs: ["Full_Corpus_Master.pdf", "Schema_Registry.json", "Compliance_Log.csv"],
    },
  }[tokenTier];

  return (
    <div className={`cap-widget cap-widget--${theme}`}>
      <div className="cap-widget-head">
        <span className="cap-widget-label">Context Window Load</span>
        <div className="cap-segmented" role="radiogroup">
          {([32, 128, 200] as const).map((tier) => (
            <button
              key={tier}
              type="button"
              className={`cap-seg-btn ${tokenTier === tier ? "active" : ""}`}
              onClick={() => setTokenTier(tier)}
            >
              {tier === 200 ? "200K+" : `${tier}K`}
            </button>
          ))}
        </div>
      </div>

      <div className="cap-context-body">
        <div className="cap-gauge-header">
          <span className="cap-gauge-title">{tierInfo.label}</span>
          <span className="cap-gauge-value">{tierInfo.tokens}</span>
        </div>

        <div className="cap-gauge-track" aria-hidden="true">
          <div
            className="cap-gauge-fill"
            style={{ width: `${tierInfo.pct}%` }}
          />
        </div>

        <div className="cap-doc-chips">
          {tierInfo.docs.map((doc, idx) => (
            <span key={idx} className="cap-doc-chip">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="cap-chip-icon">
                <path d="M3 2h7l3 3v9H3V2z" />
                <polyline points="10 2 10 5 13 5" />
              </svg>
              {doc}
            </span>
          ))}
        </div>
      </div>

      <div className="cap-widget-foot">
        <span className="cap-foot-badge">Haystack Recall: {tierInfo.recall}</span>
        <span className="cap-foot-meta">Latency: {tierInfo.latency}</span>
      </div>
    </div>
  );
}

/**
 * Widget 3: Rapid MVP Delivery Sprint Stepper
 */
export function SprintTimelineWidget({ theme = "light" }: WidgetProps) {
  const [activeWeek, setActiveWeek] = useState<1 | 2 | 3 | 4>(2);

  const sprintSteps = {
    1: {
      week: "Week 1",
      name: "Architecture & Evals",
      deliverable: "Baseline test harness with 100+ automated edge-case evaluations.",
      milestone: "Schema contracts signed · Latency targets locked",
      badge: "Architecture Phase",
    },
    2: {
      week: "Week 2",
      name: "Core RAG & Tool Calling",
      deliverable: "Working Claude tool-calling pipeline with high-precision vector search.",
      milestone: "FastAPI endpoint live · End-to-end telemetry active",
      badge: "MVP Core Pipeline",
    },
    3: {
      week: "Week 3",
      name: "Guardrails & Stress Tests",
      deliverable: "PII masking, schema validator, and token rate limiting fully integrated.",
      milestone: "Zero security violations · Red-teaming passed",
      badge: "Security & Hardening",
    },
    4: {
      week: "Week 4",
      name: "Production Deployment",
      deliverable: "Containerized deployment to client AWS/GCP with CI/CD automation.",
      milestone: "Zero-downtime cutover · Client team onboarding complete",
      badge: "Production Ready",
    },
  }[activeWeek];

  return (
    <div className={`cap-widget cap-widget--${theme}`}>
      <div className="cap-widget-head">
        <span className="cap-widget-label">Sprint Progression</span>
        <div className="cap-segmented" role="radiogroup">
          {([1, 2, 3, 4] as const).map((w) => (
            <button
              key={w}
              type="button"
              className={`cap-seg-btn ${activeWeek === w ? "active" : ""}`}
              onClick={() => setActiveWeek(w)}
            >
              W{w}
            </button>
          ))}
        </div>
      </div>

      <div className="cap-sprint-body">
        <div className="cap-sprint-top">
          <span className="cap-sprint-phase">{sprintSteps.week} · {sprintSteps.name}</span>
          <span className="cap-sprint-badge">{sprintSteps.badge}</span>
        </div>
        <p className="cap-sprint-detail">{sprintSteps.deliverable}</p>
        <div className="cap-sprint-milestone">
          <span className="cap-milestone-icon">✓</span>
          <span className="cap-milestone-text">{sprintSteps.milestone}</span>
        </div>
      </div>

      <div className="cap-widget-foot">
        <span className="cap-foot-badge">Full Deployment SLA</span>
        <span className="cap-foot-meta">Day 30 Handover Guaranteed</span>
      </div>
    </div>
  );
}

/**
 * Widget 4: Enterprise Safety & Compliance Guardrail Demo
 */
export function GuardrailWidget({ theme = "light" }: WidgetProps) {
  const [guardrailActive, setGuardrailActive] = useState(true);

  return (
    <div className={`cap-widget cap-widget--${theme}`}>
      <div className="cap-widget-head">
        <span className="cap-widget-label">Safety Filter</span>
        <div className="cap-toggle-wrapper">
          <button
            type="button"
            className={`cap-toggle-btn ${guardrailActive ? "active" : ""}`}
            onClick={() => setGuardrailActive((prev) => !prev)}
            aria-pressed={guardrailActive}
          >
            <span className="cap-toggle-thumb" />
            <span className="cap-toggle-text">
              {guardrailActive ? "Guardrails Active" : "Bypass (Unsafe)"}
            </span>
          </button>
        </div>
      </div>

      <div className="cap-code-block">
        <pre className="cap-pre">
          <code>
            {guardrailActive
              ? `{
  "client_id": "ORG-9412",
  "pii_ssn": "[REDACTED_SSN_HASH]",
  "api_token": "[TOKEN_MASKED]",
  "injection_filter": "CLEAN",
  "soc2_compliance": "VERIFIED_PASS"
}`
              : `{
  "client_id": "ORG-9412",
  "pii_ssn": "042-88-1994",  // EXPOSED
  "api_token": "sk-ant-live-4a", // EXPOSED
  "injection_filter": "UNCHECKED",
  "soc2_compliance": "NON_COMPLIANT"
}`}
          </code>
        </pre>
      </div>

      <div className="cap-widget-foot">
        <span
          className={`cap-foot-badge ${
            guardrailActive ? "cap-foot-badge--success" : "cap-foot-badge--danger"
          }`}
        >
          {guardrailActive ? "✓ SOC-2 Type II Enforced" : "⚠️ Compliance Risk Detected"}
        </span>
        <span className="cap-foot-meta">
          {guardrailActive ? "0 Violations" : "2 Exposure Alerts"}
        </span>
      </div>
    </div>
  );
}
