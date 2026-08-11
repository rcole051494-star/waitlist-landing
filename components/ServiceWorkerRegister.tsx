"use client";
import { useEffect } from "react";

// The service worker is a production-only concern.
//
// It serves same-origin assets stale-while-revalidate, which is right for a
// production build — those URLs are content-hashed, so a stale hit is always
// the right bytes. In development it is actively destructive: dev chunk names
// are STABLE (`webpack.js`, `main-app.js`) while their contents change on
// every edit, so the worker happily pairs a stale webpack runtime with a fresh
// module and you get "Cannot read properties of undefined (reading 'call')"
// out of options.factory.
//
// So: never register outside production, and tear down any worker a previous
// production build (or an older checkout on the same localhost port) left
// behind, since that one keeps serving until something removes it.
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol === "file:") return; // Capacitor WebView: skip SW

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then(async (regs) => {
          if (regs.length === 0) return;
          await Promise.all(regs.map((r) => r.unregister()));
          if ("caches" in window) {
            const keys = await caches.keys();
            await Promise.all(keys.filter((k) => k.startsWith("cf-")).map((k) => caches.delete(k)));
          }
          // The page currently on screen may already be running on stale
          // chunks, so reload once now that nothing is intercepting.
          window.location.reload();
        })
        .catch(() => {});
      return;
    }

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    };

    // Waiting for the load event alone loses the race whenever the page has
    // already finished loading by the time React hydrates — which is most of
    // the time on a static export, and always on a warm cache. The worker then
    // never registers, so the app never works offline and never becomes
    // installable. Check first, and only listen if there's still something to
    // wait for.
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);
  return null;
}
