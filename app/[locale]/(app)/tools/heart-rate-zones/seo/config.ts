import { Locale } from "locales/types";

// All SEO metadata in one place for easy maintenance
export const HEART_RATE_ZONES_SEO: Record<
  Locale,
  {
    title: string;
    description: string;
    keywords: string[];
  }
> = {
  en: {
    title: "Discover your ideal heart rate training zones for optimal workouts",
    description:
      "Calculate your personalized heart rate training zones with our free calculator. Basic & Karvonen formulas, age-based chart, complete guide to optimize your cardio workouts.",
    keywords: [
      "heart rate zones calculator",
      "target heart rate calculator",
      "maximum heart rate",
      "training zones",
      "VO2 max zone",
      "anaerobic zone",
      "aerobic zone",
      "fat burn zone",
      "Karvonen formula",
      "heart rate training",
      "THR calculator",
      "MHR calculator",
      "cardio zones",
      "fitness calculator",
      "heart rate by age",
    ],
  },
};
