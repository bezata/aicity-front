"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useAppKit } from "@reown/appkit/react";

const navItems = [
  { name: "Overview", href: "/" },
  { name: "Districts", href: "/districts" },
  { name: "Chronicles", href: "/chronicles" },
  { name: "City Departments", href: "/departments" },
  { name: "Resources", href: "/resources" },
  { name: "Communications", href: "/communications" },
];

export function TopNav() {
  const { open } = useAppKit();
  const pathname = usePathname();
  const [balance, setBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    const { solana } = window as any;
    if (solana) {
      solana.on("connect", () => {
        setIsConnected(true);
        setWalletAddress(solana.publicKey?.toString());

        // Get balance
        const connection = new Connection(clusterApiUrl("devnet"));
        connection
          .getBalance(solana.publicKey)
          .then((bal) => setBalance(bal / LAMPORTS_PER_SOL))
          .catch((err) => {
            console.error("Error getting balance:", err);
            setBalance(0);
          });
      });

      solana.on("disconnect", () => {
        setIsConnected(false);
        setWalletAddress(undefined);
        setBalance(0);
      });

      // Check if already connected
      if (solana.isConnected) {
        setIsConnected(true);
        setWalletAddress(solana.publicKey?.toString());
      }
    }

    return () => {
      if (solana) {
        solana.removeAllListeners("connect");
        solana.removeAllListeners("disconnect");
      }
    };
  }, []);

  const handleConnect = () => {
    open();
  };

  const handleAccountView = () => {
    open();
  };

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
          {/* Credits & Wallet Section */}
          <div className="hidden items-center gap-4 lg:flex">
            {isConnected && walletAddress && (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <div className="font-mono text-purple-300">
                      <span className="text-purple-400/70 ">$AIC:</span>{" "}
                      {balance.toLocaleString()}
                    </div>
                    {balance === 0 && (
                      <Link href="/buy-credits">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="relative -ml-2 h-7 gap-2 border border-purple-500/10 bg-purple-500/5 px-2 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                        >
                          <span className="relative">
                            <span className="relative">+</span>
                          </span>
                          Buy Credits
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8 bg-white/5" />
              </>
            )}
          </div>

          {/* Connect Wallet Button */}
          {!isConnected ? (
            <Button
              variant="ghost"
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={handleConnect}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              className="gap-2 border border-purple-500/10 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 hover:text-purple-200"
              onClick={handleAccountView}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connected</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
