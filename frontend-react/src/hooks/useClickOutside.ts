/* ============================================================
   GSDS v1.0 — useClickOutside Hook
   Detects clicks outside a referenced element.
   ============================================================ */

import { useEffect, type RefObject } from 'react';

/**
 * Invokes `handler` when a click or touch event occurs outside
 * the element referenced by `ref`.
 *
 * @param ref - React ref to the target element
 * @param handler - Callback fired on outside interaction
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      // If there's no target or it's inside the ref, ignore
      const target = event.target as Node | null;
      if (!el || !target || el.contains(target)) {
        return;
      }

      // Ignore clicks that originate from the sidebar toggle button (e.g. hamburger)
      // The Topbar menu button will have `data-sidebar-toggle` attribute.
      try {
        if (target instanceof Element && target.closest('[data-sidebar-toggle]')) {
          return;
        }
      } catch (e) {
        // defensive: if `closest` is not available or fails, ignore
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

