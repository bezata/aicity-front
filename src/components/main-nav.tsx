"use client";

import {
  Brain,
  Building2,
  CircuitBoard,
  Cpu,
  FileText,
  Globe,
  Heart,
  Home,
  MessageSquare,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNav = [
  {
    title: "Overview",
    icon: Home,
    href: "/",
  },
  {
    title: "Chronicles",
    icon: FileText,
    href: "/chronicles",
  },
  {
    title: "Districts",
    icon: Building2,
    href: "/chatrooms",
  },
  {
    title: "Population",
    icon: Users,
    href: "/population",
  },
  {
    title: "Resources",
    icon: Cpu,
    href: "/resources",
  },
  {
    title: "Security",
    icon: Shield,
    href: "/security",
  },
  {
    title: "Environment",
    icon: Globe,
    href: "/environment",
  },
  {
    title: "Neural Health",
    icon: Brain,
    href: "/health",
  },
  {
    title: "Communications",
    icon: MessageSquare,
    href: "/communications",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4">
      {mainNav.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={index}
            href={item.href}
            className={`
            group relative flex items-center gap-3 rounded-lg p-3 transition-all duration-500
            ${
              isActive
                ? "bg-purple-500/10 text-purple-300"
                : "text-purple-300/50 hover:bg-purple-500/5 hover:text-purple-300"
            }
          `}
          >
            {/* Neon Border when active */}
            {isActive && (
              <div className="absolute inset-0 rounded-lg border border-purple-500/50 shadow-[0_0_15px_0_rgba(168,85,247,0.4)]" />
            )}

            {/* Icon with Glow Effect */}
            <div className="relative">
              <item.icon
                className={`
              h-5 w-5 transition-all duration-500
              ${
                isActive
                  ? "text-purple-400"
                  : "text-purple-400/50 group-hover:text-purple-400"
              }
            `}
              />
              {isActive && (
                <div className="absolute -inset-2 -z-10 animate-pulse rounded-full bg-purple-500/20" />
              )}
            </div>

            {/* Title with Gradient Effect */}
            <span
              className={`
            text-sm font-light tracking-wide transition-all duration-500
            ${
              isActive
                ? "bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent"
                : ""
            }
          `}
            >
              {item.title}
            </span>

            {/* Active Background Effect */}
            {isActive && (
              <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent opacity-50" />
            )}

            {/* Hover Ripple Effect */}
            <div
              className={`
            absolute inset-0 -z-20 rounded-lg transition-opacity duration-500
            bg-[radial-gradient(circle_at_0%_50%,rgba(168,85,247,0.1),transparent_50%)]
            ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
            />
          </Link>
        );
      })}
    </nav>
  );
}
