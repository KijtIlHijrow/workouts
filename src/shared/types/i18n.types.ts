import { Locale } from "locales/types";

// Base type for any field that needs internationalization
// Note: Database still stores all locale fields, but app only uses English
export type I18nField<T extends string> = {
  [K in T]: string;
} & {
  [K in T as `${K}En`]: string;
} & {
  [K in T as `${K}Es`]: string;
} & {
  [K in T as `${K}Pt`]: string;
} & {
  [K in T as `${K}Ru`]: string;
} & {
  [K in T as `${K}ZhCn`]: string;
};

// Common i18n fields used across entities
export type I18nText = I18nField<"title"> & I18nField<"description">;
export type I18nSlug = I18nField<"slug">;
export type I18nName = I18nField<"name">;

// Utility type to extract a specific locale field
export type ExtractLocaleField<T extends Record<string, unknown>, Field extends keyof T, L extends Locale> = L extends "en"
  ? T[`${string & Field}En`]
  : never;

// Helper to get field suffix for a locale (always returns "En" since app is English-only)
export function getLocaleSuffix(_locale: Locale): "En" | "" {
  return "En";
}
