import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { ResumeData } from '../types';

type Project = ResumeData['key_projects'][0];

import L, { LatLngExpression } from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type RegionId = 'usa' | 'canada' | 'europe' | 'south-america' | 'global';

type LonLat = {
  lon: number;
  lat: number;
};

interface RegionDefinition {
  id: RegionId;
  name: string;
  summary: string;
  detail: string;
  center: LatLngExpression;
  zoom: number;
}

interface ProjectLocationDefinition {
  keywords: string[];
  coords: LonLat;
  regionId: Exclude<RegionId, 'global'>;
  label: string;
}

const REGION_FALLBACK_LOCATIONS: Record<Exclude<RegionId, 'global'>, ProjectLocationDefinition> = {
  usa: {
    keywords: ['usa'],
    coords: { lon: -98.5795, lat: 39.8283 },
    regionId: 'usa',
    label: 'United States',
  },
  canada: {
    keywords: ['canada'],
    coords: { lon: -79.3832, lat: 43.6532 },
    regionId: 'canada',
    label: 'Toronto, Ontario',
  },
  europe: {
    keywords: ['europe'],
    coords: { lon: -3.70379, lat: 40.416775 },
    regionId: 'europe',
    label: 'Spain',
  },
  'south-america': {
    keywords: ['south-america'],
    coords: { lon: -75.563, lat: 6.244 },
    regionId: 'south-america',
    label: 'Colombia',
  },
};

const REGION_DEFINITIONS: Record<RegionId, RegionDefinition> = {
  global: {
    id: 'global',
    name: 'Global',
    summary: 'Projects across the globe.',
    detail: 'An overview of all project locations.',
    center: [20, 0],
    zoom: 3,
  },
  usa: {
    id: 'usa',
    name: 'United States',
    summary:
      'Progressive design-build, P3, and CMAR pursuits that span the East Coast, Gulf, and Midwest corridors.',
    detail:
      'Pins surface large-scale delivery and capture programs across Washington, DC, Georgia, Louisiana, Texas, and Indiana. Hover to preview, then click to review the full project brief.',
    center: [39.8283, -98.5795],
    zoom: 4,
  },
  canada: {
    id: 'canada',
    name: 'Canada',
    summary:
      'Toronto-region transit programs delivered through alliance and progressive design-build models.',
    detail:
      'Explore Metrolinx programs across the Toronto network, including East Harbour, Scarborough, and Ontario Line corridor interfaces.',
    center: [43.6532, -79.3832],
    zoom: 10,
  },
  europe: {
    id: 'europe',
    name: 'Spain & Western Europe',
    summary:
      'High-speed rail, toll road, and hydraulic infrastructure delivered across Spain’s northern and central regions.',
    detail:
      'Examine the Basque Country, Castile and León, Catalonia, and Madrid corridors where I led tunneling, bridge, and roadway programs.',
    center: [40.416775, -3.703790],
    zoom: 6,
  },
  'south-america': {
    id: 'south-america',
    name: 'Colombia',
    summary:
      'Urban rail modernization and tramway delivery advancing sustainable mobility in Medellín.',
    detail:
      'Zoom into the Aburrá Valley to see how the Ayacucho Avenue tramway expansion improved access across Medellín.',
    center: [4.570868, -74.297333],
    zoom: 5,
  },
};

const PROJECT_LOCATIONS: ProjectLocationDefinition[] = [
  {
    keywords: ['long bridge north'],
    coords: { lon: -77.04, lat: 38.87 },
    regionId: 'usa',
    label: 'Washington, DC',
  },
  {
    keywords: ['susquehanna'],
    coords: { lon: -76.08, lat: 39.72 },
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
    keywords: ['east harbour'],
    coords: { lon: -79.338, lat: 43.653 },
    regionId: 'canada',
    label: 'East Harbour, Toronto',
  },
  {
    keywords: ['scarborough subway', 'scarborough subway extension', 'srs pdb'],
    coords: { lon: -79.257, lat: 43.744 },
    regionId: 'canada',
    label: 'Scarborough, Toronto',
  },
  {
    keywords: ['ontario line elevated', 'ontario line elevated guideway', 'ontario line'],
    coords: { lon: -79.324, lat: 43.689 },
    regionId: 'canada',
    label: 'Ontario Line Corridor, Toronto',
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

const REGION_IDS: RegionId[] = ['global', 'usa', 'canada', 'europe', 'south-america'];

const matchProjectToLocation = (project: Project): ProjectLocationDefinition | undefined => {
  const haystack = `${project.name} ${project.location ?? ''}`.toLowerCase();
  const explicitMatch = PROJECT_LOCATIONS.find((entry) =>
    entry.keywords.some((keyword) => haystack.includes(keyword)),
  );

  if (explicitMatch) return explicitMatch;

  if (haystack.includes('toronto') || haystack.includes('ontario, canada') || haystack.includes('metrolinx')) {
    return {
      keywords: ['toronto'],
      coords: { lon: -79.3832, lat: 43.6532 },
      regionId: 'canada',
      label: 'Toronto, Ontario',
    };
  }

  if (project.region && project.region !== 'other') {
    return REGION_FALLBACK_LOCATIONS[project.region];
  }

  return undefined;
};

const MapUpdater: React.FC<{ center: LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const ProjectMaps: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const [activeRegion, setActiveRegion] = useState<RegionId>('global');

  const projectMarkers = useMemo(() => {
    return projects
      .map((project) => {
        const match = matchProjectToLocation(project);
        if (!match) {
          return null;
        }

        return {
          ...project,
          coords: [match.coords.lat, match.coords.lon] as LatLngExpression,
          regionId: match.regionId,
          mapLabel: match.label,
        };
      })
      .filter((project): project is Project & {
        coords: LatLngExpression;
        regionId: Exclude<RegionId, 'global'>;
        mapLabel: string;
      } => project !== null);
  }, [projects]);

  const activeRegionDef = REGION_DEFINITIONS[activeRegion];

  const markersForRegion = activeRegion === 'global'
    ? projectMarkers
    : projectMarkers.filter((project) => project.regionId === activeRegion);

  return (
    <div className="mt-20">
      <div className="text-center mb-12 space-y-3">
        <h3 className="text-3xl font-semibold text-foreground">Interactive Project Atlas</h3>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Explore projects on an interactive map. Select a region to zoom in across North America, Europe, and South America.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
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
            {REGION_DEFINITIONS[regionId].name}
          </button>
        ))}
      </div>

      <div className="h-[600px] w-full border border-border rounded-2xl overflow-hidden">
        <MapContainer center={activeRegionDef.center} zoom={activeRegionDef.zoom} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <MapUpdater center={activeRegionDef.center} zoom={activeRegionDef.zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markersForRegion.map((project) => (
            <Marker key={`${project.name}-${project.regionId}`} position={project.coords}>
              <Popup>
                <b>{project.name}</b><br />
                {project.mapLabel}<br />
                {project.location}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ProjectMaps;
