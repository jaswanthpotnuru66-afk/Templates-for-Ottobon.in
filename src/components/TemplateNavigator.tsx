import type { FC } from "react";

interface TemplateNavigatorProps {
  activeTemplate: "template-1" | "template-2";
  onSelectTemplate: (template: "template-1" | "template-2") => void;
}

export const TemplateNavigator: FC<TemplateNavigatorProps> = ({
  activeTemplate,
  onSelectTemplate,
}) => {
  return (
    <aside className="tpl-nav-root" aria-label="Template switcher">
      <div className="tpl-nav-bar">
        <div className="tpl-nav-brand">
          <span className="tpl-nav-dot" />
          <span className="tpl-nav-label">OTTOBON DESIGN CANDIDATES</span>
        </div>

        <div className="tpl-nav-switch" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTemplate === "template-1"}
            className={`tpl-nav-btn ${activeTemplate === "template-1" ? "active" : ""}`}
            onClick={() => onSelectTemplate("template-1")}
          >
            <span className="tpl-nav-pill-num">01</span>
            <span>Template 1 · Targo Editorial</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTemplate === "template-2"}
            className={`tpl-nav-btn ${activeTemplate === "template-2" ? "active" : ""}`}
            onClick={() => onSelectTemplate("template-2")}
          >
            <span className="tpl-nav-pill-num">02</span>
            <span>Template 2 · Enterprise Obsidian</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
