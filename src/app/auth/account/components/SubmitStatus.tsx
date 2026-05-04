type SubmitStatusType = "success" | "error" | null;

interface SubmitStatusProps {
  type: SubmitStatusType;
  message: string;
}

export function SubmitStatus({ type, message }: SubmitStatusProps) {
  if (!type) return null;

  return (
    <p
      className={`text-sm ${
        type === "success"
          ? "text-emerald-700 dark:text-emerald-400"
          : "text-red-600 dark:text-red-400"
      }`}
    >
      {message}
    </p>
  );
}
