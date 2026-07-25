"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/lib/auth";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/editor", label: "Editor" },
  { href: "/settings", label: "Settings" },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const showToast = useToastStore((state) => state.showToast);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.push("/login");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to log out.", "error");
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200 bg-cream-50 px-4 py-4 sm:px-6">
      <nav className="flex items-center gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium text-charcoal-600 hover:text-charcoal-900",
              pathname === link.href && "text-charcoal-900 underline underline-offset-4"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" onClick={handleLogout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Log out"}
      </Button>
    </header>
  );
}
