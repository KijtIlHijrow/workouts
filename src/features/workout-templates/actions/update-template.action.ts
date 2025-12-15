"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { ExerciseAttributeValueEnum } from "@prisma/client";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

interface UpdateTemplateData {
  id: string;
  name?: string;
  equipment?: ExerciseAttributeValueEnum[];
  muscles?: ExerciseAttributeValueEnum[];
  exercises?: {
    exerciseId: string;
    order: number;
  }[];
}

export async function updateTemplate(data: UpdateTemplateData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existing = await prisma.workoutTemplate.findFirst({
    where: { id: data.id, userId: session.user.id },
  });

  if (!existing) {
    throw new Error("Template not found");
  }

  // If exercises are provided, delete existing and recreate
  if (data.exercises) {
    await prisma.workoutTemplateExercise.deleteMany({
      where: { templateId: data.id },
    });
  }

  const template = await prisma.workoutTemplate.update({
    where: { id: data.id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.equipment && { equipment: data.equipment }),
      ...(data.muscles && { muscles: data.muscles }),
      ...(data.exercises && {
        exercises: {
          create: data.exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            order: ex.order,
          })),
        },
      }),
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
