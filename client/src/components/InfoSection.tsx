export default function InfoSection() {
  return (
    <div id="how-it-works" className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-[#24292F]">How CodeCloak Works</h3>
      
      <div className="space-y-4 text-[#24292F]">
        <div>
          <h4 className="font-medium mb-2">Intelligent Code Steganography</h4>
          <p>CodeCloak hides your secret messages within code using believable comments and metadata that appear legitimate to human reviewers. The tool analyzes your code to choose the most appropriate hiding technique based on the language.</p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Language-Aware Hiding</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>JavaScript/TypeScript: Uses JSDoc comments and debugging notes</li>
            <li>HTML: Hides in metadata tags and schema markup</li>
            <li>Python: Utilizes docstrings and TODO comments</li>
            <li>CSS: Embeds in descriptive comment blocks</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Security Features</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Strong encryption to secure your hidden message</li>
            <li>Password protection for revealing the secret</li>
            <li>Entropy analysis to ensure hiding is undetectable</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Perfect for Developers</h4>
          <p>Hide confidential information, signatures, or watermarks in code snippets that you share publicly. The code functions exactly the same, but contains your cleverly hidden secret disguised as normal development artifacts.</p>
        </div>
        
        <div className="text-sm text-[#6E7681] mt-8 pt-4 border-t border-[#F6F8FA]">
          <p>
            Inspired by <a href="https://github.com/KuroLabs/stegcloak" target="_blank" rel="noopener noreferrer" className="text-[#2EA44F] hover:underline">StegCloak</a> - Advanced steganography for embedding secrets in source code.
          </p>
        </div>
      </div>
    </div>
  );
}
