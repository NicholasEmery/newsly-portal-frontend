interface TitleSectionProps {
  title: string;
  subtitle: string;
}

export function TitleSection({ title, subtitle }: TitleSectionProps) {
  return (
    <div>
      <h1 className="text-3xl leading-tight text-slate-900 sm:text-[2rem] dark:text-slate-50">
        {title}
      </h1>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {subtitle}
      </p>
    </div>
  );
}
