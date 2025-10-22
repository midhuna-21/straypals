
# Cloudflare setup (summary)

- Proxy domain through Cloudflare (orange cloud).
- SSL/TLS: Full (strict), Always Use HTTPS: On.
- **Cache Rule 1**: Path `/ogImage*` → Cache Everything, respect origin, cache by full URL.
- **Cache Rule 2 (optional)**: Path `/v0/b/*/o/public%2Fog%2F*` → Cache Everything (1 day).
- **Bypass**: for dynamic API endpoints you add (if any).
- Force refresh OG by appending `?refresh=1` to the `/ogImage` URL.
