"use client";

import { createI18nClient } from "next-international/client";

export const languages = ["en"];

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, defineLocale, useCurrentLocale } = createI18nClient(
  {
    en: async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return import("./en");
    },
  },
  {},
);

export type TFunction = Awaited<ReturnType<typeof useI18n>>;
