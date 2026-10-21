'use client';

import { useEffect } from 'react';

/**
 * Behaviour every modal on the site needs:
 *
 *  - Escape closes it (keyboard users otherwise have no way out).
 *  - The page behind stops scrolling, so a long dashboard list cannot scroll the
 *    modal out of reach.
 *  - Focus moves into the modal and returns to whatever was focused before.
 *
 * On mount it looks for the first focusable element inside `ref` and focuses
 * it, so keyboard and screen-reader users land inside the dialog instead of
 * back at the top of the page behind it.
 */
export function useModal(onClose: () => void, ref?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const previouslyFocused = document.activeElement as HTMLElement | null;
    // Prefer the first form field — landing on the "close" button instead would
    // mean a keyboard user has to tab past it before typing anything.
    const root = ref?.current;
    const first =
      root?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])',
      ) ??
      root?.querySelector<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])');
    first?.focus();

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose, ref]);
}
