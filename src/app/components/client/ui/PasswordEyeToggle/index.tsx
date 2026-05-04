"use client";

type PasswordEyeToggleProps = {
  visible: boolean;
  onToggle: () => void;
  disabled?: boolean;
  className?: string;
};

const PasswordEyeToggle = ({
  visible,
  onToggle,
  disabled = false,
  className = "",
}: PasswordEyeToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={visible}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors duration-300 hover:text-primary-blue disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300 dark:hover:text-blue-300 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          className={`origin-center transition-all duration-300 ease-out ${
            visible
              ? "opacity-100 scale-y-100 translate-y-0"
              : "opacity-0 scale-y-70 translate-y-0.5"
          }`}
        >
          <path d="M2 12C4 7.5 7.5 5 12 5C16.5 5 20 7.5 22 12" />
          <path d="M2 12C4 16.5 7.5 19 12 19C16.5 19 20 16.5 22 12" />
          <circle
            cx="12"
            cy="12"
            r="2.7"
            className="origin-center transition-all duration-250"
          />
        </g>

        <g
          className={`origin-center transition-all duration-300 ease-out ${
            visible ? "opacity-0 -translate-y-0.5" : "opacity-100 translate-y-0"
          }`}
        >
          <path d="M4 12.5C6.1 10.8 8.7 10 12 10C15.3 10 17.9 10.8 20 12.5" />
          <path d="M8.5 13L7.6 14.6" />
          <path d="M12 13.2V15" />
          <path d="M15.5 13L16.4 14.6" />
        </g>
      </svg>
    </button>
  );
};

export default PasswordEyeToggle;
