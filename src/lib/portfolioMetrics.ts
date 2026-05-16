import { ContractType, ProjectRegion, ProjectSector, ResumeData } from '../types';

export type SectorKey = ProjectSector;
export type RegionKey = ProjectRegion;

export type ProjectWithMetrics = ResumeData['key_projects'][number] & {
  sectorKey: SectorKey;
  sectorLabel: string;
  contractType: ContractType;
  regionKey: RegionKey;
  regionLabel: string;
  parsedValueMillions: number | null;
};

type ValueSectorKey = SectorKey | 'all';

const CONTRACT_TYPES: ContractType[] = ['P3', 'PDB', 'DB', 'DBB', 'CMAR', 'Alliance', 'Other'];

const SECTOR_LABELS: Record<SectorKey, string> = {
  rail: 'Rail & Transit',
  highway: 'Highway & Bridges',
  other: 'Water & Utilities',
};

const VALUE_SECTOR_LABELS: Record<ValueSectorKey, string> = {
  all: 'Total Portfolio',
  ...SECTOR_LABELS,
};

const REGION_LABELS: Record<RegionKey, string> = {
  usa: 'United States',
  canada: 'Canada',
  europe: 'Europe',
  'south-america': 'South America',
  other: 'Other',
};

const CAD_TO_USD = 0.7272;
const EUR_TO_USD = 1.1626;

const SECTOR_KEYS: SectorKey[] = ['rail', 'highway', 'other'];
const REGION_KEYS: RegionKey[] = ['usa', 'canada', 'europe', 'south-america', 'other'];

const parseDateToken = (value: string | undefined, fallbackYear = 2003) => {
  if (!value) return fallbackYear;

  if (/present/i.test(value)) {
    const now = new Date();
    return now.getFullYear() + now.getMonth() / 12;
  }

  const match = value.match(/(?:(\d{1,2})[./\s-])?(\d{4})/);
  if (!match) return fallbackYear;

  const month = match[1] ? Number(match[1]) - 1 : 0;
  return Number(match[2]) + Math.max(month, 0) / 12;
};

export const parseDateRange = (range: string | undefined) => {
  if (!range) return null;

  const [startToken, endToken] = range.split(/\s*(?:-|–|—)\s*/);
  const start = parseDateToken(startToken);
  const end = endToken ? parseDateToken(endToken, start) : start;

  return {
    start,
    end: Math.max(end, start),
    years: Math.max(end - start, 0),
  };
};

export const formatYears = (years: number) => {
  if (years >= 10) return `${Math.round(years)}+`;
  if (years >= 1) return years.toFixed(1).replace(/\.0$/, '');
  return '<1';
};

export const getProjectSector = (project: ResumeData['key_projects'][number]): SectorKey => {
  if (project.sector && SECTOR_KEYS.includes(project.sector)) {
    return project.sector;
  }

  const text = `${project.name} ${project.scope ?? ''}`.toLowerCase();

  if (/\b(rail|tram|track|transit|high-speed|subway|station|stations|guideway|lrt)\b/.test(text)) return 'rail';

  if (
    /\b(highway|interstate|express|parkway|toll|road|lane|bridge|corridor)\b/.test(text) ||
    /\b(i-|sr-|ap1|r-3|m-50|bi-625)\b/.test(text)
  ) {
    return 'highway';
  }

  return 'other';
};

export const getProjectRegion = (project: ResumeData['key_projects'][number]): RegionKey => {
  if (project.region && REGION_KEYS.includes(project.region)) {
    return project.region;
  }

  const text = `${project.location ?? ''} ${project.name} ${project.client ?? ''} ${project.scope ?? ''}`.toLowerCase();

  if (/\b(canada|ontario|toronto|metrolinx|scarborough|ontario line)\b/.test(text)) {
    return 'canada';
  }

  if (/\b(usa|dc|ga|la|tx|in|washington|atlanta|louisiana|texas|indiana|houston|bloomington)\b/.test(text)) {
    return 'usa';
  }

  if (/\b(spain|basque|castile|catalonia|madrid|gernika|girona|eibar|bergara|legutiano|andoain|urnieta|pisuerga)\b/.test(text)) {
    return 'europe';
  }

  if (/\b(colombia|medellin|medellín)\b/.test(text)) return 'south-america';

  return 'other';
};

export const getProjectContractType = (project: ResumeData['key_projects'][number]): ContractType => {
  if (project.contract_type && CONTRACT_TYPES.includes(project.contract_type)) {
    return project.contract_type;
  }

  const text = `${project.name} ${project.scope ?? ''} ${project.achievement ?? ''}`.toLowerCase();

  if (/\bpdb\b|progressive design-build/.test(text)) return 'PDB';
  if (/\bcmar\b/.test(text)) return 'CMAR';
  if (/\bp3\b|public-private/.test(text)) return 'P3';
  if (/\balliance\b/.test(text)) return 'Alliance';
  if (/\bdb\b|design-build/.test(text)) return 'DB';

  return 'Other';
};

export const parseProjectValueMillions = (value: string) => {
  const normalized = value.replace(/,/g, '').trim();
  const match = normalized.match(/([$€]|eur|cad)?\s*([\d.]+)\s*([mb])?/i);
  if (!match) return null;

  const amount = Number(match[2]);
  if (!Number.isFinite(amount)) return null;

  const unit = match[3]?.toLowerCase();
  const millions = unit === 'b' ? amount * 1000 : amount;

  if (/\bcad\b/i.test(normalized)) {
    return millions * CAD_TO_USD;
  }

  if (/€|\beur\b/i.test(normalized)) {
    return millions * EUR_TO_USD;
  }

  return millions;
};

export const enrichProjects = (projects: ResumeData['key_projects']): ProjectWithMetrics[] => {
  return projects.map((project) => {
    const sectorKey = getProjectSector(project);
    const regionKey = getProjectRegion(project);

    return {
      ...project,
      sectorKey,
      sectorLabel: SECTOR_LABELS[sectorKey],
      contractType: getProjectContractType(project),
      regionKey,
      regionLabel: REGION_LABELS[regionKey],
      parsedValueMillions: parseProjectValueMillions(project.value),
    };
  });
};

const roundedMillions = (value: number) => Math.round(value);

const getUniqueCoveredYears = (projects: ProjectWithMetrics[], sector: SectorKey) => {
  const years = new Set<number>();

  projects
    .filter((project) => project.sectorKey === sector)
    .forEach((project) => {
      const range = parseDateRange(project.timeframe);
      if (!range) return;

      const startYear = Math.floor(range.start);
      const endYear = Math.max(startYear, Math.ceil(range.end));
      for (let year = startYear; year <= endYear; year += 1) {
        years.add(year);
      }
    });

  return years.size;
};

export const buildPortfolioMetrics = (data: ResumeData) => {
  const projects = enrichProjects(data.key_projects);
  const careerStart = Math.min(...data.work_experience.map((experience) => parseDateRange(experience.duration)?.start ?? 2003));
  const careerEnd = Math.max(...data.work_experience.map((experience) => parseDateRange(experience.duration)?.end ?? careerStart));
  const largestProject = projects.reduce<ProjectWithMetrics | null>((largest, project) => {
    if (project.parsedValueMillions === null) return largest;
    if (!largest || (largest.parsedValueMillions ?? 0) < project.parsedValueMillions) return project;
    return largest;
  }, null);

  const valueSectorKeys: ValueSectorKey[] = ['all', ...SECTOR_KEYS];
  const sectorChart = valueSectorKeys.map((sector) => {
    const sectorProjects = sector === 'all'
      ? projects
      : projects.filter((project) => project.sectorKey === sector);

    const valueMillions = sectorProjects.reduce((total, project) => total + (project.parsedValueMillions ?? 0), 0);

    return {
      key: sector,
      name: VALUE_SECTOR_LABELS[sector],
      count: sectorProjects.length,
      valueMillions: roundedMillions(valueMillions),
    };
  }).filter((item) => item.count > 0);

  const projectCountBySectorChart = SECTOR_KEYS.map((sector) => {
    const sectorProjects = projects.filter((project) => project.sectorKey === sector);
    return {
      key: sector,
      name: SECTOR_LABELS[sector],
      count: sectorProjects.length,
    };
  }).filter((item) => item.count > 0);

  const contractChart = CONTRACT_TYPES.map((contractType) => ({
    key: contractType,
    name: contractType,
    count: projects.filter((project) => project.contractType === contractType).length,
  })).filter((item) => item.count > 0);

  return {
    projects,
    careerYears: careerEnd - careerStart,
    totalProjects: projects.length,
    railProjects: projects.filter((project) => project.sectorKey === 'rail').length,
    highwayProjects: projects.filter((project) => project.sectorKey === 'highway').length,
    railYears: getUniqueCoveredYears(projects, 'rail'),
    highwayYears: getUniqueCoveredYears(projects, 'highway'),
    largestProject,
    regions: Array.from(new Set(projects.map((project) => project.regionKey).filter((region) => region !== 'other'))),
    contractChart,
    sectorChart,
    projectCountBySectorChart,
  };
};
