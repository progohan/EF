import { z } from 'zod';

export const ResumeDataSchema = z.object({
  personal_info: z.object({
    full_name: z.string(),
    credentials: z.array(z.string()),
    current_title: z.string(),
    location: z.string(),
    contact: z.object({
      phone: z.string(),
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

export type ResumeData = z.infer<typeof ResumeDataSchema>;
