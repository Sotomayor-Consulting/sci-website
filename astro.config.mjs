import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import compressor from "astro-compressor";
import starlight from "@astrojs/starlight";
import pagefind from "astro-pagefind";
import mdx from "@astrojs/mdx";
import partytown from '@astrojs/partytown';


import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // https://docs.astro.build/en/guides/images/#authorizing-remote-images
  site: "https://sotomayorconsulting.com",
  base: "/",
  image: {
    domains: ["images.unsplash.com"],
  },
  devToolbar: {
    enabled: true
  },
  prefetch: true,
  integrations: [
    partytown({
      config: {
        debug: false,
        logCalls: false,
        logGetters: false,
        logSetters: false,
        logImageRequests: false,
        logScriptExecution: false,
        logStackTraces: false,
        forward: ['dataLayer.push'],
      },
    }),
    pagefind(),
    sitemap({
      i18n: {
        defaultLocale: "es", // All urls that don't contain language prefix will be treated as default locale
        locales: {
          en: "en", // The `defaultLocale` value must present in `locales` keys
          es: "es",
          pr: "pr",
        },
      },
    }),
    starlight({
      title: "ScrewFast Docs",
      // https://github.com/withastro/starlight/blob/main/packages/starlight/CHANGELOG.md
      // If no Astro and Starlight i18n configurations are provided, the built-in default locale is used in Starlight and a matching Astro i18n configuration is generated/used.
      // If only a Starlight i18n configuration is provided, an equivalent Astro i18n configuration is generated/used.
      // If only an Astro i18n configuration is provided, the Starlight i18n configuration is updated to match it.
      // If both an Astro and Starlight i18n configurations are provided, an error is thrown.
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
        de: { label: "Deutsch", lang: "de" },
        es: { label: "Español", lang: "es" },
        fa: { label: "Persian", lang: "fa", dir: "rtl" },
        fr: { label: "Français", lang: "fr" },
        ja: { label: "日本語", lang: "ja" },
        "zh-cn": { label: "简体中文", lang: "zh-CN" },
      },
      // https://starlight.astro.build/guides/sidebar/
      sidebar: [
        {
          label: "Quick Start Guides",
          translations: {
            de: "Schnellstartanleitungen",
            es: "Guías de Inicio Rápido",
            fa: "راهنمای شروع سریع",
            fr: "Guides de Démarrage Rapide",
            ja: "クイックスタートガイド",
            "zh-cn": "快速入门指南",
          },
          items: [{ autogenerate: { directory: "guides" } }],
        },
        {
          label: "Tools & Equipment",
          items: [
            { label: "Tool Guides", link: "tools/tool-guides/" },
            { label: "Equipment Care", link: "tools/equipment-care/" },
          ],
        },
        {
          label: "Construction Services",
          items: [{ autogenerate: { directory: "construction" } }],
        },
        {
          label: "Advanced Topics",
          items: [{ autogenerate: { directory: "advanced" } }],
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mearashadowfax/ScrewFast",
        },
      ],
      disable404Route: true,
      customCss: ["./src/assets/styles/starlight.css"],
      favicon: "/favicon.ico",
      components: {
        SiteTitle: "./src/components/ui/starlight/SiteTitle.astro",
        Head: "./src/components/ui/starlight/Head.astro",
        MobileMenuFooter:
          "./src/components/ui/starlight/MobileMenuFooter.astro",
        ThemeSelect: "./src/components/ui/starlight/ThemeSelect.astro",
      },
      head: [
        {
          tag: "meta",
          attrs: {
            property: "og:image",
            content: "https://sotomayorconsulting.com/" + "/social.webp",
          },
        },
        {
          tag: "meta",
          attrs: {
            property: "twitter:image",
            content: "https://sotomayorconsulting.com/" + "/social.webp",
          },
        },
      ],
    }),
    compressor({
      gzip: false,
      brotli: true,
    }),
    mdx(),
    icon({
      iconDir: "src/assets/icons",
    }),
  ],
  experimental: {
    clientPrerender: true,
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [
        '.tunnelmole.net'  // o usa '.tunnelmole.net' para todos
      ]
    }
  },
});
