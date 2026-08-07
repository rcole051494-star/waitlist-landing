import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-30 bg-ink-950/85 backdrop-blur border-b border-ink-800/70">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-py to-js grid place-items-center text-ink-950 text-xs font-black shadow-glow">
            CF
          </span>
          <span className="font-semibold tracking-tight">Code Forge</span>
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <NavLink href="/">Dashboard</NavLink>
          <NavLink href="/learn/python">Python</NavLink>
          <NavLink href="/learn/javascript">JavaScript</NavLink>
          <NavLink href="/review">Review</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/cheatsheet">Cheatsheet</NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 transition"
    >
      {children}
    </Link>
  );
}
