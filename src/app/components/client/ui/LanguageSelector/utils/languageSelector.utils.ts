import {
  DROPDOWN_GAP,
  VIEWPORT_PADDING,
} from "../constants/languageSelector.constants";
import type {
  DropdownPlacement,
  DropdownPosition,
} from "../types/languageSelector.types";

export function resolveDropdownPosition(
  triggerRect: DOMRect,
  menuRect: DOMRect,
): DropdownPosition {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const candidates: Array<{
    placement: DropdownPlacement;
    top: number;
    left: number;
    transformOrigin: string;
  }> = [
    {
      placement: "bottom",
      top: triggerRect.bottom + DROPDOWN_GAP,
      left: triggerRect.left + triggerRect.width / 2 - menuRect.width / 2,
      transformOrigin: "top center",
    },
    {
      placement: "top",
      top: triggerRect.top - menuRect.height - DROPDOWN_GAP,
      left: triggerRect.left + triggerRect.width / 2 - menuRect.width / 2,
      transformOrigin: "bottom center",
    },
    {
      placement: "right",
      top: triggerRect.top + triggerRect.height / 2 - menuRect.height / 2,
      left: triggerRect.right + DROPDOWN_GAP,
      transformOrigin: "center left",
    },
    {
      placement: "left",
      top: triggerRect.top + triggerRect.height / 2 - menuRect.height / 2,
      left: triggerRect.left - menuRect.width - DROPDOWN_GAP,
      transformOrigin: "center right",
    },
  ];

  const getOverflowScore = (candidate: { top: number; left: number }) => {
    const overflowTop = Math.max(0, VIEWPORT_PADDING - candidate.top);
    const overflowLeft = Math.max(0, VIEWPORT_PADDING - candidate.left);
    const overflowBottom = Math.max(
      0,
      candidate.top + menuRect.height - (viewportHeight - VIEWPORT_PADDING),
    );
    const overflowRight = Math.max(
      0,
      candidate.left + menuRect.width - (viewportWidth - VIEWPORT_PADDING),
    );

    return overflowTop + overflowLeft + overflowBottom + overflowRight;
  };

  const bestCandidate =
    candidates.find((candidate) => getOverflowScore(candidate) === 0) ??
    candidates.reduce((best, candidate) => {
      return getOverflowScore(candidate) < getOverflowScore(best)
        ? candidate
        : best;
    }, candidates[0]);

  return {
    top: Math.min(
      Math.max(bestCandidate.top, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        viewportHeight - menuRect.height - VIEWPORT_PADDING,
      ),
    ),
    left: Math.min(
      Math.max(bestCandidate.left, VIEWPORT_PADDING),
      Math.max(
        VIEWPORT_PADDING,
        viewportWidth - menuRect.width - VIEWPORT_PADDING,
      ),
    ),
    placement: bestCandidate.placement,
    transformOrigin: bestCandidate.transformOrigin,
    ready: true,
  };
}