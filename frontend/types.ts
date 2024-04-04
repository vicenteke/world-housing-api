export interface HousingDataStatsType {
  month: string;
  variation: number;
  squareMeterPrice: number;
}

export interface HousingDataType {
  name: string;
  data: Array<HousingDataStatsType>;
  month: string;
  finalMonth?: string;
  variation?: number;
};

export interface HousingCountryType {
  name: string;
  baseUri: string;
  states?: { name: string, abbreviation: string }[];
}
