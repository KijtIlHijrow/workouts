/* eslint-disable max-len */
import { Locale } from "locales/types";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";
import { ProgramSessionWithExercises } from "@/entities/program-session/types/program-session.types";
import { ProgramI18nReference } from "@/entities/program/types/program.types";

import { getSessionTitle, getSessionDescription, getProgramTitle } from "./translations-mapper";

export function generateSessionSEOKeywords(session: ProgramSessionWithExercises, program: ProgramI18nReference, locale: Locale): string[] {
  const baseData = getLocalizedMetadata(locale);
  const sessionTitle = getSessionTitle(session, locale);
  const programTitle = getProgramTitle(program, locale);

  const exerciseNames = session.exercises.map((ex) => ex.exercise.nameEn || ex.exercise.name);

  const localizedSessionType = "workout session";

  return [
    ...baseData.keywords,
    sessionTitle.toLowerCase(),
    programTitle.toLowerCase(),
    localizedSessionType,
    ...exerciseNames.map((name) => name.toLowerCase()),
    "fitness",
    "exercise",
    "training",
    "workout",
  ];
}

export function generateSessionMetadata(session: ProgramSessionWithExercises, program: ProgramI18nReference, locale: Locale) {
  const sessionTitle = getSessionTitle(session, locale);
  const programTitle = getProgramTitle(program, locale);
  const sessionDescription = getSessionDescription(session, locale);
  const keywords = generateSessionSEOKeywords(session, program, locale);

  const title = `${sessionTitle} - ${programTitle}`;
  const description =
    sessionDescription ||
    `${sessionTitle} workout session from the ${programTitle} program. ${session.exercises.length} exercises, ~${Math.round(session.exercises.length * 3)} minutes.`;

  return {
    title,
    description,
    keywords: keywords.join(", "),
  };
}
