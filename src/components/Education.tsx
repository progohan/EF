import React from 'react';

interface EducationProps {
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    status?: string;
  }>;
  programs: Array<{
    program: string;
    institution: string;
    year: string;
  }>;
  certifications: Array<{
    certification: string;
    jurisdictions?: string[];
    jurisdiction?: string;
    country?: string;
    issuing_organization?: string;
    organization?: string;
  }>;
}

const Education: React.FC<EducationProps> = ({ education, programs, certifications }) => {
  const getDegreeIcon = (degree: string): string => {
    if (degree.toLowerCase().includes('law')) return '⚖️';
    if (degree.toLowerCase().includes('mba') || degree.toLowerCase().includes('business')) return '💼';
    if (degree.toLowerCase().includes('engineering') || degree.toLowerCase().includes('math')) return '⚙️';
    if (degree.toLowerCase().includes('intelligence')) return '🧠';
    return '🎓';
  };

  const getCertificationIcon = (cert: string): string => {
    if (cert.includes('P.E.') || cert.includes('P.Eng.')) return '🏗️';
    if (cert.includes('PMP')) return '📊';
    if (cert.includes('Contractor')) return '🔨';
    return '📋';
  };

  return (
    <section id="education" className="py-24 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Education & Certifications
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              Comprehensive academic foundation and professional certifications supporting technical excellence and leadership
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {/* Education & Programs Column*/}
            <div className="space-y-12">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
                  <span className="text-3xl mr-3">🎓</span>
                  Academic Education
                </h3>
                <div className="space-y-6">
                  {education.map((edu, index) => (
                    <div 
                      key={index}
                      className="p-6 bg-background rounded-xl border border-border shadow-sm"
                    >
                      <div className="flex items-start">
                        <div className="text-2xl mr-4 mt-1">{getDegreeIcon(edu.degree)}</div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-1">{edu.degree}</h4>
                          <p className="text-primary/90 font-medium mb-2">{edu.institution}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground text-sm">{edu.year}</span>
                            {edu.status && (
                              <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-green-600 text-xs">
                                {edu.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
                  <span className="text-3xl mr-3">📚</span>
                  Postgraduate Programs
                </h3>
                <div className="space-y-6">
                  {programs.map((program, index) => (
                    <div 
                      key={index}
                      className="p-6 bg-background rounded-xl border border-border shadow-sm"
                    >
                      <div className="flex items-start">
                        <div className="text-2xl mr-4 mt-1">
                          {program.program.toLowerCase().includes('cloud') ? '☁️' : 
                          program.program.toLowerCase().includes('data') || program.program.toLowerCase().includes('ai') ? '🤖' : 
                          program.program.toLowerCase().includes('steel') ? '🏗️' : '📖'}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-foreground mb-1">{program.program}</h4>
                          <p className="text-primary/90 font-medium mb-2">{program.institution}</p>
                          <span className="text-muted-foreground text-sm">{program.year}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Professional Certifications Column*/}
            <div>
              <h3 className="text-2xl font-semibold text-foreground mb-8 flex items-center">
                <span className="text-3xl mr-3">🏆</span>
                Professional Certifications
              </h3>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <div 
                    key={index}
                    className="p-6 bg-background rounded-xl border border-border shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="text-2xl mr-4 mt-1">{getCertificationIcon(cert.certification)}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-foreground mb-2">{cert.certification}</h4>
                        
                        {(cert.issuing_organization || cert.organization) && (
                          <p className="text-primary/90 font-medium mb-2">{cert.issuing_organization || cert.organization}</p>
                        )}

                        <div className="space-y-2">
                          {cert.country && (
                            <p className="text-muted-foreground text-sm">Country: {cert.country}</p>
                          )}
                          
                          {cert.jurisdiction && (
                            <p className="text-muted-foreground text-sm">Jurisdiction: {cert.jurisdiction}</p>
                          )}
                          
                          {cert.jurisdictions && cert.jurisdictions.length > 0 && (
                            <div className="text-muted-foreground text-sm">
                              <span>Jurisdictions: </span>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {cert.jurisdictions.map((jurisdiction, jIndex) => (
                                  <span 
                                    key={jIndex}
                                    className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary text-xs"
                                  >
                                    {jurisdiction}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
