"use client";

import { TopNav } from "@/components/top-nav";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-black">
      <TopNav />
      <main className=" justify-center items-center flex pt-20">
        {children}
      </main>
    </div>
  );
}
