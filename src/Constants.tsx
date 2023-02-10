export const CONTINENTS = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

export const MAX_TEXT_LENGTH = 100;

export const TRUNCATE_MAX_TEXT_LENGTH = 125;

export const EMBED_LINK_ROOT = 'https://informal-economy.netlify.app/';

export const PARENT_LINK_ROOT = 'https://data.undp.org/informal-economy/';

export const DEFAULT_VALUES = {
  firstMetric: 'Percentage of informal employment',
  secondMetric: 'Access to internet, percent of population',
  colorMetric: 'Continents',
};

export const INCOME_GROUPS = ['Low income', 'Lower middle income', 'Upper middle income', 'High income'];

export const HDI_LEVELS = ['Low', 'Medium', 'High', 'Very High'];

export const DATALINK = process.env.NODE_ENV === 'production' ? 'https://raw.githubusercontent.com/UNDP-Data/Access-All-Data-Data-Repo/main/output_minified.json' : 'https://raw.githubusercontent.com/UNDP-Data/Access-All-Data-Data-Repo/main/output_minified.json';
export const METADATALINK = process.env.NODE_ENV === 'production' ? 'https://raw.githubusercontent.com/UNDP-Data/Indicators-MetaData/for-redesign/indicatorMetaData.json' : 'https://raw.githubusercontent.com/UNDP-Data/Indicators-MetaData/for-redesign/indicatorMetaData.json';
export const COUNTRYTAXONOMYLINK = process.env.NODE_ENV === 'production' ? 'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json' : 'https://raw.githubusercontent.com/UNDP-Data/country-taxonomy-from-azure/main/country_territory_groups.json';
