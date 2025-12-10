# ICPay Docs

The official documentation site for ICPay (Next.js + MDX).

- Live: https://docs.icpay.org
- Repos: SDK — https://github.com/icpay/icpay-sdk · Widgets — https://github.com/icpay/icpay-widget

## Getting started

```bash
pnpm install
pnpm dev   # runs Next.js on http://localhost:6204
```

Build & run:
```bash
pnpm build
pnpm start   # serves production build on port 6204
```

## Project structure

- `src/app/*` — MDX/TSX routes (e.g. `sdk`, `widget`, `webhooks`, `x402`, `ledgers`)
- `src/app/widget/components/*` — per‑component docs (pay‑button, amount‑input, etc.)
- `src/components/*` — UI components for the docs site
- `src/styles/tailwind.css` — site styles
- `src/mdx/*` — MDX/remark/rehype pipeline and search config

## Authoring content

- Pages are MDX (`page.mdx`) or TSX (`page.tsx`) under `src/app/...`
- Use fenced code blocks and the built-in `<Code>` component for code samples
- Navigation is derived from route structure; keep paths descriptive

## Contributing

- Use `pnpm lint` before submitting changes
- Open issues/PRs in this repo for docs changes
