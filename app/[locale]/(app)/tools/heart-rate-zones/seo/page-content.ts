import { Locale } from "locales/types";

interface PageContent {
  heroSubtitle: string;
}

// Page content separate from SEO metadata
export const HEART_RATE_ZONES_CONTENT: Record<Locale, PageContent> = {
  en: {
    heroSubtitle: "Discover your personalized training zones to optimize performance, burn more fat, and improve cardiovascular fitness",
  },
};
