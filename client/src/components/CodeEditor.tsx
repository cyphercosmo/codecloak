import { useEffect, useRef } from "react";
import "highlight.js/styles/github-dark.css";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  value, 
  onChange, 
  className = "", 
  readOnly = false 
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle tab key in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (readOnly) return;
    
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert 2 spaces at cursor position
      const newValue = value.substring(0, start) + "  " + value.substring(end);
      onChange(newValue);
      
      // Put cursor after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2;
          textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };
  
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className={`${className} w-full resize-none`}
      readOnly={readOnly}
      spellCheck={false}
      style={{ 
        fontFamily: "Monaco, SF Mono, Fira Code, monospace",
        minHeight: "200px",
        height: "100%",
        backgroundColor: "#2D2D2D", 
        color: "white",
        outline: "none"
      }}
    />
  );
}
