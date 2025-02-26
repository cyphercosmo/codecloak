import React, { useState } from 'react';
import { runUnitTests } from './unit-tests';
import { runVitestTests } from './vitest-tests';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [activeTab, setActiveTab] = useState("original");
  
  const logRef = React.useRef<HTMLDivElement>(null);

  // Intercept console.log and console.error to capture test output
  const handleRunTests = async (testType: "original" | "vitest") => {
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
      // Execute tests based on selected type
      if (testType === "original") {
        await runUnitTests();
      } else {
        await runVitestTests();
        // Since Vitest needs to run with a CLI, provide instructions
        setResults(prev => [...prev, 
          "⚠️ Note: For full Vitest test execution, use the command line:", 
          "./run-steg-tests.sh", 
          "Or run with UI:", 
          "./run-steg-tests.sh --ui"
        ]);
      }
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
          <Tabs defaultValue="original" onValueChange={(value) => setActiveTab(value as "original" | "vitest")}>
            <TabsList className="mb-4">
              <TabsTrigger value="original">Original Tests</TabsTrigger>
              <TabsTrigger value="vitest">Vitest Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="original">
              <Button 
                onClick={() => handleRunTests("original")} 
                disabled={isRunning}
                className="mb-4"
              >
                {isRunning && activeTab === "original" ? "Running Tests..." : "Run Original Tests"}
              </Button>
              <p className="mb-4 text-sm text-gray-500">
                These tests use our custom test framework and provide detailed diagnostic information.
              </p>
            </TabsContent>
            
            <TabsContent value="vitest">
              <Button 
                onClick={() => handleRunTests("vitest")} 
                disabled={isRunning}
                className="mb-4"
              >
                {isRunning && activeTab === "vitest" ? "Running Tests..." : "Run Vitest Tests"}
              </Button>
              <p className="mb-4 text-sm text-gray-500">
                These tests use the Vitest framework which provides better assertion and reporting capabilities.
                For full test execution, run <code>./run-steg-tests.sh</code> from the command line.
              </p>
            </TabsContent>
          </Tabs>
          
          <div 
            ref={logRef}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-[500px] overflow-y-auto font-mono text-sm"
          >
            {results.map((line, index) => {
              const isPass = line.includes('✅ PASS') || line.includes('✓');
              const isFail = line.includes('❌ FAIL') || line.includes('✗');
              const isHeading = line.includes('-----') || line.includes('====');
              const isSuccess = line.includes('- ✓ Success');
              const isWarning = line.includes('- ⚠️ Warning') || line.includes('⚠️');
              
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
              {activeTab === "vitest" && (
                <div className="mt-2 text-gray-500">
                  For a better testing experience, run <code>./run-steg-tests.sh --ui</code> from the command line.
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}