export default function InfoSection() {
  return (
    <div id="how-it-works" className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-[#24292F]">How CodeCloak Works</h3>
      
      <div className="space-y-4 text-[#24292F]">
        <div>
          <h4 className="font-medium mb-2">Invisible Steganography</h4>
          <p>CodeCloak uses the StegCloak library to hide your secret messages within code using zero-width unicode characters that are completely invisible to the human eye.</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Security Features</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>AES-256-CTR encryption to secure your hidden message</li>
            <li>Optional HMAC integrity check to prevent tampering</li>
            <li>Password protection for revealing the secret</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Perfect for Developers</h4>
          <p>Hide confidential information, signatures, or watermarks in code snippets that you share publicly. The code works exactly the same, but contains your invisible secret.</p>
        </div>
        
        <div className="text-sm text-[#6E7681] mt-8 pt-4 border-t border-[#F6F8FA]">
          <p>
            Powered by <a href="https://github.com/KuroLabs/stegcloak" target="_blank" rel="noopener noreferrer" className="text-[#2EA44F] hover:underline">StegCloak</a> - Hide secrets with invisible characters in plain text securely using passwords.
          </p>
        </div>
      </div>
    </div>
  );
}
