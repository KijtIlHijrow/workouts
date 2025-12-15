/**
 * Utility functions for getting slugs
 */

interface SlugData {
  slug: string;
  slugEn: string;
}

/**
 * Gets the English slug
 */
export function getSlugForLocale(slugData: SlugData, _locale: string): string {
  return slugData.slugEn;
}

/**
 * Gets the English title
 */
interface TitleData {
  title: string;
  titleEn: string;
}

export function getTitleForLocale(titleData: TitleData, _locale: string): string {
  return titleData.titleEn;
}
