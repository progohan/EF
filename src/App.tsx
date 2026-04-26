import { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import { ResumeData, ResumeDataSchema } from './types';
import { AlertCircle } from 'lucide-react';

const Experience = lazy(() => import('./components/Experience'));
const CoreCompetencies = lazy(() => import('./components/CoreCompetencies'));
const KeyProjects = lazy(() => import('./components/KeyProjects'));
const Education = lazy(() => import('./components/Education'));
const Contact = lazy(() => import('./components/Contact'));

const SectionLoader = () => (
  <div className="py-12 text-center text-muted-foreground">Loading section...</div>
);

function App() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch('./data.json', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const jsonData = await response.json();

        const validatedData = ResumeDataSchema.parse(jsonData);
        setResumeData(validatedData);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        console.error('Error loading resume data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xl font-medium">Loading portfolio...</div>
        </div>
      </div>
    );
  }

  if (error || !resumeData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-destructive/10 border border-destructive/20 rounded-xl p-8 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="text-destructive w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-muted-foreground mb-6">
            {error || 'Unable to load portfolio data. Please try again later.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero data={resumeData.personal_info} />
        <About data={resumeData.personal_info} achievements={resumeData.key_achievements} />

        <Suspense fallback={<SectionLoader />}>
          <Experience experiences={resumeData.work_experience} />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CoreCompetencies
            competencies={resumeData.core_competencies}
            technicalExpertise={resumeData.technical_expertise}
            leadershipSkills={resumeData.leadership_skills}
          />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <KeyProjects projects={resumeData.key_projects} />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Education
            education={resumeData.education}
            programs={resumeData.postgraduate_programs}
            certifications={resumeData.professional_certifications}
          />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Contact data={resumeData.personal_info} />
        </Suspense>
      </main>
    </div>
  );
}

export default App;
