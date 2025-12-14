"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/shared/lib/prisma";
import { auth } from "@/features/auth/lib/better-auth";

export async function deleteTemplate(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify ownership
  const existing = await prisma.workoutTemplate.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!existing) {
    throw new Error("Template not found");
  }

  await prisma.workoutTemplate.delete({
    where: { id },
  });

  revalidatePath("/");

  return { success: true };
}
