"use server";

import { headers } from "next/headers";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function getTemplates() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return [];
  }

  const templates = await prisma.workoutTemplate.findMany({
    where: { userId: session.user.id },
    include: {
      exercises: {
        include: {
          exercise: {
            include: {
              attributes: {
                include: {
                  attributeName: true,
                  attributeValue: true,
                },
              },
            },
          },
          sets: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return templates;
}

export type WorkoutTemplateWithExercises = Awaited<ReturnType<typeof getTemplates>>[number];
