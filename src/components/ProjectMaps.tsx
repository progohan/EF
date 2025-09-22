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
  { lon: -168, lat: 71.5 },
  { lon: -161, lat: 66.5 },
  { lon: -153, lat: 67.5 },
  { lon: -143, lat: 67.8 },
  { lon: -135, lat: 64.5 },
  { lon: -130, lat: 61.2 },
  { lon: -126, lat: 57.5 },
  { lon: -125, lat: 53.2 },
  { lon: -124, lat: 49.5 },
  { lon: -122, lat: 45.5 },
  { lon: -120, lat: 42.3 },
  { lon: -118, lat: 38.0 },
  { lon: -117, lat: 35.2 },
  { lon: -115, lat: 33.5 },
  { lon: -112, lat: 32.4 },
  { lon: -109, lat: 31.2 },
  { lon: -106, lat: 30.5 },
  { lon: -103, lat: 29.0 },
  { lon: -99, lat: 26.5 },
  { lon: -96, lat: 25.0 },
  { lon: -93, lat: 25.5 },
  { lon: -90, lat: 27.5 },
  { lon: -87, lat: 28.5 },
  { lon: -84, lat: 28.0 },
  { lon: -82, lat: 25.5 },
  { lon: -80.5, lat: 24.0 },
  { lon: -79.5, lat: 26.5 },
  { lon: -79.0, lat: 29.0 },
  { lon: -78, lat: 31.0 },
  { lon: -77, lat: 33.0 },
  { lon: -76, lat: 35.0 },
  { lon: -75, lat: 37.0 },
  { lon: -74, lat: 39.5 },
  { lon: -72, lat: 42.0 },
  { lon: -69.5, lat: 44.5 },
  { lon: -66.5, lat: 47.5 },
  { lon: -63.5, lat: 50.5 },
  { lon: -60.5, lat: 52.0 },
  { lon: -59, lat: 54.5 },
  { lon: -60.5, lat: 57.0 },
  { lon: -65, lat: 60.5 },
  { lon: -70, lat: 63.0 },
  { lon: -77, lat: 65.5 },
  { lon: -85, lat: 67.5 },
  { lon: -95, lat: 69.5 },
  { lon: -110, lat: 70.5 },
  { lon: -125, lat: 71.0 },
  { lon: -140, lat: 71.5 },
  { lon: -150, lat: 72.0 },
  { lon: -160, lat: 72.5 },
  { lon: -168, lat: 71.5 },
];

const GREENLAND_OUTLINE: LonLat[] = [
  { lon: -73.5, lat: 83.1 },
  { lon: -60.0, lat: 82.0 },
  { lon: -48.0, lat: 81.0 },
  { lon: -38.0, lat: 79.0 },
  { lon: -30.0, lat: 76.5 },
  { lon: -24.0, lat: 73.5 },
  { lon: -23.0, lat: 70.5 },
  { lon: -30.0, lat: 68.5 },
  { lon: -38.0, lat: 67.0 },
  { lon: -46.0, lat: 66.5 },
  { lon: -54.0, lat: 67.0 },
  { lon: -60.0, lat: 69.5 },
  { lon: -64.0, lat: 72.0 },
  { lon: -68.5, lat: 76.0 },
  { lon: -73.5, lat: 83.1 },
];

const SOUTH_AMERICA_OUTLINE: LonLat[] = [
  { lon: -81.7, lat: 12.4 },
  { lon: -79.0, lat: 9.5 },
  { lon: -77.0, lat: 8.0 },
  { lon: -75.0, lat: 6.5 },
  { lon: -74.0, lat: 4.0 },
  { lon: -73.0, lat: 1.0 },
  { lon: -74.0, lat: -1.5 },
  { lon: -78.0, lat: -3.0 },
  { lon: -81.0, lat: -4.5 },
  { lon: -82.5, lat: -8.0 },
  { lon: -80.0, lat: -12.0 },
  { lon: -76.0, lat: -15.5 },
  { lon: -73.0, lat: -17.0 },
  { lon: -72.0, lat: -20.0 },
  { lon: -70.0, lat: -23.0 },
  { lon: -68.0, lat: -26.0 },
  { lon: -65.0, lat: -28.0 },
  { lon: -63.0, lat: -31.0 },
  { lon: -62.0, lat: -33.0 },
  { lon: -60.0, lat: -36.0 },
  { lon: -57.0, lat: -38.0 },
  { lon: -55.0, lat: -40.0 },
  { lon: -52.0, lat: -41.5 },
  { lon: -48.0, lat: -39.5 },
  { lon: -46.0, lat: -36.0 },
  { lon: -44.0, lat: -32.0 },
  { lon: -42.0, lat: -28.0 },
  { lon: -40.0, lat: -24.0 },
  { lon: -38.0, lat: -17.0 },
  { lon: -36.0, lat: -12.0 },
  { lon: -37.0, lat: -8.0 },
  { lon: -39.0, lat: -4.0 },
  { lon: -44.0, lat: 1.0 },
  { lon: -48.0, lat: 5.0 },
  { lon: -54.0, lat: 5.5 },
  { lon: -61.0, lat: 7.0 },
  { lon: -70.0, lat: 8.5 },
  { lon: -75.0, lat: 10.5 },
  { lon: -79.5, lat: 11.5 },
  { lon: -81.7, lat: 12.4 },
];

const EUROPE_MAIN_OUTLINE: LonLat[] = [
  { lon: -10.5, lat: 36.0 },
  { lon: -9.0, lat: 39.0 },
  { lon: -9.5, lat: 43.0 },
  { lon: -6.5, lat: 43.8 },
  { lon: -4.5, lat: 46.5 },
  { lon: -1.5, lat: 48.5 },
  { lon: 0.5, lat: 50.0 },
  { lon: 3.0, lat: 51.5 },
  { lon: 6.0, lat: 53.5 },
  { lon: 8.0, lat: 55.5 },
  { lon: 10.0, lat: 57.5 },
  { lon: 12.5, lat: 59.0 },
  { lon: 15.0, lat: 61.0 },
  { lon: 18.0, lat: 63.0 },
  { lon: 20.0, lat: 65.0 },
  { lon: 23.0, lat: 66.0 },
  { lon: 29.0, lat: 69.0 },
  { lon: 33.0, lat: 69.5 },
  { lon: 38.0, lat: 67.5 },
  { lon: 43.0, lat: 66.0 },
  { lon: 47.0, lat: 63.0 },
  { lon: 52.0, lat: 60.0 },
  { lon: 55.0, lat: 58.0 },
  { lon: 58.0, lat: 54.0 },
  { lon: 58.0, lat: 50.0 },
  { lon: 55.0, lat: 47.0 },
  { lon: 52.0, lat: 44.0 },
  { lon: 48.0, lat: 41.0 },
  { lon: 43.0, lat: 38.0 },
  { lon: 38.0, lat: 36.0 },
  { lon: 33.0, lat: 34.0 },
  { lon: 28.0, lat: 36.0 },
  { lon: 24.0, lat: 37.5 },
  { lon: 20.0, lat: 38.5 },
  { lon: 16.0, lat: 40.0 },
  { lon: 12.0, lat: 42.5 },
  { lon: 8.0, lat: 44.0 },
  { lon: 5.0, lat: 43.5 },
  { lon: 2.0, lat: 43.0 },
  { lon: -1.0, lat: 42.5 },
  { lon: -4.0, lat: 41.0 },
  { lon: -6.5, lat: 39.0 },
  { lon: -8.5, lat: 37.0 },
  { lon: -10.5, lat: 36.0 },
];

const UNITED_KINGDOM_OUTLINE: LonLat[] = [
  { lon: -7.5, lat: 54.5 },
  { lon: -6.0, lat: 56.5 },
  { lon: -4.5, lat: 58.5 },
  { lon: -2.5, lat: 59.0 },
  { lon: -1.0, lat: 58.0 },
  { lon: 0.5, lat: 56.0 },
  { lon: 1.5, lat: 53.5 },
  { lon: 0.5, lat: 51.5 },
  { lon: -2.0, lat: 50.0 },
  { lon: -4.0, lat: 50.0 },
  { lon: -6.0, lat: 51.5 },
  { lon: -7.5, lat: 54.5 },
];

const ICELAND_OUTLINE: LonLat[] = [
  { lon: -24.0, lat: 66.5 },
  { lon: -23.0, lat: 65.0 },
  { lon: -20.5, lat: 64.0 },
  { lon: -17.0, lat: 63.5 },
  { lon: -14.0, lat: 64.5 },
  { lon: -13.0, lat: 66.0 },
  { lon: -14.5, lat: 67.0 },
  { lon: -18.0, lat: 67.5 },
  { lon: -22.0, lat: 66.5 },
  { lon: -24.0, lat: 66.5 },
];

const AFRICA_OUTLINE: LonLat[] = [
  { lon: -17.5, lat: 32.0 },
  { lon: -13.0, lat: 30.0 },
  { lon: -10.0, lat: 27.0 },
  { lon: -7.0, lat: 24.0 },
  { lon: -5.0, lat: 21.0 },
  { lon: -2.0, lat: 17.0 },
  { lon: 1.5, lat: 14.0 },
  { lon: 4.5, lat: 11.0 },
  { lon: 8.0, lat: 8.0 },
  { lon: 10.0, lat: 5.0 },
  { lon: 12.0, lat: 2.0 },
  { lon: 13.0, lat: -1.0 },
  { lon: 12.0, lat: -4.0 },
  { lon: 10.0, lat: -6.0 },
  { lon: 8.0, lat: -7.5 },
  { lon: 11.0, lat: -10.0 },
  { lon: 14.0, lat: -12.5 },
  { lon: 17.0, lat: -15.0 },
  { lon: 20.0, lat: -18.0 },
  { lon: 24.0, lat: -22.0 },
  { lon: 28.0, lat: -25.0 },
  { lon: 32.0, lat: -28.0 },
  { lon: 34.0, lat: -31.0 },
  { lon: 33.0, lat: -34.0 },
  { lon: 30.0, lat: -35.5 },
  { lon: 27.0, lat: -34.0 },
  { lon: 24.0, lat: -31.5 },
  { lon: 20.0, lat: -30.0 },
  { lon: 16.0, lat: -26.0 },
  { lon: 12.0, lat: -20.0 },
  { lon: 10.0, lat: -15.0 },
  { lon: 6.0, lat: -5.0 },
  { lon: 5.0, lat: -1.5 },
  { lon: 3.5, lat: 3.0 },
  { lon: 1.0, lat: 6.5 },
  { lon: 0.0, lat: 10.0 },
  { lon: 2.0, lat: 15.0 },
  { lon: 5.0, lat: 20.0 },
  { lon: 8.0, lat: 24.0 },
  { lon: 12.0, lat: 28.0 },
  { lon: 16.0, lat: 30.0 },
  { lon: 20.0, lat: 31.0 },
  { lon: 24.0, lat: 31.5 },
  { lon: 28.0, lat: 31.0 },
  { lon: 32.0, lat: 30.5 },
  { lon: 33.5, lat: 29.0 },
  { lon: 31.0, lat: 28.0 },
  { lon: 28.0, lat: 27.0 },
  { lon: 24.0, lat: 26.0 },
  { lon: 18.0, lat: 24.0 },
  { lon: 11.0, lat: 25.0 },
  { lon: 5.0, lat: 27.5 },
  { lon: -1.0, lat: 29.0 },
  { lon: -6.0, lat: 30.5 },
  { lon: -12.0, lat: 31.5 },
  { lon: -17.5, lat: 32.0 },
];

const ASIA_OUTLINE: LonLat[] = [
  { lon: 26.0, lat: 39.5 },
  { lon: 32.0, lat: 41.0 },
  { lon: 39.0, lat: 44.0 },
  { lon: 45.0, lat: 47.0 },
  { lon: 52.0, lat: 51.0 },
  { lon: 59.0, lat: 53.0 },
  { lon: 66.0, lat: 55.0 },
  { lon: 76.0, lat: 56.0 },
  { lon: 90.0, lat: 59.0 },
  { lon: 105.0, lat: 60.0 },
  { lon: 120.0, lat: 61.0 },
  { lon: 130.0, lat: 61.5 },
  { lon: 140.0, lat: 62.0 },
  { lon: 150.0, lat: 62.5 },
  { lon: 160.0, lat: 61.0 },
  { lon: 170.0, lat: 59.0 },
  { lon: 179.0, lat: 55.0 },
  { lon: 179.0, lat: 50.0 },
  { lon: 170.0, lat: 46.0 },
  { lon: 162.0, lat: 45.0 },
  { lon: 150.0, lat: 43.0 },
  { lon: 142.0, lat: 42.0 },
  { lon: 135.0, lat: 40.0 },
  { lon: 130.0, lat: 38.0 },
  { lon: 126.0, lat: 36.0 },
  { lon: 123.0, lat: 34.0 },
  { lon: 120.0, lat: 32.0 },
  { lon: 117.0, lat: 30.0 },
  { lon: 114.0, lat: 28.0 },
  { lon: 110.0, lat: 25.0 },
  { lon: 106.0, lat: 22.0 },
  { lon: 103.0, lat: 19.0 },
  { lon: 100.0, lat: 16.0 },
  { lon: 96.0, lat: 14.0 },
  { lon: 95.0, lat: 10.0 },
  { lon: 97.0, lat: 7.0 },
  { lon: 101.0, lat: 5.0 },
  { lon: 106.0, lat: 3.0 },
  { lon: 110.0, lat: 2.0 },
  { lon: 112.0, lat: 0.0 },
  { lon: 114.0, lat: -2.0 },
  { lon: 117.0, lat: -3.0 },
  { lon: 120.0, lat: -1.5 },
  { lon: 123.0, lat: 0.5 },
  { lon: 126.0, lat: 2.5 },
  { lon: 129.0, lat: 5.0 },
  { lon: 133.0, lat: 7.0 },
  { lon: 136.0, lat: 4.0 },
  { lon: 140.0, lat: 2.0 },
  { lon: 145.0, lat: 0.0 },
  { lon: 150.0, lat: -3.0 },
  { lon: 154.0, lat: -5.0 },
  { lon: 158.0, lat: -4.0 },
  { lon: 162.0, lat: -1.0 },
  { lon: 165.0, lat: 2.0 },
  { lon: 168.0, lat: 6.0 },
  { lon: 170.0, lat: 11.0 },
  { lon: 172.0, lat: 16.0 },
  { lon: 175.0, lat: 22.0 },
  { lon: 178.0, lat: 28.0 },
  { lon: 175.0, lat: 34.0 },
  { lon: 170.0, lat: 38.0 },
  { lon: 164.0, lat: 42.0 },
  { lon: 154.0, lat: 45.0 },
  { lon: 142.0, lat: 47.0 },
  { lon: 130.0, lat: 49.0 },
  { lon: 118.0, lat: 50.0 },
  { lon: 105.0, lat: 49.0 },
  { lon: 92.0, lat: 48.0 },
  { lon: 80.0, lat: 47.0 },
  { lon: 70.0, lat: 45.0 },
  { lon: 62.0, lat: 43.0 },
  { lon: 54.0, lat: 41.0 },
  { lon: 46.0, lat: 39.0 },
  { lon: 38.0, lat: 36.0 },
  { lon: 34.0, lat: 34.0 },
  { lon: 30.0, lat: 33.0 },
  { lon: 27.0, lat: 35.0 },
  { lon: 26.0, lat: 39.5 },
];

const AUSTRALIA_OUTLINE: LonLat[] = [
  { lon: 113.0, lat: -22.0 },
  { lon: 114.0, lat: -18.0 },
  { lon: 117.0, lat: -15.0 },
  { lon: 121.0, lat: -13.0 },
  { lon: 125.0, lat: -14.0 },
  { lon: 130.0, lat: -15.0 },
  { lon: 134.0, lat: -17.0 },
  { lon: 138.0, lat: -18.0 },
  { lon: 142.0, lat: -18.0 },
  { lon: 146.0, lat: -19.0 },
  { lon: 150.0, lat: -22.0 },
  { lon: 152.0, lat: -24.0 },
  { lon: 154.0, lat: -27.0 },
  { lon: 154.0, lat: -32.0 },
  { lon: 152.0, lat: -35.0 },
  { lon: 149.0, lat: -37.0 },
  { lon: 146.0, lat: -39.0 },
  { lon: 142.0, lat: -39.5 },
  { lon: 138.0, lat: -35.0 },
  { lon: 135.0, lat: -34.0 },
  { lon: 132.0, lat: -31.0 },
  { lon: 128.0, lat: -29.0 },
  { lon: 124.0, lat: -30.0 },
  { lon: 119.0, lat: -32.0 },
  { lon: 116.0, lat: -34.0 },
  { lon: 114.0, lat: -33.0 },
  { lon: 113.0, lat: -27.0 },
  { lon: 113.0, lat: -22.0 },
];

const NEW_ZEALAND_OUTLINE: LonLat[] = [
  { lon: 167.0, lat: -34.0 },
  { lon: 170.0, lat: -36.0 },
  { lon: 173.0, lat: -39.5 },
  { lon: 176.0, lat: -43.0 },
  { lon: 178.0, lat: -46.0 },
  { lon: 177.0, lat: -42.0 },
  { lon: 174.0, lat: -37.0 },
  { lon: 171.0, lat: -34.0 },
  { lon: 167.0, lat: -34.0 },
];

const USA_POLYGON: LonLat[] = [
  { lon: -124.7, lat: 48.4 },
  { lon: -123.0, lat: 46.5 },
  { lon: -122.3, lat: 45.6 },
  { lon: -121.3, lat: 44.5 },
  { lon: -119.8, lat: 43.0 },
  { lon: -118.8, lat: 41.5 },
  { lon: -118.0, lat: 39.5 },
  { lon: -117.2, lat: 37.5 },
  { lon: -115.5, lat: 35.0 },
  { lon: -114.2, lat: 32.8 },
  { lon: -111.5, lat: 31.4 },
  { lon: -108.5, lat: 30.8 },
  { lon: -106.0, lat: 31.3 },
  { lon: -102.5, lat: 29.8 },
  { lon: -99.5, lat: 28.0 },
  { lon: -96.5, lat: 26.0 },
  { lon: -93.0, lat: 27.5 },
  { lon: -89.5, lat: 29.0 },
  { lon: -86.5, lat: 30.0 },
  { lon: -83.5, lat: 29.5 },
  { lon: -81.5, lat: 28.0 },
  { lon: -80.5, lat: 25.2 },
  { lon: -81.7, lat: 24.5 },
  { lon: -83.0, lat: 26.5 },
  { lon: -81.2, lat: 29.5 },
  { lon: -79.5, lat: 32.0 },
  { lon: -78.0, lat: 33.5 },
  { lon: -76.5, lat: 35.5 },
  { lon: -75.0, lat: 37.5 },
  { lon: -74.0, lat: 39.5 },
  { lon: -72.5, lat: 41.5 },
  { lon: -70.5, lat: 43.0 },
  { lon: -68.5, lat: 45.0 },
  { lon: -67.5, lat: 47.0 },
  { lon: -69.5, lat: 47.5 },
  { lon: -72.0, lat: 46.0 },
  { lon: -75.5, lat: 45.0 },
  { lon: -79.5, lat: 44.5 },
  { lon: -83.5, lat: 44.5 },
  { lon: -86.5, lat: 45.5 },
  { lon: -90.5, lat: 46.5 },
  { lon: -95.0, lat: 48.5 },
  { lon: -101.0, lat: 49.0 },
  { lon: -110.0, lat: 49.0 },
  { lon: -118.0, lat: 48.8 },
  { lon: -124.7, lat: 48.4 },
];

const EUROPE_POLYGON: LonLat[] = [
  { lon: -9.5, lat: 36.0 },
  { lon: -8.5, lat: 38.0 },
  { lon: -7.5, lat: 41.5 },
  { lon: -6.0, lat: 43.0 },
  { lon: -4.5, lat: 44.5 },
  { lon: -2.0, lat: 46.5 },
  { lon: 0.5, lat: 48.5 },
  { lon: 2.5, lat: 50.0 },
  { lon: 4.5, lat: 51.5 },
  { lon: 7.0, lat: 52.5 },
  { lon: 9.5, lat: 53.5 },
  { lon: 9.5, lat: 56.0 },
  { lon: 7.5, lat: 57.0 },
  { lon: 3.0, lat: 57.5 },
  { lon: 0.0, lat: 56.5 },
  { lon: -3.5, lat: 54.0 },
  { lon: -6.0, lat: 51.0 },
  { lon: -7.5, lat: 48.0 },
  { lon: -6.0, lat: 45.0 },
  { lon: -3.0, lat: 43.0 },
  { lon: -0.5, lat: 42.5 },
  { lon: 2.0, lat: 42.5 },
  { lon: 3.5, lat: 42.8 },
  { lon: 5.5, lat: 43.2 },
  { lon: 7.0, lat: 43.5 },
  { lon: 9.0, lat: 43.5 },
  { lon: 10.5, lat: 44.5 },
  { lon: 9.0, lat: 46.0 },
  { lon: 6.0, lat: 46.5 },
  { lon: 3.0, lat: 45.5 },
  { lon: 1.0, lat: 44.0 },
  { lon: -1.5, lat: 42.5 },
  { lon: -4.0, lat: 41.0 },
  { lon: -6.5, lat: 39.0 },
  { lon: -8.5, lat: 37.0 },
  { lon: -9.5, lat: 36.0 },
];

const SOUTH_AMERICA_POLYGON: LonLat[] = [
  { lon: -81.5, lat: 12.0 },
  { lon: -78.0, lat: 8.5 },
  { lon: -76.5, lat: 7.0 },
  { lon: -75.5, lat: 4.0 },
  { lon: -74.5, lat: 1.0 },
  { lon: -75.0, lat: -2.0 },
  { lon: -78.5, lat: -5.5 },
  { lon: -81.0, lat: -7.5 },
  { lon: -80.5, lat: -11.0 },
  { lon: -77.0, lat: -15.0 },
  { lon: -73.5, lat: -19.0 },
  { lon: -70.5, lat: -23.0 },
  { lon: -66.5, lat: -26.0 },
  { lon: -62.5, lat: -30.0 },
  { lon: -58.5, lat: -34.0 },
  { lon: -54.5, lat: -37.0 },
  { lon: -50.5, lat: -35.0 },
  { lon: -46.5, lat: -32.0 },
  { lon: -42.5, lat: -25.0 },
  { lon: -39.5, lat: -18.0 },
  { lon: -40.5, lat: -12.0 },
  { lon: -43.5, lat: -6.0 },
  { lon: -47.5, lat: -1.0 },
  { lon: -53.5, lat: 4.5 },
  { lon: -60.5, lat: 6.5 },
  { lon: -67.5, lat: 8.0 },
  { lon: -74.0, lat: 9.5 },
  { lon: -78.5, lat: 10.5 },
  { lon: -81.5, lat: 12.0 },
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
  EUROPE_MAIN_OUTLINE,
  UNITED_KINGDOM_OUTLINE,
  ICELAND_OUTLINE,
  AFRICA_OUTLINE,
  ASIA_OUTLINE,
  AUSTRALIA_OUTLINE,
  NEW_ZEALAND_OUTLINE,
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
