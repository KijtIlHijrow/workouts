"use client";

import { Plus } from "lucide-react";

import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";

import { TemplateCard } from "./template-card";

import type { WorkoutTemplateWithExercises } from "../actions/get-templates.action";

interface TemplateListProps {
  templates: WorkoutTemplateWithExercises[];
  onStartTemplate: (template: WorkoutTemplateWithExercises) => void;
  onEditTemplate: (template: WorkoutTemplateWithExercises) => void;
  onDeleteTemplate: (template: WorkoutTemplateWithExercises) => void;
  onBuildNew: () => void;
}

export function TemplateList({ templates, onStartTemplate, onEditTemplate, onDeleteTemplate, onBuildNew }: TemplateListProps) {
  const t = useI18n();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("workout_templates.title")}</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-1">{t("workout_templates.subtitle")}</p>
      </div>

      {/* Templates grid */}
      {templates.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              onDelete={onDeleteTemplate}
              onEdit={onEditTemplate}
              onStart={onStartTemplate}
              template={template}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {templates.length === 0 && (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          <p>{t("workout_templates.empty")}</p>
          <p className="text-sm mt-1">{t("workout_templates.empty_hint")}</p>
        </div>
      )}

      {/* Build new button */}
      <div className="flex justify-center">
        <Button className="w-full sm:w-auto" onClick={onBuildNew} size="large" variant="outline">
          <Plus className="w-5 h-5 mr-2" />
          {t("workout_templates.build_new")}
        </Button>
      </div>
    </div>
  );
}
