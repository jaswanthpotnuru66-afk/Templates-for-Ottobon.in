import { useState, useEffect, useRef } from "react";

const GLYPHS = "01_#*/<>[]~+=xyz";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delayMs?: number;
}

export function ScrambleText({ text, className = "", delayMs = 0 }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const maxIterations = text.length;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) return text[index];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, 28);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startScramble();
    }, delayMs);

    return () => {
      clearTimeout(timer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      className={`t2-v-bullet ${isScrambling ? "scrambling" : ""} ${className}`}
      onMouseEnter={startScramble}
      data-scrambling={isScrambling ? "true" : "false"}
    >
      {displayText}
    </div>
  );
}
