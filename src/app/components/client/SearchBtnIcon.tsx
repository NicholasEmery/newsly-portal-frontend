"use client";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { useGlobalStore } from "@/app/store/stateGlobals";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { IoMdSend } from "react-icons/io";
import { parseCreatedAtDisplay as parseCreatedAtDisplayUtil } from "@/utils/date";

type SearchResult = {
  Title: string;
  Category: string;
  CreatedAt: string;
  Slug?: string;
};

const SearchBtnIcon = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const parseCreatedAtDisplay = (CreatedAt: string) => {
    // import from utils/date if needed
    return parseCreatedAtDisplayUtil(CreatedAt);
  };
  const { openSearchBar, setOpenSearchBar, setOpen, pinned } = useGlobalStore();

  // fetch search results on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/search");
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch {}
    };
    load();
  }, []);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 0,
    fullWidth: false,
  });

  const containerRef = useRef<HTMLFormElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const allSearchResults = useMemo<SearchResult[]>(() => {
    // sort descending by CreatedAt and deduplicate by Title (keep newest)
    const sorted = [...searchResults].sort(
      (a, b) =>
        parseCreatedAtDisplayUtil(b.CreatedAt) -
        parseCreatedAtDisplayUtil(a.CreatedAt),
    );
    const map = new Map<string, SearchResult>();
    for (const item of sorted) {
      const key = (item.Title || "").toLowerCase();
      if (!map.has(key)) map.set(key, item);
    }
    return Array.from(map.values());
  }, [searchResults]);

  const formatRelativeTime = useCallback((CreatedAt: string) => {
    const created = parseCreatedAtDisplay(CreatedAt);
    if (!Number.isFinite(created)) return "now";

    const diffMs = Date.now() - created;
    const diffMin = Math.max(1, Math.floor(diffMs / 60000));

    if (diffMin < 60) return `${diffMin}m`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h`;
    const diffDay = Math.floor(diffHour / 24);
    return `${diffDay}d`;
  }, []);

  useEffect(() => {
    if (pinned) {
      setOpenSearchBar(false);
    }
  }, [pinned, setOpenSearchBar]);

  useEffect(() => {
    if (!openSearchBar) {
      setQuery("");
      setShowDropdown(false);
      setIsFocused(false);
    }
  }, [openSearchBar]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop("matches" in e ? e.matches : mq.matches);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const updateDropdownPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    const baseLeft = rect.left + (pinned ? 0 : scrollX);
    const baseTop = rect.bottom + (pinned ? 0 : scrollY) + 6;

    if (isDesktop) {
      setDropdownPos({
        top: baseTop,
        left: baseLeft,
        width: rect.width,
        fullWidth: false,
      });
    } else {
      setDropdownPos({
        top: baseTop,
        left: 12,
        width: window.innerWidth - 24,
        fullWidth: true,
      });
    }
  }, [isDesktop, pinned]);

  useEffect(() => {
    const normalized = query.trim().toLowerCase();
    if (!openSearchBar) {
      setResults([]);
      return;
    }
    const matched = normalized
      ? allSearchResults.filter(
          (item) =>
            item.Title.toLowerCase().includes(normalized) ||
            item.Category.toLowerCase().includes(normalized),
        )
      : allSearchResults;
    // limit to max 5 results
    const limited = matched.slice(0, 5);
    setResults(limited);
    const shouldShow = openSearchBar && isFocused && limited.length > 0;
    setShowDropdown(shouldShow);
    if (shouldShow) {
      requestAnimationFrame(updateDropdownPosition);
    }
  }, [
    query,
    openSearchBar,
    isFocused,
    updateDropdownPosition,
    allSearchResults,
  ]);

  useEffect(() => {
    if (!showDropdown) return;
    const handleWin = () => updateDropdownPosition();
    window.addEventListener("resize", handleWin);
    window.addEventListener("scroll", handleWin, { passive: true });
    return () => {
      window.removeEventListener("resize", handleWin);
      window.removeEventListener("scroll", handleWin);
    };
  }, [showDropdown, updateDropdownPosition]);

  useEffect(() => {
    if (!showDropdown && !openSearchBar) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (containerRef.current?.contains(target)) return;
      if (dropdownRef.current?.contains(target)) return;
      setShowDropdown(false);
      setIsFocused(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowDropdown(false);
        setOpenSearchBar(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [showDropdown, openSearchBar, setOpenSearchBar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você pode integrar com o store global ou rota de busca
    // Exemplo: useGlobalStore.getState().setSearchQuery(query);
  };

  const handleFocus = () => {
    setIsFocused(true);
    requestAnimationFrame(() => {
      updateDropdownPosition();
      setShowDropdown(openSearchBar && results.length > 0);
    });
  };

  const toggle = () => {
    const next = !openSearchBar;
    setOpenSearchBar(next);
    if (next) {
      setOpen(false);
    }
  };

  return (
    <div
      className={`relative flex flex-row-reverse lg:flex-row items-center gap-2 overflow-hidden transition-all duration-100 ease-in-out ${
        openSearchBar ? "gap-2" : "gap-0"
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        className="flex items-center justify-center rounded-full cursor-pointer"
        aria-label={openSearchBar ? "Fechar busca" : "Abrir busca"}
      >
        {openSearchBar ? (
          <AiOutlineClose size={25} className="text-white" />
        ) : (
          <AiOutlineSearch size={25} className="text-white" />
        )}
      </button>
      <form
        className={`px-1 flex flex-row items-center justify-center transition-all duration-500 ease-in-out bg-white overflow-hidden rounded-full h-9 ${
          openSearchBar ? "w-4/5 lg:w-50 opacity-100" : "w-0 opacity-0"
        }`}
        onSubmit={handleSubmit}
        ref={containerRef}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar notícias"
          onFocus={handleFocus}
          className={`bg-transparent w-full text-[clamp(0.775rem,0.8vw,1.1rem)] px-1 pl-2 text-black outline-none placeholder:text-neutral-400 placeholder:text-[clamp(0.775rem,0.7vw,1rem)] transition-all duration-500 ease-in-out`}
          aria-label="Teste"
        />
        <button
          type="submit"
          aria-label="Open"
          className={`text-center p-1 rounded-full border border-black cursor-pointer`}
        >
          <IoMdSend className="text-black" size={15} />
        </button>
      </form>
      {mounted &&
        showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.fullWidth
                ? dropdownPos.width
                : dropdownPos.width || "auto",
              zIndex: 1200,
            }}
            className="origin-top bg-white text-black shadow-2xl rounded-2xl border border-black/5 overflow-hidden max-h-[70vh] animate-[fadeDown_0.18s_ease-out]"
          >
            <div className="divide-y divide-black/5">
              {results.map((item, idx) => (
                <div
                  key={item.Slug || `${item.Title}-${idx}`}
                  className="p-3 hover:bg-gray-100 transition-colors duration-150 flex items-start justify-between gap-3"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold leading-tight text-gray-900">
                      {item.Title}
                    </span>
                    <span className="text-xs text-gray-500">
                      {item.Category}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 shrink-0">
                    {formatRelativeTime(item.CreatedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default SearchBtnIcon;
