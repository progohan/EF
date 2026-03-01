import React from 'react';

interface ExperienceProps {
  experiences: Array<{
    position: string;
    company: string;
    location: string;
    duration: string;
    responsibilities: string[];
  }>;
}

const Experience: React.FC<ExperienceProps> = ({ experiences }) => {

  return (
    <section id="experience" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Professional Experience
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
              Over two decades of leadership in infrastructure development across North America and Europe
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden md:block"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div key={`${exp.position}-${exp.company}-${index}`} className="relative flex items-start md:pl-12">
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-0 top-1 w-8 h-8 bg-background rounded-full border-4 border-primary items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  
                  {/* Content */}
                  <div className="w-full">
                    <div className="bg-background rounded-xl p-8 border border-border shadow-sm hover:shadow-lg transition-shadow">
                      {/* Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {exp.position}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-muted-foreground">
                            <span className="text-lg font-semibold text-primary/90">
                              {exp.company}
                            </span>
                            <span className="sm:mx-3 text-border hidden sm:inline">|</span>
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {exp.location}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 lg:mt-0">
                          <span className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {exp.duration}
                          </span>
                        </div>
                      </div>

                      {/* Responsibilities */}
                      <div>
                        <ul className="space-y-3 mt-6">
                          {exp.responsibilities.map((responsibility, respIndex) => (
                            <li key={respIndex} className="flex items-start">
                              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2 mr-4"></div>
                              <p className="text-foreground/80 leading-relaxed">{responsibility}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
