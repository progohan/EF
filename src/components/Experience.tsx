import React, { useState } from 'react';

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
  const [activeTab, setActiveTab] = useState(0);

  // Helper to parse decimal years from duration string (e.g., "06.2024 - Present")
  const getDecimalYear = (dateStr: string) => {
    if (dateStr.toLowerCase().includes('present')) {
      const now = new Date();
      return now.getFullYear() + now.getMonth() / 12;
    }
    
    // Match MM.YYYY or just YYYY
    const match = dateStr.match(/(?:(\d{2})\.)?(\d{4})/);
    if (!match) return 2003;
    
    const month = match[1] ? parseInt(match[1]) - 1 : 0;
    const year = parseInt(match[2]);
    return year + month / 12;
  };

  const getRange = (duration: string) => {
    // Split by hyphen or en-dash with optional spaces
    const parts = duration.split(/\s*[-–]\s*/);
    const start = getDecimalYear(parts[0]);
    const end = parts[1] ? getDecimalYear(parts[1]) : start;
    return { start, end };
  };

  const totalRange = { start: 2003, end: new Date().getFullYear() + new Date().getMonth() / 12 };
  const totalDuration = totalRange.end - totalRange.start;

  // Function to get a shorter company name for the tabs
  const getShortName = (name: string) => {
    const parts = name.split(' ');
    if (parts[0] === 'SNC' || parts[0] === 'Isolux' || parts[0] === 'Flatiron' || parts[0] === 'Team') {
      return `${parts[0]} ${parts[1] || ''}`.trim().replace(/,/g, '');
    }
    return parts[0].replace(/,/g, '');
  };

  const activeExperience = experiences[activeTab];

  return (
    <section id="experience" className="py-24 sm:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Professional Experience
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-2xl mx-auto">
              Over two decades of leadership in infrastructure development across North America and Europe
            </p>
          </div>

          {/* Main Layout: Sidebar + Detail Panel */}
          <div className="flex flex-col min-[600px]:flex-row gap-4 md:gap-8 min-h-[450px] max-w-5xl mx-auto">
            
            {/* Tab List */}
            <div className="flex min-[600px]:flex-col overflow-x-auto min-[600px]:overflow-x-visible border-b min-[600px]:border-b-0 min-[600px]:border-l-2 border-muted scrollbar-hide min-w-[180px]">
              {experiences.map((exp, idx) => (
                <button
                  key={`${exp.company}-${idx}`}
                  onClick={() => setActiveTab(idx)}
                  className={`
                    flex-1 min-[600px]:flex-none px-5 py-3 text-sm font-mono whitespace-nowrap text-left 
                    transition-all duration-[250ms] ease-in-out outline-none
                    ${activeTab === idx 
                      ? 'text-primary bg-primary/5 min-[600px]:border-l-2 min-[600px]:-ml-[2px] border-primary font-bold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-primary border-transparent'
                    }
                    max-[599px]:border-b-2 max-[599px]:-mb-[2px] 
                    ${activeTab === idx 
                      ? 'max-[599px]:border-b-primary max-[599px]:border-l-0' 
                      : 'max-[599px]:border-b-transparent max-[599px]:border-l-0'
                    }
                  `}
                >
                  {getShortName(exp.company)}
                </button>
              ))}
            </div>

            {/* Detail Panel */}
            <div className="flex-1 mt-4 min-[600px]:mt-0 px-2">
              <div 
                key={activeTab} 
                className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              >
                <div className="mb-1">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    <span className="text-foreground">{activeExperience.position}</span>
                    <span className="text-primary block sm:inline sm:ml-2">@ {activeExperience.company}</span>
                  </h3>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
                  <p className="font-mono text-sm text-primary font-semibold">
                    {activeExperience.duration}
                  </p>
                  <span className="hidden sm:inline text-muted-foreground">|</span>
                  <p className="text-muted-foreground text-sm flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    {activeExperience.location}
                  </p>
                </div>

                <ul className="space-y-4">
                  {activeExperience.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex gap-4 text-foreground/80 leading-relaxed group">
                      <span className="text-primary flex-shrink-0 translate-y-1.5 text-xs">▹</span>
                      <span className="group-hover:text-foreground transition-colors duration-200">
                        {resp}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive Timeline Visualizer */}
          <div className="mt-20 max-w-5xl mx-auto hidden md:block">
            <h4 className="text-sm font-mono text-muted-foreground mb-8 text-center uppercase tracking-widest">
              Career Timeline
            </h4>
            <div className="relative h-2 bg-muted rounded-full overflow-visible mb-12">
              {/* Year Markers */}
              {[2003, 2008, 2013, 2018, 2023, Math.ceil(totalRange.end)].map((year) => (
                <div 
                  key={year}
                  className="absolute top-6 -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${((year - totalRange.start) / totalDuration) * 100}%` }}
                >
                  <div className="w-px h-2 bg-border mb-1"></div>
                  <span className="text-[10px] font-mono text-muted-foreground">{year}</span>
                </div>
              ))}

              {/* Experience Segments */}
              {experiences.map((exp, idx) => {
                const { start, end } = getRange(exp.duration);
                const left = ((start - totalRange.start) / totalDuration) * 100;
                const width = ((end - start) / totalDuration) * 100;
                
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`
                      absolute top-0 h-full cursor-pointer transition-all duration-300
                      ${activeTab === idx 
                        ? 'bg-primary z-10 scale-y-150 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]' 
                        : 'bg-primary/20 hover:bg-primary/40'
                      }
                    `}
                    style={{ 
                      left: `${left}%`, 
                      width: `${Math.max(width, 0.5)}%` 
                    }}
                    title={`${exp.company}: ${exp.duration}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Simple Mobile Timeline */}
          <div className="mt-12 md:hidden flex justify-between items-center px-4">
             <span className="text-[10px] font-mono text-muted-foreground">2003</span>
             <div className="flex-grow mx-4 h-1 bg-muted rounded-full relative">
                {experiences.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${activeTab === idx ? 'bg-primary scale-150' : 'bg-muted-foreground/30'}`}
                    style={{ left: `${(idx / (experiences.length - 1)) * 100}%` }}
                  />
                ))}
             </div>
             <span className="text-[10px] font-mono text-muted-foreground">{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
