import React from 'react';
import { FileDown } from 'lucide-react';

interface HeroProps {
  data: {
    full_name: string;
    credentials: string[];
    current_title: string;
    location: string;
    summary: string;
    cv_url?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center py-16 sm:py-20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Credentials */}
          <div className="mb-4">
            <div className="inline-flex flex-wrap gap-2 justify-center">
              {data.credentials.map((credential, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium"
                >
                  {credential}
                </span>
              ))}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-foreground">
            {data.full_name}
          </h1>

          {/* Title */}
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-6 font-light">
            {data.current_title}
          </h2>

          {/* Location */}
          <div className="flex items-center justify-center mb-8 text-muted-foreground">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {data.location}
          </div>

          {/* Summary */}
          <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {data.summary}
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={scrollToContact}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </button>
            
            {data.cv_url && (
              <a
                href={data.cv_url}
                download
                className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center gap-2"
              >
                <FileDown className="w-5 h-5" />
                Download CV (PDF)
              </a>
            )}

            <button
              onClick={scrollToAbout}
              className="w-full sm:w-auto px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;