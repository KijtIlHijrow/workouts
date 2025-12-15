"use client";

import { useState, useRef, useEffect } from "react";
import { X, Save } from "lucide-react";

import { useI18n } from "locales/client";
import { Button } from "@/components/ui/button";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  isLoading?: boolean;
  initialName?: string;
}

export function SaveTemplateModal({ isOpen, onClose, onSave, isLoading, initialName = "" }: SaveTemplateModalProps) {
  const t = useI18n();
  const [name, setName] = useState(initialName);
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    if (isOpen) {
      modal.showModal();
      setName(initialName);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      modal.close();
      setName("");
    }
  }, [isOpen, initialName]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      onClose();
    };

    modal.addEventListener("close", handleClose);
    return () => modal.removeEventListener("close", handleClose);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await onSave(name.trim());
    setName("");
  };

  return (
    <dialog className="modal modal-bottom sm:modal-middle" ref={modalRef}>
      <div className="modal-box">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{t("workout_templates.save_modal.title")}</h3>
          <form method="dialog">
            <Button className="p-1" size="small" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-control mb-6">
            <label className="label" htmlFor="template-name">
              <span className="label-text">{t("workout_templates.save_modal.name_label")}</span>
            </label>
            <input
              autoComplete="off"
              className="input input-bordered w-full"
              disabled={isLoading}
              id="template-name"
              onChange={(e) => setName(e.target.value)}
              placeholder={t("workout_templates.save_modal.name_placeholder")}
              ref={inputRef}
              type="text"
              value={name}
            />
          </div>

          <div className="modal-action">
            <Button disabled={!name.trim() || isLoading} size="large" type="submit">
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? t("commons.saving") : t("commons.save")}
            </Button>
          </div>
        </form>
      </div>
      <form className="modal-backdrop" method="dialog">
        <button type="submit">close</button>
      </form>
    </dialog>
  );
}
