import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ── localStorage helper ──────────────────────────────────
export const storage = {
    get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    },
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // quota exceeded or other error
        }
    },
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch {
            // ignore
        }
    },
};
