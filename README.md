# Elemental Wars

A browser-based card battle game inspired by Rock-Paper-Scissors, expanded with six fantasy elements, strategic card management, and a streaking bonus system. Play directly in any modern browser — no installation, no build step.

---

## How to Play

1. **Set up** on the home screen: choose a Difficulty and a Game Mode before starting.
2. **Select a card** from your hand at the bottom of the board.
3. **Click Fight** to battle the computer's hidden card.
4. **Score points** by playing an element that defeats the computer's pick.
5. **Reach the point target** (or outscore the computer when all cards are exhausted) to win.

### Element Rules

| Element | Defeats |
|---------|---------|
| 💨 Wind | 💧 Water |
| 💧 Water | 🔥 Fire |
| 🔥 Fire | 🌍 Earth |
| 🌍 Earth | 💨 Wind |
| ✨ Light | 🌑 Dark (draws with everything else) |
| 🌑 Dark | All except ✨ Light |

### Card Usage

Each of the 6 cards can be played **twice** per game (12 total battles maximum). Two gold stars ★★ appear below each card — one star dims ★☆ after the first use, and the card is removed after the second use.

### Win Streak Bonus

Win **3 battles in a row** to earn +1 bonus point. The streak resets on a loss or tie. The computer can earn a streak bonus too.

---

## Game Modes & Difficulty

| Setting | Options | Effect |
|---------|---------|--------|
| **Difficulty** | Easy / Hard | Easy = computer picks randomly. Hard = computer counters your last played element when possible. |
| **Game Mode** | Quick (4) / Classic (6) / Marathon (8) | Sets the point target needed to win. |

---

## Features

- **Six elements** with an asymmetric win/draw/lose system (Light and Dark break the cycle)
- **Card usage stars** — visual ★★ / ★☆ indicators for remaining uses
- **Computer card backs** — 6 face-down cards show how many cards the computer has left
- **Battle counter** — "Battle 3 / 12" tracks game progress
- **Battle history log** — last 3 fights shown below the Fight button
- **Win streak bonus** — 3-win streaks award +1 bonus point
- **Color-coded results** — green win, red loss, gold tie
- **Battle explanation** — e.g. "🔥 Fire beats 🌍 Earth!" shown after every fight
- **Score pulse animation** — score numbers animate when updated
- **AI difficulty** — Hard mode counters your last played element
- **Game mode selector** — Quick / Classic / Marathon point targets
- **Sound effects & background music** — fully generated via the Web Audio API (no audio files)
- **Mute button** — 🔊 / 🔇 toggle in the game header
- **Responsive layout** — fits the screen without scrolling on desktop and mobile
- **Accessibility** — ARIA labels, role="button" on interactive spans

---

## Technologies

- **HTML5** — semantic markup, ARIA attributes
- **CSS3** — Flexbox layout, CSS custom properties, `clamp()` for fluid sizing, `@keyframes` animations, viewport-height-based responsive scaling
- **Vanilla JavaScript (ES6 Modules)** — no frameworks, no build tools
- **Web Audio API** — programmatic sound effects and background music (no audio files)
- **Google Fonts** — Permanent Marker, Play, VT323, Chewy, Montserrat, and more

---

## Project Structure

```
elemental-wars/
├── index.html        # Game markup — home screen, game board, modals
├── main.js           # All game logic (ES6 module)
├── audio.js          # Web Audio API sound engine (ES6 module)
├── css/
│   └── style.css     # All styles — layout, animations, responsive rules
├── images/           # Card art, backgrounds, UI buttons
│   ├── wind.jpg / water.jpg / fire.jpg / earth.jpg / light.jpg / dark.jpg
│   ├── sunset.jpg    # Home screen background
│   ├── castle-throne-room.jpg  # End-game modal background
│   └── ...
└── docs/
    └── CHANGELOG.md  # Full history of changes
```

---

## Running the Game

Open `index.html` directly in any modern browser. No server or build step is required.

```
# Clone and open
git clone https://github.com/<your-username>/elemental-wars.git
cd elemental-wars
# Open index.html in your browser
```

---

## Third-Party Assets

All image assets are sourced externally. All rights and ownership belong to their respective creators.

**Board & Card Design**
- [Tornioduva's basic card game asset pack](https://tornioduva.itch.io/tornioduva-card-pack)

**Background Images**
- Sunset background — [Sunset in cartoon landscape](https://www.freepik.com/free-vector/sunset-cartoon-landscape_1076851.htm) by 0melapics on Freepik
- End-game background — Castle throne room image

**Card Images**
- Light card — [pngegg.com](https://www.pngegg.com/en/png-dbccm)
- Dark card — [Design by griffsnuff](https://www.clipartmax.com/middle/m2i8A0G6H7d3d3b1_design-by-griffsnuff-griffsnuff-deviantart/)
- Wind card (Sylph Princess) — [pngkey.com](https://www.pngkey.com/detail/u2r5o0q8w7u2t4t4_sylph/)
- Water card (Mermaid) — [dreamstime.com](https://www.dreamstime.com/hand-drawn-mermaid-isolated-white-background-linen-vectorillustration-swimming-image174749278) by Kseniia Shafranovskaia
- Fire card (Phoenix) — [Hand drawn phoenix concept](https://www.freepik.com/free-vector/hand-drawn-phoenix-concept_7547514.htm) by Freepik
- Earth card (Gnome) — gnome-sitting-mushroom by brgfx / Freepik
