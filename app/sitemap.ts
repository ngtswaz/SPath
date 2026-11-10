import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const PAGES = ["", "/how-it-works", "/features", "/pricing", "/mission", "/join"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
