import React, { Suspense, useMemo, useState } from 'react';
import { PiTrain } from 'react-icons/pi';
import { GiSuspensionBridge } from 'react-icons/gi';
import { FaRoad, FaHardHat } from 'react-icons/fa';
import { TbBuildingTunnel } from 'react-icons/tb';
import { MdLocationOn, MdClose } from 'react-icons/md';
import { Button } from './ui/button';
import { ContractType, ResumeData } from '../types';
import { enrichProjects, ProjectWithMetrics, RegionKey, SectorKey } from '../lib/portfolioMetrics';

const ProjectMaps = React.lazy(() => import('./ProjectMaps'));

type Project = ResumeData['key_projects'][0];

interface KeyProjectsProps {
  projects: Project[];
}

interface ProjectInfo {
  categoryLabel: string;
  icon: JSX.Element;
}

type SectorFilterKey = 'all' | SectorKey;
type ContractFilterKey = 'all' | ContractType;
type RegionFilterKey = 'all' | RegionKey;

const sectorFilterConfig: Record<SectorFilterKey, { label: string }> = {
  all: { label: 'All Sectors' },
  rail: { label: 'Rail & Transit' },
  highway: { label: 'Highways & Bridges' },
  other: { label: 'Other Infrastructure' },
};

const contractFilterConfig: Record<ContractFilterKey, { label: string }> = {
  all: { label: 'All Contracts' },
  P3: { label: 'P3' },
  PDB: { label: 'PDB' },
  DB: { label: 'DB' },
  DBB: { label: 'DBB' },
  CMAR: { label: 'CMAR' },
  Alliance: { label: 'Alliance' },
  Other: { label: 'Other' },
};

const regionFilterConfig: Record<RegionFilterKey, { label: string }> = {
  all: { label: 'All Regions' },
  usa: { label: 'United States' },
  canada: { label: 'Canada' },
  europe: { label: 'Europe' },
  'south-america': { label: 'South America' },
  other: { label: 'Other' },
};

const getProjectInfo = (project: ProjectWithMetrics): ProjectInfo => {
  const text = `${project.name} ${project.scope ?? ''}`.toLowerCase();

  if (project.sectorKey === 'rail') {
    return { categoryLabel: 'Rail & Transit', icon: <PiTrain /> };
  }

  if (text.includes('bridge')) {
    return { categoryLabel: 'Bridge Construction', icon: <GiSuspensionBridge /> };
  }

  if (project.sectorKey === 'highway') {
    return { categoryLabel: 'Highway Construction', icon: <FaRoad /> };
  }

  if (text.includes('tunnel')) {
    return { categoryLabel: 'Tunneling', icon: <TbBuildingTunnel /> };
  }

  return { categoryLabel: 'Infrastructure', icon: <FaHardHat /> };
};

const SECTOR_ORDER: SectorKey[] = ['rail', 'highway', 'other'];
const CONTRACT_ORDER: ContractType[] = ['P3', 'PDB', 'DB', 'DBB', 'CMAR', 'Alliance', 'Other'];
const REGION_ORDER: RegionKey[] = ['usa', 'canada', 'europe', 'south-america', 'other'];

const KeyProjects: React.FC<KeyProjectsProps> = ({ projects }) => {
  const [selectedProject, setSelectedProject] = useState<(ProjectWithMetrics & ProjectInfo) | null>(null);
  const [activeSector, setActiveSector] = useState<SectorFilterKey>('all');
  const [activeContract, setActiveContract] = useState<ContractFilterKey>('all');
  const [activeRegion, setActiveRegion] = useState<RegionFilterKey>('all');

  const projectsWithInfo = useMemo(() => {
    return enrichProjects(projects).map((project) => ({ ...project, ...getProjectInfo(project) }));
  }, [projects]);

  const filterCounts = useMemo(() => {
    return {
      sectors: projectsWithInfo.reduce<Record<string, number>>((counts, project) => {
        counts[project.sectorKey] = (counts[project.sectorKey] ?? 0) + 1;
        return counts;
      }, {}),
      contracts: projectsWithInfo.reduce<Record<string, number>>((counts, project) => {
        counts[project.contractType] = (counts[project.contractType] ?? 0) + 1;
        return counts;
      }, {}),
      regions: projectsWithInfo.reduce<Record<string, number>>((counts, project) => {
        counts[project.regionKey] = (counts[project.regionKey] ?? 0) + 1;
        return counts;
      }, {}),
    };
  }, [projectsWithInfo]);

  const sectorFilterKeys = useMemo<SectorFilterKey[]>(() => {
    return ['all', ...SECTOR_ORDER.filter((key) => (filterCounts.sectors[key] ?? 0) > 0)];
  }, [filterCounts.sectors]);

  const contractFilterKeys = useMemo<ContractFilterKey[]>(() => {
    return ['all', ...CONTRACT_ORDER.filter((key) => (filterCounts.contracts[key] ?? 0) > 0)];
  }, [filterCounts.contracts]);

  const regionFilterKeys = useMemo<RegionFilterKey[]>(() => {
    return ['all', ...REGION_ORDER.filter((key) => (filterCounts.regions[key] ?? 0) > 0)];
  }, [filterCounts.regions]);

  const filteredProjects = useMemo(() => {
    return projectsWithInfo.filter((project) => {
      const matchesSector = activeSector === 'all' || project.sectorKey === activeSector;
      const matchesContract = activeContract === 'all' || project.contractType === activeContract;
      const matchesRegion = activeRegion === 'all' || project.regionKey === activeRegion;
      return matchesSector && matchesContract && matchesRegion;
    });
  }, [projectsWithInfo, activeSector, activeContract, activeRegion]);

  const filterSummary = useMemo(() => {
    const contractCounts = filteredProjects.reduce<Record<string, number>>((counts, project) => {
      counts[project.contractType] = (counts[project.contractType] ?? 0) + 1;
      return counts;
    }, {});

    return Object.entries(contractCounts)
      .map(([contract, count]) => `${contract}: ${count}`)
      .join(' | ');
  }, [filteredProjects]);

  const handleProjectKeyDown = (e: React.KeyboardEvent, project: ProjectWithMetrics & ProjectInfo) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedProject(project);
    }
  };

  const clearFilters = () => {
    setActiveSector('all');
    setActiveContract('all');
    setActiveRegion('all');
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
              Multibillion-dollar infrastructure projects spanning rail, highway, and bridge construction across North America, Europe, and South America
            </p>
          </div>

          {/* Portfolio Filters */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap justify-center gap-3">
              {sectorFilterKeys.map((key) => (
                <Button
                  key={key}
                  variant={activeSector === key ? 'default' : 'outline'}
                  onClick={() => setActiveSector(key)}
                  className="min-w-[130px]"
                >
                  {sectorFilterConfig[key].label}
                  {key !== 'all' && filterCounts.sectors[key] ? ` (${filterCounts.sectors[key]})` : ''}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {contractFilterKeys.map((key) => (
                <Button
                  key={key}
                  variant={activeContract === key ? 'default' : 'outline'}
                  onClick={() => setActiveContract(key)}
                  size="sm"
                >
                  {contractFilterConfig[key].label}
                  {key !== 'all' && filterCounts.contracts[key] ? ` (${filterCounts.contracts[key]})` : ''}
                </Button>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {regionFilterKeys.map((key) => (
                <Button
                  key={key}
                  variant={activeRegion === key ? 'default' : 'outline'}
                  onClick={() => setActiveRegion(key)}
                  size="sm"
                >
                  {regionFilterConfig[key].label}
                  {key !== 'all' && filterCounts.regions[key] ? ` (${filterCounts.regions[key]})` : ''}
                </Button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Showing {filteredProjects.length} of {projectsWithInfo.length} projects
              {filterSummary ? ` | ${filterSummary}` : ''}
            </p>
            {(activeSector !== 'all' || activeContract !== 'all' || activeRegion !== 'all') && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
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
                  <span className="inline-block ml-2 px-2 py-1 bg-muted border border-border rounded text-muted-foreground text-xs font-medium mb-2">
                    {project.contractType}
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
          ) : (
            <div className="mb-12 rounded-lg border border-border bg-background p-8 text-center">
              <p className="text-lg font-semibold text-foreground">No projects match these filters.</p>
              <p className="mt-2 text-sm text-muted-foreground">Try clearing one filter or returning to all projects.</p>
              <Button className="mt-4" variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          )}
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

                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Contract Type</h4>
                    <p className="text-foreground">{selectedProject.contractType}</p>
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
