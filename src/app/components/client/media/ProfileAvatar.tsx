"use client";

import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  name: string;
  src?: string | null;
  alt?: string;
  showBorder?: boolean;
  size?: string; // Tailwind classes para w-X h-X
};

const sanitizeProfileName = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim();

export const getProfileInitials = (name: string) => {
  const sanitizedName = sanitizeProfileName(name);

  if (!sanitizedName) {
    return "??";
  }

  const tokens = sanitizedName.split(/\s+/).filter(Boolean);

  if (tokens.length === 1) {
    return tokens[0].slice(0, 2).toUpperCase() || "??";
  }

  return (
    `${tokens[0][0] ?? ""}${tokens[tokens.length - 1][0] ?? ""}`
      .toUpperCase()
      .trim() || "??"
  );
};

function ProfileAvatar({
  name,
  src,
  alt,
  showBorder = false,
  size = "w-20 h-20",
}: ProfileAvatarProps) {
  const hasImage = Boolean(src?.trim());
  const accessibleLabel = alt?.trim() || name.trim() || "Avatar de perfil";

  const borderClass = showBorder ? "border-4 border-primary-blue" : "";

  if (hasImage) {
    return (
      <div
        aria-label={accessibleLabel}
        role="img"
        className={cn(
          "@container rounded-full bg-cover bg-center bg-no-repeat",
          size,
          borderClass,
        )}
        style={{
          backgroundImage: `url(${src?.trim()})`,
        }}
      />
    );
  }

  return (
    <span
      aria-label={accessibleLabel}
      role="img"
      className={cn(
        "@container flex items-center justify-center rounded-full bg-[#a0acff] uppercase text-gray-500",
        size,
        borderClass,
      )}
    >
      <span className="font-poppins text-[clamp(1.25rem,38cqi,3rem)] leading-none font-light select-none">
        {getProfileInitials(name)}
      </span>
    </span>
  );
}

export default ProfileAvatar;
