import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? <Badge className="mb-4 bg-yellow-200 text-black">{eyebrow}</Badge> : null}
      <h2 className="text-balance text-3xl font-black leading-tight tracking-normal text-black md:text-5xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-4 text-base leading-7 text-neutral-600 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}
