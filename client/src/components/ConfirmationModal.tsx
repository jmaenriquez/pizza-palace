import React from "react";
import type { IconType } from "react-icons";

import Button from "../widgets/Button";
import {
  LuBadgeAlert,
  LuBadgeCheck,
  LuBadgeHelp,
  LuBadgeInfo,
  LuBadgeX,
  LuX,
} from "react-icons/lu";

interface ModalProps {
  type?: "error" | "success" | "info" | "warning" | "question";
  title: string;
  message: string;
  isOpen: Boolean;
  onConfirm: () => void;
  onClose: () => void;
}

function ConfirmationModal({
  type,
  title,
  message,
  isOpen,
  onConfirm,
  onClose,
}: ModalProps) {
  if (!isOpen) return;
  return (
    <div
      onClick={onClose}
      className="fixed p-4 inset-0 z-20 flex items-center justify-center bg-foreground/80"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="p-6 max-w-120 bg-white rounded-lg shadow-md/20 flex flex-col  gap-8"
      >
        <div className="flex flex-col gap-2">

          <div className="flex justify-between items-center">
            <h1 className="text-2xl flex justify-between items-center">
              {title}
            </h1>
            <span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-1.5 text-gray-400 transition hover:cursor-pointer hover:bg-foreground/5 hover:text-foreground"
              >
                <LuX className="h-5 w-5" />
              </button>
            </span>
          </div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex gap-4 justify-end">
          <Button.Hollow name="Cancel" type="button" onClick={onClose} />

          <Button.Solid name="Confirm" type="button" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
