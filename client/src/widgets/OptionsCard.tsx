import type { IconType } from "react-icons";
import { LuCheck } from "react-icons/lu";

interface OptionCardProps {
  selected: boolean;
  title: string;
  description: string;
  icon?: IconType;
  onSelect: () => void;
}

function OptionCard({
  selected,
  title,
  description,
  icon: Icon,
  onSelect,
}: OptionCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition
        ${
          selected
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : "border-foreground/15 hover:border-primary/50 hover:bg-foreground/2"
        }`}
    >
      {Icon && (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full
          ${
            selected
              ? "bg-primary text-white"
              : "bg-foreground/5 text-foreground/60"
          }`}
        >
          <Icon className="h-5 w-5" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs leading-relaxed text-foreground/55">
          {description}
        </span>
      </span>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border
          ${selected ? "border-primary bg-primary text-white" : "border-foreground/25"}`}
      >
        {selected && <LuCheck className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

export default OptionCard;