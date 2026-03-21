import React from 'react';
import { MdOutlineSchool, MdOutlineEngineering, MdVerified } from 'react-icons/md';
import { FaBriefcase, FaCloud, FaDatabase, FaGavel } from 'react-icons/fa';
import { PiCertificateBold, PiMathOperationsBold } from 'react-icons/pi';
import { GiBrain } from 'react-icons/gi';
import { TbBuildingBridge } from 'react-icons/tb';
import { MdLocationOn } from 'react-icons/md';

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

// Credential badges shown at the top — derived from the most prominent qualifications
const CREDENTIAL_BADGES = [
  { abbr: 'PE', label: 'Professional Engineer' },
  { abbr: 'P.Eng', label: 'Professional Engineer (Canada)' },
  { abbr: 'PMP', label: 'Project Management Professional' },
  { abbr: 'MSCE', label: 'Master of Science in Civil Engineering' },
  { abbr: 'MBA', label: 'Executive MBA' },
  { abbr: 'LLB', label: 'Bachelor of Law' },
];

const getDegreeIcon = (text: string): JSX.Element => {
  const t = text.toLowerCase();
  if (t.includes('law')) return <FaGavel />;
  if (t.includes('mba') || t.includes('business')) return <FaBriefcase />;
  if (t.includes('civil engineering') || t.includes('science in civil')) return <MdOutlineEngineering />;
  if (t.includes('math') || t.includes('computation')) return <PiMathOperationsBold />;
  if (t.includes('intelligence')) return <GiBrain />;
  if (t.includes('cloud') || t.includes('aws') || t.includes('azure')) return <FaCloud />;
  if (t.includes('data') || t.includes('ai') || t.includes('artificial')) return <FaDatabase />;
  if (t.includes('steel') || t.includes('composite') || t.includes('struct')) return <TbBuildingBridge />;
  return <MdOutlineSchool />;
};

const Education: React.FC<EducationProps> = ({ education, programs, certifications }) => {
  // Merge academic + postgraduate into one timeline, sorted oldest → newest
  const allAcademic = [
    ...education.map(e => ({
      title: e.degree,
      institution: e.institution,
      year: parseInt(e.year),
      yearLabel: e.year,
      status: e.status,
      type: 'degree' as const,
    })),
    ...programs.map(p => ({
      title: p.program,
      institution: p.institution,
      year: parseInt(p.year),
      yearLabel: p.year,
      status: undefined,
      type: 'program' as const,
    })),
  ].sort((a, b) => a.year - b.year);

  return (
    <section id="education" className="py-16 sm:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Education & Certifications
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              Two decades of deliberate, cross-disciplinary learning — from civil engineering to business law, underpinned by active professional licensure across three countries.
            </p>
          </div>

          {/* Credential Badge Strip */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {CREDENTIAL_BADGES.map((badge) => (
              <div
                key={badge.abbr}
                className="group relative px-5 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-bold shadow-sm cursor-default"
                title={badge.label}
              >
                {badge.abbr}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-foreground text-background px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">

            {/* Left: Unified Academic Timeline */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-3">
                <MdOutlineSchool className="text-2xl text-primary" />
                Academic Background
              </h3>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {allAcademic.map((item, index) => (
                    <div key={index} className="flex gap-5">
                      {/* Timeline dot */}
                      <div className="relative shrink-0 w-9 flex justify-center">
                        <div className="w-4 h-4 rounded-full bg-primary border-2 border-background ring-2 ring-primary/30 mt-1 z-10" />
                      </div>

                      {/* Card */}
                      <div className="flex-1 pb-2">
                        <div className="bg-background rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200">
                          <div className="flex items-start gap-3">
                            <span className="text-xl text-primary mt-0.5 shrink-0">
                              {getDegreeIcon(item.title)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-foreground leading-snug">
                                  {item.title}
                                </h4>
                                {item.status && (
                                  <span className="shrink-0 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded text-green-600 text-xs font-medium">
                                    {item.status}
                                  </span>
                                )}
                              </div>
                              <p className="text-primary/80 text-sm font-medium mb-1">
                                {item.institution}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{item.yearLabel}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                  item.type === 'degree'
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  {item.type === 'degree' ? 'Degree' : 'PG Program'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Certifications */}
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-8 flex items-center gap-3">
                <PiCertificateBold className="text-2xl text-primary" />
                Professional Certifications
              </h3>

              <div className="space-y-5">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="bg-background rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <MdVerified className="text-2xl text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-foreground mb-1">
                          {cert.certification}
                        </h4>

                        {(cert.issuing_organization || cert.organization) && (
                          <p className="text-primary/80 text-sm font-medium mb-3">
                            {cert.issuing_organization || cert.organization}
                          </p>
                        )}

                        <div className="space-y-2.5">
                          {/* Single jurisdiction */}
                          {cert.jurisdiction && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MdLocationOn className="text-base shrink-0" />
                              <span>{cert.jurisdiction}{cert.country ? `, ${cert.country}` : ''}</span>
                            </div>
                          )}

                          {/* Country only (no specific jurisdiction) */}
                          {cert.country && !cert.jurisdiction && !cert.jurisdictions && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MdLocationOn className="text-base shrink-0" />
                              <span>{cert.country}</span>
                            </div>
                          )}

                          {/* Multiple jurisdictions */}
                          {cert.jurisdictions && cert.jurisdictions.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                <MdLocationOn className="text-sm shrink-0" />
                                Licensed in {cert.jurisdictions.length} US states:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {cert.jurisdictions.map((j, jIndex) => (
                                  <span
                                    key={jIndex}
                                    className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold"
                                  >
                                    {j}
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
