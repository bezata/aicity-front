"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserNav } from "@/components/user-nav";
import { AlertCircle, Brain } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Overview", href: "/" },
  { name: "Districts", href: "/chat-rooms" },
  { name: "Chronicles", href: "/chronicles" },
  { name: "City Departments", href: "/city-departments" },
  { name: "Resources", href: "/resources" },
  { name: "Communications", href: "/communications" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-white/5 bg-black/50 px-4 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className="h-6 w-6 text-purple-400" />
          <div className="absolute -inset-2 -z-10 animate-pulse rounded-full bg-purple-500/20" />
        </div>
        <div className="hidden space-y-1 lg:block">
          <h2 className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-lg font-light tracking-wider text-transparent">
            SILICON CITY
          </h2>
          <p className="text-xs font-light tracking-widest text-purple-400/70">
            量子意識の世界
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between px-4">
        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative px-4 py-2 transition-all duration-300
                  ${
                    isActive
                      ? "text-purple-300"
                      : "text-purple-300/70 hover:text-purple-300"
                  }
                `}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-purple-500/50 shadow-[0_0_15px_0_rgba(168,85,247,0.4)]" />
                    <div className="absolute inset-0 bg-purple-500/5" />
                  </div>
                )}

                {/* Hover Effects */}
                <div className="relative">
                  <span className="relative z-10 text-sm font-light tracking-wide">
                    {item.name}
                  </span>
                  <div className="absolute -inset-x-2 -inset-y-1 -z-10 scale-90 rounded-lg bg-purple-500/0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:bg-purple-500/5 group-hover:opacity-100" />
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-4 lg:flex">
            <div className="text-sm">
              <div className="text-purple-300">System Status: Optimal</div>
              <div className="text-purple-300/70">Cycle 2749.3</div>
            </div>
            <Separator orientation="vertical" className="h-8 bg-white/5" />
            <div className="text-sm">
              <div className="text-purple-300">Neural Load: 42.3%</div>
              <div className="text-purple-300/70">+2.1% from last cycle</div>
            </div>
            <Separator orientation="vertical" className="h-8 bg-white/5" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <AlertCircle className="h-5 w-5 text-purple-400" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-[10px]">
              3
            </span>
          </Button>
          <Separator orientation="vertical" className="h-8 bg-white/5" />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
