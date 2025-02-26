import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaMagic, FaCode, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import CodeEditor from "@/components/CodeEditor";
import { loadSample } from "@/lib/samples";

interface InputPanelProps {
  sourceCode: string;
  setSourceCode: (code: string) => void;
  secretMessage: string;
  setSecretMessage: (message: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isEncryptionEnabled: boolean;
  setIsEncryptionEnabled: (enabled: boolean) => void;
  isIntegrityEnabled: boolean;
  setIsIntegrityEnabled: (enabled: boolean) => void;
  onHideSecret: () => void;
  onClear: () => void;
}

export default function InputPanel({
  sourceCode,
  setSourceCode,
  secretMessage,
  setSecretMessage,
  password,
  setPassword,
  isEncryptionEnabled,
  setIsEncryptionEnabled,
  isIntegrityEnabled,
  setIsIntegrityEnabled,
  onHideSecret,
  onClear
}: InputPanelProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleLoadSample = () => {
    setSourceCode(loadSample());
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="bg-[#2D2D2D] text-white px-4 py-3 flex justify-between items-center">
        <h3 className="font-medium">Input</h3>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={handleLoadSample}
          >
            <FaCode className="mr-1" /> Load Sample
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
            onClick={onClear}
          >
            <FaTrashAlt className="mr-1" /> Clear
          </Button>
        </div>
      </div>
      
      <div className="p-4 bg-[#2D2D2D] flex-1 flex flex-col overflow-auto">
        <div className="border border-[#6E7681] border-opacity-30 rounded-md mb-4 flex-1">
          <CodeEditor
            value={sourceCode}
            onChange={setSourceCode}
            className="bg-[#2D2D2D] text-white p-3 font-mono text-sm"
          />
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="secret-message" className="block text-white mb-1 text-sm">Secret Message</Label>
            <Input 
              id="secret-message" 
              placeholder="Enter your secret message here" 
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#6E7681] border-opacity-30 rounded-md text-white placeholder-[#6E7681] placeholder-opacity-70"
            />
          </div>
          
          <div>
            <Label htmlFor="password" className="block text-white mb-1 text-sm">Password (optional)</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={isPasswordVisible ? "text" : "password"} 
                placeholder="Enter password to encrypt your secret" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-[#1E1E1E] border border-[#6E7681] border-opacity-30 rounded-md text-white placeholder-[#6E7681] placeholder-opacity-70"
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6E7681]"
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-white rounded flex items-center justify-center">
                <input 
                  type="checkbox" 
                  id="enable-encryption"
                  checked={isEncryptionEnabled}
                  onChange={(e) => setIsEncryptionEnabled(e.target.checked)}
                  className="h-3 w-3"
                />
              </div>
              <Label htmlFor="enable-encryption" className="text-white text-sm">Enable Encryption</Label>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 bg-white rounded flex items-center justify-center">
                <input 
                  type="checkbox" 
                  id="enable-integrity"
                  checked={isIntegrityEnabled}
                  onChange={(e) => setIsIntegrityEnabled(e.target.checked)}
                  className="h-3 w-3"
                />
              </div>
              <Label htmlFor="enable-integrity" className="text-white text-sm">Enable HMAC Integrity</Label>
            </div>
          </div>
          
          <Button 
            className="w-full bg-[#2EA44F] hover:bg-opacity-80 text-white font-medium"
            onClick={onHideSecret}
          >
            <FaMagic className="mr-2" /> Hide Secret in Code
          </Button>
        </div>
      </div>
    </div>
  );
}
