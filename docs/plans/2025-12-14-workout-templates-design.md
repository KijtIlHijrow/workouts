# Workout Templates Design

## Overview

Add ability to save, name, and quickly reuse workout configurations as templates.

## User Flow

1. **Build workout** (equipment → muscles → exercises)
2. **Save as template** - Button at Step 3, enter name
3. **Next time** - Open Workouts, see templates at Step 0
4. **Tap template** - Starts workout immediately with saved exercises
5. **Long-press template** - Edit or delete

## Data Model

```prisma
model WorkoutTemplate {
  id        String   @id @default(cuid())
  userId    String
  name      String
  equipment ExerciseAttributeValueEnum[] @default([])
  muscles   ExerciseAttributeValueEnum[] @default([])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user      User                       @relation(fields: [userId], references: [id], onDelete: Cascade)
  exercises WorkoutTemplateExercise[]

  @@map("workout_templates")
}

model WorkoutTemplateExercise {
  id         String @id @default(cuid())
  templateId String
  exerciseId String
  order      Int

  template WorkoutTemplate      @relation(fields: [templateId], references: [id], onDelete: Cascade)
  exercise Exercise             @relation(fields: [exerciseId], references: [id])
  sets     WorkoutTemplateSet[]

  @@map("workout_template_exercises")
}

model WorkoutTemplateSet {
  id                 String           @id @default(cuid())
  templateExerciseId String
  setIndex           Int
  types              WorkoutSetType[] @default([])
  valuesInt          Int[]            @default([])
  valuesSec          Int[]            @default([])
  units              WorkoutSetUnit[] @default([])

  templateExercise WorkoutTemplateExercise @relation(fields: [templateExerciseId], references: [id], onDelete: Cascade)

  @@map("workout_template_sets")
}
```

## UI Components

### Step 0: Template Selection
- Shows if user has templates
- Template cards with name + muscle badges
- "Build New Workout" button
- Tap = start workout, Long-press = edit/delete menu

### Save Template Modal
- Text input for template name
- Save button
- Appears at Step 3 of workout builder

### Template Card
- Name
- Muscle group badges
- Exercise count

## Implementation Files

### New
- `src/features/workout-templates/actions/create-template.action.ts`
- `src/features/workout-templates/actions/update-template.action.ts`
- `src/features/workout-templates/actions/delete-template.action.ts`
- `src/features/workout-templates/actions/get-templates.action.ts`
- `src/features/workout-templates/ui/template-list.tsx`
- `src/features/workout-templates/ui/template-card.tsx`
- `src/features/workout-templates/ui/save-template-modal.tsx`

### Modified
- `prisma/schema.prisma` - Add new models
- `src/features/workout-builder/ui/workout-stepper.tsx` - Add Step 0 and save button
- `src/features/workout-builder/model/workout-builder.store.ts` - Template state
