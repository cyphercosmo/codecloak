import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaEye, FaInfoCircle } from "react-icons/fa";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";

interface OutputPanelProps {
  encodedOutput: string;
  encodeSuccess: boolean;
  revealPassword: string;
  setRevealPassword: (password: string) => void;
  onReveal: () => void;
  revealedSecret: string;
  revealSuccess: boolean;
}

export default function OutputPanel({
  encodedOutput,
  encodeSuccess,
  revealPassword,
  setRevealPassword,
  onReveal,
  revealedSecret,
  revealSuccess
}: OutputPanelProps) {
  const { toast } = useToast();
  
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
  
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="bg-[#2D2D2D] text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Output</h3>
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={handleCopy}
          >
            <FaCopy className="mr-1" /> Copy
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-[#2D2D2D] flex-1 flex flex-col overflow-auto gap-4">
        <div className="border border-[#6E7681] border-opacity-30 rounded-md h-[300px] min-h-[300px] flex flex-col">
          {encodeSuccess && (
            <div className="bg-[#F0F3F6] bg-opacity-10 p-3 text-white text-sm">
              <div className="flex items-start">
                <FaInfoCircle className="text-[#2EA44F] mt-1 mr-2" />
                <div>
                  <p>Secret successfully hidden in the code as a comment.</p>
                  <p className="mt-1 text-[#6E7681]">The code below contains your hidden message in a Base64-encoded comment that looks like normal developer documentation.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex-1 overflow-auto">
            <CodeEditor
              value={encodedOutput || "// Your encoded result will appear here"}
              onChange={() => {}}
              readOnly={true}
              className="bg-[#2D2D2D] text-white p-3 font-mono text-sm h-full"
            />
          </div>
        </div>
        
        <div className="border border-[#6E7681] border-opacity-30 rounded-md p-4 mt-auto">
          <h4 className="text-white text-sm font-medium mb-3">Reveal Secret</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reveal-password" className="block text-white mb-1 text-sm">Password</Label>
              <Input 
                id="reveal-password" 
                type="password" 
                placeholder="Enter password to reveal the secret" 
                value={revealPassword}
                onChange={(e) => setRevealPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#6E7681] border-opacity-30 rounded-md text-white placeholder-[#6E7681] placeholder-opacity-70"
              />
            </div>
            
            <Button 
              className="w-full bg-[#6E7681] hover:bg-opacity-80 text-white font-medium"
              onClick={onReveal}
            >
              <FaEye className="mr-2" /> Reveal Secret
            </Button>
            
            {revealSuccess && (
              <div className="mt-4 p-3 bg-[#F0F3F6] bg-opacity-10 rounded-md">
                <h5 className="text-white text-sm font-medium mb-1">Revealed Secret:</h5>
                <p className="text-[#2EA44F] font-mono">{revealedSecret}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
