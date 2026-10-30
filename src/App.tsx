import { useState, useEffect } from "react";
import { TemplateNavigator } from "./components/TemplateNavigator";
import { Template1 } from "./templates/Template1";
import { Template2 } from "./templates/Template2";
import "./styles/navigator.css";
import "./styles/targo.css";
import "./styles/capabilities-widgets.css";

export default function App() {
  const [activeTemplate, setActiveTemplate] = useState<"template-1" | "template-2">(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes("template-2")) return "template-2";
    return "template-1";
  });

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("template-2")) {
        setActiveTemplate("template-2");
      } else if (hash.includes("template-1")) {
        setActiveTemplate("template-1");
      }
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleSelectTemplate = (tpl: "template-1" | "template-2") => {
    setActiveTemplate(tpl);
    window.location.hash = `#/${tpl}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-root">
      <TemplateNavigator
        activeTemplate={activeTemplate}
        onSelectTemplate={handleSelectTemplate}
      />

      {activeTemplate === "template-1" ? <Template1 /> : <Template2 />}
    </div>
  );
}
