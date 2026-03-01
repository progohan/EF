export interface ResumeData {
  personal_info: {
    full_name: string;
    credentials: string[];
    current_title: string;
    location: string;
    contact: {
      phone: string;
      email: string;
      linkedin: string;
    };
    summary: string;
    about_description: string;
  };
  core_competencies: string[];
  work_experience: Array<{
    position: string;
    company: string;
    location: string;
    duration: string;
    responsibilities: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    status?: string;
  }>;
  postgraduate_programs: Array<{
    program: string;
    institution: string;
    year: string;
  }>;
  professional_certifications: Array<{
    certification: string;
    jurisdictions?: string[];
    jurisdiction?: string;
    country?: string;
    issuing_organization?: string;
    organization?: string;
  }>;
  key_projects: Array<{
    name: string;
    value: string;
    role: string;
    company: string;
    location?: string;
    client?: string;
    contribution?: string;
    achievement?: string;
    scope?: string;
  }>;
  key_achievements: string[];
  technical_expertise: {
    delivery_models: string[];
    project_types: string[];
    technical_skills: string[];
    technology_skills: string[];
  };
  leadership_skills: string[];
}
