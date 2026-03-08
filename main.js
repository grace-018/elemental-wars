import {
    playCardSelect, playFight, playWin, playLose, playTie,
    playVictory, playDefeat, startMusic, stopMusic, toggleMute,
} from './audio.js';

// ── DOM References ────────────────────────────────────────────────────────────
const home = document.getElementById('home');
const start = document.getElementById('start');
const gameContainer = document.getElementById('game-container');
const playerItems = document.getElementById('playerItems');
const computerItems = document.getElementById('computerItems');
const instructionButton = document.getElementById('how-to-play');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const fight = document.getElementById('fight');
const result = document.getElementById('result');
const battleExplanation = document.getElementById('battle-explanation');
const hint = document.getElementById('hint');
const battleCounter = document.getElementById('battle-counter');
const streakNotification = document.getElementById('streak-notification');
const pointTargetLabel = document.getElementById('point-target-label');
const battleLog = document.getElementById('battle-log');
const final = document.getElementById('final');
const message = document.querySelector('.message');
const stats = document.getElementById('stats');
const computerSelected = document.querySelector('.computerSelected');
const playerSelected = document.querySelector('.playerSelected');
const restartButton = document.getElementById('restart');
const restartModal = document.getElementById('restartModal');
const yesRestart = document.querySelector('.yesRestart');
const noRestart = document.querySelector('.noRestart');
const returnHome = document.getElementById('returnHome');
const btnEasy = document.getElementById('btn-easy');
const btnHard = document.getElementById('btn-hard');
const btnQuick = document.getElementById('btn-quick');
const btnClassic = document.getElementById('btn-classic');
const btnMarathon = document.getElementById('btn-marathon');
const muteBtn = document.getElementById('mute-btn');
const direction = document.querySelector('.direction');
let playerScore = document.querySelector('.playerScore');
let computerScore = document.querySelector('.computerScore');

// ── Element Definitions ───────────────────────────────────────────────────────
// Single source of truth — emoji used in the battle log and explanations.
const ELEMENT_DEFS = [
    { src: 'images/wind.jpg',  alt: 'wind',  emoji: '💨' },
    { src: 'images/water.jpg', alt: 'water', emoji: '💧' },
    { src: 'images/fire.jpg',  alt: 'fire',  emoji: '🔥' },
    { src: 'images/earth.jpg', alt: 'earth', emoji: '🌍' },
    { src: 'images/light.jpg', alt: 'light', emoji: '✨' },
    { src: 'images/dark.jpg',  alt: 'dark',  emoji: '🌑' },
];

// What card beats each element (used by Hard AI).
const COUNTER = {
    water: 'wind',
    fire:  'water',
    earth: 'fire',
    wind:  'earth',
    dark:  'light',
    light: null,   // nothing beats light
};

function makeElementSet() {
    return ELEMENT_DEFS.map(e => ({ ...e, count: 0 }));
}

let computerElements = makeElementSet();
let playerElements = makeElementSet();

// ── Game State ────────────────────────────────────────────────────────────────
let playerPoint = 0;
let computerPoint = 0;
let playerSelect = null;
let isGameOver = false;
let difficulty = 'easy';
let pointTarget = 6;
let battleCount = 0;
let wins = 0;
let losses = 0;
let draws = 0;
let lastPlayerAlt = null;
let playerStreak = 0;
let computerStreak = 0;

// ── Result Display Images ─────────────────────────────────────────────────────
// Reusable img elements moved into the result area each fight.
const computerSelectedImg = document.createElement('img');
computerSelectedImg.className = 'elements resultImg';

const playerSelectedImg = document.createElement('img');
playerSelectedImg.className = 'elements resultImg';

// ── Difficulty Selector ───────────────────────────────────────────────────────
btnEasy.addEventListener('click', function () {
    difficulty = 'easy';
    btnEasy.classList.add('active');
    btnHard.classList.remove('active');
});

btnHard.addEventListener('click', function () {
    difficulty = 'hard';
    btnHard.classList.add('active');
    btnEasy.classList.remove('active');
});

// ── Mode Selector ─────────────────────────────────────────────────────────────
const modeBtns = [btnQuick, btnClassic, btnMarathon];

btnQuick.addEventListener('click', function () {
    pointTarget = 4;
    modeBtns.forEach(b => b.classList.remove('active'));
    btnQuick.classList.add('active');
});

btnClassic.addEventListener('click', function () {
    pointTarget = 6;
    modeBtns.forEach(b => b.classList.remove('active'));
    btnClassic.classList.add('active');
});

btnMarathon.addEventListener('click', function () {
    pointTarget = 8;
    modeBtns.forEach(b => b.classList.remove('active'));
    btnMarathon.classList.add('active');
});

// ── Mute Button ───────────────────────────────────────────────────────────────
muteBtn.addEventListener('click', function () {
    const muted = toggleMute();
    muteBtn.textContent = muted ? '🔇' : '🔊';
});

// ── Home Screen ───────────────────────────────────────────────────────────────
start.addEventListener('click', clickStart);

function clickStart() {
    if (home.style.display !== 'none') {
        home.style.display = 'none';
        gameContainer.style.display = 'flex';
        showPlayerItems();
        showComputerBacks();
        battleCounter.textContent = 'Battle 0 / 12';
        pointTargetLabel.textContent = `First to ${pointTarget}`;
        startMusic();
    } else {
        home.style.display = 'grid';
        gameContainer.style.display = 'none';
    }
}

// ── Instruction Modal ─────────────────────────────────────────────────────────
instructionButton.addEventListener('click', function () {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});

// ── Player Cards ──────────────────────────────────────────────────────────────
// Each card is wrapped in a .card-slot div with star indicators below the image.
function showPlayerItems() {
    for (let i = 0; i < playerElements.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'card-slot';
        slot.dataset.alt = playerElements[i].alt;

        const img = document.createElement('img');
        img.className = 'elements playerCards';
        img.src = playerElements[i].src;
        img.alt = playerElements[i].alt;

        const starsDiv = document.createElement('div');
        starsDiv.className = 'stars';
        starsDiv.innerHTML = '<span class="star full">★</span><span class="star full">★</span>';

        slot.appendChild(img);
        slot.appendChild(starsDiv);
        playerItems.appendChild(slot);
    }
}

// ── Computer Card Backs ───────────────────────────────────────────────────────
// Shows 6 face-down cards for the computer so the player can see how many remain.
function showComputerBacks() {
    for (let i = 0; i < computerElements.length; i++) {
        const back = document.createElement('div');
        back.className = 'card-back';
        computerItems.appendChild(back);
    }
}

// ── Card Selection ────────────────────────────────────────────────────────────
playerItems.addEventListener('click', handleClick);

function handleClick(event) {
    if (event.target.tagName !== 'IMG') return;
    removeHighlight();
    clearGameField();
    const card = event.target;
    card.classList.add('selected');
    playerSelect = { src: card.src, alt: card.alt };

    // Update direction text to show selected element
    const emoji = ELEMENT_DEFS.find(e => e.alt === card.alt)?.emoji ?? '';
    const name = card.alt.charAt(0).toUpperCase() + card.alt.slice(1);
    direction.textContent = `Playing: ${name} ${emoji}`;

    playCardSelect();
}

// ── AI Card Selection ─────────────────────────────────────────────────────────
// Hard mode: picks the card that counters the player's last played element.
// Falls back to random if the counter card is not in hand.
function getComputerCard() {
    if (difficulty === 'hard' && lastPlayerAlt !== null) {
        const counterAlt = COUNTER[lastPlayerAlt];
        if (counterAlt) {
            const winning = computerElements.find(e => e.alt === counterAlt);
            if (winning) return winning;
        }
        // Light has no counter — avoid playing Dark (which loses to Light)
        if (lastPlayerAlt === 'light') {
            const safe = computerElements.filter(e => e.alt !== 'dark');
            if (safe.length > 0) return safe[Math.floor(Math.random() * safe.length)];
        }
    }
    return computerElements[Math.floor(Math.random() * computerElements.length)];
}

// ── Battle Logic ──────────────────────────────────────────────────────────────
function getResult(playerSel, computerSel) {
    const p = playerSel.alt;
    const c = computerSel.alt;

    const playerWins =
        (p === 'wind'  && c === 'water') ||
        (p === 'water' && c === 'fire')  ||
        (p === 'fire'  && c === 'earth') ||
        (p === 'earth' && c === 'wind')  ||
        (p === 'dark'  && c !== 'light' && c !== 'dark') ||
        (p === 'light' && c === 'dark');

    const computerWins =
        (c === 'wind'  && p === 'water') ||
        (c === 'water' && p === 'fire')  ||
        (c === 'fire'  && p === 'earth') ||
        (c === 'earth' && p === 'wind')  ||
        (c === 'dark'  && p !== 'light' && p !== 'dark') ||
        (c === 'light' && p === 'dark');

    // Clear previous result classes
    result.classList.remove('win-text', 'lose-text', 'tie-text');

    let outcome;
    if (playerWins) {
        playerPoint++;
        playerScore.textContent = playerPoint;
        pulseScore(playerScore);
        result.textContent = 'You Win';
        result.classList.add('win-text');
        wins++;
        outcome = 'win';

        // Streak tracking — player
        playerStreak++;
        computerStreak = 0;
        if (playerStreak === 3) {
            playerPoint++;
            playerScore.textContent = playerPoint;
            pulseScore(playerScore);
            showStreakNotification('🔥 3-Win Streak! +1 Bonus!');
            playerStreak = 0;
        }

    } else if (computerWins) {
        computerPoint++;
        computerScore.textContent = computerPoint;
        pulseScore(computerScore);
        result.textContent = 'You Lose';
        result.classList.add('lose-text');
        losses++;
        outcome = 'lose';

        // Streak tracking — computer
        computerStreak++;
        playerStreak = 0;
        if (computerStreak === 3) {
            computerPoint++;
            computerScore.textContent = computerPoint;
            pulseScore(computerScore);
            showStreakNotification('💀 CPU 3-Win Streak! +1 Bonus!');
            computerStreak = 0;
        }

    } else {
        result.textContent = "It's a Tie";
        result.classList.add('tie-text');
        draws++;
        outcome = 'tie';

        // Both streaks reset on tie
        playerStreak = 0;
        computerStreak = 0;
    }

    // Show why this round ended the way it did
    battleExplanation.textContent = getBattleExplanation(p, c, outcome);

    return outcome;
}

// ── Final Result ──────────────────────────────────────────────────────────────
function finalResult() {
    if (isGameOver) return;

    // Use >= to handle streak bonus overshooting the target
    if (playerPoint >= pointTarget) {
        isGameOver = true;
        message.textContent = "Congratulations! You have won the game.";
    } else if (computerPoint >= pointTarget) {
        isGameOver = true;
        message.textContent = "Sorry, you have lost the game.";
    } else if (playerElements.length === 0 && computerElements.length === 0) {
        isGameOver = true;
        if (playerPoint > computerPoint) {
            message.textContent = "Congratulations! You have won the game.";
        } else if (playerPoint < computerPoint) {
            message.textContent = "Sorry, you have lost the game.";
        } else {
            message.textContent = "It's a Draw";
        }
    }

    if (isGameOver) {
        stats.textContent = `Wins: ${wins}  |  Losses: ${losses}  |  Draws: ${draws}`;
        final.style.display = 'flex';
        stopMusic();
        if (playerPoint > computerPoint) playVictory();
        else if (computerPoint > playerPoint) playDefeat();
        else playTie();
    }
}

// ── Fight Button ──────────────────────────────────────────────────────────────
fight.addEventListener('click', clickFight);

function clickFight() {
    if (playerSelect === null || computerElements.length === 0) {
        // Shake the button and show a hint
        fight.classList.remove('shake');
        void fight.offsetWidth; // reflow to restart the animation
        fight.classList.add('shake');
        hint.textContent = 'Select a card first!';
        hint.classList.add('visible');
        setTimeout(() => hint.classList.remove('visible'), 1500);
        return;
    }

    const randomSelect = getComputerCard();
    const computerSelect = { src: randomSelect.src, alt: randomSelect.alt };

    // Show chosen cards in the game-result area
    computerSelectedImg.src = computerSelect.src;
    computerSelectedImg.alt = computerSelect.alt;
    computerSelected.appendChild(computerSelectedImg);

    playerSelectedImg.src = playerSelect.src;
    playerSelectedImg.alt = playerSelect.alt;
    playerSelected.appendChild(playerSelectedImg);

    // Evaluate the battle
    playFight();
    const outcome = getResult(playerSelect, computerSelect);
    if (outcome === 'win')       playWin();
    else if (outcome === 'lose') playLose();
    else                         playTie();

    // Update battle counter
    battleCount++;
    battleCounter.textContent = `Battle ${battleCount} / 12`;

    // Add to battle log
    addToLog(playerSelect.alt, computerSelect.alt, outcome);

    // Capture alts before resetting playerSelect
    const playerAlt = playerSelect.alt;
    const computerAlt = computerSelect.alt;
    lastPlayerAlt = playerAlt;

    // Increment usage counts
    playerElements.forEach(e => { if (e.alt === playerAlt) e.count++; });
    computerElements.forEach(e => { if (e.alt === computerAlt) e.count++; });

    // Dim one star on first use, remove slot on second use
    const slot = playerItems.querySelector(`.card-slot[data-alt="${playerAlt}"]`);
    if (slot) {
        const fullStars = slot.querySelectorAll('.star.full');
        if (fullStars.length > 0) {
            fullStars[fullStars.length - 1].classList.replace('full', 'empty');
        }
    }

    // Remove exhausted player card from DOM and array
    playerElements = playerElements.filter(e => {
        if (e.alt === playerAlt && e.count === 2) {
            const cardSlot = playerItems.querySelector(`.card-slot[data-alt="${e.alt}"]`);
            if (cardSlot) cardSlot.remove();
            return false;
        }
        return true;
    });

    // Remove exhausted computer card from array and its back from DOM
    const prevLen = computerElements.length;
    computerElements = computerElements.filter(e => !(e.alt === computerAlt && e.count === 2));
    if (computerElements.length < prevLen) {
        const backs = computerItems.querySelectorAll('.card-back');
        if (backs.length > 0) backs[backs.length - 1].remove();
    }

    playerSelect = null;
    removeHighlight();
    direction.textContent = 'Choose your card';
    finalResult();
}

// ── Restart ───────────────────────────────────────────────────────────────────
restartButton.addEventListener('click', clickRestart);
yesRestart.addEventListener('click', function () { stopMusic(); location.reload(true); });
noRestart.addEventListener('click', function () { restartModal.style.display = 'none'; });

function clickRestart() {
    restartModal.style.display = 'block';
}

// ── Return Home ───────────────────────────────────────────────────────────────
returnHome.addEventListener('click', function () {
    stopMusic();
    location.reload(true);
});

// ── Utilities ─────────────────────────────────────────────────────────────────
function removeHighlight() {
    const selectedCard = document.querySelector('.selected');
    if (selectedCard) {
        selectedCard.classList.remove('selected');
    }
}

function clearGameField() {
    result.textContent = '';
    result.classList.remove('win-text', 'lose-text', 'tie-text');
    battleExplanation.textContent = '';
    computerSelected.innerHTML = '';
    playerSelected.innerHTML = '';
}

function pulseScore(el) {
    el.classList.remove('pulse');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('pulse');
    el.addEventListener('animationend', () => el.classList.remove('pulse'), { once: true });
}

function showStreakNotification(text) {
    streakNotification.textContent = text;
    streakNotification.classList.add('visible');
    setTimeout(() => streakNotification.classList.remove('visible'), 2000);
}

function getBattleExplanation(p, c, outcome) {
    const emojiMap = ELEMENT_DEFS.reduce((acc, e) => { acc[e.alt] = e.emoji; return acc; }, {});
    const pe = emojiMap[p] ?? '';
    const ce = emojiMap[c] ?? '';
    const pCap = p.charAt(0).toUpperCase() + p.slice(1);
    const cCap = c.charAt(0).toUpperCase() + c.slice(1);

    if (outcome === 'tie') {
        if (p === c) return `Both played ${pCap} — Tie!`;
        if ((p === 'light' && c !== 'dark') || (c === 'light' && p !== 'dark')) {
            return `Light draws with most elements`;
        }
        return `${pe} ${pCap} draws with ${ce} ${cCap}`;
    }
    if (outcome === 'win') return `${pe} ${pCap} beats ${ce} ${cCap}!`;
    return `${ce} ${cCap} beats ${pe} ${pCap}!`;
}

// ── Battle Log ────────────────────────────────────────────────────────────────
function addToLog(playerAlt, computerAlt, outcome) {
    const pEmoji = ELEMENT_DEFS.find(e => e.alt === playerAlt)?.emoji ?? '';
    const cEmoji = ELEMENT_DEFS.find(e => e.alt === computerAlt)?.emoji ?? '';
    const label  = outcome === 'win' ? '✅ You Win' : outcome === 'lose' ? '❌ You Lose' : '🤝 Draw';

    const li = document.createElement('li');
    li.textContent = `${pEmoji} ${playerAlt} vs ${cEmoji} ${computerAlt} — ${label}`;
    battleLog.insertBefore(li, battleLog.firstChild);

    // Keep only the last 3 entries
    while (battleLog.children.length > 3) {
        battleLog.removeChild(battleLog.lastChild);
    }
}
