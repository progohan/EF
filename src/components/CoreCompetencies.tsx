import React from 'react';

// --- REACT-ICONS IMPORTS ---
// Leadership & Management Competencies
import { FiTarget } from "react-icons/fi"; // Strategic Planning & Execution
import { GoProject, GoProjectSymlink } from "react-icons/go"; // Project & Program Management, Project Types header
import { RiTeamFill, RiMoneyDollarCircleLine } from "react-icons/ri"; // Cross-Functional Team Leadership, Cost Optimization
import { FaRegHandshake, FaRegLightbulb } from "react-icons/fa"; // Stakeholder Engagement, Innovation
import { LiaFileContractSolid } from "react-icons/lia"; // Contract Negotiation
import { AiOutlineThunderbolt } from "react-icons/ai"; // Risk Assessment
import { FaDatabase } from "react-icons/fa6"; // Big Data Analytics
import { FaCloud, FaSuitcase, FaLaptopCode } from "react-icons/fa"; // Cloud Computing, Commercial Management, Technology Skills
import { MdOutlineEngineering } from "react-icons/md"; // Civil Engineering
import { GiTeamIdea, GiFireworkRocket } from "react-icons/gi"; // Mentorship, Technical Skills Header
import { CiMedal } from "react-icons/ci"; // Leadership Skills header
import { FaRegAddressBook } from "react-icons/fa"; // Delivery Models header

// --- END REACT-ICONS IMPORTS ---

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

const CoreCompetencies: React.FC<CoreCompetenciesProps> = ({
  competencies,
  technicalExpertise,
  leadershipSkills,
}) => {
  // Map competency names to their chosen React-Icon components
  const competencyIconMap: { [key: string]: JSX.Element } = {
    'Strategic Planning & Execution': <FiTarget />,
    'Project & Program Management': <GoProject />,
    'Cross-Functional Team Leadership': <RiTeamFill />,
    'Stakeholder Engagement & Communication': <FaRegHandshake />,
    'Cost Optimization & Value Engineering': <RiMoneyDollarCircleLine />,
    'Contract Negotiation & Management': <LiaFileContractSolid />,
    'Risk Assessment & Mitigation': <AiOutlineThunderbolt />,
    'Big Data Analytics & AI Applications': <FaDatabase />,
    'Cloud Computing Architectures (AWS & Azure)': <FaCloud />,
    'Commercial Management': <FaSuitcase />,
    'Civil Engineering': <MdOutlineEngineering />,
    'Mentorship & Team Development': <GiTeamIdea />,
    'Innovation & Continuous Improvement': <FaRegLightbulb />
  };

  const getIcon = (competency: string): JSX.Element => {
    return competencyIconMap[competency] || <GoProject />;
  };

  return (
    <section id="competencies" className="py-24 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Core Competencies & Expertise
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              Comprehensive expertise spanning traditional civil engineering and cutting-edge technology integration
            </p>
          </div>

          {/* Core Competencies Grid */}
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competencies.map((competency, index) => (
                <div
                  key={index}
                  className="p-6 bg-background rounded-xl border border-border shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start">
                    <span className="text-2xl text-primary mr-4 mt-1">{getIcon(competency)}</span>
                    <div>
                      <h4 className="text-foreground font-semibold leading-tight">{competency}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Expertise */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
            {/* Delivery Models & Project Types */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <span className="text-2xl mr-3 text-primary"><FaRegAddressBook /></span>
                  Delivery Models
                </h3>
                <div className="space-y-3">
                  {technicalExpertise.delivery_models.map((model, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground/90">{model}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <span className="text-2xl mr-3 text-primary"><GoProjectSymlink /></span>
                  Project Types
                </h3>
                <div className="space-y-3">
                  {technicalExpertise.project_types.map((type, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground/90">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <span className="text-2xl mr-3 text-primary"><GiFireworkRocket /></span>
                  Technical Skills
                </h3>
                <div className="space-y-3">
                  {technicalExpertise.technical_skills.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground/90">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                  <span className="text-2xl mr-3 text-primary"><FaLaptopCode /></span>
                  Technology Skills
                </h3>
                <div className="space-y-3">
                  {technicalExpertise.technology_skills.map((skill, index) => (
                    <div key={index} className="flex items-center p-3 bg-muted/50 rounded-lg border border-border">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground/90">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Leadership Skills Section */}
          <div className="mt-24">
            <h3 className="text-2xl font-bold text-foreground mb-8 text-center flex items-center justify-center">
              <span className="text-3xl mr-3 text-primary"><CiMedal /></span>
              Leadership Skills
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {leadershipSkills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-6 py-3 bg-primary/5 border border-primary/20 rounded-xl text-foreground font-medium hover:bg-primary/10 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreCompetencies;