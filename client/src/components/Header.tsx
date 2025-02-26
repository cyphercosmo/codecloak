import { FaUserSecret, FaGithub, FaInfoCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-[#2D2D2D] text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <FaUserSecret className="text-2xl mr-3" />
          <h1 className="text-xl font-bold">CodeCloak</h1>
          <span className="ml-2 opacity-75 text-sm">powered by StegCloak</span>
        </div>
        <div className="flex space-x-4">
          <a 
            href="https://github.com/KuroLabs/stegcloak" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white hover:text-[#2EA44F] transition-colors duration-200"
          >
            <FaGithub className="inline mr-1" />
            <span>GitHub</span>
          </a>
          <a 
            href="#how-it-works" 
            className="text-white hover:text-[#2EA44F] transition-colors duration-200"
          >
            <FaInfoCircle className="inline mr-1" />
            <span>How it works</span>
          </a>
        </div>
      </div>
    </header>
  );
}
