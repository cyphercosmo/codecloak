import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FaMagic, FaCode, FaTrashAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import CodeEditor from "@/components/CodeEditor";
import { loadSample, additionalSamples } from "@/lib/samples";
import { detectLanguage } from "@/lib/codeSteg";

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
  const [detectedLanguage, setDetectedLanguage] = useState('javascript');
  const [showSamplesDropdown, setShowSamplesDropdown] = useState(false);
  
  // Reference for the samples dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Detect the language whenever the source code changes
  useEffect(() => {
    if (sourceCode) {
      const language = detectLanguage(sourceCode);
      setDetectedLanguage(language);
    }
  }, [sourceCode]);
  
  // Add click outside handler for the samples dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSamplesDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  const handleLoadSample = () => {
    setSourceCode(loadSample());
  };
  
  const handleLoadAdditionalSample = (sample: any) => {
    setSourceCode(sample.code);
    setShowSamplesDropdown(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-[#2D2D2D] text-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <h3 className="font-medium">Input</h3>
          {detectedLanguage && (
            <Badge variant="outline" className="text-xs bg-[#6E7681] bg-opacity-20 border-none text-[#E6E6E6]">
              {detectedLanguage.charAt(0).toUpperCase() + detectedLanguage.slice(1)}
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-[#6E7681] bg-opacity-30 hover:bg-opacity-50 border-none text-white"
              onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
            >
              <FaCode className="mr-1" /> Samples
            </Button>
            {showSamplesDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute z-10 right-0 mt-1 w-56 bg-[#1E1E1E] rounded-md shadow-lg overflow-hidden"
              >
                <div className="py-1 max-h-48 overflow-y-auto">
                  {additionalSamples.map((sample, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2D2D2D]"
                      onClick={() => handleLoadAdditionalSample(sample)}
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
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
      
      <div className="p-4 bg-[#2D2D2D]">
        <div className="border border-[#6E7681] border-opacity-30 rounded-md mb-4 overflow-hidden">
          <CodeEditor
            value={sourceCode}
            onChange={setSourceCode}
            className="bg-[#2D2D2D] text-white p-3 overflow-auto max-h-[400px] font-mono text-sm"
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
