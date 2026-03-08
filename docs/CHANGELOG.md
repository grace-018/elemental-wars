# Changelog

## [Refactor] – 2026-03-08

A full code-quality pass fixing bugs, removing dead code, and improving
accessibility. No game rules or visual design were changed.

---

### Bug Fixes

#### `main.js`
- **Fixed splice-during-forEach bug** in `clickFight`.
  The original code called `array.splice()` inside a `forEach` loop, which
  skips the element immediately after the spliced one. Replaced both loops with
  `Array.filter()` so the array is rebuilt safely after every fight.

- **Fixed all-cards-played end-condition never firing**.
  `finalResult` checked `playerItems.hasChildNodes() && computerElements.length === 0`,
  but `playerItems` has no children once all cards are used — so the condition
  was always `false`. Fixed by also tracking player card exhaustion in the
  `playerElements` array (cards are now spliced when `count === 2`) and checking
  `playerElements.length === 0 && computerElements.length === 0` instead.

- **Replaced 20-second `setTimeout`** with a direct `finalResult()` call at the
  end of `clickFight`. The timeout was a workaround for the end-condition bug
  above; with that bug fixed it is no longer needed.

- **Fixed wrong `alt` attribute** on the fight button image in `index.html`
  (`alt="quit"` → `alt="Fight"`).

---

### Code Quality

#### `main.js`
- **Consolidated three identical element array definitions** into a single
  `ELEMENT_DEFS` constant and a `makeElementSet()` factory function. Both
  `playerElements` and `computerElements` are now derived from this one source
  of truth.

- **Removed all dead/commented-out code**:
  - Commented-out computer card display loop (was replaced by the scoreboard approach).
  - Commented-out span wrappers inside `showPlayerItems` and `handleClick`.
  - Commented-out `resetCard()` function and the full alternative restart logic
    inside `clickYesRestart`.
  - Commented-out quit button event listener.

- **Simplified `getResult`**: Replaced chained `if` statements (which could
  accidentally match multiple branches) with a clear `if / else if / else`
  structure using two boolean variables (`playerWins`, `computerWins`).

- **Simplified `finalResult`**: Replaced repeated `isGameOver = true` + `final.style.display`
  assignments with a single guard clause at the top and a consolidated display
  call at the bottom.

- **Added null-guard to `clickFight`**: Returns early if `computerElements` is
  empty (prevents an error if the fight button is clicked after all computer
  cards are exhausted but before the end modal appears).

- **Grouped all DOM references at the top** of the file for easy discoverability.

- **Fixed typo**: `removeHiglight` → `removeHighlight`.

#### `index.html`
- **Fixed all backslash image paths** (`images\file.jpg` → `images/file.jpg`).
  Backslashes are Windows-only; forward slashes work on all platforms.

- **Removed malformed comment** on the quit button block
  (`--commnent for now-->` was invalid HTML comment syntax).

- **Added `role="button"` and `aria-label`** to all `<span>` elements that act
  as buttons (Start, How to Play, Restart, Fight), improving keyboard and
  screen-reader accessibility.

- **Added `alt` text** to element card images inside the instruction modal
  (previously blank).

#### `css/style.css`
- **Fixed missing semicolon** on `height: 100%` in the `html, body` rule
  (line 9 of the original file).

- **Replaced hard-coded `711.7px` height** on `#game-board` with
  `min-height: 600px; height: max-content` so the board grows naturally with
  its content.

- **Replaced hard-coded `231.44px` height** on `#playerItems` with
  `min-height: 130px` so the player card area shrinks gracefully as cards are
  removed without collapsing entirely.

- **Removed commented-out CSS rules** inside `#closeModal`.

---

### Files Changed

| File | Changes |
|------|---------|
| `main.js` | Consolidated arrays, removed dead code, fixed bugs, simplified logic |
| `index.html` | Fixed paths, fixed comment, added ARIA, fixed alt text |
| `css/style.css` | Fixed semicolon, fixed heights, removed commented CSS |
| `docs/CHANGELOG.md` | Created (this file) |

---

## [Improvements] – 2026-03-08

Seven gameplay and UX improvements added while keeping the project strictly
vanilla HTML / CSS / JS — no frameworks, no build tools, no new dependencies.

---

### New Features

#### 1. Card Usage Indicators (★★ / ★☆)
Each player card is now wrapped in a `.card-slot` div with two gold stars below
the image. After the first use one star dims to grey, making it immediately clear
which cards have one use remaining and which are fresh.

**Files:** `main.js` (`showPlayerItems`, `clickFight`), `css/style.css`

---

#### 2. Computer Card Backs
Six face-down card backs appear in the computer's field at game start. One back
is removed each time the computer exhausts a card (after its second use). The
player can now see how many cards the computer has left without revealing which
elements those cards are.

**Files:** `main.js` (`showComputerBacks`, `clickFight`), `css/style.css`

---

#### 3. Battle Counter ("Battle 3 / 12")
A small label updates after every fight showing current progress. The maximum is
12 (6 cards × 2 uses each). Gives players a sense of pacing and urgency.

**Files:** `index.html` (`#battle-counter`), `main.js` (`battleCount`), `css/style.css`

---

#### 4. "Select a Card First" Shake Prompt
Clicking Fight without selecting a card now triggers a CSS shake animation on the
Fight button and fades in the text "Select a card first!" for 1.5 seconds. Previously
the button silently did nothing.

**Files:** `main.js` (guard in `clickFight`), `css/style.css` (`@keyframes shake`, `#hint`)

---

#### 5. Battle History Log
A running list (last 3 fights) sits below the Fight button showing:
`💨 wind vs 💧 water — ✅ You Win`. The most recent fight is always at the top.
Entries older than three are removed automatically.

**Files:** `index.html` (`#battle-log`), `main.js` (`addToLog`), `css/style.css`

---

#### 6. End-Game Statistics
The final modal now shows a breakdown below the win/lose/draw message:
`Wins: 4  |  Losses: 3  |  Draws: 5`. Three counters (`wins`, `losses`, `draws`)
are tracked throughout the game and written to `#stats` when `finalResult` fires.

**Files:** `index.html` (`#stats`), `main.js` (`wins`/`losses`/`draws`, `finalResult`), `css/style.css`

---

#### 7. AI Difficulty Selector (Easy / Hard)
Two buttons on the home screen let the player choose difficulty before starting.
- **Easy** (default): computer picks randomly from its remaining cards.
- **Hard**: computer looks up the counter to the player's last played element
  (e.g. player played Water → computer tries Wind). If the counter card is not
  in its hand it falls back to random. If the player used Light (which has no
  counter) the computer avoids playing Dark (which would lose).

**Files:** `index.html` (`#difficulty-selector`), `main.js` (`difficulty`, `getComputerCard`), `css/style.css`

---

### Files Changed

| File | Changes |
|------|---------|
| `main.js` | `showComputerBacks`, `addToLog`, `getComputerCard`, card-slot stars, battle counter, stats tracking |
| `index.html` | `#difficulty-selector`, `#hint`, `#battle-counter`, `#battle-log`, `#stats` |
| `css/style.css` | `.diff-btn`, `.card-back`, `.card-slot`, `.stars`, `#hint`, `#battle-counter`, `#battle-log`, `#stats`, `@keyframes shake` |
| `docs/CHANGELOG.md` | Updated (this section) |

---

## [Sound & Music] – 2026-03-08

Sound effects and background music added using the browser's built-in Web Audio
API. No audio files or external libraries are required — every sound is generated
programmatically at runtime.

---

### New Features

#### Sound Effects
Seven distinct sounds triggered by game events:

| Sound | Trigger | Description |
|-------|---------|-------------|
| Card select | Player clicks a card | Short soft click (900 Hz sine) |
| Fight | Fight button pressed | Low impact thud (sawtooth + sine) |
| Round win | Player wins a battle | Ascending C → E → G arpeggio |
| Round lose | Player loses a battle | Descending G → E → C arpeggio |
| Tie | Battle is a draw | Flat A4 triangle tone |
| Victory | Player wins the game | Four-note fanfare C → E → G → C5 (square wave) |
| Defeat | Player loses the game | Slow descending motif G → F → E → C |

#### Background Music
A quiet C-major arpeggio (C3 → E3 → G3 → E3) loops at low volume during
gameplay. Music starts when the game board appears and stops cleanly when
the game ends, restarts, or the player returns home.

#### Mute Button
A 🔊 / 🔇 toggle button in the game header controls all audio (effects +
music) via a single `masterGain` node. The AudioContext is created lazily on
the first user interaction to comply with browser autoplay policies.

---

### Files Changed

| File | Changes |
|------|---------|
| `audio.js` | Created — full Web Audio API sound engine |
| `main.js` | Imports audio module; adds `playCardSelect`, `playFight`, `playWin/Lose/Tie`, `playVictory`, `playDefeat`, `startMusic`, `stopMusic` call sites; mute button wired |
| `index.html` | `#mute-btn` added to game header |
| `css/style.css` | `#mute-btn` styles; `header` updated to `align-items: center` |
| `docs/CHANGELOG.md` | Updated (this section) |

---

## [UI & Game Rules] – 2026-03-08

UI polish and two new game rules added. Pure vanilla HTML/CSS/JS throughout.

---

### Bug Fixes
- **"Elementtal" typo** corrected to "Elemental" in the instruction modal.
- **`.dark` color** changed from `#15131f` (invisible against dark backgrounds) to `#9b59b6` (purple), matching the element's theme.

---

### UI Improvements

#### Color-coded result text
`#result` receives class `win-text` (green `#2ecc71`), `lose-text` (red `#e74c3c`), or `tie-text` (gold `#f1c40f`) after each fight. Classes are cleared by `clearGameField()`.

#### Battle explanation line
`<p id="battle-explanation">` appears inside `#game-result`. After each fight it shows why the round ended: `"🔥 Fire beats 🌍 Earth!"`, `"Light draws with most elements"`, `"Same element — Tie!"`, etc. Powered by `getBattleExplanation(p, c, outcome)` in `main.js`.

#### "Your Pick" / "CPU Pick" labels
`#game-result` was restructured into three columns: `.pick-area` (Your Pick + image), `.result-center` (result + explanation), `.pick-area` (CPU Pick + image). Existing DOM refs to `.playerSelected` and `.computerSelected` remain valid.

#### Score pulse animation
`@keyframes pulse` scales the score element to 1.5× and back in 0.4s. `pulseScore(el)` helper is called in `getResult()` whenever a score changes.

#### Dynamic direction text
The `.direction` paragraph now updates on card select (`"Playing: Wind 💨"`) and resets to `"Choose your card"` after each fight.

#### Point target label in header
`<span id="point-target-label">` in the game header shows `"First to 4"` / `"First to 6"` / `"First to 8"` depending on the chosen mode. Set in `clickStart()`.

#### Streak notification div
`<div id="streak-notification">` between the battle counter and fight button. Fades in for 2 seconds when a streak fires via `showStreakNotification(text)`.

---

### Game Rule Improvements

#### Win streak bonus
Tracks `playerStreak` and `computerStreak`. Every 3 consecutive round wins by either side awards +1 bonus point and shows the streak notification. Streaks reset on a loss or tie. Because the bonus can overshoot the point target, `finalResult()` now uses `>= pointTarget` instead of `=== pointTarget`.

#### Game mode selector (point target)
Three buttons on the home screen — **Quick (4)**, **Classic (6)**, **Marathon (8)** — set `pointTarget`. `finalResult()` checks `>= pointTarget` throughout. The header label updates on game start. Battle counter max stays at 12 (physical card limit).

---

### Files Changed

| File | Changes |
|------|---------|
| `main.js` | New DOM refs, `pointTarget`/streak state, mode listeners, `getBattleExplanation`, `pulseScore`, `showStreakNotification`, updated `getResult`/`finalResult`/`handleClick`/`clickFight`/`clearGameField` |
| `index.html` | Typo fix, `#game-result` restructure, `#mode-selector`, `#streak-notification`, `#point-target-label`, `#battle-explanation` |
| `css/style.css` | `.dark` color fix; `win-text`/`lose-text`/`tie-text`; `.pick-area`/`.result-center`/`.pick-label`; `#battle-explanation`; `@keyframes pulse`; `.score-board .points.pulse`; `#streak-notification`; `#point-target-label`; `.mode-btn` |
| `docs/CHANGELOG.md` | Updated (this section) |
