import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const { toast } = useToast();
  
  const [sourceCode, setSourceCode] = useState<string>("// Enter your code here\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Developer'));");
  const [secretMessage, setSecretMessage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [revealPassword, setRevealPassword] = useState<string>("");
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState<boolean>(true);
  const [isIntegrityEnabled, setIsIntegrityEnabled] = useState<boolean>(false);
  const [encodedOutput, setEncodedOutput] = useState<string>("");
  const [encodeSuccess, setEncodeSuccess] = useState<boolean>(false);
  const [revealedSecret, setRevealedSecret] = useState<string>("");
  const [revealSuccess, setRevealSuccess] = useState<boolean>(false);
  
  const handleEncode = () => {
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
    
    // This would call the stegcloak library for actual encoding
    try {
      // Import is done dynamically to avoid server-side issues
      import("@/lib/stegcloak").then(({ hideSecret }) => {
        const result = hideSecret(sourceCode, secretMessage, password, isEncryptionEnabled, isIntegrityEnabled);
        setEncodedOutput(result);
        setEncodeSuccess(true);
        toast({
          title: "Success",
          description: "Secret message hidden successfully",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to hide secret",
        variant: "destructive",
      });
    }
  };
  
  const handleReveal = () => {
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
      // Import is done dynamically to avoid server-side issues
      import("@/lib/stegcloak").then(({ revealSecret }) => {
        const revealed = revealSecret(encodedOutput, revealPassword);
        setRevealedSecret(revealed);
        setRevealSuccess(true);
        toast({
          title: "Success",
          description: "Secret message revealed",
        });
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
    setSourceCode("// Enter your code here");
    setSecretMessage("");
    setPassword("");
    setRevealPassword("");
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
      <main className="container mx-auto p-4 flex-1">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3 text-[#24292F]">Hide Secrets in Plain Code</h2>
          <p className="text-[#6E7681]">
            CodeCloak embeds your secret messages into code snippets using invisible unicode characters, without affecting the code's functionality or appearance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
        
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}
