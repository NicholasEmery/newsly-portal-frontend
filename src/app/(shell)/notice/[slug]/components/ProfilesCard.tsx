"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { CreatorInfo } from "@/api/types/news";
import ProfileAvatar from "@/app/components/client/media/ProfileAvatar";

interface ProfilesCardProps {
  owner: CreatorInfo;
  collaborators?: CreatorInfo[];
}

type ProfileCardData = {
  imgUrl: string;
  nickname: string;
  description: string;
  role: "Creator" | "Collaborator";
};

const ITEM_SIZE = 100;
const SLOT_SPACING = 60;
const TRANSITION_DURATION = 700;
const INFO_SWAP_DELAY = TRANSITION_DURATION;

const SLOT_EASING = `transform ${TRANSITION_DURATION}ms cubic-bezier(0.445,0.05,0.55,0.95), opacity ${TRANSITION_DURATION}ms cubic-bezier(0.445,0.05,0.55,0.95), filter ${TRANSITION_DURATION}ms cubic-bezier(0.445,0.05,0.55,0.95), box-shadow ${TRANSITION_DURATION}ms cubic-bezier(0.445,0.05,0.55,0.95)`;

function getSlotStyle(slot: number): React.CSSProperties {
  const abs = Math.abs(slot);
  const tx = slot * SLOT_SPACING;

  if (abs === 0) {
    return {
      transform: `translateX(${tx}px) scale(1) translateY(0)`,
      opacity: 1,
      zIndex: 30,
      filter: "none",
      border: "4px solid rgba(99,102,241)",
      pointerEvents: "auto",
    };
  }
  if (abs === 1) {
    return {
      transform: `translateX(${tx}px) scale(0.45) translateY(40px)`,
      opacity: 0.65,
      zIndex: 20,
      filter: "blur(0.6px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      pointerEvents: "auto",
    };
  }
  // Slots com distância >= 2 ficam invisíveis, mas mantidos no DOM
  return {
    transform: `translateX(${tx}px) scale(0.2) translateY(70px)`,
    opacity: 0,
    zIndex: 0,
    filter: "blur(4px)",
    pointerEvents: "none",
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "profile";

const getCircularSlot = (
  itemIndex: number,
  currentIndex: number,
  total: number,
) => {
  let slot = itemIndex - currentIndex;
  const half = total / 2;

  if (slot > half) slot -= total;
  if (slot < -half) slot += total;

  return slot;
};

export default function ProfilesCard({
  owner,
  collaborators = [],
}: ProfilesCardProps) {
  const t = useTranslations("profilesCard");

  const safeOwner = {
    ...owner,
    name: owner?.name?.trim() || "newsly",
    imgProfile: owner?.imgProfile?.trim() || "",
    bio: owner?.bio?.trim() || "",
    socialMedias: Array.isArray(owner?.socialMedias) ? owner.socialMedias : [],
  };

  const safeCollaborators = collaborators
    .filter(Boolean)
    .map((collab, index) => ({
      ...collab,
      name: collab?.name?.trim() || `colaborador ${index + 1}`,
      imgProfile: collab?.imgProfile?.trim() || "",
      bio: collab?.bio?.trim() || "",
      socialMedias: Array.isArray(collab?.socialMedias)
        ? collab.socialMedias
        : [],
    }));

  const allProfiles: ProfileCardData[] = [
    {
      imgUrl: safeOwner.imgProfile,
      nickname: safeOwner.name,
      description: safeOwner.bio,
      role: "Creator",
    },
    ...safeCollaborators.map<ProfileCardData>((collab) => ({
      imgUrl: collab.imgProfile,
      nickname: collab.name,
      description: collab.bio,
      role: "Collaborator",
    })),
  ];

  const total = allProfiles.length;
  const canNavigate = total > 1;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedProfileIndex, setDisplayedProfileIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const infoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const currentProfile = allProfiles[displayedProfileIndex];
  const currentRoleLabel =
    currentProfile.role === "Creator"
      ? t("roles.creator")
      : t("roles.collaborator");

  useEffect(() => {
    if (currentIndex === displayedProfileIndex) return;

    if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);
    infoTimeoutRef.current = setTimeout(() => {
      setDisplayedProfileIndex(currentIndex);
    }, INFO_SWAP_DELAY);
  }, [currentIndex, displayedProfileIndex]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      if (infoTimeoutRef.current) clearTimeout(infoTimeoutRef.current);
    };
  }, []);

  const moveCarousel = useCallback(
    (direction: -1 | 1) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex((prev) => (prev + direction + total) % total);
      if (transitionTimeoutRef.current)
        clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(
        () => setIsTransitioning(false),
        TRANSITION_DURATION,
      );
    },
    [isTransitioning, total],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const startX = pointerStartXRef.current;
    const startY = pointerStartYRef.current;
    pointerStartXRef.current = null;
    pointerStartYRef.current = null;
    if (startX === null || startY === null) return;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 32 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    moveCarousel(deltaX < 0 ? 1 : -1);
  };

  return (
    <div className="group relative mx-auto w-full xl:min-w-82 xl:max-w-82 rounded-[28px] border border-slate-100 bg-white px-4 py-5 text-center text-slate-900 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:shadow-[0_18px_50px_rgba(2,6,23,0.45)]">
      {/* Botão anterior */}
      {canNavigate && (
        <div
          className="opacity-0 group-hover:opacity-100 transition-all duration-400 absolute z-30"
          style={{
            left: -15,
            top: "calc(50% + 80px)",
            transform: "translateY(-50%)",
          }}
        >
          <button
            type="button"
            onClick={() => moveCarousel(-1)}
            disabled={!canNavigate || isTransitioning}
            aria-label={t("aria.previousProfile")}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            style={{ width: 30, height: 30 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Botão próximo */}
      {canNavigate && (
        <div
          className="opacity-0 group-hover:opacity-100 transition-all duration-400 absolute z-30"
          style={{
            right: -15,
            top: "calc(50% + 80px)",
            transform: "translateY(-50%)",
          }}
        >
          <button
            type="button"
            onClick={() => moveCarousel(1)}
            disabled={!canNavigate || isTransitioning}
            aria-label={t("aria.nextProfile")}
            className="flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            style={{ width: 30, height: 30 }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      )}

      {/* Tag de papel */}
      <div className="mb-2">
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-200">
          {currentRoleLabel}
        </span>
      </div>

      {/* Carrossel – renderiza slots de -2 a 2 (para transição suave) */}
      <div
        className="relative mb-5 overflow-hidden"
        style={{ height: 140 }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: ITEM_SIZE,
            height: ITEM_SIZE,
          }}
        >
          {allProfiles.map((profile, idx) => {
            const slot = getCircularSlot(idx, currentIndex, total);
            // Mostramos slots de -2 a 2 (5 itens) – os invisíveis garantem suavidade
            if (Math.abs(slot) > 2) return null;
            const slotStyle = getSlotStyle(slot);
            const isCenter = slot === 0;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (
                    !isCenter &&
                    !isTransitioning &&
                    canNavigate &&
                    Math.abs(slot) === 1
                  ) {
                    moveCarousel(slot > 0 ? 1 : -1);
                  }
                }}
                aria-label={profile.nickname}
                className="absolute inset-0 rounded-full border-none p-0 will-change-transform"
                style={{
                  background: "transparent",
                  cursor: isCenter
                    ? "default"
                    : Math.abs(slot) === 1
                      ? "pointer"
                      : "default",
                  outline: "none",
                  transition: SLOT_EASING,
                  ...slotStyle,
                }}
              >
                <div className="h-full w-full overflow-hidden rounded-full">
                  <ProfileAvatar
                    name={profile.nickname}
                    src={profile.imgUrl}
                    size="h-full w-full"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dots indicadores */}
      {canNavigate && (
        <div className="mb-5 flex items-center justify-center gap-1.5">
          {allProfiles.map((_, i) => {
            const active = i === currentIndex;
            return (
              <div
                key={i}
                style={{
                  width: active ? 18 : 5,
                  height: 5,
                  borderRadius: 3,
                  transition: "width 300ms ease, background 300ms ease",
                }}
                className={active ? "bg-indigo-500" : "bg-slate-200"}
              />
            );
          })}
        </div>
      )}

      {/* Informações do perfil com fade */}
      <div className="overflow-hidden min-h-42.5">
        <div
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(6px)" : "translateY(0)",
            transition: `opacity ${TRANSITION_DURATION * 0.4}ms ease, transform ${TRANSITION_DURATION * 0.4}ms ease`,
          }}
        >
          <h2 className="mb-3 text-[clamp(1.25rem,4vw,1.55rem)] font-bold leading-tight text-slate-900 dark:text-slate-50">
            {currentProfile.nickname}
          </h2>
          <p className="mb-6 text-[0.96rem] leading-7 text-slate-600 line-clamp-3 dark:text-slate-300 sm:text-[0.98rem]">
            {currentProfile.description || t("noDescription")}
          </p>
          <Link
            href={`/profile/${slugify(currentProfile.nickname)}`}
            className="inline-flex items-center justify-center rounded-xl bg-primary-blue px-5 py-3 text-sm font-semibold text-white transition-all duration-500 hover:opacity-80 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400"
          >
            {t("openProfile")}
          </Link>
        </div>
      </div>
    </div>
  );
}
