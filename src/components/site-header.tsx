"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, UserRound, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "#destinations" },
  { label: "My Bookings", href: "#bookings" },
  { label: "Admin", href: "#admin" },
];

const accountLinks = [
  { label: "Profile", href: "#profile", icon: true },
  { label: "Login", href: "#login" },
  { label: "Sign Up", href: "#signup" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="relative z-50 h-10 container mx-auto  w-full lg:h-12 my-4">
      <div className="relative mx-auto  flex h-full max-w-[1600px] items-center justify-between bg-white px-4 sm:px-6 lg:px-8 xl:px-12">
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-4 md:flex lg:gap-7 "
        >
          {navLinks.map((link) => {
            const isActive = link.href === pathname;

            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`text-[13px] transition-colors hover:text-brand lg:text-[15px] ${
                  isActive ? "font-medium text-brand" : "text-neutral-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          aria-label="Wanderlast home"
          className="absolute left-1/2 -translate-x-1/2"
        >
          <Image
            src="/assets/Wanderlast.png"
            alt="Wanderlast"
            width={162}
            height={24}
            priority
            className="h-5 w-auto lg:h-6"
          />
        </Link>

        <div className="ml-auto hidden items-center gap-4 md:flex lg:gap-6">
          {accountLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 text-[13px] text-neutral-700 transition-colors hover:text-brand lg:text-[15px]"
            >
              {link.icon ? (
                <UserRound className="size-4" aria-hidden="true" />
              ) : null}
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="ml-auto flex size-9 items-center justify-center text-neutral-700 transition-colors hover:text-brand md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-black/5 bg-white shadow-lg md:hidden"
        >
          <nav aria-label="Mobile navigation" className="px-4 py-3">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`border-b border-black/5 py-3 text-sm transition-colors hover:text-brand ${
                    link.href === pathname
                      ? "font-medium text-brand"
                      : "text-neutral-700"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-5 pt-4">
              {accountLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1.5 text-sm text-neutral-700 transition-colors hover:text-brand"
                >
                  {link.icon ? (
                    <UserRound className="size-4" aria-hidden="true" />
                  ) : null}
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
