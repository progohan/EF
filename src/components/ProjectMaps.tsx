import React, { useMemo, useState } from 'react';
import type { Project } from './KeyProjects';

interface GlobalRegion {
  id: 'usa' | 'spain' | 'colombia';
  title: string;
  description: string;
  cx: number;
  cy: number;
  projects: Project[];
}

interface ProjectPoint {
  project: Project;
  cx: number;
  cy: number;
}

const ProjectMaps: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [hoveredRegion, setHoveredRegion] = useState<GlobalRegion | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showUSMap, setShowUSMap] = useState(false);
  const [isPointerInsideUSMap, setIsPointerInsideUSMap] = useState(false);
  const [hoveredUSProject, setHoveredUSProject] = useState<ProjectPoint | null>(null);
  const [usTooltipPosition, setUsTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedUSProject, setSelectedUSProject] = useState<ProjectPoint | null>(null);

  const globalRegions = useMemo<GlobalRegion[]>(() => {
    const usaProjects = projects.filter((project) => project.location?.toLowerCase().includes('usa'));
    const spainProjects = projects.filter((project) => {
      const location = project.location?.toLowerCase() ?? '';
      return location.includes('spain') || location.includes('basque') || location.includes('madrid') || location.includes('castilla');
    });
    const colombiaProjects = projects.filter((project) => project.location?.toLowerCase().includes('colombia'));

    return [
      {
        id: 'usa',
        title: 'Estados Unidos',
        description: 'Programas de transporte, ferrocarriles y autopistas gestionados mediante modelos P3, CMAR y DB.',
        cx: 260,
        cy: 150,
        projects: usaProjects,
      },
      {
        id: 'spain',
        title: 'España',
        description: 'Alta velocidad, autopistas y obras hidráulicas que consolidan experiencia técnica en Europa.',
        cx: 470,
        cy: 140,
        projects: spainProjects,
      },
      {
        id: 'colombia',
        title: 'Colombia',
        description: 'Implementación de tranvías urbanos y soluciones de movilidad sostenible en Medellín.',
        cx: 320,
        cy: 220,
        projects: colombiaProjects,
      },
    ];
  }, [projects]);

  const usProjectPoints = useMemo<ProjectPoint[]>(() => {
    const coordinateMap: Record<string, { cx: number; cy: number }> = {
      'washington dc': { cx: 420, cy: 150 },
      'atlanta ga': { cx: 400, cy: 210 },
      'lake charles la': { cx: 360, cy: 220 },
      'houston tx': { cx: 340, cy: 230 },
      'bloomington in': { cx: 380, cy: 180 },
    };

    return projects
      .filter((project) => project.location?.toLowerCase().includes('usa'))
      .map((project) => {
        const location = project.location?.toLowerCase() ?? '';
        const match = Object.entries(coordinateMap).find(([key]) => location.includes(key));

        if (match) {
          const [, coords] = match;
          return { project, cx: coords.cx, cy: coords.cy };
        }

        return { project, cx: 320, cy: 200 };
      });
  }, [projects]);

  const handleRegionEnter = (region: GlobalRegion, event: React.MouseEvent<SVGCircleElement | SVGPathElement>) => {
    setHoveredRegion(region);
    setTooltipPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
    if (region.id === 'usa') {
      setShowUSMap(true);
    }
  };

  const handleRegionMove = (event: React.MouseEvent<SVGCircleElement | SVGPathElement>) => {
    setTooltipPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const handleRegionLeave = (region: GlobalRegion) => {
    setHoveredRegion((previous) => (previous?.id === region.id ? null : previous));
    if (region.id === 'usa' && !isPointerInsideUSMap) {
      setShowUSMap(false);
    }
  };

  const handleUSProjectEnter = (point: ProjectPoint, event: React.MouseEvent<SVGCircleElement>) => {
    setHoveredUSProject(point);
    setUsTooltipPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const handleUSProjectMove = (event: React.MouseEvent<SVGCircleElement>) => {
    setUsTooltipPosition({ x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY });
  };

  const handleUSProjectLeave = () => {
    setHoveredUSProject(null);
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-semibold text-foreground">Mapa interactivo de proyectos</h3>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          Recorre el mapa para descubrir en qué regiones he liderado programas estratégicos. Pasa el ratón sobre Estados Unidos para desplegar un mapa detallado con los proyectos destacados y pulsa en cada pin para ver su descripción.
        </p>
      </div>

      <div className="space-y-10" onMouseLeave={() => { setHoveredRegion(null); setShowUSMap(false); }}>
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-border rounded-3xl p-8 shadow-inner">
          <svg viewBox="0 0 600 320" className="w-full h-auto">
            <defs>
              <linearGradient id="continent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary)/0.2)" />
                <stop offset="100%" stopColor="hsl(var(--primary)/0.5)" />
              </linearGradient>
            </defs>
            <path
              d="M60 110 L140 60 L220 80 L260 120 L250 170 L180 190 L120 160 Z"
              fill="url(#continent)"
              className="transition-all duration-300"
              opacity={hoveredRegion?.id === 'usa' ? 0.9 : 0.65}
              onMouseEnter={(event) => handleRegionEnter(globalRegions[0], event as React.MouseEvent<SVGPathElement>)}
              onMouseMove={handleRegionMove}
              onMouseLeave={() => handleRegionLeave(globalRegions[0])}
            />
            <path
              d="M280 200 L310 210 L320 260 L300 300 L260 280 L250 230 Z"
              fill="url(#continent)"
              opacity={hoveredRegion?.id === 'colombia' ? 0.9 : 0.6}
              className="transition-all duration-300"
              onMouseEnter={(event) => handleRegionEnter(globalRegions[2], event as React.MouseEvent<SVGPathElement>)}
              onMouseMove={handleRegionMove}
              onMouseLeave={() => handleRegionLeave(globalRegions[2])}
            />
            <path
              d="M360 120 L420 110 L470 100 L520 120 L500 170 L420 190 L380 160 Z"
              fill="url(#continent)"
              opacity={hoveredRegion?.id === 'spain' ? 0.9 : 0.6}
              className="transition-all duration-300"
              onMouseEnter={(event) => handleRegionEnter(globalRegions[1], event as React.MouseEvent<SVGPathElement>)}
              onMouseMove={handleRegionMove}
              onMouseLeave={() => handleRegionLeave(globalRegions[1])}
            />

            {globalRegions.map((region) => (
              <g key={region.id}>
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={7}
                  className="fill-primary/90 stroke-background stroke-[2px] cursor-pointer"
                  onMouseEnter={(event) => handleRegionEnter(region, event)}
                  onMouseMove={handleRegionMove}
                  onMouseLeave={() => handleRegionLeave(region)}
                  onClick={() => region.id === 'usa' && setShowUSMap(true)}
                />
                <text x={region.cx + 12} y={region.cy + 4} className="text-xs fill-foreground/80 font-medium">
                  {region.title}
                </text>
              </g>
            ))}
          </svg>

          {hoveredRegion && (
            <div
              className="absolute z-10 w-64 bg-background/90 backdrop-blur border border-border rounded-xl shadow-lg p-4 text-left"
              style={{
                left: Math.min(Math.max(tooltipPosition.x + 20, 0), 420),
                top: Math.min(Math.max(tooltipPosition.y - 20, 0), 220),
              }}
            >
              <h4 className="text-sm font-semibold text-foreground mb-1">{hoveredRegion.title}</h4>
              <p className="text-xs text-muted-foreground mb-3">{hoveredRegion.description}</p>
              <div className="space-y-1">
                {hoveredRegion.projects.slice(0, 3).map((project) => (
                  <p key={project.name} className="text-xs text-foreground/80">
                    • {project.name}
                  </p>
                ))}
                {hoveredRegion.projects.length === 0 && (
                  <p className="text-xs text-muted-foreground">No hay proyectos registrados.</p>
                )}
                {hoveredRegion.projects.length > 3 && (
                  <p className="text-[10px] uppercase tracking-wide text-primary/80 font-semibold">
                    +{hoveredRegion.projects.length - 3} proyectos más
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div
          className={`origin-top transition-all duration-500 ease-out ${
            showUSMap ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95 pointer-events-none'
          }`}
          onMouseEnter={() => {
            setIsPointerInsideUSMap(true);
            setShowUSMap(true);
          }}
          onMouseLeave={() => {
            setIsPointerInsideUSMap(false);
            setHoveredUSProject(null);
            setSelectedUSProject((prev) => (prev && prev.project.location?.toLowerCase().includes('usa') ? prev : null));
            setShowUSMap(false);
          }}
        >
          <div className="bg-background border border-border rounded-3xl shadow-xl p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="relative flex-1 w-full">
                <h4 className="text-2xl font-semibold text-foreground mb-4">Estados Unidos · vista detallada</h4>
                <svg viewBox="0 0 520 320" className="w-full h-auto border border-border/60 rounded-2xl bg-muted/40">
                  <path
                    d="M60 140 L120 110 L220 110 L280 130 L320 150 L360 160 L420 150 L460 170 L440 210 L380 230 L320 220 L260 210 L200 210 L140 190 L100 180 Z"
                    className="fill-primary/25 stroke-primary/50 stroke-[3]"
                  />
                  {usProjectPoints.map((point) => (
                    <g key={point.project.name}>
                      <circle
                        cx={point.cx}
                        cy={point.cy}
                        r={8}
                        className="fill-primary stroke-background stroke-[2px] cursor-pointer transition-transform hover:scale-110"
                        onMouseEnter={(event) => handleUSProjectEnter(point, event)}
                        onMouseMove={handleUSProjectMove}
                        onMouseLeave={handleUSProjectLeave}
                        onClick={() => setSelectedUSProject(point)}
                      />
                      <text x={point.cx + 12} y={point.cy + 4} className="text-[11px] fill-foreground/80">
                        {point.project.location?.split(',')[0] ?? point.project.name}
                      </text>
                    </g>
                  ))}
                </svg>

                {hoveredUSProject && (
                  <div
                    className="absolute z-20 w-56 bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg p-3"
                    style={{
                      left: Math.min(Math.max(usTooltipPosition.x + 16, 0), 360),
                      top: Math.min(Math.max(usTooltipPosition.y - 20, 0), 220),
                    }}
                  >
                    <p className="text-xs font-semibold text-foreground">{hoveredUSProject.project.name}</p>
                    <p className="text-[11px] text-muted-foreground">{hoveredUSProject.project.role}</p>
                    {hoveredUSProject.project.scope && (
                      <p className="text-[11px] text-foreground/80 mt-2">{hoveredUSProject.project.scope}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full lg:w-80">
                <div className="bg-muted/40 border border-border rounded-2xl p-6 h-full">
                  <h5 className="text-lg font-semibold text-foreground mb-3">Proyecto seleccionado</h5>
                  {selectedUSProject ? (
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold text-primary">{selectedUSProject.project.name}</p>
                      <p className="text-muted-foreground">{selectedUSProject.project.role}</p>
                      <p className="text-foreground/80">{selectedUSProject.project.company}</p>
                      {selectedUSProject.project.scope && (
                        <p className="text-muted-foreground/90">{selectedUSProject.project.scope}</p>
                      )}
                      {selectedUSProject.project.achievement && (
                        <p className="text-primary/90 bg-primary/10 border border-primary/20 rounded-lg p-3">
                          {selectedUSProject.project.achievement}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      Pasa el ratón por un pin y haz clic para descubrir más detalles del proyecto dentro de Estados Unidos.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMaps;
