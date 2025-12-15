"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface CreateTemplateData {
  name: string;
  equipment: ExerciseAttributeValueEnum[];
  muscles: ExerciseAttributeValueEnum[];
  exercises: {
    exerciseId: string;
    order: number;
  }[];
}

export async function createTemplate(data: CreateTemplateData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const template = await prisma.workoutTemplate.create({
    data: {
      userId: session.user.id,
      name: data.name,
      equipment: data.equipment,
      muscles: data.muscles,
      exercises: {
        create: data.exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          order: ex.order,
        })),
      },
    },
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
  });

  revalidatePath("/");

  return template;
}
