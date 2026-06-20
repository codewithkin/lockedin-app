# LockedIn — Design System

Dark and cinematic, calm not gamified. The system is shared in spirit across the mobile app and the marketing site, with one accent doing all the emotional work.

## Voice of the visuals

- **Serif (Newsreader)** carries the human, declarative moments — the headlines. "Stop planning. Start executing." "Day 6."
- **Sans (Hanken Grotesk)** carries the UI — body copy, buttons, controls.
- **Mono (JetBrains Mono)** carries time and discipline — the timer, eyebrows, and uppercase tracked labels.

## Color

| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A0A0A` | App background |
| `card` | `#16161A` | Default surface |
| `elevated` | `#1E1E24` | Raised surface / inputs |
| `line` | `#262630` | Hairline borders |
| `fg` | `#ECEAE6` | Primary text |
| `subtle` | `#8A8A94` | Muted text, captions |
| `paper` | `#F4EFE9` | Warm white (share cards, inverse) |
| `coral` | `#FF6B4A` | The accent — actions, focus, streak |
| `coral-bright` | `#FF8A6E` | Gradient highlight / hover |
| `coral-deep` | `#E0512E` | Pressed / deep glow |

Rules: exactly one accent. Coral never competes with itself — a screen has at most one coral action. Text on coral is always `ink`.

## Type scale

| Role | Font | Size / line | Weight |
|---|---|---|---|
| Display | Newsreader | 40 / 44 | 600 |
| Title | Newsreader | 30 / 36 | 600 |
| Heading | Hanken Grotesk | 18 / 24 | 600 |
| Body | Hanken Grotesk | 16 / 24 | 400 |
| Body strong | Hanken Grotesk | 16 / 24 | 600 |
| Label (eyebrow) | JetBrains Mono | 11 / 16 | 500, +2px tracking, UPPERCASE, coral |
| Timer | JetBrains Mono | 64 / 64 | 600, tabular |
| Caption | Hanken Grotesk | 12 / 16 | 400, subtle |

## Spacing

4px base. Screen gutter = 24 (28 on key screens). Section rhythm = 32–40 between blocks. Card padding = 20–24.

## Radii

| Token | px | Use |
|---|---|---|
| `sm` | 8 | chips, small controls |
| `md` | 12 | duration chips |
| `lg` | 16 | inputs |
| `xl` | 20 | nested surfaces |
| `2xl` | 24 | cards |
| `pill` | 999 | primary buttons, goal chips |

## Components

- **Primary button** — coral, pill, ink text, Hanken 600, vertical gradient (bright → coral), light press dim. Medium haptic.
- **Ghost button** — transparent, `line` border, subtle text. Used for Skip / secondary.
- **Card** — `card` fill, `line` border, radius 2xl.
- **Eyebrow** — mono label, coral, above headlines.
- **Share card** — `paper`-on-`ink` with a coral radial glow; the one inverse surface.

## Implementation

- **Native:** tokens in `lib/theme.ts`, Tailwind/uniwind tokens in `global.css` `@theme`, text via `components/typography.tsx`. Fonts loaded with `@expo-google-fonts/*` in the root layout.
- **Web:** fonts via `next/font/google` as CSS variables, tokens in `src/index.css` `@theme`, shadcn/ui (new-york, Tailwind v4) with `cn` in `lib/utils.ts`.
