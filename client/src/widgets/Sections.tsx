import type { IconType } from "react-icons";

interface SectionProps {
  title: string;
  subtitle?: string;
  icon?: IconType;
  children: React.ReactNode;
}

function Section({ title, subtitle, icon: Icon, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-foreground/10 bg-background p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
        )}
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-foreground/55">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="mt-5 grid gap-4">{children}</div>
    </section>
  );
}

export default Section;