import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaEye, FaInfoCircle, FaPaste, FaEdit, FaCheck, FaRedo, FaLock, FaLockOpen } from "react-icons/fa";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";
import { mightContainHiddenMessage, detectLanguage } from '@/lib/codeSteg';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface OutputPanelProps {
  encodedOutput: string;
  encodeSuccess: boolean;
  revealPassword: string;
  setRevealPassword: (password: string) => void;
  onReveal: () => void;
  revealedSecret: string;
  revealSuccess: boolean;
  setEncodedOutput: (code: string) => void;
  onClear?: () => void;
}

export default function OutputPanel({
  encodedOutput,
  encodeSuccess,
  revealPassword,
  setRevealPassword,
  onReveal,
  revealedSecret,
  revealSuccess,
  setEncodedOutput,
  onClear
}: OutputPanelProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tempEncodedOutput, setTempEncodedOutput] = useState(encodedOutput);
  const [isRevealPanelOpen, setIsRevealPanelOpen] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string>("");
  const revealPasswordRef = useRef<HTMLInputElement>(null);
  
  // Update tempEncodedOutput when encodedOutput changes
  useEffect(() => {
    setTempEncodedOutput(encodedOutput);
    
    // Detect language whenever output changes
    if (encodedOutput && encodedOutput.trim()) {
      try {
        const lang = detectLanguage(encodedOutput);
        setDetectedLanguage(lang);
      } catch (err) {
        setDetectedLanguage("");
      }
    } else {
      setDetectedLanguage("");
    }
  }, [encodedOutput]);

  // When a secret is successfully revealed, open the reveal panel
  useEffect(() => {
    if (revealSuccess) {
      setIsRevealPanelOpen(true);
    }
  }, [revealSuccess]);
  
  // Check if code might contain hidden messages
  const mightContainSecret = (code: string): boolean => {
    if (!code || code.trim() === '') {
      return false;
    }
    
    try {
      // Use the imported function to check for hidden messages
      return mightContainHiddenMessage(code);
    } catch (error) {
      console.error("Error checking for hidden messages:", error);
      return false;
    }
  };
  
  const handleCopy = async () => {
    if (encodedOutput) {
      try {
        await navigator.clipboard.writeText(encodedOutput);
        toast({
          title: "Copied!",
          description: "Encoded code copied to clipboard",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard",
          variant: "destructive",
        });
      }
    }
  };
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setTempEncodedOutput(text);
      setEncodedOutput(text);
      
      // Check if the pasted text might contain a hidden message
      if (mightContainSecret(text)) {
        setIsRevealPanelOpen(true);
        toast({
          title: "Secret detected!",
          description: "Hidden message detected in the code. Enter a password to reveal it.",
        });
      } else {
        toast({
          title: "Pasted!",
          description: "Code pasted from clipboard. You can now reveal any hidden secrets.",
        });
      }
    } catch (err) {
      toast({
        title: "Failed to paste",
        description: "Could not paste from clipboard. Try editing directly.",
        variant: "destructive",
      });
    }
  };
  
  const toggleEdit = () => {
    if (isEditing) {
      // Save changes
      setEncodedOutput(tempEncodedOutput);
      
      // Check if the edited text might contain a hidden message
      if (mightContainSecret(tempEncodedOutput)) {
        setIsRevealPanelOpen(true);
        toast({
          title: "Secret detected!",
          description: "Hidden message may be present in this code. Enter password to decode it.",
        });
      } else {
        toast({
          title: "Updated!",
          description: "Code has been updated",
        });
      }
    }
    setIsEditing(!isEditing);
  };
  
  const handleRevealClick = () => {
    if (mightContainSecret(encodedOutput)) {
      setIsRevealPanelOpen(!isRevealPanelOpen);
      
      // Focus the password input when opening the reveal panel
      if (!isRevealPanelOpen) {
        setTimeout(() => {
          revealPasswordRef.current?.focus();
        }, 100);
      }
    } else if (encodedOutput && encodedOutput.trim()) {
      setIsRevealPanelOpen(!isRevealPanelOpen);
      
      if (!isRevealPanelOpen) {
        toast({
          title: "No obvious secret detected",
          description: "No hidden message detected, but you can still try to reveal a secret.",
        });
      }
    } else {
      toast({
        title: "Empty content",
        description: "Please paste or enter code that contains a hidden message first.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="bg-[#2D2D2D] rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#2D2D2D] text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Output</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={handlePaste}
            title="Paste code from clipboard"
          >
            <FaPaste className="mr-1" /> Paste
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={toggleEdit}
            title={isEditing ? "Save changes" : "Edit code directly"}
          >
            {isEditing ? <FaCheck className="mr-1" /> : <FaEdit className="mr-1" />} {isEditing ? "Save" : "Edit"}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={handleCopy}
            title="Copy code to clipboard"
          >
            <FaCopy className="mr-1" /> Copy
          </Button>
          {onClear && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
              onClick={onClear}
              title="Clear output and start over"
            >
              <FaRedo className="mr-1" /> Reset
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4 bg-[#2D2D2D]">
        <div className="border border-[#6E7681] border-opacity-30 rounded-md overflow-hidden mb-3">
          {/* Success notification */}
          {encodeSuccess && !isEditing && (
            <div className="bg-[#F0F3F6] bg-opacity-10 p-3 text-white text-sm">
              <div className="flex items-start">
                <FaInfoCircle className="text-[#2EA44F] mt-1 mr-2" />
                <div>
                  <p>Secret successfully hidden in the code.</p>
                  <p className="mt-1 text-[#6E7681]">The code below contains your hidden message but looks and works exactly like the original.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Language detection and hidden message indicator */}
          {detectedLanguage && !isEditing && (
            <div className="bg-[#1E1E1E] border-b border-[#6E7681] border-opacity-30 py-1 px-3 text-xs flex items-center justify-between">
              <span className="text-[#6E7681]">Detected Language: <span className="text-[#2EA44F] font-medium">{detectedLanguage}</span></span>
              
              {mightContainSecret(encodedOutput) && (
                <div className="flex items-center">
                  <span className="text-amber-400 text-xs mr-2">
                    • May contain hidden message
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 py-0 text-xs bg-amber-400 bg-opacity-20 hover:bg-opacity-30 border-amber-400 border-opacity-30 text-amber-400"
                    onClick={handleRevealClick}
                  >
                    <FaLock className="mr-1 h-3 w-3" /> Reveal
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Code editor */}
          <CodeEditor
            value={isEditing ? tempEncodedOutput : encodedOutput || "// Your encoded result will appear here"}
            onChange={isEditing ? setTempEncodedOutput : () => {}}
            readOnly={!isEditing}
            className="bg-[#2D2D2D] text-white p-3 overflow-auto max-h-[400px] font-mono text-sm"
          />
        </div>
        
        {/* Reveal panel (collapsible) */}
        {(isRevealPanelOpen || revealSuccess) && (
          <div className="border border-[#6E7681] border-opacity-30 rounded-md p-4 bg-[#1E1E1E] mt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-white text-sm font-medium">Reveal Secret</h4>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 py-0 text-xs text-[#6E7681] hover:text-white hover:bg-[#3B3B3B]"
                onClick={() => setIsRevealPanelOpen(false)}
              >
                Hide
              </Button>
            </div>
            
            {mightContainSecret(encodedOutput) ? (
              <div className="mb-3 bg-amber-400 bg-opacity-10 border border-amber-400 border-opacity-20 p-2 rounded-md">
                <p className="text-amber-400 text-xs flex items-center">
                  <FaInfoCircle className="mr-2" /> This code appears to contain a hidden secret.
                </p>
              </div>
            ) : encodedOutput ? (
              <div className="mb-3 bg-[#6E7681] bg-opacity-10 border border-[#6E7681] border-opacity-20 p-2 rounded-md">
                <p className="text-[#6E7681] text-xs flex items-center">
                  <FaInfoCircle className="mr-2" /> No obvious hidden message detected, but you can still try to reveal a secret.
                </p>
              </div>
            ) : null}
            
            <div className="space-y-4">
              {!revealSuccess && (
                <>
                  <div>
                    <Label htmlFor="reveal-password" className="block text-white mb-1 text-sm">Password</Label>
                    <div className="flex space-x-2">
                      <Input 
                        id="reveal-password" 
                        type="password" 
                        placeholder="Enter password to reveal the secret" 
                        value={revealPassword}
                        onChange={(e) => setRevealPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#2D2D2D] border border-[#6E7681] border-opacity-30 rounded-md text-white placeholder-[#6E7681] placeholder-opacity-70"
                        ref={revealPasswordRef}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') onReveal();
                        }}
                      />
                      <Button 
                        className="bg-[#2EA44F] hover:bg-opacity-80 text-white font-medium"
                        onClick={onReveal}
                      >
                        <FaEye className="mr-2" /> Reveal
                      </Button>
                    </div>
                    <p className="text-xs text-[#6E7681] mt-1">
                      Make sure the password matches the one used to hide the secret
                    </p>
                  </div>
                </>
              )}
              
              {revealSuccess && (
                <div className="p-3 bg-[#2EA44F] bg-opacity-10 border border-[#2EA44F] border-opacity-20 rounded-md">
                  <h5 className="text-white text-sm font-medium mb-1">Revealed Secret:</h5>
                  <p className="text-[#2EA44F] font-mono break-words">{revealedSecret}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Reveal secret button and help text (only show if panel is not open) */}
        {!isRevealPanelOpen && !revealSuccess && (
          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-[#6E7681]">
              <FaInfoCircle className="inline mr-1" /> 
              Paste code containing hidden messages to decode them
            </p>
            <Button
              variant="outline"
              size="sm"
              className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
              onClick={handleRevealClick}
              disabled={!encodedOutput}
            >
              <FaLockOpen className="mr-1" /> Reveal Secret
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
