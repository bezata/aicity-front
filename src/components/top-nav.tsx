"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Wallet, Menu, X as XIcon, Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { useState } from "react";
import { useEffect } from "react";
import {
  useAppKitConnection,
  type Provider,
} from "@reown/appkit-adapter-solana/react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import logo from './logo.png'

const navItems = [
  { name: "Introduction", href: "/" },
  { name: "Overview", href: "/overview" },
  { name: "Departments", href: "/departments" },
  { name: "Chronicles", href: "/chronicles" },
  { name: "CCTV", href: "/surveillance" },
  {
    name: "Docs",
    href: "https://neurova.gitbook.io/docs",
    isExternal: true,
  },
];

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function TopNav() {
  const { open } = useAppKit();
  const pathname = usePathname();
  const { address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { walletProvider } = useAppKitProvider<Provider>("solana");
  const [balance, setBalance] = useState(0);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkWalletState = async () => {
      if (walletProvider?.publicKey && connection) {
        try {
          const bal = await connection.getBalance(walletProvider.publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
          setIsWalletReady(true);
        } catch (err) {
          console.error("Error getting balance:", err);
          setBalance(0);
          setIsWalletReady(false);
        }
      } else {
        setIsWalletReady(false);
      }
    };

    checkWalletState();
    const interval = setInterval(checkWalletState, 30000);

    return () => clearInterval(interval);
  }, [connection, walletProvider?.publicKey]);

  const handleConnect = () => {
    open();
  };

  const handleAccountView = () => {
    open();
  };

  const renderNavLink = (item: (typeof navItems)[0]) => {
    const content = (
      <div className="relative">
        <span className="relative z-10 text-sm font-light tracking-wide">
          {item.name}
        </span>
        <div className="absolute -inset-x-2 -inset-y-1 -z-10 scale-90 rounded-lg bg-purple-500/0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:bg-purple-500/5 group-hover:opacity-100" />
      </div>
    );

    if (item.isExternal) {
      return (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            group relative px-4 py-2 transition-all duration-300
            text-purple-300/70 hover:text-purple-300
          `}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          group relative px-4 py-2 transition-all duration-300
          ${
            pathname === item.href
              ? "text-purple-300"
              : "text-purple-300/70 hover:text-purple-300"
          }
        `}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {pathname === item.href && (
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-x-0 -bottom-[1px] h-[1px] bg-purple-500/50 shadow-[0_0_15px_0_rgba(168,85,247,0.4)]" />
            <div className="absolute inset-0 bg-purple-500/5" />
          </div>
        )}
        {content}
      </Link>
    );
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center border-b border-white/5 bg-black/50 px-4 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={logo}
            alt="Neurova Logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
        </div>
        <div className="hidden space-y-1 lg:block">
          <h2 className="bg-gradient-to-r from-purple-200 via-purple-300 to-purple-400 bg-clip-text text-lg font-light tracking-wider text-transparent">
            Neurova
          </h2>
          <p className="text-xs font-light tracking-widest text-purple-400/70">
            量子意識の世界
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XIcon className="h-5 w-5 text-purple-300" />
          ) : (
            <Menu className="h-5 w-5 text-purple-300" />
          )}
        </Button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(renderNavLink)}
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute left-0 right-0 top-16 bg-black/95 border-b border-white/5 backdrop-blur-xl lg:hidden">
            <nav className="flex flex-col py-4">
              {navItems.map(renderNavLink)}
            </nav>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Credits & Wallet Section */}
          <div className="hidden items-center gap-4 lg:flex">
            <a
              href="https://x.com/NeurovaLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300/70 hover:text-purple-300 transition-colors"
            >
              <XLogo />
            </a>
            <a
              href="https://github.com/NeurovaCity/Neurova"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300/70 hover:text-purple-300 transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
            {address && (
              <>
                <div className="flex items-center gap-2">
                  <div className="text-sm">
                    <div className="font-mono text-purple-300">
                      <span className="text-purple-400/70">$NEUROVA:</span>{" "}
                      {balance.toLocaleString()}
                    </div>
                    {balance === 0 && (
                      <Link href="/buy-credits">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="relative -ml-2 h-7 gap-2 border border-purple-500/10 bg-purple-500/5 px-2 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
                        >
                          <span className="relative">+</span>
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
          {!address ? (
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
