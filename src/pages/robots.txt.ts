// https://docs.astro.build/en/guides/integrations-guide/sitemap/#usage
import type { APIRoute } from 'astro';

const robotsTxt = `
User-agent: Googlebot
Disallow:
Allow: /
Crawl-delay: 10

User-agent: Yandex
Disallow:
Allow: /
Crawl-delay: 2

User-agent: archive.org_bot
Disallow:
Allow: /
Crawl-delay: 2

User-agent: *
Disallow: /

User-agent: Claude-Web
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-User
Disallow:
Allow: /

User-agent: Claude-SearchBot
Disallow:
Allow: /

User-agent: ClaudeBot
Disallow:
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};