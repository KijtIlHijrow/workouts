import { ExerciseAttributeNameEnum, ExerciseAttributeValueEnum, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function ensureAttributeNameExists(name: ExerciseAttributeNameEnum) {
  let attributeName = await prisma.exerciseAttributeName.findFirst({
    where: { name },
  });

  if (!attributeName) {
    attributeName = await prisma.exerciseAttributeName.create({
      data: { name },
    });
  }

  return attributeName;
}

async function ensureAttributeValueExists(attributeNameId: string, value: ExerciseAttributeValueEnum) {
  let attributeValue = await prisma.exerciseAttributeValue.findFirst({
    where: {
      attributeNameId,
      value,
    },
  });

  if (!attributeValue) {
    attributeValue = await prisma.exerciseAttributeValue.create({
      data: {
        attributeNameId,
        value,
      },
    });
  }

  return attributeValue;
}

async function createAttribute(exerciseId: string, nameEnum: ExerciseAttributeNameEnum, valueEnum: ExerciseAttributeValueEnum) {
  const attributeName = await ensureAttributeNameExists(nameEnum);
  const attributeValue = await ensureAttributeValueExists(attributeName.id, valueEnum);

  // Check if attribute already exists
  const existing = await prisma.exerciseAttribute.findFirst({
    where: {
      exerciseId,
      attributeNameId: attributeName.id,
      attributeValueId: attributeValue.id,
    },
  });

  if (!existing) {
    await prisma.exerciseAttribute.create({
      data: {
        exerciseId,
        attributeNameId: attributeName.id,
        attributeValueId: attributeValue.id,
      },
    });
  }
}

async function main() {
  console.log("🚀 Adding Cable Lateral Raise exercise...\n");

  const slug = slugify("Cable Lateral Raise");
  const slugFr = slugify("Élévation latérale à la poulie");

  // Check if exercise already exists
  const existing = await prisma.exercise.findFirst({
    where: {
      OR: [{ slug: slugFr }, { slugEn: slug }],
    },
  });

  if (existing) {
    console.log("⚠️  Exercise already exists:", existing.name);
    await prisma.$disconnect();
    return;
  }

  const descriptionEn = `1. Set the cable pulley to the lowest position and attach a single handle.
2. Stand sideways to the cable machine, feet shoulder-width apart.
3. Grasp the handle with your outside hand (the one farthest from the machine).
4. Keep your arm slightly bent at the elbow throughout the movement.
5. Raise your arm out to the side until it reaches shoulder height.
6. Hold briefly at the top, squeezing your shoulder.
7. Lower the weight slowly and with control back to the starting position.
8. Complete all reps on one side, then switch to the other side.`;

  const descriptionFr = `1. Réglez la poulie au niveau le plus bas et attachez une poignée simple.
2. Tenez-vous de côté par rapport à la machine, pieds à largeur d'épaules.
3. Saisissez la poignée avec la main extérieure (celle la plus éloignée de la machine).
4. Gardez le bras légèrement fléchi au coude pendant tout le mouvement.
5. Levez le bras sur le côté jusqu'à atteindre la hauteur des épaules.
6. Maintenez brièvement en haut, en contractant l'épaule.
7. Redescendez le poids lentement et de manière contrôlée jusqu'à la position de départ.
8. Effectuez toutes les répétitions d'un côté, puis changez de côté.`;

  // Create the exercise
  const exercise = await prisma.exercise.create({
    data: {
      name: "Élévation latérale à la poulie",
      nameEn: "Cable Lateral Raise",
      description: descriptionFr,
      descriptionEn: descriptionEn,
      slug: slugFr,
      slugEn: slug,
    },
  });

  console.log("✅ Exercise created:", exercise.nameEn);

  // Add attributes
  await createAttribute(exercise.id, "TYPE", "STRENGTH");
  console.log("   🏷️  Added TYPE: STRENGTH");

  await createAttribute(exercise.id, "PRIMARY_MUSCLE", "SHOULDERS");
  console.log("   🏷️  Added PRIMARY_MUSCLE: SHOULDERS");

  await createAttribute(exercise.id, "EQUIPMENT", "CABLE");
  console.log("   🏷️  Added EQUIPMENT: CABLE");

  await createAttribute(exercise.id, "MECHANICS_TYPE", "ISOLATION");
  console.log("   🏷️  Added MECHANICS_TYPE: ISOLATION");

  console.log("\n🎉 Cable Lateral Raise added successfully!");
  console.log(`   ID: ${exercise.id}`);
  console.log(`   Slug (EN): ${exercise.slugEn}`);
  console.log(`   Slug (FR): ${exercise.slug}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("💥 Error:", error);
  process.exit(1);
});
