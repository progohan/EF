import React, { Suspense, useMemo, useState } from 'react';
import { PiTrain } from 'react-icons/pi';
import { GiSuspensionBridge } from 'react-icons/gi';
import { FaRoad, FaHardHat } from 'react-icons/fa';
import { TbBuildingTunnel } from 'react-icons/tb';
import { MdLocationOn, MdClose } from 'react-icons/md';
import { Button } from './ui/button';
import { ResumeData } from '../types';

const ProjectMaps = React.lazy(() => import('./ProjectMaps'));

type Project = ResumeData['key_projects'][0];

interface KeyProjectsProps {
  projects: Project[];
}

type ProjectCategoryKey = 'highways' | 'railways' | 'miscellaneous';
type FilterKey = 'all' | ProjectCategoryKey;

interface ProjectInfo {
  categoryKey: ProjectCategoryKey;
  categoryLabel: string;
  icon: JSX.Element;
}

const filterConfig: Record<FilterKey, { label: string }> = {
  all: { label: 'All Projects' },
  highways: { label: 'Highways' },
  railways: { label: 'Railways' },
  miscellaneous: { label: 'Miscellaneous' },
};

const getProjectInfo = (project: Project): ProjectInfo => {
  const text = `${project.name} ${project.scope ?? ''}`.toLowerCase();

  if (text.includes('rail') || text.includes('tram') || text.includes('track')) {
    return { categoryKey: 'railways', categoryLabel: 'High-Speed Rail', icon: <PiTrain /> };
  }

  if (text.includes('bridge')) {
    return { categoryKey: 'highways', categoryLabel: 'Bridge Construction', icon: <GiSuspensionBridge /> };
  }

  if (
    text.includes('highway') ||
    text.includes('interstate') ||
    text.includes('i-') ||
    text.includes('sr-') ||
    text.includes('express') ||
    text.includes('parkway') ||
    text.includes('toll') ||
    text.includes('road') ||
    text.includes('lane')
  ) {
    return { categoryKey: 'highways', categoryLabel: 'Highway Construction', icon: <FaRoad /> };
  }

  if (text.includes('tunnel')) {
    return { categoryKey: 'miscellaneous', categoryLabel: 'Tunneling', icon: <TbBuildingTunnel /> };
  }

  return { categoryKey: 'miscellaneous', categoryLabel: 'Infrastructure', icon: <FaHardHat /> };
};

const FILTER_KEYS: FilterKey[] = ['all', 'highways', 'railways', 'miscellaneous'];

const KeyProjects: React.FC<KeyProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<(Project & ProjectInfo) | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const projectsWithInfo = useMemo(() => {
    return projects.map((project) => ({ ...project, ...getProjectInfo(project) }));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return projectsWithInfo;
    return projectsWithInfo.filter((project) => project.categoryKey === activeFilter);
  }, [projectsWithInfo, activeFilter]);

  const handleProjectKeyDown = (e: React.KeyboardEvent, project: Project & ProjectInfo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedProject(project);
    }
  };

  return (
    <section id="projects" className="py-16 sm:py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Key Projects
            </h2>
            <p className="text-muted-foreground mt-6 text-lg max-w-3xl mx-auto">
              Multibillion-dollar infrastructure projects spanning rail, highway, and bridge construction across three continents
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {FILTER_KEYS.map((key) => (
              <Button
                key={key}
                variant={activeFilter === key ? 'default' : 'outline'}
                onClick={() => setActiveFilter(key)}
                className="min-w-[130px]"
              >
                {filterConfig[key].label}
              </Button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredProjects.map((project) => (
              <div
                key={project.name}
                className="group bg-background rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => handleProjectKeyDown(e, project)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${project.name}`}
              >
                {/* Project Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-3xl text-primary">{project.icon}</div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {project.value}
                    </div>
                    <div className="text-xs text-muted-foreground">Project Value</div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-primary/10 border border-primary/20 rounded text-primary text-xs font-medium mb-2">
                    {project.categoryLabel}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-1">
                    <span className="font-medium text-foreground/80">{project.role}</span>
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {project.company}
                  </p>
                  {project.location && (
                    <p className="text-muted-foreground/80 text-xs mt-1 flex items-center">
                      <MdLocationOn className="w-3 h-3 mr-1" />
                      {project.location}
                    </p>
                  )}
                </div>

                {/* Key Highlight */}
                {project.scope && (
                  <div className="border-t border-border pt-3">
                    <p className="text-foreground/80 text-sm">
                      {project.scope}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-2xl">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start">
                  <div className="text-4xl text-primary mr-4">{selectedProject.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{selectedProject.name}</h3>
                    <div className="flex items-center text-muted-foreground">
                      <span className="text-3xl font-bold text-primary mr-4">
                        {selectedProject.value}
                      </span>
                      <span className="px-2 py-1 bg-primary/10 border border-primary/20 rounded text-primary text-sm">
                        {selectedProject.categoryLabel}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close project details"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              {/* Project Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Role</h4>
                    <p className="text-foreground">{selectedProject.role}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Company</h4>
                    <p className="text-foreground">{selectedProject.company}</p>
                  </div>

                  {selectedProject.client && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Client</h4>
                      <p className="text-foreground">{selectedProject.client}</p>
                    </div>
                  )}

                  {selectedProject.location && (
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Location</h4>
                      <p className="text-foreground">{selectedProject.location}</p>
                    </div>
                  )}
                  {selectedProject.scope && (
                    <div className="col-span-full">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-1">Scope</h4>
                      <p className="text-foreground">{selectedProject.scope}</p>
                    </div>
                  )}
                </div>

                {selectedProject.achievement && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Key Achievement</h4>
                    <p className="text-foreground/90 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                      {selectedProject.achievement}
                    </p>
                  </div>
                )}

                {selectedProject.contribution && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Contribution</h4>
                    <p className="text-foreground/90 bg-primary/5 border border-primary/20 rounded-lg p-3">
                      {selectedProject.contribution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <Suspense fallback={<div className="mt-20 text-center text-muted-foreground">Loading project map...</div>}>
        <ProjectMaps projects={projects} />
      </Suspense>
    </section>
  );
};

export default KeyProjects;
