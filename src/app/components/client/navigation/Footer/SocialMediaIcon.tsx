import type { IconType } from "react-icons";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import type { SocialLinkKey } from "@/api/schemas/socialLinks";

type SocialMediaIconProps = {
  name: SocialLinkKey;
  href: string;
  ariaLabel: string;
  size?: number;
  className?: string;
};

const iconsByKey: Record<SocialLinkKey, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  youtube: FaYoutube,
  pinterest: FaPinterestP,
};

const SocialMediaIcon = ({
  name,
  href,
  ariaLabel,
  size = 16,
  className,
}: SocialMediaIconProps) => {
  const Icon = iconsByKey[name];
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-blue hover:text-primary-blue"
    >
      <Icon size={size} className={className} aria-hidden />
    </a>
  );
};

export default SocialMediaIcon;
