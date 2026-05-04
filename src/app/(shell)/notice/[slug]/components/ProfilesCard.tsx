"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { CreatorInfo } from "@/api/types/news";

interface ProfilesCardProps {
  owner: CreatorInfo;
  collaborators?: CreatorInfo[];
}

type SlideState =
  | "visible"
  | "exit-left"
  | "exit-right"
  | "enter-left"
  | "enter-right";

type ProfileCardData = {
  imgUrl: string;
  nickname: string;
  description: string;
  role: "Creator" | "Collaborator";
};

type CarouselSlot = {
  key: string;
  profile: ProfileCardData | null;
  isCenter: boolean;
  offset: -1 | 0 | 1;
};

const slideClasses: Record<SlideState, string> = {
  "visible": "translate-x-0 opacity-100",
  "exit-left": "-translate-x-8 opacity-0",
  "exit-right": "translate-x-8 opacity-0",
  "enter-left": "-translate-x-8 opacity-0",
  "enter-right": "translate-x-8 opacity-0",
};

const DEFAULT_IMAGE = "/images/Nicholas-Emery.png";
const CAROUSEL_STEP = 58;

const fallbackCreator = (name: string): CreatorInfo => ({
  name,
  imgProfile: DEFAULT_IMAGE,
  bio: "",
  socialMedias: [],
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "profile";

export default function ProfilesCard({
  owner,
  collaborators = [],
}: ProfilesCardProps) {
  const safeOwner = {
    ...fallbackCreator(owner?.name || "newsly"),
    ...owner,
    name: owner?.name?.trim() || "newsly",
    imgProfile: owner?.imgProfile?.trim() || DEFAULT_IMAGE,
    bio: owner?.bio?.trim() || "",
    socialMedias: Array.isArray(owner?.socialMedias) ? owner.socialMedias : [],
  };

  const safeCollaborators = collaborators
    .filter(Boolean)
    .map((collab, index) => ({
      ...fallbackCreator(collab?.name || `colaborador ${index + 1}`),
      ...collab,
      name: collab?.name?.trim() || `colaborador ${index + 1}`,
      imgProfile: collab?.imgProfile?.trim() || DEFAULT_IMAGE,
      bio: collab?.bio?.trim() || "",
      socialMedias: Array.isArray(collab?.socialMedias)
        ? collab.socialMedias
        : [],
    }));

  // Monta lista de perfis com os campos necessários para o componente
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

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideState, setSlideState] = useState<SlideState>("visible");
  const [carouselShift, setCarouselShift] = useState<-1 | 0 | 1>(0);
  const currentProfile = allProfiles[selectedIndex];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartXRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);
  // cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  const total = allProfiles.length || 1;
  const canNavigate = total > 1;

  function triggerSelection(newIndex: number, carouselDirection: -1 | 1) {
    if (newIndex === selectedIndex) return;
    const direction = newIndex > selectedIndex ? "right" : "left";

    setSlideState(direction === "right" ? "exit-left" : "exit-right");
    setCarouselShift(carouselDirection);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSelectedIndex(newIndex);
      setSlideState(direction === "right" ? "enter-right" : "enter-left");
      setCarouselShift(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setSlideState("visible"));
      });
    }, 200);
  }

  function moveCarousel(carouselDirection: -1 | 1) {
    const nextIndex =
      carouselDirection === -1
        ? (selectedIndex + 1) % total
        : (selectedIndex - 1 + total) % total;

    triggerSelection(nextIndex, carouselDirection);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStartXRef.current = event.clientX;
    pointerStartYRef.current = event.clientY;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const startX = pointerStartXRef.current;
    const startY = pointerStartYRef.current;

    pointerStartXRef.current = null;
    pointerStartYRef.current = null;

    if (startX === null || startY === null) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (Math.abs(deltaX) < 32 || Math.abs(deltaX) < Math.abs(deltaY)) {
      return;
    }

    if (deltaX < 0) {
      moveCarousel(-1);
      return;
    }

    moveCarousel(1);
  }

  const visibleSlots: CarouselSlot[] = (() => {
    if (total >= 3) {
      return [
        {
          key: `thumb-${(selectedIndex - 1 + total) % total}`,
          profile: allProfiles[(selectedIndex - 1 + total) % total],
          isCenter: false,
          offset: -1,
        },
        {
          key: `thumb-${selectedIndex}`,
          profile: allProfiles[selectedIndex],
          isCenter: true,
          offset: 0,
        },
        {
          key: `thumb-${(selectedIndex + 1) % total}`,
          profile: allProfiles[(selectedIndex + 1) % total],
          isCenter: false,
          offset: 1,
        },
      ];
    }

    if (total === 2) {
      const otherIndex = selectedIndex === 0 ? 1 : 0;
      const otherOffset = selectedIndex === 0 ? 1 : -1;
      return [
        {
          key: `thumb-${otherIndex}`,
          profile: allProfiles[otherIndex],
          isCenter: false,
          offset: otherOffset,
        },
        {
          key: `thumb-${selectedIndex}`,
          profile: allProfiles[selectedIndex],
          isCenter: true,
          offset: 0,
        },
        {
          key: "thumb-placeholder-right",
          profile: null,
          isCenter: false,
          offset: otherOffset === 1 ? -1 : 1,
        },
      ];
    }

    return [
      {
        key: "thumb-placeholder-left",
        profile: null,
        isCenter: false,
        offset: -1,
      },
      {
        key: `thumb-${selectedIndex}`,
        profile: allProfiles[selectedIndex],
        isCenter: true,
        offset: 0,
      },
      {
        key: "thumb-placeholder-right",
        profile: null,
        isCenter: false,
        offset: 1,
      },
    ];
  })();

  return (
    <div className="relative w-full max-w-sm rounded-[28px] border border-slate-100 bg-white p-7 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      {/* Navegação absoluta: 50px fora / 50px dentro do container */}
      <button
        type="button"
        onClick={() => moveCarousel(1)}
        disabled={!canNavigate}
        aria-label="Perfil anterior"
        className="absolute z-30 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ left: -50, top: 16, width: 100, height: 40 }}
      >
        &lt;
      </button>

      <button
        type="button"
        onClick={() => moveCarousel(-1)}
        disabled={!canNavigate}
        aria-label="Próximo perfil"
        className="absolute z-30 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ right: -50, top: 16, width: 100, height: 40 }}
      >
        &gt;
      </button>
      <div>
        <h1>{currentProfile.role}</h1>
      </div>
      <div
        className="mb-7 flex items-center justify-center"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div className="relative h-33 w-full max-w-90 overflow-visible">
          {visibleSlots.map((slot) => {
            const isPlaceholder = !slot.profile;
            const profileIndex = slot.profile
              ? allProfiles.indexOf(slot.profile)
              : -1;

            return (
              <button
                key={slot.key}
                onClick={() =>
                  slot.profile &&
                  triggerSelection(
                    profileIndex,
                    slot.offset === 0 ? 1 : ((slot.offset * -1) as -1 | 1),
                  )
                }
                disabled={isPlaceholder}
                className={`absolute left-1/2 top-1/2 rounded-full bg-cover bg-center shadow-[0_8px_24px_rgba(70,83,246,0.22)] transition-[transform,opacity,box-shadow,filter] duration-500 ease-out ${isPlaceholder ? "pointer-events-none opacity-0" : "opacity-100"} ${slot.isCenter ? "ring-4 border-primary-blue ring-indigo-100" : "border-b-blue-500"}`}
                style={{
                  backgroundImage: slot.profile
                    ? `url(${slot.profile.imgUrl})`
                    : "none",
                  width: slot.isCenter ? 100 : 78,
                  height: slot.isCenter ? 100 : 78,
                  borderWidth: 4,
                  borderStyle: "solid",
                  zIndex: slot.isCenter ? 30 : 5,
                  transform: `translate(-50%, -50%) translateX(${slot.offset * CAROUSEL_STEP + carouselShift * CAROUSEL_STEP}px) translateY(${slot.isCenter ? -4 : 14}px) scale(${slot.isCenter ? 1.08 : 0.7})`,
                  boxShadow: slot.isCenter
                    ? "0 18px 38px rgba(70,83,246,0.24)"
                    : "0 8px 18px rgba(70,83,246,0.10)",
                }}
                aria-label={slot.profile?.nickname || "placeholder"}
              />
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden min-h-42.5">
        <div
          className={`transition-all duration-300 ease-in-out ${slideClasses[slideState]}`}
        >
          {/* Botões de navegação movidos para as bordas do container */}
          <h2 className="mb-3 text-[1.45rem] font-bold leading-tight text-slate-900">
            {currentProfile.nickname}
          </h2>
          <p className="mb-6 text-[0.98rem] leading-7 text-slate-600">
            {currentProfile.description}
          </p>
          <Link
            href={`/profile/${slugify(currentProfile.nickname)}`}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Open Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

// cleanup timeout on unmount
// (note: placed after export so linter doesn't complain about hooks)
// but we add effect inside component instead
