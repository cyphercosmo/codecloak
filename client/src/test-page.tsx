import React, { useState } from 'react';
import { runUnitTests } from './unit-tests';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function TestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  
  const logRef = React.useRef<HTMLDivElement>(null);

  // Intercept console.log and console.error to capture test output
  const handleRunTests = async () => {
    setResults([]);
    setIsDone(false);
    setIsRunning(true);
    
    const originalLog = console.log;
    const originalError = console.error;
    
    // Override console.log
    console.log = (...args) => {
      originalLog(...args);
      setResults(prev => [...prev, args.join(' ')]);
    };
    
    // Override console.error
    console.error = (...args) => {
      originalError(...args);
      setResults(prev => [...prev, `ERROR: ${args.join(' ')}`]);
    };
    
    try {
      // Execute tests
      await runUnitTests();
    } catch (err) {
      console.error('Test execution error:', err);
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      setIsDone(true);
      setIsRunning(false);
    }
  };
  
  // Auto-scroll to bottom when new logs appear
  React.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [results]);
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Steganography Unit Tests</CardTitle>
          <CardDescription>
            Comprehensive tests for browserStegCloak, codeSteg, and combined functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            className="mb-4"
          >
            {isRunning ? "Running Tests..." : "Run Unit Tests"}
          </Button>
          
          <div 
            ref={logRef}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-[500px] overflow-y-auto font-mono text-sm"
          >
            {results.map((line, index) => {
              const isPass = line.includes('✅ PASS');
              const isFail = line.includes('❌ FAIL');
              const isHeading = line.includes('-----');
              const isSuccess = line.includes('- ✓ Success');
              const isWarning = line.includes('- ⚠️ Warning');
              
              return (
                <div 
                  key={index} 
                  className={`${isPass ? 'text-green-600 dark:text-green-400' : ''} 
                              ${isFail ? 'text-red-600 dark:text-red-400 font-semibold' : ''} 
                              ${isHeading ? 'font-bold mt-2' : ''}
                              ${isSuccess ? 'text-green-600 dark:text-green-400' : ''}
                              ${isWarning ? 'text-amber-600 dark:text-amber-400' : ''}`}
                >
                  {line}
                </div>
              );
            })}
            {isRunning && results.length === 0 && (
              <div className="animate-pulse">Starting tests...</div>
            )}
            {!isRunning && !isDone && results.length === 0 && (
              <div className="text-gray-500">Test results will appear here</div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          {isDone && (
            <div className="text-sm">
              Tests completed. Check the results above for detailed output.
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}