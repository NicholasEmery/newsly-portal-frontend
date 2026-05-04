import { MdSchedule } from "react-icons/md";
import { formatRelativeCreatedAt } from "@/utils/date";
import { useTranslations } from "next-intl";

interface DateDisplayProps {
  date: string;
  variant?: "gray" | "white";
}

const DateDisplay = ({ date, variant = "gray" }: DateDisplayProps) => {
  const colorClass = variant === "gray" ? "text-gray-400" : "";
  const t = useTranslations("dateRelative");

  return (
    <div className="flex flex-row items-center justify-center gap-1">
      <MdSchedule
        className={`text-[clamp(0.7rem,0.9vw,1rem)] ${colorClass} font-medium!`}
      />
      <p
        className={`text-[clamp(0.7rem,0.6vw,0.8rem)] ${colorClass} font-medium!`}
      >
        {date ? formatRelativeCreatedAt(date, t) : "-"}
      </p>
    </div>
  );
};

export default DateDisplay;
