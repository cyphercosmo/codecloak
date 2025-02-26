import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCopy, FaEye, FaInfoCircle, FaPaste, FaEdit, FaCheck } from "react-icons/fa";
import CodeEditor from "@/components/CodeEditor";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OutputPanelProps {
  encodedOutput: string;
  encodeSuccess: boolean;
  revealPassword: string;
  setRevealPassword: (password: string) => void;
  onReveal: () => void;
  revealedSecret: string;
  revealSuccess: boolean;
  setEncodedOutput: (code: string) => void;
}

export default function OutputPanel({
  encodedOutput,
  encodeSuccess,
  revealPassword,
  setRevealPassword,
  onReveal,
  revealedSecret,
  revealSuccess,
  setEncodedOutput
}: OutputPanelProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tempEncodedOutput, setTempEncodedOutput] = useState(encodedOutput);
  const [activeTab, setActiveTab] = useState<string>("encoded");
  
  // Update tempEncodedOutput when encodedOutput changes
  useEffect(() => {
    setTempEncodedOutput(encodedOutput);
  }, [encodedOutput]);
  
  // Check if code might contain hidden messages
  const mightContainSecret = (code: string): boolean => {
    // Look for zero-width characters that indicate hidden content
    return code.includes('\u200B') || code.includes('\u200C') || code.includes('\u200D');
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
        setActiveTab("reveal");
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
        setActiveTab("reveal");
        toast({
          title: "Secret detected!",
          description: "Hidden message may be present in this code. Switch to 'Reveal Secret' tab to decode it.",
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
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
        </div>
      </div>
      
      <div className="p-4 bg-[#2D2D2D]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="bg-[#1E1E1E] border border-[#6E7681] border-opacity-30 mb-4">
            <TabsTrigger value="encoded" className="data-[state=active]:bg-[#3B3B3B] text-white data-[state=active]:text-[#2EA44F]">Encoded Code</TabsTrigger>
            <TabsTrigger value="reveal" className="data-[state=active]:bg-[#3B3B3B] text-white data-[state=active]:text-[#2EA44F]">Reveal Secret</TabsTrigger>
          </TabsList>
          
          <TabsContent value="encoded">
            <div className="border border-[#6E7681] border-opacity-30 rounded-md overflow-hidden">
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
              
              <CodeEditor
                value={isEditing ? tempEncodedOutput : encodedOutput || "// Your encoded result will appear here"}
                onChange={isEditing ? setTempEncodedOutput : () => {}}
                readOnly={!isEditing}
                className="bg-[#2D2D2D] text-white p-3 overflow-auto max-h-[400px] font-mono text-sm"
              />
            </div>
            
            <div className="mt-3 text-white text-sm bg-[#F0F3F6] bg-opacity-10 p-3 rounded-md">
              <p className="flex items-center"><FaInfoCircle className="text-[#2EA44F] mr-2" /> 
              Paste code containing hidden messages directly here by clicking the "Paste" button or editing manually.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="reveal">
            <div className="border border-[#6E7681] border-opacity-30 rounded-md p-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
