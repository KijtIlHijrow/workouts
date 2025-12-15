export const LocalizedMetadata = {
  en: {
    title: "Workout Cool",
    description: "Modern fitness coaching platform with comprehensive exercise database",
    keywords: [
      "fitness",
      "workout",
      "exercise",
      "training",
      "muscle building",
      "strength training",
      "bodybuilding",
      "fitness app",
      "workout planner",
      "exercise database",
    ],
    ogAlt: "Workout Cool - Modern fitness platform",
    applicationName: "Workout Cool",
    category: "fitness",
    classification: "Fitness & Health",
  },
} as const;

export type SupportedLocale = keyof typeof LocalizedMetadata;

export function getLocalizedMetadata(_locale: string) {
  return LocalizedMetadata.en;
}
