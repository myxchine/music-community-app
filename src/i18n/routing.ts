import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
export const routing = defineRouting({
  locales: ["en", "pt", "fr", "es", "de"],
  defaultLocale: "en",
  localeDetection: false,
});
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);