// script for Home
const home = document.getElementById('home');
const start = document.getElementById('start');
const gameContainer = document.getElementById('game-container')

//script when the Start button is clicked
start.addEventListener('click', clickStart);
let game;
function clickStart() {
    if (home.style.display !== 'none') {
        home.style.display = 'none';
        gameContainer.style.display = 'flex';
        showPlayerItems();
    } else {
        home.style.display = 'grid';
        gameContainer.style.display = 'none';
    }
};

// script for Instruction Modal - when How-To-Play is clicked

const instructionButton = document.getElementById('how-to-play');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');

instructionButton.addEventListener('click', function () {
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});

// script for game-container//

// setting the element items for computer and player
const elements = [
    { src: 'images/wind.jpg', alt: 'wind', count: 0 },
    { src: 'images/water.jpg', alt: 'water', count: 0 },
    { src: 'images/fire.jpg', alt: 'fire', count: 0 },
    { src: 'images/earth.jpg', alt: 'earth', count: 0 },
    { src: 'images/light.jpg', alt: 'light', count: 0 },
    { src: 'images/dark.jpg', alt: 'dark', count: 0 },
];

let computerElements = [
    { src: 'images/wind.jpg', alt: 'wind', count: 0 },
    { src: 'images/water.jpg', alt: 'water', count: 0 },
    { src: 'images/fire.jpg', alt: 'fire', count: 0 },
    { src: 'images/earth.jpg', alt: 'earth', count: 0 },
    { src: 'images/light.jpg', alt: 'light', count: 0 },
    { src: 'images/dark.jpg', alt: 'dark', count: 0 },
];

let playerElements = [
    { src: 'images/wind.jpg', alt: 'wind', count: 0 },
    { src: 'images/water.jpg', alt: 'water', count: 0 },
    { src: 'images/fire.jpg', alt: 'fire', count: 0 },
    { src: 'images/earth.jpg', alt: 'earth', count: 0 },
    { src: 'images/light.jpg', alt: 'light', count: 0 },
    { src: 'images/dark.jpg', alt: 'dark', count: 0 },
];

// show the commputer items in HTML

// const computerItems = document.getElementById('computerItems');

// for (let i = 0; i < computerElements.length; i++) {
//     // const computerSpan = document.createElement('span');
//     const computerImg = document.createElement('img');
//     computerImg.className = 'elements'
//     computerImg.src = computerElements[i].src;
//     computerImg.alt = computerElements[i].alt;
//     // computerSpan.appendChild(computerImg);
//     // computerItems.appendChild(computerSpan);
//     computerItems.appendChild(computerImg);
// }
console.log(computerElements);

// // show the player Elements in HTML

const playerItems = document.getElementById('playerItems');

function showPlayerItems() {
    for (let i = 0; i < playerElements.length; i++) {
        // const playerSpan = document.createElement('span');
        // playerSpan.className = 'player-elements';
        const playerImg = document.createElement('img');
        playerImg.className = 'elements playerCards';
        playerImg.src = playerElements[i].src;
        playerImg.alt = playerElements[i].alt;
        // playerSpan.appendChild(playerImg);
        // playerItems.appendChild(playerSpan);
        playerItems.appendChild(playerImg);
    }
};

console.log(playerElements);

// Player select card

let playerSelect = null;

playerItems.addEventListener('click', handleClick);

function handleClick(event) {
    removeHiglight();

    clearGameField();

    // // remove previous selected card - highlight
    // const prevSelected = document.querySelector('.selected');
    // if (prevSelected) {
    //     prevSelected.classList.remove('selected');
    // }

    const card = event.target;

    // add highlight to the selected card
    card.classList.add('selected');

    // get new value for selected card
    if (card.tagName === 'IMG') {
        const selectedSrc = card.src;
        const selectedAlt = card.alt;

        playerSelect = {
            src: selectedSrc,
            alt: selectedAlt,
        };

        console.log('player selected ' + playerSelect.alt);
    } else {
        playerSelect = null;
        console.log('no selection');
    }
};

//script for result

// setting the score display
let playerPoint = 0;
let computerPoint = 0;
let playerScore = document.querySelector('.playerScore');
let computerScore = document.querySelector('.computerScore');
const result = document.getElementById('result');

function getResult(playerSelect, computerSelect) {
    // condition to win/lose/tie
    //Condition to Win
    if ((playerSelect.alt === 'wind' && computerSelect.alt === 'water') ||
        (playerSelect.alt === 'water' && computerSelect.alt === 'fire') ||
        (playerSelect.alt === 'fire' && computerSelect.alt === 'earth') ||
        (playerSelect.alt === 'earth' && computerSelect.alt === 'wind') ||
        (playerSelect.alt === 'dark' && computerSelect.alt !== 'light' && computerSelect.alt !== 'dark') ||
        (playerSelect.alt === 'light' && computerSelect.alt === 'dark')) {
        playerPoint++;
        playerScore.textContent = playerPoint;
        result.textContent = 'You win';
    }

    //Condition to Lose
    if ((computerSelect.alt === 'wind' && playerSelect.alt === 'water') ||
        (computerSelect.alt === 'water' && playerSelect.alt === 'fire') ||
        (computerSelect.alt === 'fire' && playerSelect.alt === 'earth') ||
        (computerSelect.alt === 'earth' && playerSelect.alt === 'wind') ||
        (computerSelect.alt === 'dark' && playerSelect.alt !== 'light' && playerSelect.alt !== 'dark') ||
        (computerSelect.alt === 'light' && playerSelect.alt === 'dark')) {
        computerPoint++;
        computerScore.textContent = computerPoint;
        result.textContent = 'You Lose';
    }
    if ((playerSelect.alt === computerSelect.alt) ||
        (playerSelect.alt === 'light' && computerSelect.alt !== 'dark') ||
        (computerSelect.alt === 'light' && playerSelect.alt !== 'dark')) {
        result.textContent = "It's a Tie";
    };

    if (result.innerHTML === '') {
        result.textContent = "It's a Tie"
    };
}

//final result
const final = document.getElementById('final');
const message = document.querySelector('.message');

function finalResult() {
    if (isGameOver === false) {
        if (playerPoint === 6) {
            isGameOver = true;
            message.textContent = "Congratulations! You have won the game.";
            console.log("Congratulations! You have won the game.");
        }

        if (computerPoint === 6) {
            isGameOver = true;
            message.textContent = "Sorry, you have lost the game.";
            console.log("Sorry, you have lost the game.");
        }

        if (playerItems.hasChildNodes() && computerElements.length === 0) {
            if (playerPoint > computerPoint) {
                isGameOver = true;
                message.textContent = "Congratulations! You have won the game.";
                console.log("Congratulations! You have won the game.");
            }
            if (playerPoint < computerPoint) {
                isGameOver = true;
                message.textContent = "Sorry, you have lost the game.";
                console.log("Sorry, you have lost the game.");
            }
            if (playerPoint === computerPoint) {
                isGameOver = true;
                message.textContent = "It's a Draw";
                console.log("It's a Draw");
            }
        };
        if (message.innerHTML !== "") {
            isGameOver = true;
            final.style.display = 'flex';
        };
    };
    console.log('player point', playerPoint);
    console.log(playerElements)
    console.log('computer point', computerPoint);
    console.log(computerElements)
};

// display result in HTML
const computerSelected = document.querySelector('.computerSelected');
const playerSelected = document.querySelector('.playerSelected');

const computerSelectedImg = document.createElement('img');
computerSelectedImg.className = 'elements resultImg';

const playerSelectedImg = document.createElement('img');
playerSelectedImg.className = 'elements resultImg';

const resultImg = document.querySelectorAll('.resultImg');

console.log(computerSelected);
console.log(playerSelected);


//fight button script
const fight = document.getElementById('fight')
const playerCards = document.querySelector('.playerCards');

fight.addEventListener('click', clickFight);

function clickFight() {
    if (playerSelect !== null) {

        // Computer randomly select computerElements
        const randomSelect = computerElements[Math.floor(Math.random() * computerElements.length)];

        let computerSelect = {
            src: randomSelect.src,
            alt: randomSelect.alt,
        };
        console.log('computer selected ' + computerSelect.alt);

        // Create a new img element with the updated src and alt attributes
        // this is for the selected card be displayed in the game field
        computerSelectedImg.src = computerSelect.src;
        computerSelectedImg.alt = computerSelect.alt;
        computerSelected.appendChild(computerSelectedImg);

        playerSelectedImg.src = playerSelect.src;
        playerSelectedImg.alt = playerSelect.alt;
        playerSelected.appendChild(playerSelectedImg);

        //show result
        getResult(playerSelect, computerSelect);

        //increase count of element based on the result img alt

        playerElements.forEach(element => {
            if (element.alt === playerSelectedImg.alt) {
                element.count++;
            }
        });

        computerElements.forEach(element => {
            if (element.alt === computerSelectedImg.alt) {
                element.count++;
            }
        });

        //remove the selected item in computerElements array
        computerElements.forEach((element, index) => {
            if (element.alt === computerSelectedImg.alt) {

                if (element.count === 2) {
                    computerElements.splice(index, 1);
                };

            };
        });

        //remove the selected item in playerItems
        playerElements.forEach((element, index) => {
            if (element.alt === playerSelectedImg.alt) {
                if (element.count === 2) {
                    const selectedImg = playerItems.querySelector(`[alt="${element.alt}"]`);
                    selectedImg.remove();
                }
            }
        });

    };

    playerSelect = null;
    removeHiglight();
    console.log('result')
    console.log(result);
    console.log(playerElements);
    console.log('playerElements')
    console.log(computerElements);
    console.log('computerElements')
    setTimeout(finalResult,30500);
    console.log('playerPoint');
    console.log(playerPoint);
    console.log('computerPoint');
    console.log(computerPoint);
};

// restart button script

const restartButton = document.getElementById('restart');
const restartModal = document.getElementById('restartModal');
const yesRestart = document.querySelector('.yesRestart');
const noRestart = document.querySelector('.noRestart');
let isGameOver = false

restartButton.addEventListener('click', clickRestart);
yesRestart.addEventListener('click', clickYesRestart);
noRestart.addEventListener('click', function () {
    restartModal.style.display = 'none';
});

function clickRestart() {
    restartModal.style.display = 'block';
};

function clickYesRestart() {
    location.reload(true);
    // playerPoint = 0;
    // computerPoint = 0;
    // isGameOver = false
    // restartModal.style.display = 'none';
    // gameContainer.style.display = 'flex';
    // playerItems.innerHTML = '';

    // resetCard()
    // showPlayerItems();


    // //reset score
    // playerScore.textContent = "0";
    // computerScore.textContent = "0";

    // clearGameField(); // clear the display of result

    // // reset player selection
    // playerSelect = null;

    // removeHiglight();

    // console.log('restart')
    // console.log(playerElements);
    // console.log(computerElements);
    // console.log('clear');
    // console.log(result, computerSelected, playerSelected);
    // console.log('point');
    // console.log(playerPoint, computerPoint)

    // location.reload(true);
}

// function resetCard() {
//     playerElements = [
//         { src: '/images/wind.jpg', alt: 'wind', count: 0 },
//         { src: '/images/water.jpg', alt: 'water', count: 0 },
//         { src: '/images/fire.jpg', alt: 'fire', count: 0 },
//         { src: '/images/earth.jpg', alt: 'earth', count: 0 },
//         { src: '/images/light.jpg', alt: 'light', count: 0 },
//         { src: '/images/dark.jpg', alt: 'dark', count: 0 },
//     ];
//     computerElements = [
//         { src: '/images/wind.jpg', alt: 'wind', count: 0 },
//         { src: '/images/water.jpg', alt: 'water', count: 0 },
//         { src: '/images/fire.jpg', alt: 'fire', count: 0 },
//         { src: '/images/earth.jpg', alt: 'earth', count: 0 },
//         { src: '/images/light.jpg', alt: 'light', count: 0 },
//         { src: '/images/dark.jpg', alt: 'dark', count: 0 },
//     ];
// };

function removeHiglight() {
    const selectedCard = document.querySelector('.selected');
    if (selectedCard) {
        selectedCard.classList.remove('selected');
    }
};

//clear game field

function clearGameField() {
    // reset result text
    document.getElementById('result').textContent = '';
    //remove selected img
    computerSelected.innerHTML = "";
    playerSelected.innerHTML = "";
};


// // quit button script
// const quitButton = document.getElementById('quit');

// quitButton.addEventListener('click', function () {
//     const confirmQuit = confirm('Are you sure you want to Quit?')
//     if (confirmQuit) {
//         // location.reload(true);
//     }
// });

//returnHome button script

const returnHome = document.getElementById('returnHome');

returnHome.addEventListener('click', function () {
    location.reload(true)
});
