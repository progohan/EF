import React, { useState } from 'react';

import { FiTarget } from "react-icons/fi";
import { GoProject } from "react-icons/go";
import { RiTeamFill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaRegHandshake, FaRegLightbulb } from "react-icons/fa";
import { LiaFileContractSolid } from "react-icons/lia";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaDatabase } from "react-icons/fa6";
import { FaCloud, FaSuitcase } from "react-icons/fa";
import { MdOutlineEngineering } from "react-icons/md";
import { GiTeamIdea } from "react-icons/gi";

interface CoreCompetenciesProps {
  competencies: string[];
  technicalExpertise: {
    delivery_models: string[];
    project_types: string[];
    technical_skills: string[];
    technology_skills: string[];
  };
  leadershipSkills: string[];
}

type PillarKey = 'leadership' | 'engineering' | 'digital';

interface CompetencyCard {
  label: string;
  description: string;
  icon: JSX.Element;
  pillar: PillarKey;
}

const COMPETENCY_CARDS: CompetencyCard[] = [
  // Leadership & Commercial
  {
    label: 'Strategic Planning & Execution',
    description: 'Directing multi-year programs from capture through closeout across multiple geographies and jurisdictions.',
    icon: <FiTarget />,
    pillar: 'leadership',
  },
  {
    label: 'Cross-Functional Team Leadership',
    description: 'Building and guiding high-performing, multidisciplinary teams that thrive under the pressure of megaproject delivery.',
    icon: <RiTeamFill />,
    pillar: 'leadership',
  },
  {
    label: 'Stakeholder Engagement & Communication',
    description: 'Bridging technical, legal, and commercial interests across owners, JV partners, regulatory agencies, and communities.',
    icon: <FaRegHandshake />,
    pillar: 'leadership',
  },
  {
    label: 'Contract Negotiation & Management',
    description: 'Structuring and administering complex contracts across DB, P3, CMAR, and PDB frameworks to protect value and manage exposure.',
    icon: <LiaFileContractSolid />,
    pillar: 'leadership',
  },
  {
    label: 'Commercial Management',
    description: 'Driving revenue, margin, and market share in competitive infrastructure markets through strategic positioning and pursuit leadership.',
    icon: <FaSuitcase />,
    pillar: 'leadership',
  },
  {
    label: 'Mentorship & Team Development',
    description: 'Cultivating leadership pipelines, resilient organizational cultures, and high-retention teams across international programs.',
    icon: <GiTeamIdea />,
    pillar: 'leadership',
  },
  // Engineering & Delivery
  {
    label: 'Project & Program Management',
    description: 'Overseeing scope, schedule, cost, and quality on billion-dollar infrastructure programs with complex multi-stakeholder interfaces.',
    icon: <GoProject />,
    pillar: 'engineering',
  },
  {
    label: 'Cost Optimization & Value Engineering',
    description: 'Identifying savings and efficiencies at every project phase without compromising technical integrity or delivery timelines.',
    icon: <RiMoneyDollarCircleLine />,
    pillar: 'engineering',
  },
  {
    label: 'Risk Assessment & Mitigation',
    description: 'Anticipating, quantifying, and neutralizing project risk before it translates into schedule delay or cost overrun.',
    icon: <AiOutlineThunderbolt />,
    pillar: 'engineering',
  },
  {
    label: 'Civil Engineering',
    description: 'Deep technical foundation in structural design, geotechnical analysis, and large-scale infrastructure construction.',
    icon: <MdOutlineEngineering />,
    pillar: 'engineering',
  },
  // Digital & Innovation
  {
    label: 'Big Data Analytics & AI Applications',
    description: 'Applying advanced analytics and AI tools to program controls, performance forecasting, and operational decision-making.',
    icon: <FaDatabase />,
    pillar: 'digital',
  },
  {
    label: 'Cloud Computing Architectures (AWS & Azure)',
    description: 'Leveraging cloud platforms to modernize project delivery workflows, data pipelines, and cross-team collaboration.',
    icon: <FaCloud />,
    pillar: 'digital',
  },
  {
    label: 'Innovation & Continuous Improvement',
    description: 'Embedding a culture of process improvement and emerging technology adoption across project teams and enterprise operations.',
    icon: <FaRegLightbulb />,
    pillar: 'digital',
  },
];

const PILLARS: { key: PillarKey; label: string; description: string }[] = [
  {
    key: 'leadership',
    label: 'Leadership & Commercial',
    description: 'Executive presence, stakeholder trust, and commercial strategy that win work and drive enterprise growth.',
  },
  {
    key: 'engineering',
    label: 'Engineering & Delivery',
    description: 'Technical rigor and program management discipline applied to the most complex infrastructure programs in North America and Europe.',
  },
  {
    key: 'digital',
    label: 'Digital & Innovation',
    description: 'Data, cloud, and AI capabilities that modernize how infrastructure is planned, controlled, and delivered.',
  },
];


const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({
  technicalExpertise,
}) => {
  const [activePillar, setActivePillar] = useState<PillarKey>('leadership');

  const visibleCards = COMPETENCY_CARDS.filter(c => c.pillar === activePillar);
  const activePillarDef = PILLARS.find(p => p.key === activePillar)!;

  const allTechnicalSkills = [
    ...technicalExpertise.technical_skills,
    ...technicalExpertise.technology_skills,
  ];

  return (
    <section id="competencies" className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">

          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Core Competencies & Expertise
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              A rare combination of executive leadership, deep engineering knowledge, and digital fluency — applied to the world's most complex infrastructure programs.
            </p>
          </div>

          {/* Pillar Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {PILLARS.map((pillar) => (
              <button
                key={pillar.key}
                type="button"
                onClick={() => setActivePillar(pillar.key)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-full border transition-colors ${
                  activePillar === pillar.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                }`}
              >
                {pillar.label}
              </button>
            ))}
          </div>

          {/* Active Pillar Description */}
          <p className="text-center text-muted-foreground text-sm mb-8 max-w-2xl mx-auto">
            {activePillarDef.description}
          </p>

          {/* Competency Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {visibleCards.map((card) => (
              <div
                key={card.label}
                className="p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                <div className="flex items-start mb-3">
                  <span className="text-2xl text-primary mr-3 mt-0.5 shrink-0">{card.icon}</span>
                  <h4 className="text-foreground font-semibold leading-tight">{card.label}</h4>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom Row: Delivery Models | Project Types | Technical Skills */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Delivery Models — pill badges */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Delivery Models</h3>
              <div className="flex flex-wrap gap-2">
                {technicalExpertise.delivery_models.map((model) => (
                  <span
                    key={model}
                    className="px-4 py-2 bg-primary/10 border border-primary/25 rounded-full text-primary text-sm font-semibold"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Types */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Project Types</h3>
              <ul className="space-y-2">
                {technicalExpertise.project_types.map((type) => (
                  <li key={type} className="flex items-center text-foreground/90 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 shrink-0"></div>
                    {type}
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical + Technology Skills merged */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Technical Skills</h3>
              <ul className="space-y-2">
                {allTechnicalSkills.map((skill) => (
                  <li key={skill} className="flex items-center text-foreground/90 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 shrink-0"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreCompetencies;
