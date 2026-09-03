import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

export function useSystemDarkMode() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  createEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    setIsDarkMode(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", listener);

    return () => {
      mediaQuery.removeEventListener("change", listener);
    };
  });

  return isDarkMode;
}

export function useKeyDown() {
  const [isKeyDown, setIsKeyDown] = createSignal(false);

  const onKeyDown = () => {
    if (isKeyDown()) {
      return;
    }
    setIsKeyDown(true);
    setTimeout(() => {
      setIsKeyDown(false);
    }, 3000);
  };

  onMount(() => {
    document.addEventListener("keydown", onKeyDown);
  });
  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
  });

  return isKeyDown;
}

function useInterval(callback: () => void, delay: number) {
  let id: number;

  onMount(() => {
    id = setInterval(callback, delay);
  });

  onCleanup(() => {
    clearInterval(id);
  });
}
