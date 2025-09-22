import React, { useEffect, useMemo, useState } from 'react';
import { MdLocationOn } from 'react-icons/md';
import type { Project } from './KeyProjects';

type RegionId = 'usa' | 'europe' | 'south-america';

type LonLat = {
  lon: number;
  lat: number;
};

type ProjectedPoint = {
  x: number;
  y: number;
};

interface RegionDefinition {
  id: RegionId;
  name: string;
  summary: string;
  detail: string;
  polygon: LonLat[];
  focusPadding?: number;
  labelPosition: LonLat;
}

interface RegionGeometry extends RegionDefinition {
  points: ProjectedPoint[];
  path: string;
  viewBox: string;
  labelPoint: ProjectedPoint;
}

interface ProjectMarker {
  project: Project;
  regionId: RegionId;
  coords: LonLat;
  point: ProjectedPoint;
  label: string;
}

const GLOBAL_WIDTH = 900;
const GLOBAL_HEIGHT = 450;
const MERCATOR_SCALE = GLOBAL_WIDTH / (2 * Math.PI);

const clampLatitude = (lat: number) => Math.max(Math.min(lat, 85), -85);

const projectPoint = (lon: number, lat: number): ProjectedPoint => {
  const limitedLat = clampLatitude(lat);
  const x = ((lon + 180) / 360) * GLOBAL_WIDTH;
  const latRad = (limitedLat * Math.PI) / 180;
  const y =
    GLOBAL_HEIGHT / 2 - MERCATOR_SCALE * Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  return { x, y };
};

const polygonToPoints = (polygon: LonLat[]): ProjectedPoint[] =>
  polygon.map(({ lon, lat }) => projectPoint(lon, lat));

const pointsToPath = (points: ProjectedPoint[]): string => {
  if (points.length === 0) {
    return '';
  }

  return (
    points
      .map((point, index) =>
        `${index === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`,
      )
      .join(' ') + ' Z'
  );
};

const pointsToViewBox = (points: ProjectedPoint[], padding = 32): string => {
  if (points.length === 0) {
    return `0 0 ${GLOBAL_WIDTH} ${GLOBAL_HEIGHT}`;
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const width = Math.max(maxX - minX, 1);
  const height = Math.max(maxY - minY, 1);

  return `${minX} ${minY} ${width} ${height}`;
};

const NORTH_AMERICA_OUTLINE: LonLat[] = [
  { lon: -168, lat: 72 },
  { lon: -160, lat: 63 },
  { lon: -150, lat: 60 },
  { lon: -140, lat: 57 },
  { lon: -132, lat: 53 },
  { lon: -124, lat: 49 },
  { lon: -116, lat: 47 },
  { lon: -107, lat: 49 },
  { lon: -97, lat: 52 },
  { lon: -88, lat: 50 },
  { lon: -80, lat: 45 },
  { lon: -70, lat: 43 },
  { lon: -65, lat: 35 },
  { lon: -81, lat: 26 },
  { lon: -92, lat: 18 },
  { lon: -100, lat: 15 },
  { lon: -109, lat: 18 },
  { lon: -116, lat: 30 },
  { lon: -122, lat: 37 },
  { lon: -135, lat: 46 },
  { lon: -150, lat: 55 },
  { lon: -160, lat: 62 },
  { lon: -168, lat: 72 },
];

const GREENLAND_OUTLINE: LonLat[] = [
  { lon: -60, lat: 83 },
  { lon: -45, lat: 78 },
  { lon: -30, lat: 73 },
  { lon: -24, lat: 66 },
  { lon: -35, lat: 60 },
  { lon: -50, lat: 62 },
  { lon: -60, lat: 68 },
  { lon: -60, lat: 83 },
];

const SOUTH_AMERICA_OUTLINE: LonLat[] = [
  { lon: -82, lat: 12 },
  { lon: -76, lat: 6 },
  { lon: -72, lat: -4 },
  { lon: -78, lat: -12 },
  { lon: -81, lat: -18 },
  { lon: -74, lat: -33 },
  { lon: -60, lat: -45 },
  { lon: -50, lat: -35 },
  { lon: -38, lat: -15 },
  { lon: -50, lat: 5 },
  { lon: -60, lat: 10 },
  { lon: -70, lat: 10 },
  { lon: -82, lat: 12 },
];

const EUROPE_OUTLINE: LonLat[] = [
  { lon: -10, lat: 36 },
  { lon: -8, lat: 43 },
  { lon: -5, lat: 49 },
  { lon: 1, lat: 53 },
  { lon: 8, lat: 56 },
  { lon: 16, lat: 60 },
  { lon: 25, lat: 65 },
  { lon: 32, lat: 64 },
  { lon: 35, lat: 57 },
  { lon: 30, lat: 47 },
  { lon: 20, lat: 40 },
  { lon: 12, lat: 38 },
  { lon: 4, lat: 40 },
  { lon: -2, lat: 39 },
  { lon: -8, lat: 37 },
  { lon: -10, lat: 36 },
];

const AFRICA_OUTLINE: LonLat[] = [
  { lon: -17, lat: 37 },
  { lon: -10, lat: 20 },
  { lon: -5, lat: 10 },
  { lon: 10, lat: -10 },
  { lon: 18, lat: -25 },
  { lon: 25, lat: -33 },
  { lon: 35, lat: -34 },
  { lon: 45, lat: -20 },
  { lon: 52, lat: -5 },
  { lon: 45, lat: 15 },
  { lon: 30, lat: 25 },
  { lon: 15, lat: 30 },
  { lon: 0, lat: 35 },
  { lon: -10, lat: 33 },
  { lon: -17, lat: 37 },
];

const ASIA_OUTLINE: LonLat[] = [
  { lon: 30, lat: 60 },
  { lon: 45, lat: 70 },
  { lon: 80, lat: 70 },
  { lon: 120, lat: 60 },
  { lon: 150, lat: 45 },
  { lon: 140, lat: 25 },
  { lon: 110, lat: 15 },
  { lon: 80, lat: 10 },
  { lon: 60, lat: 20 },
  { lon: 45, lat: 35 },
  { lon: 35, lat: 45 },
  { lon: 30, lat: 60 },
];

const AUSTRALIA_OUTLINE: LonLat[] = [
  { lon: 112, lat: -10 },
  { lon: 130, lat: -10 },
  { lon: 153, lat: -20 },
  { lon: 153, lat: -35 },
  { lon: 140, lat: -42 },
  { lon: 120, lat: -35 },
  { lon: 112, lat: -20 },
  { lon: 112, lat: -10 },
];

const USA_POLYGON: LonLat[] = [
  { lon: -124.5, lat: 48.8 },
  { lon: -122, lat: 43 },
  { lon: -117, lat: 41 },
  { lon: -111, lat: 41 },
  { lon: -104, lat: 45 },
  { lon: -96, lat: 48.5 },
  { lon: -89, lat: 46 },
  { lon: -82, lat: 44 },
  { lon: -75, lat: 43 },
  { lon: -70, lat: 42 },
  { lon: -67, lat: 45 },
  { lon: -70, lat: 40 },
  { lon: -75, lat: 38 },
  { lon: -80, lat: 36 },
  { lon: -81, lat: 32 },
  { lon: -80, lat: 27 },
  { lon: -83, lat: 24 },
  { lon: -88, lat: 29 },
  { lon: -94, lat: 29 },
  { lon: -102, lat: 31 },
  { lon: -109, lat: 34 },
  { lon: -114, lat: 36 },
  { lon: -118, lat: 39 },
  { lon: -124.5, lat: 48.8 },
];

const EUROPE_POLYGON: LonLat[] = [
  { lon: -10, lat: 36 },
  { lon: -5, lat: 43 },
  { lon: -2, lat: 48 },
  { lon: 3, lat: 50 },
  { lon: 8, lat: 52 },
  { lon: 15, lat: 53 },
  { lon: 20, lat: 56 },
  { lon: 14, lat: 58 },
  { lon: 8, lat: 56 },
  { lon: 4, lat: 54 },
  { lon: -1, lat: 51 },
  { lon: -6, lat: 45 },
  { lon: -10, lat: 36 },
];

const SOUTH_AMERICA_POLYGON: LonLat[] = [
  { lon: -81, lat: 12 },
  { lon: -75, lat: 7 },
  { lon: -72, lat: -2 },
  { lon: -78, lat: -15 },
  { lon: -71, lat: -33 },
  { lon: -60, lat: -45 },
  { lon: -50, lat: -30 },
  { lon: -40, lat: -12 },
  { lon: -54, lat: 5 },
  { lon: -63, lat: 10 },
  { lon: -72, lat: 11 },
  { lon: -81, lat: 12 },
];

const REGION_DEFINITIONS: Record<RegionId, RegionDefinition> = {
  usa: {
    id: 'usa',
    name: 'United States',
    summary:
      'Progressive design-build, P3, and CMAR pursuits that span the East Coast, Gulf, and Midwest corridors.',
    detail:
      'Pins surface large-scale delivery and capture programs across Washington, DC, Georgia, Louisiana, Texas, and Indiana. Hover to preview, then click to review the full project brief.',
    polygon: USA_POLYGON,
    focusPadding: 40,
    labelPosition: { lon: -97, lat: 39 },
  },
  europe: {
    id: 'europe',
    name: 'Spain & Western Europe',
    summary:
      'High-speed rail, toll road, and hydraulic infrastructure delivered across Spain’s northern and central regions.',
    detail:
      'Examine the Basque Country, Castile and León, Catalonia, and Madrid corridors where I led tunneling, bridge, and roadway programs.',
    polygon: EUROPE_POLYGON,
    focusPadding: 28,
    labelPosition: { lon: -1, lat: 45 },
  },
  'south-america': {
    id: 'south-america',
    name: 'Colombia',
    summary:
      'Urban rail modernization and tramway delivery advancing sustainable mobility in Medellín.',
    detail:
      'Zoom into the Aburrá Valley to see how the Ayacucho Avenue tramway expansion improved access across Medellín.',
    polygon: SOUTH_AMERICA_POLYGON,
    focusPadding: 36,
    labelPosition: { lon: -74, lat: 2 },
  },
};

const REGION_GEOMETRY = Object.fromEntries(
  (Object.values(REGION_DEFINITIONS) as RegionDefinition[]).map((region) => {
    const points = polygonToPoints(region.polygon);
    return [
      region.id,
      {
        ...region,
        points,
        path: pointsToPath(points),
        viewBox: pointsToViewBox(points, region.focusPadding ?? 32),
        labelPoint: projectPoint(region.labelPosition.lon, region.labelPosition.lat),
      },
    ];
  }),
) as Record<RegionId, RegionGeometry>;

const BACKGROUND_PATHS = [
  NORTH_AMERICA_OUTLINE,
  GREENLAND_OUTLINE,
  SOUTH_AMERICA_OUTLINE,
  EUROPE_OUTLINE,
  AFRICA_OUTLINE,
  ASIA_OUTLINE,
  AUSTRALIA_OUTLINE,
].map((polygon) => pointsToPath(polygonToPoints(polygon)));

interface ProjectLocationDefinition {
  keywords: string[];
  coords: LonLat;
  regionId: RegionId;
  label: string;
}

const PROJECT_LOCATIONS: ProjectLocationDefinition[] = [
  {
    keywords: ['susquehanna'],
    coords: { lon: -76.992, lat: 39.533 },
    regionId: 'usa',
    label: 'Washington, DC',
  },
  {
    keywords: ['sr-400', 'express lanes'],
    coords: { lon: -84.36, lat: 33.97 },
    regionId: 'usa',
    label: 'Atlanta, GA',
  },
  {
    keywords: ['calcasieu'],
    coords: { lon: -93.217, lat: 30.226 },
    regionId: 'usa',
    label: 'Lake Charles, LA',
  },
  {
    keywords: ['grand parkway'],
    coords: { lon: -95.369, lat: 29.76 },
    regionId: 'usa',
    label: 'Houston, TX',
  },
  {
    keywords: ['i-69'],
    coords: { lon: -86.526, lat: 39.165 },
    regionId: 'usa',
    label: 'Bloomington, IN',
  },
  {
    keywords: ['ayacucho', 'medell'],
    coords: { lon: -75.563, lat: 6.244 },
    regionId: 'south-america',
    label: 'Medellín',
  },
  {
    keywords: ['zizurkil', 'andoain'],
    coords: { lon: -2.02, lat: 43.23 },
    regionId: 'europe',
    label: 'Zizurkil · Andoain',
  },
  {
    keywords: ['venta de baños'],
    coords: { lon: -4.5, lat: 41.99 },
    regionId: 'europe',
    label: 'Venta de Baños',
  },
  {
    keywords: ['andoain to urnieta', 'urnieta'],
    coords: { lon: -2.01, lat: 43.25 },
    regionId: 'europe',
    label: 'Andoain · Urnieta',
  },
  {
    keywords: ['cabezón de pisuerga', 'valvení'],
    coords: { lon: -4.63, lat: 41.78 },
    regionId: 'europe',
    label: 'Cabezón de Pisuerga',
  },
  {
    keywords: ['legutiano', 'escoriatza'],
    coords: { lon: -2.52, lat: 43.04 },
    regionId: 'europe',
    label: 'Legutiano · Escoriatza',
  },
  {
    keywords: ['gernika'],
    coords: { lon: -2.68, lat: 43.31 },
    regionId: 'europe',
    label: 'Gernika',
  },
  {
    keywords: ['vilademuls', 'cornellà'],
    coords: { lon: 2.82, lat: 42.12 },
    regionId: 'europe',
    label: 'Vilademuls',
  },
  {
    keywords: ['bi-625'],
    coords: { lon: -2.87, lat: 43.23 },
    regionId: 'europe',
    label: 'BI-625 Corridor',
  },
  {
    keywords: ['r-3', 'm-50', 'madrid'],
    coords: { lon: -3.52, lat: 40.35 },
    regionId: 'europe',
    label: 'Madrid',
  },
  {
    keywords: ['ap1', 'bergara'],
    coords: { lon: -2.41, lat: 43.18 },
    regionId: 'europe',
    label: 'Eibar · Bergara',
  },
  {
    keywords: ['urumea', 'astigarraga'],
    coords: { lon: -1.95, lat: 43.29 },
    regionId: 'europe',
    label: 'Martutene · Astigarraga',
  },
];

const REGION_IDS: RegionId[] = ['usa', 'europe', 'south-america'];

const matchProjectToLocation = (project: Project): ProjectLocationDefinition | undefined => {
  const haystack = `${project.name} ${project.location ?? ''}`.toLowerCase();
  return PROJECT_LOCATIONS.find((entry) =>
    entry.keywords.some((keyword) => haystack.includes(keyword)),
  );
};

const ProjectMaps: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [activeRegion, setActiveRegion] = useState<RegionId>('usa');
  const [hoveredRegion, setHoveredRegion] = useState<RegionId | null>(null);
  const [globalTooltip, setGlobalTooltip] = useState<
    | {
        region: RegionGeometry;
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | null
  >(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [regionTooltip, setRegionTooltip] = useState<
    | {
        marker: ProjectMarker;
        x: number;
        y: number;
        width: number;
        height: number;
      }
    | null
  >(null);

  const projectMarkers = useMemo<ProjectMarker[]>(() => {
    return projects.reduce<ProjectMarker[]>((accumulator, project) => {
      const match = matchProjectToLocation(project);

      if (!match) {
        return accumulator;
      }

      const point = projectPoint(match.coords.lon, match.coords.lat);

      accumulator.push({
        project,
        regionId: match.regionId,
        coords: match.coords,
        point,
        label: match.label,
      });

      return accumulator;
    }, []);
  }, [projects]);

  const projectsByRegion = useMemo(() => {
    return projectMarkers.reduce<Record<RegionId, ProjectMarker[]>>(
      (accumulator, marker) => {
        accumulator[marker.regionId] = [...accumulator[marker.regionId], marker];
        return accumulator;
      },
      {
        usa: [],
        europe: [],
        'south-america': [],
      },
    );
  }, [projectMarkers]);

  const regionCounts = useMemo(() => {
    return projectMarkers.reduce<Record<RegionId, number>>(
      (accumulator, marker) => {
        accumulator[marker.regionId] += 1;
        return accumulator;
      },
      {
        usa: 0,
        europe: 0,
        'south-america': 0,
      },
    );
  }, [projectMarkers]);

  const activeRegionMarkers = useMemo(
    () => projectsByRegion[activeRegion],
    [projectsByRegion, activeRegion],
  );

  useEffect(() => {
    setRegionTooltip(null);

    setSelectedProject((previous) => {
      if (
        previous &&
        activeRegionMarkers.some((marker) => marker.project.name === previous.name)
      ) {
        return previous;
      }

      return activeRegionMarkers[0]?.project ?? null;
    });
  }, [activeRegion, activeRegionMarkers]);

  const handleRegionMouseEnter = (
    region: RegionGeometry,
    event: React.MouseEvent<SVGPathElement>,
  ) => {
    const svgElement = event.currentTarget.ownerSVGElement;
    if (!svgElement) {
      return;
    }

    const bounds = svgElement.getBoundingClientRect();
    setHoveredRegion(region.id);
    setGlobalTooltip({
      region,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  };

  const handleRegionMouseMove = (
    region: RegionGeometry,
    event: React.MouseEvent<SVGPathElement>,
  ) => {
    const svgElement = event.currentTarget.ownerSVGElement;
    if (!svgElement) {
      return;
    }

    const bounds = svgElement.getBoundingClientRect();
    setGlobalTooltip({
      region,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  };

  const handleRegionMouseLeave = () => {
    setHoveredRegion(null);
    setGlobalTooltip(null);
  };

  const handleMarkerMouseEnter = (
    marker: ProjectMarker,
    event: React.MouseEvent<SVGCircleElement>,
  ) => {
    const svgElement = event.currentTarget.ownerSVGElement;
    if (!svgElement) {
      return;
    }

    const bounds = svgElement.getBoundingClientRect();
    setRegionTooltip({
      marker,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  };

  const handleMarkerMouseMove = (
    marker: ProjectMarker,
    event: React.MouseEvent<SVGCircleElement>,
  ) => {
    const svgElement = event.currentTarget.ownerSVGElement;
    if (!svgElement) {
      return;
    }

    const bounds = svgElement.getBoundingClientRect();
    setRegionTooltip({
      marker,
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      width: bounds.width,
      height: bounds.height,
    });
  };

  const handleMarkerMouseLeave = () => {
    setRegionTooltip(null);
  };

  return (
    <div className="mt-20">
      <div className="text-center mb-12 space-y-3">
        <h3 className="text-3xl font-semibold text-foreground">Interactive project atlas</h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Start with the global map to locate the regions where I have delivered major programs. Click a
          highlighted area to expand a regional map populated with precise project pins, then review the
          detailed briefs for each engagement.
        </p>
      </div>

      <div className="space-y-12">
        <div className="relative bg-gradient-to-br from-primary/10 via-background to-primary/10 border border-border rounded-3xl p-8 shadow-inner">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
            <div className="flex-1">
              <div className="relative">
                <svg
                  viewBox={`0 0 ${GLOBAL_WIDTH} ${GLOBAL_HEIGHT}`}
                  className="w-full h-auto"
                >
                  {BACKGROUND_PATHS.map((path, index) => (
                    <path
                      key={`background-${index}`}
                      d={path}
                      fill="hsl(var(--foreground) / 0.08)"
                      stroke="hsl(var(--foreground) / 0.12)"
                      strokeWidth={1.2}
                    />
                  ))}

                  {REGION_IDS.map((regionId) => {
                    const region = REGION_GEOMETRY[regionId];
                    const isActive = activeRegion === regionId;
                    const isHovered = hoveredRegion === regionId;

                    return (
                      <g key={regionId}>
                        <path
                          d={region.path}
                          className="transition-all duration-200 ease-out cursor-pointer"
                          style={{
                            fill: `hsl(var(--primary) / ${isActive ? 0.6 : isHovered ? 0.45 : 0.25})`,
                            stroke: isActive
                              ? 'hsl(var(--primary) / 0.8)'
                              : 'hsl(var(--primary) / 0.4)',
                            strokeWidth: isActive ? 2.4 : 1.5,
                          }}
                          onMouseEnter={(event) => handleRegionMouseEnter(region, event)}
                          onMouseMove={(event) => handleRegionMouseMove(region, event)}
                          onMouseLeave={handleRegionMouseLeave}
                          onClick={() => setActiveRegion(regionId)}
                        />
                        <g
                          transform={`translate(${region.labelPoint.x}, ${region.labelPoint.y})`}
                        >
                          <circle
                            r={isActive ? 10 : 8}
                            fill="hsl(var(--background))"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                          />
                          <text
                            className="text-xs font-semibold"
                            textAnchor="middle"
                            dy={22}
                            fill="hsl(var(--foreground))"
                          >
                            {REGION_GEOMETRY[regionId].name}
                          </text>
                          <text
                            className="text-[10px]"
                            textAnchor="middle"
                            dy={34}
                            fill="hsl(var(--foreground) / 0.7)"
                          >
                            {regionCounts[regionId]} project{regionCounts[regionId] === 1 ? '' : 's'}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {globalTooltip && (
                  <div
                    className="absolute z-20 w-72 bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg p-4"
                    style={{
                      left: Math.min(
                        Math.max(globalTooltip.x + 16, 12),
                        Math.max(globalTooltip.width - 280, 12),
                      ),
                      top: Math.min(
                        Math.max(globalTooltip.y - 20, 12),
                        Math.max(globalTooltip.height - 140, 12),
                      ),
                    }}
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {globalTooltip.region.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {globalTooltip.region.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-64 bg-background/80 border border-border rounded-2xl p-5 space-y-4">
              <h4 className="text-lg font-semibold text-foreground">How to explore</h4>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                <li>Hover to preview each geography and read the focus summary.</li>
                <li>Click a highlighted region or use the selector below to open its detailed map.</li>
                <li>
                  Interact with the project pins to surface key facts, then select a project to review the
                  complete engagement story.
                </li>
              </ol>
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-3xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2">
                {REGION_IDS.map((regionId) => (
                  <button
                    key={regionId}
                    type="button"
                    onClick={() => setActiveRegion(regionId)}
                    className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
                      activeRegion === regionId
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >
                    {REGION_GEOMETRY[regionId].name}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-semibold text-foreground">
                  {REGION_GEOMETRY[activeRegion].name} · detailed map
                </h4>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  {REGION_GEOMETRY[activeRegion].detail}
                </p>
              </div>

              <div className="relative">
                <svg
                  viewBox={REGION_GEOMETRY[activeRegion].viewBox}
                  className="w-full h-auto border border-border/70 rounded-2xl bg-muted/40"
                >
                  <path
                    d={REGION_GEOMETRY[activeRegion].path}
                    fill="hsl(var(--primary) / 0.25)"
                    stroke="hsl(var(--primary) / 0.7)"
                    strokeWidth={2}
                  />

                  {activeRegionMarkers.map((marker) => (
                    <g key={marker.project.name}>
                      <circle
                        cx={marker.point.x}
                        cy={marker.point.y}
                        r={8}
                        className="fill-primary stroke-background stroke-[2px] cursor-pointer transition-transform hover:scale-110"
                        onMouseEnter={(event) => handleMarkerMouseEnter(marker, event)}
                        onMouseMove={(event) => handleMarkerMouseMove(marker, event)}
                        onMouseLeave={handleMarkerMouseLeave}
                        onClick={() => {
                          setSelectedProject(marker.project);
                          setRegionTooltip(null);
                        }}
                      />
                      <text
                        x={marker.point.x + 12}
                        y={marker.point.y + 4}
                        className="text-[11px] fill-foreground/80"
                      >
                        {marker.label}
                      </text>
                    </g>
                  ))}
                </svg>

                {regionTooltip && (
                  <div
                    className="absolute z-20 w-60 bg-background/95 backdrop-blur border border-border rounded-xl shadow-lg p-3"
                    style={{
                      left: Math.min(
                        Math.max(regionTooltip.x + 18, 8),
                        Math.max(regionTooltip.width - 220, 8),
                      ),
                      top: Math.min(
                        Math.max(regionTooltip.y - 24, 8),
                        Math.max(regionTooltip.height - 160, 8),
                      ),
                    }}
                  >
                    <p className="text-xs font-semibold text-foreground">
                      {regionTooltip.marker.project.name}
                    </p>
                    {regionTooltip.marker.project.role && (
                      <p className="text-[11px] text-muted-foreground">
                        {regionTooltip.marker.project.role}
                      </p>
                    )}
                    {regionTooltip.marker.project.scope && (
                      <p className="text-[11px] text-foreground/80 mt-2">
                        {regionTooltip.marker.project.scope}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full lg:w-80 space-y-6">
              <div className="bg-muted/40 border border-border rounded-2xl p-6">
                <h5 className="text-lg font-semibold text-foreground mb-4">Projects in this region</h5>
                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {activeRegionMarkers.length > 0 ? (
                    activeRegionMarkers.map((marker) => {
                      const isSelected = selectedProject?.name === marker.project.name;
                      return (
                        <button
                          key={marker.project.name}
                          type="button"
                          onClick={() => setSelectedProject(marker.project)}
                          className={`w-full text-left border rounded-xl px-4 py-3 transition ${
                            isSelected
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-background hover:border-primary/60'
                          }`}
                        >
                          <p className="text-sm font-semibold text-foreground">
                            {marker.project.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{marker.label}</p>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No mapped projects are available for this region yet.
                    </p>
                  )}
                </div>
              </div>

              {selectedProject && (
                <div className="bg-muted/40 border border-border rounded-2xl p-6 space-y-3">
                  <h5 className="text-lg font-semibold text-foreground">Project spotlight</h5>
                  <div className="space-y-2 text-sm">
                    <p className="text-base font-semibold text-primary">
                      {selectedProject.name}
                    </p>
                    {selectedProject.location && (
                      <p className="flex items-center gap-2 text-muted-foreground">
                        <MdLocationOn className="w-4 h-4 text-primary" />
                        {selectedProject.location}
                      </p>
                    )}
                    {selectedProject.role && (
                      <p>
                        <span className="font-medium text-foreground/90">Role:</span>{' '}
                        {selectedProject.role}
                      </p>
                    )}
                    {selectedProject.company && (
                      <p>
                        <span className="font-medium text-foreground/90">Company:</span>{' '}
                        {selectedProject.company}
                      </p>
                    )}
                    {selectedProject.value && (
                      <p>
                        <span className="font-medium text-foreground/90">Value:</span>{' '}
                        {selectedProject.value}
                      </p>
                    )}
                    {selectedProject.scope && (
                      <p className="text-muted-foreground/90">{selectedProject.scope}</p>
                    )}
                    {selectedProject.achievement && (
                      <p className="text-primary/90 bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
                        {selectedProject.achievement}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMaps;
