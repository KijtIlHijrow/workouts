"use client";
import { ArrowLeft, ArrowRight, Bookmark } from "lucide-react";

import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";

interface WorkoutBuilderFooterProps {
  currentStep: number;
  totalSteps: number;
  canContinue: boolean;
  onPrevious: VoidFunction;
  onNext: VoidFunction;
  onStartWorkout?: VoidFunction;
  // Editing mode props
  isEditing?: boolean;
  editingTemplateName?: string;
  onTemplateNameChange?: (name: string) => void;
  onSaveTemplate?: VoidFunction;
  isSavingTemplate?: boolean;
}

export function WorkoutBuilderFooter({
  currentStep,
  totalSteps,
  canContinue,
  onPrevious,
  onNext,
  onStartWorkout,
  isEditing,
  editingTemplateName,
  onTemplateNameChange,
  onSaveTemplate,
  isSavingTemplate,
}: WorkoutBuilderFooterProps) {
  const t = useI18n();
  const isFirstStep = currentStep === 1;
  const isFinalStep = currentStep === totalSteps;

  // Editing mode footer
  if (isEditing) {
    return (
      <div className="w-full sticky bottom-0">
        <div className="flex flex-col gap-4 px-2 sm:px-6 pb-2">
          <div className="mt-4 min-h-12 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 w-full p-1 border border-slate-400 dark:border-slate-700 rounded-full">
            {/* Template name input */}
            <input
              className="flex-1 bg-transparent px-4 py-2 text-sm font-medium outline-none placeholder:text-slate-400"
              onChange={(e) => onTemplateNameChange?.(e.target.value)}
              placeholder={t("workout_templates.save_modal.name_placeholder")}
              type="text"
              value={editingTemplateName || ""}
            />

            {/* Save button */}
            <Button
              className="rounded-full bg-blue-600 hover:bg-blue-700 min-h-10 px-6 dark:bg-blue-500 dark:hover:bg-blue-600"
              disabled={!editingTemplateName?.trim() || isSavingTemplate}
              onClick={onSaveTemplate}
              size="default"
              variant="default"
            >
              <div className="flex items-center justify-center gap-2">
                <Bookmark className="h-4 w-4" />
                <span className="font-semibold">{isSavingTemplate ? t("commons.saving") : t("commons.save")}</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sticky bottom-0 ">
      {/* Mobile layout - vertical stack */}
      <div className="flex flex-col gap-4 px-2 sm:px-6 pb-2">
        {/* Center stats on top for mobile */}

        {/* Navigation buttons */}
        <div className="mt-4 min-h-12 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 w-full p-0.5 border border-slate-400 dark:border-slate-700 rounded-full">
          {/* Previous button */}
          <Button className="flex-1 rounded-full min-h-12" disabled={isFirstStep} onClick={onPrevious} size="default" variant="ghost">
            <div className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="font-medium">{t("workout_builder.navigation.previous")}</span>
            </div>
          </Button>

          {/* Next/Start Workout button */}
          <Button
            className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 min-h-12 dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={!canContinue}
            onClick={isFinalStep ? () => onStartWorkout?.() : onNext}
            size="default"
            variant="default"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">{t("workout_builder.navigation.continue")}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
