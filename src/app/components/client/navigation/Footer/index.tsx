"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Category } from "@/api/schemas/categories";
import type { SocialLink } from "@/api/schemas/socialLinks";
import SocialMediaIcon from "./SocialMediaIcon";

type FooterCategory = {
  label: string;
  href: string;
};

const isCategory = (value: unknown): value is Category => {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return typeof entry.label === "string" && typeof entry.Slug === "string";
};

const isSocialLink = (value: unknown): value is SocialLink => {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  const validKey =
    entry.key === "facebook" ||
    entry.key === "instagram" ||
    entry.key === "twitter" ||
    entry.key === "youtube" ||
    entry.key === "pinterest";

  return validKey && typeof entry.href === "string";
};

const Footer = () => {
  const t = useTranslations("footer");
  const [categories, setCategories] = useState<FooterCategory[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) return;

        const payload = await response.json();
        const mappedCategories = Array.isArray(payload)
          ? payload
              .filter(isCategory)
              .map((category) => ({
                label: category.label,
                href: category.Slug,
              }))
              .slice(0, 7)
          : [];

        setCategories(mappedCategories);
      } catch {
        setCategories([]);
      }
    };

    const loadSocialLinks = async () => {
      try {
        const response = await fetch("/api/social-links");
        if (!response.ok) return;

        const payload = await response.json();
        const mappedSocialLinks = Array.isArray(payload)
          ? payload.filter(isSocialLink)
          : [];

        setSocialLinks(mappedSocialLinks);
      } catch {
        setSocialLinks([]);
      }
    };

    loadCategories();
    loadSocialLinks();
  }, []);

  return (
    <footer className="w-full bg-[#03060d]">
      <div className="w-3/4 mx-auto px-2 py-16 sm:px-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <Link href="/" className="inline-flex" aria-label={t("brand")}>
            <Image
              src="/images/logo_nome.png"
              width={520}
              height={140}
              alt={t("brand")}
              className="h-auto w-46 sm:w-60 md:w-78"
            />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <SocialMediaIcon
                key={social.key}
                name={social.key}
                href={social.href}
                ariaLabel={t(`social.${social.key}`)}
                size={16}
              />
            ))}
          </div>

          <nav
            aria-label={t("navigationLabel")}
            className="w-full border-t border-white/10 pt-8"
          >
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {categories.map((item) => (
                <li key={`${item.label}-${item.href}`}>
                  <Link
                    href={item.href}
                    className="text-sm sm:text-base font-semibold uppercase tracking-[0.05em] text-white/80 transition-colors duration-300 hover:text-primary-blue"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="text-center text-xs sm:text-sm text-white/55">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
