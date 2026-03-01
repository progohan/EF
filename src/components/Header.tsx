import React, { useState } from 'react';
import { ModeToggle } from './mode-toggle';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-primary">
            Eduardo Fernández Ortiz
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <a href="#hero" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Home
              </a>
              <a href="#about" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                About
              </a>
              <a href="#experience" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Experience
              </a>
              <a href="#competencies" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Expertise
              </a>
              <a href="#projects" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Projects
              </a>
              <a href="#education" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Education
              </a>
              <a href="#contact" onClick={handleLinkClick} className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </div>

            <ModeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-foreground hover:text-primary"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 space-y-2 bg-background p-4 rounded-lg shadow-lg">
            <a href="#hero" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Home
            </a>
            <a href="#about" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              About
            </a>
            <a href="#experience" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Experience
            </a>
            <a href="#competencies" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Expertise
            </a>
            <a href="#projects" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Projects
            </a>
            <a href="#education" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Education
            </a>
            <a href="#contact" onClick={handleLinkClick} className="block w-full text-left text-foreground hover:text-primary py-2">
              Contact
            </a>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;