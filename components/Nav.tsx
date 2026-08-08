"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const path = usePathname();
  return (
    <nav
      className="sticky top-0 z-30 bg-ink-950/85 backdrop-blur border-b border-ink-800/70"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-py to-js grid place-items-center text-ink-950 text-[11px] font-black shadow-glow">
            CF
          </span>
          <span className="font-semibold tracking-tight hidden sm:inline">Code Forge</span>
        </Link>
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-1 text-sm whitespace-nowrap">
            <NavLink href="/" active={path === "/"}>Home</NavLink>
            <NavLink href="/learn/python" active={path?.startsWith("/learn/python") ?? false}>Python</NavLink>
            <NavLink href="/learn/javascript" active={path?.startsWith("/learn/javascript") ?? false}>JavaScript</NavLink>
            <NavLink href="/review" active={path === "/review"}>Review</NavLink>
            <NavLink href="/projects" active={path === "/projects"}>Projects</NavLink>
            <NavLink href="/cheatsheet" active={path === "/cheatsheet"}>Cheatsheet</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md transition ${
        active
          ? "text-ink-100 bg-ink-800"
          : "text-ink-300 hover:text-ink-100 hover:bg-ink-800/60"
      }`}
    >
      {children}
    </Link>
  );
}
