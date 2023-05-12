# IQ Test Game

Next.js web client for IQ Test Game — a trivia platform with quiz zones, daily quizzes, battles, contests, exams, and self-learning modes.

## Stack

- Next.js 14 (Pages Router)
- React 18, Redux Toolkit, Ant Design
- Firebase authentication
- Remote REST API backend (`NEXT_PUBLIC_BASE_URL`)

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Docker

```bash
docker build -t iq-test-game .
docker run --rm -p 3000:3000 iq-test-game
```

## Tests

```bash
npm test
```

Coverage targets the shared `lib/` helpers used across quiz scoring and configuration.

## Environment

Copy `.env` and set:

- `NEXT_PUBLIC_BASE_URL` — API backend origin
- `NEXT_PUBLIC_APP_WEB_URL` — public site URL

Set `NEXT_PUBLIC_SEO=false` only when producing a static export for Apache hosting.
