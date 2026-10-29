"use client";

const MARKER = "The children should not have changed if we pass in the same set";

function messageText(args: unknown[]) {
  return args
    .map((value) => {
      if (typeof value === "string") return value;
      if (value instanceof Error) return `${value.message}\n${value.stack ?? ""}`;
      return "";
    })
    .join(" ");
}

function installDevtoolsFilter() {
  if (typeof window === "undefined") return;
  const flag = "__portfolioDevtoolsFilter";
  const host = window as Window & { [flag]?: boolean };
  if (host[flag]) return;
  host[flag] = true;

  const wrap = (fn: (...args: unknown[]) => void) => {
    return (...args: unknown[]) => {
      if (messageText(args).includes(MARKER)) return;
      fn.apply(console, args);
    };
  };

  let current = wrap(console.error.bind(console));
  try {
    Object.defineProperty(console, "error", {
      configurable: true,
      enumerable: true,
      get() {
        return current;
      },
      set(fn: (...args: unknown[]) => void) {
        current = wrap(fn);
      },
    });
  } catch {
    console.error = current as typeof console.error;
  }
}

if (process.env.NODE_ENV === "development") {
  installDevtoolsFilter();
}

/** Drops a known React DevTools false warning before the Next.js error overlay shows it. */
export function DevtoolsConsoleFilter() {
  return null;
}
