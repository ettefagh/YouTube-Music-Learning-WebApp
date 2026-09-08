/**
 * Long-press gesture action for Svelte
 * Triggers onLongPress after duration ms of continuous hold (touch or mouse)
 * Suppresses standard click event when long-press fires
 */
export interface LongPressOptions {
  duration?: number;
  onLongPress: () => void;
  onClick?: () => void;
}

export function longpress(node: HTMLElement, options: LongPressOptions) {
  let timer: number | null = null;
  let isLongPressFired = false;
  let startX = 0;
  let startY = 0;
  const duration = options.duration ?? 500;

  function onPointerDown(e: MouseEvent | TouchEvent) {
    isLongPressFired = false;
    if ('touches' in e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }

    timer = window.setTimeout(() => {
      isLongPressFired = true;
      options.onLongPress();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate?.(40);
      }
    }, duration);
  }

  function onPointerMove(e: MouseEvent | TouchEvent) {
    if (timer === null) return;
    const curX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const curY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    // Cancel if dragged more than 10px
    if (Math.hypot(curX - startX, curY - startY) > 10) {
      clearTimer();
    }
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function onClick(e: MouseEvent) {
    if (isLongPressFired) {
      e.preventDefault();
      e.stopPropagation();
      isLongPressFired = false;
      return;
    }
    options.onClick?.();
  }

  node.addEventListener('mousedown', onPointerDown);
  node.addEventListener('mousemove', onPointerMove);
  node.addEventListener('mouseup', clearTimer);
  node.addEventListener('mouseleave', clearTimer);

  node.addEventListener('touchstart', onPointerDown, { passive: true });
  node.addEventListener('touchmove', onPointerMove, { passive: true });
  node.addEventListener('touchend', clearTimer);
  node.addEventListener('touchcancel', clearTimer);

  node.addEventListener('click', onClick, { capture: true });

  return {
    update(newOptions: LongPressOptions) {
      options = newOptions;
    },
    destroy() {
      clearTimer();
      node.removeEventListener('mousedown', onPointerDown);
      node.removeEventListener('mousemove', onPointerMove);
      node.removeEventListener('mouseup', clearTimer);
      node.removeEventListener('mouseleave', clearTimer);
      node.removeEventListener('touchstart', onPointerDown);
      node.removeEventListener('touchmove', onPointerMove);
      node.removeEventListener('touchend', clearTimer);
      node.removeEventListener('touchcancel', clearTimer);
      node.removeEventListener('click', onClick, { capture: true });
    }
  };
}
