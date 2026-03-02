import React from 'react';
import profileImage from '../assets/Edu_github.jpg';

interface AboutProps {
  data: {
    full_name: string;
    current_title: string;
    about_description: string;
  };
  achievements: string[];
}

const About: React.FC<AboutProps> = ({ data, achievements }) => {
  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
            {/* Left Column: Title and Image */}
            <div className="lg:col-span-1 space-y-8">
              <div className="lg:text-left">
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">About Me</h2>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-80 rounded-lg overflow-hidden shadow-2xl">
                  <img 
                    src={profileImage} 
                    alt={data.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Infrastructure Delivery | Commercial Strategy | Team Leadership
              </h3>
              <div className="text-foreground/80 text-lg leading-relaxed mb-10 space-y-4">
                {data.about_description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Key Achievements Section */}
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-8">
                  Key Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.slice(0, 8).map((achievement, index) => (
                    <div key={index} className="flex items-start p-4 bg-background rounded-lg border border-border shadow-sm hover:shadow-lg transition-shadow">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-4 mt-1">
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-foreground/90 leading-relaxed">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;