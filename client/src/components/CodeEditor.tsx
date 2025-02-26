import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark.css";

// Register the languages we need
hljs.registerLanguage('javascript', javascript);

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
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Apply syntax highlighting when value changes
  useEffect(() => {
    if (editorRef.current) {
      // Create line numbers
      const lines = value.split("\n");
      const lineNumbersHtml = lines.map((line, i) => 
        `<span>${line}</span>`
      ).join("\n");
      
      editorRef.current.innerHTML = `<pre class="editor-line-numbers">${lineNumbersHtml}</pre>`;
      
      // Apply syntax highlighting to all pre elements
      editorRef.current.querySelectorAll('pre').forEach(block => {
        hljs.highlightElement(block);
      });
    }
  }, [value]);
  
  // Handle editable content changes
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const content = e.currentTarget.textContent || "";
    onChange(content);
  };
  
  // Handle key events (tab, etc)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;
    
    // Handle tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Insert two spaces at cursor position
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const tabNode = document.createTextNode("  ");
        range.insertNode(tabNode);
        range.setStartAfter(tabNode);
        range.setEndAfter(tabNode);
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Update the value
        if (editorRef.current) {
          const content = editorRef.current.textContent || "";
          onChange(content);
        }
      }
    }
  };
  
  return (
    <div
      ref={editorRef}
      contentEditable={!readOnly}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      className={`${className} ${readOnly ? 'cursor-default' : 'cursor-text'}`}
      spellCheck="false"
      suppressContentEditableWarning={true}
      style={{ 
        fontFamily: "Monaco, SF Mono, Fira Code, monospace",
        tabSize: 2 
      }}
    />
  );
}

// Add CSS for line numbers
const style = document.createElement('style');
style.textContent = `
  .editor-line-numbers {
    counter-reset: line;
  }
  .editor-line-numbers span {
    counter-increment: line;
  }
  .editor-line-numbers span::before {
    content: counter(line);
    color: #6E7681;
    display: inline-block;
    width: 1.5rem;
    margin-right: 0.5rem;
    text-align: right;
    user-select: none;
  }
`;
document.head.appendChild(style);
