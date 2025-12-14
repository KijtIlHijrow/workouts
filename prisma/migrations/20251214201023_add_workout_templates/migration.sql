-- CreateTable
CREATE TABLE "workout_templates" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "equipment" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[],
    "muscles" "ExerciseAttributeValueEnum"[] DEFAULT ARRAY[]::"ExerciseAttributeValueEnum"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template_exercises" (
    "id" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "workout_template_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_template_sets" (
    "id" TEXT NOT NULL,
    "templateExerciseId" TEXT NOT NULL,
    "setIndex" INTEGER NOT NULL,
    "types" "WorkoutSetType"[] DEFAULT ARRAY[]::"WorkoutSetType"[],
    "valuesInt" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "valuesSec" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "units" "WorkoutSetUnit"[] DEFAULT ARRAY[]::"WorkoutSetUnit"[],

    CONSTRAINT "workout_template_sets_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "workout_templates" ADD CONSTRAINT "workout_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "workout_templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_exercises" ADD CONSTRAINT "workout_template_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_template_sets" ADD CONSTRAINT "workout_template_sets_templateExerciseId_fkey" FOREIGN KEY ("templateExerciseId") REFERENCES "workout_template_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
