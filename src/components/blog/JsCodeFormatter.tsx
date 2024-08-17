import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/monokai.min.css";
import React, {
  useEffect,
  useRef,
  useState,
} from "react";

hljs.registerLanguage("javascript", javascript);

interface JsCodeFormatterProps {}

const JsCodeFormatter: React.FC<JsCodeFormatterProps> = () => {
  const codeRef = useRef<HTMLElement | null>(null);
  const [html, setHtml] = useState("<p>ldkjf</p>");
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, []);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    setHtml(e.currentTarget.textContent || "");
  };

  return (
    <pre style={{ background: "#282c34" }}>
      <code
        className="javascript"
        style={{
          background: "transparent",
          fontSize: "17px",
          lineHeight: "25px",
        }}
        ref={codeRef}
        contentEditable={true}
        onInput={handleInput}
        suppressContentEditableWarning={true}
      >
        {html}
      </code>
    </pre>
  );
};

export default JsCodeFormatter;
