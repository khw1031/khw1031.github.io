"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./nav";
import { Footer } from "./footer";

export function ConditionalNavbar() {
  const pathname = usePathname();
  if (pathname === "/portfolio") return null;
  return <Navbar />;
}

export function ConditionalFooter() {
  const pathname = usePathname();
  if (pathname === "/portfolio") return null;
  return <Footer />;
}
