import { flushSync } from "react-dom";

type ThemeSetter = (theme: string) => void;

type TransitionPoint = {
  x: number;
  y: number;
};

function supportsViewTransition() {
  return (
    typeof document !== "undefined" &&
    "startViewTransition" in document &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function applyCssFallback(duration = 380) {
  const root = document.documentElement;
  root.classList.add("theme-transition");
  window.setTimeout(() => {
    root.classList.remove("theme-transition");
  }, duration);
}

export function setThemeWithTransition(
  nextTheme: string,
  setTheme: ThemeSetter,
  point?: TransitionPoint,
) {
  const x = point?.x ?? window.innerWidth / 2;
  const y = point?.y ?? window.innerHeight / 2;

  if (!supportsViewTransition()) {
    applyCssFallback();
    setTheme(nextTheme);
    return;
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    flushSync(() => {
      setTheme(nextTheme);
    });
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 480,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => {
      // ignore aborted transitions
    });
}
