import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FaInfoCircle } from "react-icons/fa";
// Import the StegCloak functions
import { hideSecret, revealSecret } from "@/lib/stegcloak";

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
      // Use the imported hideSecret function
      const result = await hideSecret(sourceCode, secretMessage, password, isEncryptionEnabled, isIntegrityEnabled);
      setEncodedOutput(result);
      setEncodeSuccess(true);
      setRevealPassword(password); // Auto-fill the reveal password field for demo convenience
      toast({
        title: "Success",
        description: "Secret message hidden successfully in code comments",
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
    // Reset any previous reveal state
    setRevealSuccess(false);
    setRevealedSecret("");
    
    if (!encodedOutput) {
      toast({
        title: "Empty Content",
        description: "Please paste or enter code that contains a hidden message",
        variant: "destructive",
      });
      return;
    }
    
    if (!revealPassword) {
      toast({
        title: "Password Required",
        description: "Please enter the password used to hide the secret",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Show a processing toast
      const processingToast = toast({
        title: "Processing",
        description: "Attempting to reveal secret...",
        duration: 5000,
      });
      
      // Use the imported revealSecret function
      const revealed = await revealSecret(encodedOutput, revealPassword);
      
      if (!revealed || revealed.trim() === '') {
        throw new Error("No hidden message found or password is incorrect");
      }
      
      // Set revealed secret and success state
      setRevealedSecret(revealed);
      setRevealSuccess(true);
      
      toast({
        title: "Success!",
        description: "Secret message revealed successfully",
      });
    } catch (error) {
      console.error("Error revealing secret:", error);
      
      let errorMessage = "Failed to reveal any secret message";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      // Provide a friendly error message based on specific errors
      if (errorMessage.includes("No zero-width characters found")) {
        errorMessage = "No hidden message found using zero-width characters. Try a different password or text.";
      } else if (errorMessage.includes("No comments found")) {
        errorMessage = "No code comments found that might contain a hidden message.";
      } else if (errorMessage.includes("binary data")) {
        errorMessage = "Found potential hidden data but couldn't decode it. The password might be incorrect.";
      } else if (errorMessage.includes("Password")) {
        errorMessage = "Password appears to be incorrect for the hidden message.";
      }
      
      toast({
        title: "Could Not Reveal Secret",
        description: errorMessage,
        variant: "destructive",
        duration: 7000,
      });
    }
  };
  
  const handleClear = () => {
    // Reset to starter code instead of just a comment
    setSourceCode("// Enter your code here\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('Developer'));");
    setSecretMessage("");
    setPassword("");
    setRevealPassword("");
    setEncodedOutput("");
    setEncodeSuccess(false);
    setRevealedSecret("");
    setRevealSuccess(false);
    
    // Using a better toast message
    toast({
      title: "Reset Complete",
      description: "All inputs and outputs have been cleared. You can start fresh.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA]">
      <Header />
      <main className="container mx-auto p-4 flex-1">
        <div className="mb-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-3 text-[#24292F]">Hide Secrets in Plain Code</h2>
          <p className="text-[#6E7681]">
            CodeCloak embeds your secret messages into code snippets by disguising them as legitimate code comments. It transforms your secrets into what appears to be standard code documentation, version numbers, or developer notes, without affecting the code's functionality.
          </p>
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
            <p>
              <strong>Note:</strong> Your secrets are hidden within comments that look like normal parts of the code. For best results, use code that already contains comments, or we'll add believable comments to contain your hidden message.
            </p>
          </div>
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
            setEncodedOutput={setEncodedOutput}
            onClear={handleClear}
          />
        </div>
        
        <div className="mb-8 bg-white rounded-lg shadow-md p-4 text-[#24292F]">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Enter or paste your code in the editor (make sure it includes comments)</li>
            <li>Type your secret message</li>
            <li>Enter a password if you want encryption (strongly recommended)</li>
            <li>Click "Hide Secret in Code" button</li>
            <li>Copy the resulting code to share it via chat apps, forums, or documentation</li>
            <li>To reveal a secret from code, either click the "Paste" button in the Output panel or use the "Edit" button to manually input code, enter the password, and click "Reveal Secret"</li>
          </ol>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="font-semibold mb-2">Best Practices:</h4>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Always use a strong password to secure your hidden messages</li>
              <li>Use code that already has comments for more natural-looking results</li>
              <li>Test the revealed message works before sharing important information</li>
              <li>The application automatically embeds your secret in legitimate-looking comments</li>
              <li>Secrets are hidden in a way that will not affect the code's execution or syntax</li>
            </ul>
          </div>
        </div>
        
        <InfoSection />
      </main>
      <Footer />
    </div>
  );
}
