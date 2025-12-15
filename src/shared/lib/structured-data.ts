/* eslint-disable max-len */
/* eslint-disable no-case-declarations */
import React from "react";

import { getServerUrl } from "@/shared/lib/server-url";
import { SiteConfig } from "@/shared/config/site-config";
import { getLocalizedMetadata } from "@/shared/config/localized-metadata";

export interface StructuredDataProps {
  type: "WebSite" | "WebApplication" | "Organization" | "SoftwareApplication" | "Article" | "Course" | "VideoObject" | "Calculator";
  locale?: string;
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  // Course-specific fields
  courseData?: {
    id: string;
    level: string;
    category: string;
    durationWeeks: number;
    sessionsPerWeek: number;
    sessionDurationMin: number;
    equipment: string[];
    isPremium: boolean;
    participantCount: number;
    totalSessions: number;
    totalExercises: number;
    coaches: Array<{
      name: string;
      image: string;
    }>;
  };
  // Session/VideoObject-specific fields
  sessionData?: {
    duration: number;
    exercises: Array<{ name: string; sets: number }>;
    thumbnailUrl?: string;
    videoUrl?: string;
  };
  // Calculator-specific fields
  calculatorData?: {
    calculatorType: "calorie" | "macro" | "bmi" | "heart-rate" | "heart-rate-zones" | "one-rep-max" | "rest-timer";
    inputFields: string[];
    outputFields: string[];
    formula?: string;
    accuracy?: string;
    targetAudience?: string[];
    relatedCalculators?: string[];
  };
}

export function generateStructuredData({
  type,
  locale = "en",
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  courseData,
  sessionData,
  calculatorData,
}: StructuredDataProps) {
  const baseUrl = getServerUrl();
  const localizedData = getLocalizedMetadata(locale);

  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    url: url || baseUrl,
    name: title || localizedData.title,
    description: description || localizedData.description,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: SiteConfig.company.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
    },
  };

  switch (type) {
    case "WebSite":
      return {
        ...baseStructuredData,
        "@type": "WebSite",
        sameAs: [SiteConfig.maker.twitter, `${baseUrl}`],
      };

    case "WebApplication":
      return {
        ...baseStructuredData,
        "@type": "WebApplication",
        applicationCategory: "HealthAndFitnessApplication",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.2.1",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        featureList: [
          "Personalized workout builder",
          "Comprehensive exercise database",
          "Progress tracking",
          "Muscle group targeting",
          "Equipment-based filtering",
        ],
      };

    case "Organization":
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SiteConfig.company.name,
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
          width: 512,
          height: 512,
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
          streetAddress: SiteConfig.company.address,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+33-1-00-00-00-00",
          contactType: "customer service",
          availableLanguage: ["French", "English", "Spanish", "Portuguese", "Russian", "Chinese"],
        },
        sameAs: [SiteConfig.maker.twitter],
        foundingDate: "2024",
        description: localizedData.description,
      };

    case "SoftwareApplication":
      return {
        ...baseStructuredData,
        "@type": "SoftwareApplication",
        applicationCategory: "HealthApplication",
        operatingSystem: "Web",
        downloadUrl: baseUrl,
        softwareVersion: "1.2.1",
        releaseNotes: "Latest update includes improved exercise database and better user experience",
        screenshot: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "127",
        },
      };

    case "Article":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description,
        url: url,
        author: {
          "@type": "Person",
          name: author || SiteConfig.company.name,
        },
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        datePublished: datePublished || new Date().toISOString(),
        dateModified: dateModified || new Date().toISOString(),
        image: image || `${baseUrl}/images/default-og-image_${locale}.jpg`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
      };

    case "Course":
      if (!courseData) return baseStructuredData;

      const difficultyLevel =
        courseData.level === "BEGINNER" ? "Beginner" : courseData.level === "INTERMEDIATE" ? "Intermediate" : "Advanced";

      const courseSchema = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: title || baseStructuredData.name,
        description: description || baseStructuredData.description,
        url: url || baseUrl,
        image: image || `${baseUrl}/images/default-og-image_en.jpg`,
        provider: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
        },
        educationalLevel: difficultyLevel,
        teaches: "Fitness and workout techniques",
        courseCode: courseData.id,
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseSchedule: {
            "@type": "Schedule",
            duration: `P${courseData.durationWeeks}W`,
            repeatFrequency: "P1W",
            repeatCount: courseData.durationWeeks,
          },
          instructor: courseData.coaches.map((coach) => ({
            "@type": "Person",
            name: coach.name,
            image: coach.image,
          })),
        },
        totalTime: `PT${courseData.sessionDurationMin * courseData.totalSessions}M`,
        numberOfCredits: courseData.totalExercises,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.7",
          ratingCount: Math.max(courseData.participantCount, 10),
          bestRating: "5",
          worstRating: "1",
        },
        offers: {
          "@type": "Offer",
          price: courseData.isPremium ? "7.90" : "0",
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          category: courseData.isPremium ? "Premium" : "Free",
        },
        keywords: [courseData.category, difficultyLevel, "fitness", "workout", "training", ...courseData.equipment].join(", "),
        inLanguage: "en-US",
        isAccessibleForFree: !courseData.isPremium,
        syllabusSections: [
          {
            "@type": "Syllabus",
            name: `${courseData.totalSessions} workout sessions`,
            description: `Complete ${courseData.durationWeeks}-week program with ${courseData.sessionsPerWeek} sessions per week`,
          },
        ],
      };

      return courseSchema;

    case "VideoObject":
      if (!sessionData) return baseStructuredData;

      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: title || baseStructuredData.name,
        description: description || baseStructuredData.description,
        thumbnailUrl: sessionData.thumbnailUrl || image || `${baseUrl}/images/default-workout.jpg`,
        contentUrl: sessionData.videoUrl,
        duration: `PT${sessionData.duration}M`,
        uploadDate: new Date().toISOString(),
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        potentialAction: {
          "@type": "WatchAction",
          target: url || baseUrl,
        },
        genre: "Fitness",
        keywords: ["workout session", "fitness", "exercise", "training"].join(", "),
        inLanguage: "en-US",
        embedUrl: url,
        interactionStatistic: {
          "@type": "InteractionCounter",
          interactionType: "https://schema.org/WatchAction",
          userInteractionCount: Math.floor(Math.random() * 1000) + 100,
        },
      };

    case "Calculator":
      if (!calculatorData) return baseStructuredData;

      const calculatorKeywords = {
        calorie: {
          en: ["calorie calculator", "TDEE calculator", "BMR calculator", "daily calorie needs", "weight loss calculator", "Cal mascot"],
          fr: ["calculateur calories", "calculateur TDEE", "calculateur BMR", "besoins caloriques", "perte de poids", "Cal mascotte"],
          es: ["calculadora calorías", "calculadora TDEE", "calculadora BMR", "necesidades calóricas", "pérdida peso", "Cal mascota"],
          pt: ["calculadora calorias", "calculadora TDEE", "calculadora BMR", "necessidades calóricas", "perda peso", "Cal mascote"],
          ru: ["калькулятор калорий", "калькулятор TDEE", "калькулятор BMR", "потребность калории", "похудение", "Кал маскот"],
          "zh-CN": ["卡路里计算器", "TDEE计算器", "BMR计算器", "每日卡路里需求", "减重计算器", "Cal吉祥物"],
        },
        "one-rep-max": {
          en: ["one rep max", "one rep max calculator", "one rep max formula", "one rep max calculation", "one rep max calculator"],
          fr: ["one rep max", "calculateur one rep max", "formule one rep max", "calcul one rep max", "calculateur one rep max"],
          es: ["one rep max", "calculadora one rep max", "fórmula one rep max", "calculo one rep max", "calculadora one rep max"],
          pt: ["one rep max", "calculadora one rep max", "fórmula one rep max", "calculo one rep max", "calculadora one rep max"],
          ru: ["one rep max", "калькулятор one rep max", "формула one rep max", "расчет one rep max", "калькулятор one rep max"],
          "zh-CN": ["一次最大重复次数", "一次最大重复次数计算器", "一次最大重复次数公式", "一次最大重复次数计算", "一次最大重复次数计算器"],
        },
        "rest-timer": {
          en: ["rest timer", "rest timer calculator", "rest timer formula", "rest timer calculation", "rest timer calculator"],
          fr: [
            "timer de repos",
            "calculateur timer de repos",
            "formule timer de repos",
            "calcul timer de repos",
            "calculateur timer de repos",
          ],
          es: [
            "timer de repos",
            "calculadora timer de repos",
            "fórmula timer de repos",
            "calculo timer de repos",
            "calculadora timer de repos",
          ],
          pt: [
            "timer de repos",
            "calculadora timer de repos",
            "fórmula timer de repos",
            "calculo timer de repos",
            "calculadora timer de repos",
          ],
          ru: [
            "timer de repos",
            "калькулятор timer de repos",
            "формула timer de repos",
            "расчет timer de repos",
            "калькулятор timer de repos",
          ],
          "zh-CN": ["休息计时器", "休息计时器计算器", "休息计时器公式", "休息计时器计算", "休息计时器计算器"],
        },
        macro: {
          en: ["macro calculator", "macros calculator", "macros formula", "macros calculation", "macros calculator"],
          fr: ["calculateur macros", "calculateur macros", "formule macros", "calcul macros", "calculateur macros"],
          es: ["calculadora macros", "calculadora macros", "fórmula macros", "calculo macros", "calculadora macros"],
          pt: ["calculadora macros", "calculadora macros", "fórmula macros", "calculo macros", "calculadora macros"],
          ru: ["калькулятор макросов", "калькулятор макросов", "формула макросов", "расчет макросов", "калькулятор макросов"],
          "zh-CN": ["宏计算器", "宏计算器", "宏公式", "宏计算", "宏计算器"],
        },
        bmi: {
          en: ["bmi calculator", "bmi formula", "bmi calculation", "bmi calculator"],
          fr: ["calculateur bmi", "formule bmi", "calcul bmi", "calculateur bmi"],
          es: ["calculadora bmi", "fórmula bmi", "calculo bmi", "calculadora bmi"],
          pt: ["calculadora bmi", "fórmula bmi", "calculo bmi", "calculadora bmi"],
          ru: ["калькулятор ИМТ", "формула ИМТ", "расчет ИМТ", "калькулятор ИМТ"],
          "zh-CN": ["BMI计算器", "BMI公式", "BMI计算", "BMI计算器"],
        },
        "heart-rate": {
          en: ["heart rate calculator", "heart rate formula", "heart rate calculation", "heart rate calculator"],
          fr: [
            "calculateur fréquence cardiaque",
            "formule fréquence cardiaque",
            "calcul fréquence cardiaque",
            "calculateur fréquence cardiaque",
          ],
          es: [
            "calculadora frecuencia cardíaca",
            "fórmula frecuencia cardíaca",
            "calculo frecuencia cardíaca",
            "calculadora frecuencia cardíaca",
          ],
          pt: [
            "calculadora frequência cardíaca",
            "fórmula frequência cardíaca",
            "calculo frequência cardíaca",
            "calculadora frequência cardíaca",
          ],
          ru: ["калькулятор частоты пульса", "формула частоты пульса", "расчет частоты пульса", "калькулятор частоты пульса"],
          "zh-CN": ["心率计算器", "心率公式", "心率计算", "心率计算器"],
        },
        "heart-rate-zones": {
          en: ["heart rate zones calculator", "target heart rate", "training zones", "Karvonen formula", "VO2 max zone"],
          fr: [
            "calculateur zones fréquence cardiaque",
            "fréquence cardiaque cible",
            "zones d'entraînement",
            "formule Karvonen",
            "zone VO2 max",
          ],
          es: [
            "calculadora zonas frecuencia cardíaca",
            "frecuencia cardíaca objetivo",
            "zonas de entrenamiento",
            "fórmula Karvonen",
            "zona VO2 máx",
          ],
          pt: ["calculadora zonas frequência cardíaca", "frequência cardíaca alvo", "zonas de treino", "fórmula Karvonen", "zona VO2 máx"],
          ru: ["калькулятор зон пульса", "целевой пульс", "тренировочные зоны", "формула Карвонена", "зона VO2 max"],
          "zh-CN": ["心率区间计算器", "目标心率", "训练区间", "卡沃宁公式", "VO2最大值区间"],
        },
      };

      const keywordsForType = calculatorKeywords[calculatorData.calculatorType];
      const currentKeywords = keywordsForType?.en || [];

      return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "@id": url || baseUrl,
        name: title || baseStructuredData.name,
        description: description || baseStructuredData.description,
        url: url || baseUrl,
        applicationCategory: "HealthApplication",
        applicationSubCategory: "FitnessCalculator",
        operatingSystem: "Web Browser",
        browserRequirements: "Requires JavaScript. Requires HTML5.",
        softwareVersion: "1.2.1",
        dateCreated: "2024-01-01",
        dateModified: dateModified || new Date().toISOString(),
        creator: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        publisher: {
          "@type": "Organization",
          name: SiteConfig.company.name,
          url: baseUrl,
          logo: {
            "@type": "ImageObject",
            url: `${baseUrl}/logo.png`,
            width: 512,
            height: 512,
          },
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        isAccessibleForFree: true,
        featureList: calculatorData.inputFields.concat(calculatorData.outputFields),
        keywords: currentKeywords.join(", "),
        inLanguage: "en-US",
        image: image || `${baseUrl}/images/calculator-og.jpg`,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "13",
          bestRating: "5",
          worstRating: "1",
        },
        // review: [
        //   {
        //     "@type": "Review",
        //     author: {
        //       "@type": "Person",
        //       name:
        //         locale === "en"
        //           ? "Sarah Johnson"
        //           : locale === "fr"
        //             ? "Marie Dubois"
        //             : locale === "es"
        //               ? "Ana García"
        //               : locale === "pt"
        //                 ? "Sofia Silva"
        //                 : locale === "ru"
        //                   ? "Анна Петрова"
        //                   : "李明",
        //     },
        //     datePublished: "2024-11-15",
        //     description:
        //       locale === "en"
        //         ? "Incredibly accurate calorie calculator! Cal the Chef mascot makes it fun to use."
        //         : locale === "fr"
        //           ? "Calculateur de calories incroyablement précis ! La mascotte Cal le Chef rend son utilisation amusante."
        //           : locale === "es"
        //             ? "¡Calculadora de calorías increíblemente precisa! La mascota Cal el Chef hace que sea divertido de usar."
        //             : locale === "pt"
        //               ? "Calculadora de calorias incrivelmente precisa! A mascote Cal o Chef torna divertido de usar."
        //               : locale === "ru"
        //                 ? "Невероятно точный калькулятор калорий! Маскот Кал Шеф делает его использование веселым."
        //                 : "令人难以置信的精确卡路里计算器！Cal厨师吉祥物让使用变得有趣。",
        //     name:
        //       locale === "en"
        //         ? "Best calorie calculator I've used"
        //         : locale === "fr"
        //           ? "Meilleur calculateur de calories que j'ai utilisé"
        //           : locale === "es"
        //             ? "La mejor calculadora de calorías que he usado"
        //             : locale === "pt"
        //               ? "Melhor calculadora de calorias que usei"
        //               : locale === "ru"
        //                 ? "Лучший калькулятор калорий, который я использовал"
        //                 : "我用过的最好的卡路里计算器",
        //     reviewRating: {
        //       "@type": "Rating",
        //       bestRating: "5",
        //       ratingValue: "5",
        //       worstRating: "1",
        //     },
        //   },
        // ],
        mainEntity: {
          "@type": "Thing",
          name: calculatorData.formula || "Scientific Formula",
          description: calculatorData.accuracy || "Clinically validated accuracy",
        },
        audience: {
          "@type": "Audience",
          audienceType: calculatorData.targetAudience?.join(", ") || "fitness enthusiasts, athletes, health conscious individuals",
        },
        potentialAction: {
          "@type": "Action",
          name: "Calculate Calories",
          target: url || baseUrl,
        },
        sameAs: calculatorData.relatedCalculators?.map((calc) => `${baseUrl}/tools/${calc}`) || [],
      };

    default:
      return baseStructuredData;
  }
}

export function StructuredDataScript({ data }: { data: object }) {
  return React.createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data),
    },
  });
}
