import React, { useState, useEffect } from 'react';
import { runTests } from './test-stegcloak';
import { runUnitTests } from './unit-tests';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TestRunner() {
  const [results, setResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [testType, setTestType] = useState<'original' | 'unit'>('unit');
  
  const logRef = React.useRef<HTMLDivElement>(null);

  // Intercept console.log and console.error to capture test output
  useEffect(() => {
    if (!isRunning) return;
    
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
    
    // Execute tests based on the selected type
    const testPromise = testType === 'original' 
      ? runTests()
      : runUnitTests();
    
    testPromise
      .then((results) => {
        setIsDone(true);
        setIsRunning(false);
        if (results && typeof results === 'object') {
          const summary = `Tests completed: ${results.passCount} passed, ${results.failCount} failed`;
          console.log(summary);
        }
      })
      .catch(err => {
        console.error('Test execution error:', err);
        setIsDone(true);
        setIsRunning(false);
      })
      .finally(() => {
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
      });
      
    return () => {
      // Cleanup - restore original console methods
      console.log = originalLog;
      console.error = originalError;
    };
  }, [isRunning, testType]);
  
  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [results]);
  
  const handleRunTests = () => {
    setResults([]);
    setIsDone(false);
    setIsRunning(true);
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Steganography Test Suite</CardTitle>
          <CardDescription>
            Tests for browserStegCloak, codeSteg, and combined functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unit" className="mb-4" onValueChange={(value) => setTestType(value as 'original' | 'unit')}>
            <TabsList className="mb-4">
              <TabsTrigger value="unit">Unit Tests</TabsTrigger>
              <TabsTrigger value="original">Basic Tests</TabsTrigger>
            </TabsList>
            
            <TabsContent value="unit">
              <p className="text-sm text-gray-500 mb-4">
                These structured unit tests help identify issues with the steganography implementation,
                focusing on error identification and edge cases.
              </p>
            </TabsContent>
            
            <TabsContent value="original">
              <p className="text-sm text-gray-500 mb-4">
                The original test suite that performs basic functionality testing of the steganography systems.
              </p>
            </TabsContent>
          </Tabs>
          
          <Button 
            onClick={handleRunTests} 
            disabled={isRunning}
            className="mb-4"
          >
            {isRunning ? "Running Tests..." : `Run ${testType === 'unit' ? 'Unit' : 'Basic'} Tests`}
          </Button>
          
          <div 
            ref={logRef}
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md h-[500px] overflow-y-auto font-mono text-sm"
          >
            {results.map((line, index) => {
              const isPass = line.includes('✅ PASS');
              const isFail = line.includes('❌ FAIL');
              const isHeading = line.includes('-----') || line.includes('====');
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