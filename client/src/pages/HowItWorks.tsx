import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FA]">
      <Header />
      <main className="container mx-auto p-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-6">
            <Link href="/" className="text-blue-600 hover:underline">&larr; Back to Home</Link>
          </nav>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#24292F]">How CodeCloak Works</h2>
            
            <div className="space-y-6 text-[#24292F]">
              <div>
                <h3 className="text-xl font-medium mb-2">Comment-Based Steganography</h3>
                <p className="leading-relaxed">
                  CodeCloak hides your secret messages within code as normal comments that blend naturally with the source code. 
                  The comments contain Base64-encoded data that looks like regular developer notes, making it virtually 
                  impossible to detect without knowing what to look for.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Security Features</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>XOR-based encryption</strong> - Uses a simple yet effective XOR cipher to secure your hidden message with a password
                  </li>
                  <li>
                    <strong>Base64 encoding</strong> - Ensures the encrypted content can be safely stored within code comments
                  </li>
                  <li>
                    <strong>Password protection</strong> - Only those with the correct password can reveal and decrypt the secret
                  </li>
                  <li>
                    <strong>Random comment placement</strong> - Makes detection even more difficult by placing the hidden data in natural-looking comments
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Technical Implementation</h3>
                <p className="leading-relaxed">
                  The application uses a combination of cryptographic techniques and comment parsing to achieve secure steganography:
                </p>
                <ol className="list-decimal pl-5 space-y-2 mt-2">
                  <li>Your message is optionally encrypted using a password-based XOR cipher</li>
                  <li>The encrypted message is encoded to Base64 format</li>
                  <li>The encoded content is embedded within code comments that look natural</li>
                  <li>To reveal a message, the process is reversed - comments are extracted, decoded from Base64, and decrypted</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Perfect for Developers</h3>
                <p className="leading-relaxed">
                  Hide confidential information, signatures, or watermarks in code snippets that you share publicly. 
                  The code works exactly the same, and the hidden messages look like ordinary comments. This is ideal for:
                </p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>Watermarking shared code samples</li>
                  <li>Sending confidential information through code reviews</li>
                  <li>Adding invisible signatures to your work</li>
                  <li>Sharing secret messages with fellow developers</li>
                </ul>
              </div>
              
              <div className="text-sm text-[#6E7681] mt-8 pt-4 border-t border-[#F6F8FA]">
                <p>
                  CodeCloak - A secure way to hide messages in code comments with encryption and Base64 encoding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}