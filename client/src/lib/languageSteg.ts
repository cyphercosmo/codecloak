/**
 * This module extends the comment-based steganography technique
 * to support multiple programming languages with their appropriate
 * comment styles and syntax.
 */

// Define supported languages and their comment styles
export type SupportedLanguage = 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'java' 
  | 'csharp'
  | 'html'
  | 'css'
  | 'php'
  | 'ruby'
  | 'go'
  | 'rust'
  | 'swift'
  | 'kotlin'
  | 'c'
  | 'cpp'
  | 'shell'
  | 'powershell'
  | 'auto'; // Auto-detect

// Language comment patterns
interface CommentPattern {
  singleLine: string;
  multiLineStart?: string;
  multiLineEnd?: string;
  identifier: string;
  fileExtension: string[];
  todoFormat: (payload: string) => string;
}

/**
 * Comment patterns for different programming languages
 */
export const LANGUAGE_PATTERNS: Record<Exclude<SupportedLanguage, 'auto'>, CommentPattern> = {
  javascript: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'js',
    fileExtension: ['.js', '.jsx', '.ts', '.tsx'],
    todoFormat: (payload) => `// TODO: Rework this hot mess - see commit ${payload} for context.`
  },
  typescript: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'ts',
    fileExtension: ['.ts', '.tsx'],
    todoFormat: (payload) => `// TODO: Rework this hot mess - see commit ${payload} for context.`
  },
  python: {
    singleLine: '#',
    multiLineStart: '"""',
    multiLineEnd: '"""',
    identifier: 'py',
    fileExtension: ['.py'],
    todoFormat: (payload) => `# TODO: Refactor this implementation - reference ticket ${payload} for details.`
  },
  java: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'java',
    fileExtension: ['.java'],
    todoFormat: (payload) => `// TODO: Technical debt - see issue ${payload} for cleanup plans.`
  },
  csharp: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'cs',
    fileExtension: ['.cs'],
    todoFormat: (payload) => `// TODO: Needs refactoring - see workitem ${payload} for details.`
  },
  html: {
    singleLine: '',
    multiLineStart: '<!--',
    multiLineEnd: '-->',
    identifier: 'html',
    fileExtension: ['.html', '.htm'],
    todoFormat: (payload) => `<!-- TODO: Update markup structure - see design ${payload} for reference -->`
  },
  css: {
    singleLine: '',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'css',
    fileExtension: ['.css', '.scss', '.less'],
    todoFormat: (payload) => `/* TODO: Improve stylesheet organization - see style guide ${payload} */`
  },
  php: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'php',
    fileExtension: ['.php'],
    todoFormat: (payload) => `// TODO: Legacy code warning - needs update per ${payload} standards.`
  },
  ruby: {
    singleLine: '#',
    multiLineStart: '=begin',
    multiLineEnd: '=end',
    identifier: 'rb',
    fileExtension: ['.rb'],
    todoFormat: (payload) => `# TODO: Simplify this logic - reference ticket ${payload} for context.`
  },
  go: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'go',
    fileExtension: ['.go'],
    todoFormat: (payload) => `// TODO: Improve error handling - see PR ${payload} for examples.`
  },
  rust: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'rs',
    fileExtension: ['.rs'],
    todoFormat: (payload) => `// TODO: Performance bottleneck - see benchmark ${payload} for metrics.`
  },
  swift: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'swift',
    fileExtension: ['.swift'],
    todoFormat: (payload) => `// TODO: Consider more swifty approach - see example ${payload} for ideas.`
  },
  kotlin: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'kt',
    fileExtension: ['.kt'],
    todoFormat: (payload) => `// TODO: Kotlin idiomatic rewrite needed - see ${payload} for patterns.`
  },
  c: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'c',
    fileExtension: ['.c', '.h'],
    todoFormat: (payload) => `// TODO: Memory management review - see audit ${payload} for recommendations.`
  },
  cpp: {
    singleLine: '//',
    multiLineStart: '/*',
    multiLineEnd: '*/',
    identifier: 'cpp',
    fileExtension: ['.cpp', '.hpp', '.cc', '.hh'],
    todoFormat: (payload) => `// TODO: Consider STL alternative - see discussion ${payload} for rationale.`
  },
  shell: {
    singleLine: '#',
    identifier: 'sh',
    fileExtension: ['.sh', '.bash'],
    todoFormat: (payload) => `# TODO: Script cleanup needed - reference thread ${payload} for best practices.`
  },
  powershell: {
    singleLine: '#',
    multiLineStart: '<#',
    multiLineEnd: '#>',
    identifier: 'ps1',
    fileExtension: ['.ps1', '.psm1'],
    todoFormat: (payload) => `# TODO: Make more PowerShell-friendly - see example ${payload} for guidance.`
  }
};

/**
 * Try to detect the programming language from source code content
 * @param sourceCode The source code to analyze
 * @returns Detected language or 'javascript' as fallback
 */
export function detectLanguage(sourceCode: string): SupportedLanguage {
  // Look for language-specific patterns (simplified detection logic)
  if (!sourceCode || typeof sourceCode !== 'string') {
    return 'javascript'; // Default fallback
  }
  
  // Check for shebang patterns (common in scripts)
  if (sourceCode.startsWith('#!/usr/bin/env python') || 
      sourceCode.match(/^from\s+[\w.]+\s+import\s+|^import\s+[\w.]+/) ||
      sourceCode.match(/def\s+\w+\s*\(.*\):\s*$/m)) {
    return 'python';
  }
  
  if (sourceCode.startsWith('#!/bin/bash') || 
      sourceCode.match(/^\s*function\s+\w+\s*\(\s*\)\s*{/m)) {
    return 'shell';
  }
  
  // HTML detection
  if (sourceCode.match(/<html|<!DOCTYPE html|<body|<head|<div/i)) {
    return 'html';
  }
  
  // CSS detection
  if (sourceCode.match(/body\s*{|@media|@keyframes|margin:|padding:|color:/)) {
    return 'css';
  }
  
  // PHP detection
  if (sourceCode.match(/<\?php/)) {
    return 'php';
  }
  
  // Java/C# detection (more specific than JavaScript)
  if (sourceCode.match(/public\s+class\s+\w+|private\s+\w+\s+\w+\s*\(.*\)\s*{/)) {
    // Further distinguish Java vs C#
    if (sourceCode.match(/namespace\s+\w+|using\s+System;/)) {
      return 'csharp';
    }
    return 'java';
  }
  
  // Ruby detection
  if (sourceCode.match(/require\s+(['"])[\w\/]+\1|def\s+\w+(\(.+\))?\s+end|class\s+\w+\s+<\s+\w+/)) {
    return 'ruby';
  }

  // Go detection
  if (sourceCode.match(/package\s+\w+|import\s+\(\s*"[\w\/]+"|\)\s*func\s+\w+\(/)) {
    return 'go';
  }
  
  // Rust detection
  if (sourceCode.match(/fn\s+\w+\s*\(.*\)\s*(\->\s*\w+)?\s*{|let\s+mut\s+\w+\s*:/)) {
    return 'rust';
  }
  
  // Swift detection
  if (sourceCode.match(/import\s+Foundation|var\s+\w+\s*:\s*\w+|func\s+\w+\s*\(.*\)\s*\->\s*\w+/)) {
    return 'swift';
  }

  // Kotlin detection
  if (sourceCode.match(/fun\s+\w+\s*\(.*\)(\s*:\s*\w+)?\s*{|val\s+\w+\s*:\s*\w+/)) {
    return 'kotlin';
  }
  
  // C/C++ detection
  if (sourceCode.match(/#include\s*<\w+\.h>|int\s+main\s*\(\s*\)|std::|void\s+\w+\s*\(/)) {
    if (sourceCode.match(/std::|template\s*<|class\s+\w+\s*{/)) {
      return 'cpp';
    }
    return 'c';
  }
  
  // TypeScript detection (check after other C-like languages)
  if (sourceCode.match(/interface\s+\w+|type\s+\w+\s*=|<\w+>\s*|:\s*\w+\[\]/)) {
    return 'typescript';
  }

  // PowerShell detection
  if (sourceCode.match(/\$\w+\s*=|\$PSScriptRoot|Get-\w+|Write-\w+/)) {
    return 'powershell';
  }
  
  // Default to JavaScript if no specific pattern is detected
  // Most common language and compatible with TypeScript
  return 'javascript';
}

/**
 * Get the appropriate comment pattern for a specific language
 * @param language The language to get the pattern for
 * @returns The comment pattern for the specified language
 */
export function getCommentPattern(language: SupportedLanguage): CommentPattern {
  if (language === 'auto') {
    return LANGUAGE_PATTERNS.javascript; // Default to JavaScript if auto
  }
  
  return LANGUAGE_PATTERNS[language];
}

/**
 * Hide a message with the appropriate comment style for the detected language
 * @param sourceCode Source code to hide the message in
 * @param payload Encoded payload to hide
 * @param language Language to use for comment style (or auto-detect)
 * @param randomPlacement Whether to place the comment randomly in the code
 * @returns Source code with hidden message in appropriate comment style
 */
export function hideWithLanguageComment(
  sourceCode: string,
  payload: string,
  language: SupportedLanguage = 'auto',
  randomPlacement: boolean = false
): string {
  // Detect language if set to auto
  const detectedLanguage = language === 'auto' ? detectLanguage(sourceCode) : language;
  console.log(`Using language: ${detectedLanguage} for comment generation`);
  
  // Get the appropriate comment pattern
  const pattern = getCommentPattern(detectedLanguage);
  
  // Generate the comment with the language-specific format
  const commentLine = pattern.todoFormat(payload);
  
  if (randomPlacement && sourceCode.trim()) {
    // If random placement is enabled, insert the comment at a random location
    const lines = sourceCode.split('\n');
    if (lines.length <= 1) {
      // If only one line, just prepend
      return commentLine + '\n\n' + sourceCode;
    }
    
    // Insert at a random position, but avoid first and last line for better disguise
    const randomPosition = Math.floor(Math.random() * (lines.length - 2)) + 1;
    lines.splice(randomPosition, 0, commentLine);
    return lines.join('\n');
  } else {
    // By default, prepend the comment to the source code
    return commentLine + '\n\n' + sourceCode;
  }
}

/**
 * Build regex patterns to match comments in different languages
 * @param sourceCode The source code to analyze
 * @returns An object with regex patterns for different comment styles
 */
export function buildCommentPatterns(sourceCode: string): Record<string, RegExp> {
  const detectedLanguage = detectLanguage(sourceCode);
  console.log(`Detected language for comment pattern: ${detectedLanguage}`);
  
  const patterns: Record<string, RegExp> = {};
  
  // Add all languages to try different patterns
  // This is useful if language detection fails
  Object.entries(LANGUAGE_PATTERNS).forEach(([lang, pattern]) => {
    // Create patterns for single line comments
    if (pattern.singleLine) {
      const todoPattern = pattern.todoFormat('([A-Za-z0-9+/=]+)')
        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') // Escape regex special chars
        .replace('([A-Za-z0-9+/=]+)', '([A-Za-z0-9+/=]+)'); // Keep the capture group
      
      patterns[`${lang}_todo`] = new RegExp(todoPattern);
      
      // Also add a generic pattern for this comment style
      patterns[`${lang}_generic`] = new RegExp(
        `${pattern.singleLine.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')}\\s*([A-Za-z0-9+/=]+)`
      );
    }
    
    // Create patterns for multi-line comments
    if (pattern.multiLineStart && pattern.multiLineEnd) {
      patterns[`${lang}_multiline`] = new RegExp(
        `${pattern.multiLineStart.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')}\\s*([A-Za-z0-9+/=]+)\\s*${pattern.multiLineEnd.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')}`
      );
    }
  });
  
  // Prioritize the detected language's patterns
  return {
    // Put the detected language patterns first
    ...Object.fromEntries(
      Object.entries(patterns).filter(([key]) => key.startsWith(detectedLanguage))
    ),
    // Then include all other patterns
    ...patterns
  };
}

/**
 * Reveal a hidden message by checking for comments in various languages
 * @param sourceCode Source code that may contain a hidden message
 * @returns The extracted payload from the comment
 */
export function extractPayloadFromComment(sourceCode: string): string | null {
  const commentPatterns = buildCommentPatterns(sourceCode);
  
  // Try each pattern to find a match
  for (const [patternName, pattern] of Object.entries(commentPatterns)) {
    const match = sourceCode.match(pattern);
    if (match && match[1]) {
      console.log(`Found comment match using pattern: ${patternName}`);
      return match[1];
    }
  }
  
  // No pattern matched
  console.log('No comment patterns matched');
  return null;
}