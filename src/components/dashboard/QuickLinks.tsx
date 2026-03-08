import Link from "next/link";

interface QuickLinkItem {
  href: string;
  icon: string;
  title: string;
  description: string;
}

const LINKS: QuickLinkItem[] = [
  {
    href: "/calendar",
    icon: "\uD83C\uDFC1",
    title: "Race Calendar",
    description: "Full 2026 season schedule",
  },
  {
    href: "/drivers",
    icon: "\uD83C\uDFCE\uFE0F",
    title: "Drivers",
    description: "Driver profiles and stats",
  },
  {
    href: "/standings",
    icon: "\uD83C\uDFC6",
    title: "Standings",
    description: "Championship leaderboards",
  },
  {
    href: "/predictions",
    icon: "\uD83C\uDFAF",
    title: "Predictions",
    description: "Predict podium finishes",
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group rounded-xl bg-f1-surface border border-f1-border p-4 transition-all duration-200 hover:bg-f1-surface-hover hover:border-f1-red/40 hover:scale-[1.02]"
        >
          <span className="text-2xl block mb-2">{link.icon}</span>
          <h3 className="text-sm font-semibold text-white group-hover:text-f1-red transition-colors">
            {link.title}
          </h3>
          <p className="text-xs text-f1-muted mt-1">{link.description}</p>
        </Link>
      ))}
    </div>
  );
}
