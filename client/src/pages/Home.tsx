import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
// Import the StegCloak functions and types
import { hideSecret, revealSecret } from "@/lib/stegcloak";
import { SupportedLanguage } from "@/lib/languageSteg";

export default function Home() {
  const { toast } = useToast();
  
  const [sourceCode, setSourceCode] = useState<string>("/**\n * A simple greeting function\n * @param {string} name - The name to greet\n */\nfunction greet(name) {\n  // Return a template string with the name\n  return `Hello, ${name}!`;\n}\n\n// Call the function with 'Developer'\nconsole.log(greet('Developer'));");
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [revealPassword, setRevealPassword] = useState<string>("");
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState<boolean>(true);
  const [isIntegrityEnabled, setIsIntegrityEnabled] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("auto");
  const [encodedOutput, setEncodedOutput] = useState<string>("");
  const [encodeSuccess, setEncodeSuccess] = useState<boolean>(false);
  const [revealedSecret, setRevealedSecret] = useState<string>("");
  const [revealSuccess, setRevealSuccess] = useState<boolean>(false);
  
  const handleEncode = async () => {
    if (!sourceCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter some code",
        variant: "destructive",
      });
      return;
    }
    
    if (!secretMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a secret message",
        variant: "destructive",
      });
      return;
    }
    
    if (isEncryptionEnabled && !password.trim()) {
      toast({
        title: "Error",
        description: "Password is required when encryption is enabled",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use the imported hideSecret function with language support
      const result = await hideSecret(
        sourceCode, 
        secretMessage, 
        password, 
        isEncryptionEnabled, 
        isIntegrityEnabled,
        selectedLanguage
      );
      
      setEncodedOutput(result);
      setEncodeSuccess(true);
      setRevealPassword(password); // Auto-fill the reveal password field for demo convenience
      
      const langDisplay = selectedLanguage === 'auto' 
        ? 'auto-detected language' 
        : selectedLanguage;
      
      toast({
        title: "Success",
        description: `Secret message hidden successfully using ${langDisplay} comment style`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to hide secret",
        variant: "destructive",
      });
    }
  };
  
  const handleReveal = async () => {
    if (!encodedOutput) {
      toast({
        title: "Error",
        description: "No encoded output to reveal from",
        variant: "destructive",
      });
      return;
    }
    
    if (isEncryptionEnabled && !revealPassword) {
      toast({
        title: "Error",
        description: "Password is required to reveal the secret",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Use the imported revealSecret function
      const revealed = await revealSecret(encodedOutput, revealPassword);
      setRevealedSecret(revealed);
      setRevealSuccess(true);
      toast({
        title: "Success",
        description: "Secret message revealed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reveal secret",
        variant: "destructive",
      });
      setRevealSuccess(false);
    }
  };
  
  const handleClear = () => {
    setSourceCode("/**\n * A simple greeting function\n * @param {string} name - The name to greet\n */\nfunction greet(name) {\n  // Return a template string with the name\n  return `Hello, ${name}!`;\n}\n\n// Call the function with 'Developer'\nconsole.log(greet('Developer'));");
    setSecretMessage("");
    setPassword("");
    setRevealPassword("");
    setSelectedLanguage("auto");
    setEncodedOutput("");
    setEncodeSuccess(false);
    setRevealedSecret("");
    setRevealSuccess(false);
    toast({
      title: "Cleared",
      description: "All fields have been cleared",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA]">
      <Header />
      <main className="container mx-auto p-4 flex-1 flex flex-col">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3 text-[#24292F]">Hide Secrets in Plain Code</h2>
          <p className="text-[#6E7681]">
            CodeCloak embeds your secret messages as comments in code snippets, making them blend naturally with the source code. Your secrets are encrypted and encoded in Base64, appearing as regular comments while maintaining perfect security.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 flex-1 min-h-[600px]">
          <InputPanel 
            sourceCode={sourceCode}
            setSourceCode={setSourceCode}
            secretMessage={secretMessage}
            setSecretMessage={setSecretMessage}
            password={password}
            setPassword={setPassword}
            isEncryptionEnabled={isEncryptionEnabled}
            setIsEncryptionEnabled={setIsEncryptionEnabled}
            isIntegrityEnabled={isIntegrityEnabled}
            setIsIntegrityEnabled={setIsIntegrityEnabled}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            onHideSecret={handleEncode}
            onClear={handleClear}
          />
          
          <OutputPanel 
            encodedOutput={encodedOutput}
            encodeSuccess={encodeSuccess}
            revealPassword={revealPassword}
            setRevealPassword={setRevealPassword}
            onReveal={handleReveal}
            revealedSecret={revealedSecret}
            revealSuccess={revealSuccess}
          />
        </div>
        
        <div className="text-center mb-8">
          <Link href="/how-it-works" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition-colors">
            Learn how CodeCloak works
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
