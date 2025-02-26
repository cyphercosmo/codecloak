export default function InfoSection() {
  return (
    <div id="how-it-works" className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-[#24292F]">How CodeCloak Works</h3>
      
      <div className="space-y-4 text-[#24292F]">
        <div>
          <h4 className="font-medium mb-2">Comment-Based Steganography</h4>
          <p>CodeCloak hides your secret messages within code as normal comments that blend naturally with the source code. The comments contain Base64-encoded data that looks like regular developer notes.</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Security Features</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>XOR-based encryption to secure your hidden message</li>
            <li>Base64 encoding for safe storage in comments</li>
            <li>Password protection for revealing the secret</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Perfect for Developers</h4>
          <p>Hide confidential information, signatures, or watermarks in code snippets that you share publicly. The code works exactly the same, and the hidden messages look like ordinary comments.</p>
        </div>
        
        <div className="text-sm text-[#6E7681] mt-8 pt-4 border-t border-[#F6F8FA]">
          <p>
            CodeCloak - A secure way to hide messages in code comments with encryption and Base64 encoding.
          </p>
        </div>
      </div>
    </div>
  );
}
