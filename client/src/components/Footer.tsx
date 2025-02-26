export default function Footer() {
  return (
    <footer className="bg-[#2D2D2D] text-white py-4 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-[#6E7681]">
          CodeCloak is a browser-based implementation of the 
          <a 
            href="https://github.com/KuroLabs/stegcloak" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#2EA44F] hover:underline ml-1"
          >
            StegCloak
          </a> library.
          No data leaves your browser.
        </p>
      </div>
    </footer>
  );
}
