import { z } from 'zod';

export interface ResumeData {
  personal_info: {
    full_name: string;
    credentials: string[];
    current_title: string;
    location: string;
    cv_url?: string;
    contact: {
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

export const ResumeDataSchema: z.ZodType<ResumeData> = z.object({
  personal_info: z.object({
    full_name: z.string(),
    credentials: z.array(z.string()),
    current_title: z.string(),
    location: z.string(),
    cv_url: z.string().optional(),
    contact: z.object({
      email: z.string(),
      linkedin: z.string(),
    }),
    summary: z.string(),
    about_description: z.string(),
  }),
  core_competencies: z.array(z.string()),
  work_experience: z.array(z.object({
    position: z.string(),
    company: z.string(),
    location: z.string(),
    duration: z.string(),
    responsibilities: z.array(z.string()),
  })),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.string(),
    status: z.string().optional(),
  })),
  postgraduate_programs: z.array(z.object({
    program: z.string(),
    institution: z.string(),
    year: z.string(),
  })),
  professional_certifications: z.array(z.object({
    certification: z.string(),
    jurisdictions: z.array(z.string()).optional(),
    jurisdiction: z.string().optional(),
    country: z.string().optional(),
    issuing_organization: z.string().optional(),
    organization: z.string().optional(),
  })),
  key_projects: z.array(z.object({
    name: z.string(),
    value: z.string(),
    role: z.string(),
    company: z.string(),
    location: z.string().optional(),
    client: z.string().optional(),
    contribution: z.string().optional(),
    achievement: z.string().optional(),
    scope: z.string().optional(),
  })),
  key_achievements: z.array(z.string()),
  technical_expertise: z.object({
    delivery_models: z.array(z.string()),
    project_types: z.array(z.string()),
    technical_skills: z.array(z.string()),
    technology_skills: z.array(z.string()),
  }),
  leadership_skills: z.array(z.string()),
});
