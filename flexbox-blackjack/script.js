let messageBox = document.getElementById("message-box");
let userTurn = false;
let canStand = false;
let numDecks = 1;
let deck = [];
// The user and dealer are objects with the same properties so functions can be shared between them.
let user = {
    CARDBOX: document.getElementById("player-cards"),
    SCOREBOX: document.getElementById("player-score"),
    WINBOX: document.getElementById("user-wins"),
    SCORE: 0,
    CARDS: [],
    GAMESWON: 0
}
let dealer = {
    CARDBOX: document.getElementById("dealer-cards"),
    SCOREBOX: document.getElementById("dealer-score"),
    WINBOX: document.getElementById("dealer-wins"),
    SCORE: 0,
    CARDS: [],
    GAMESWON: 0
}
const cardTypes = {
    A: 11, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10
}

// Assembles a deck with one of each card in a given suit (1-letter abbreviation is used later on)
function makeSuitDeck(suit) {
    let suitDeck = [];
    for (value in cardTypes) {
        // Adds an object that represesnts that card including the value and the name of the image.
        suitDeck.push({ 
            VALUE: cardTypes[value], 
            NAME: value + suit, 
            IMAGEID: "blackjack-cards/"+value+suit+".svg"});
    }
    return suitDeck
}

// This is not mine
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

// Assembles and shuffles the full deck
function makeDeck() {
    let newDeck = []
    for (let i = 0; i < numDecks; i++) {
        newDeck.push(makeSuitDeck("H"));
        newDeck.push(makeSuitDeck("D"));
        newDeck.push(makeSuitDeck("C"));
        newDeck.push(makeSuitDeck("S"));
        }
        newDeck = newDeck.flat();

        // This is a shuffle that w3 schools says is fair. Algorithm not mine.
        for (let i = newDeck.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = newDeck[i];
        newDeck[i] = newDeck[j];
        newDeck[j] = k;
    }
    return newDeck
}

// Some inital steps. Gets the stored number of decks if it exists. Defaults to 8 decks
// NaN and 0 are falsy, other numbers are truthy, so the if basically just checks if an nonzero integer was entered
if(parseInt(localStorage["deckCount"])){
    numDecks = Math.abs(parseInt(localStorage["deckCount"]));
} else {
    numDecks = 8;
}
deck = makeDeck();
reset();


function updateScore(player, newScore){
    player.SCORE = newScore;
    player.SCOREBOX.innerText = newScore;
}

function addWin(player){
    player.GAMESWON++
    player.WINBOX.innerText = player.GAMESWON
}

function resetCards(player) {
    player.CARDS = [];
    player.CARDBOX.innerHTML = "";
}

function drawCard(player){
    if (player.SCORE == 21){
        alert("Well, that was awfully silly, wasn't it?");
    }
    let drawnCard = deck.pop();
    player.CARDBOX.innerHTML += "<img src=" + drawnCard.IMAGEID + " alt=" + drawnCard.NAME + ">";
    player.CARDS.push(drawnCard);
    // Fully recalculates score (this is the easiest way in my mind to handle aces counting as 1 or 11)
    let score = 0
    for (card of player.CARDS) {
        score += card.VALUE;
    }
    for (card of player.CARDS) {
        if (card.VALUE == 11 && score > 21){
            score = score - 10;
        }
    }
    updateScore(player, score);
    if (player.SCORE > 21){
        player.SCOREBOX.innerText += " - bust";
    }
}

function reset() {
    updateScore(user, 0);
    updateScore(dealer, 0);
    resetCards(user);
    resetCards(dealer)
    userTurn = true;
    canStand = true;
    messageBox.innerText = "Take your turn";
    if (deck.length < 30) {
        alert("Don't go around trying to count cards with me, silly. I'm reshuffling the deck!");
        deck = makeDeck();
    }
    drawCard(user);
    drawCard(user);
    drawCard(dealer);
    let drawnCard = deck.pop();
    dealer.CARDBOX.innerHTML += "<img src='blackjack-cards/back.png' alt= card back>";
    dealer.CARDS.push(drawnCard);
    dealer.SCOREBOX.innerText = "?";
}

function hitClicked() {
    if (userTurn){
        drawCard(user);
        if(user.SCORE > 21){
            messageBox.innerText = "You bust - I win!";
            addWin(dealer);
            userTurn = false;
            canStand = false;
        }
    }
}

async function dealerTurn() {
    if (canStand) {
        userTurn = false;
        dealer.CARDBOX.innerHTML = "";
        dealer.SCORE = 0;
        // "Redraws" the two cards the dealer already has. This is a somewhat roundabout way of turning over the hidden card
        for (card of dealer.CARDS) {
            dealer.SCORE += card.VALUE;
            dealer.CARDBOX.innerHTML += "<img src=" + card.IMAGEID + " alt=" + card.NAME + ">";
        }
        dealer.SCOREBOX.innerText = dealer.SCORE;
        messageBox.innerHTML = "The dealer will hit until their score is at least 17, then they will stand.";
        while(dealer.SCORE < 17){
            await sleep(1500);
            drawCard(dealer); 
        }
        // If the user score is > 21, the game is already over
        if (user.SCORE > dealer.SCORE) {
            messageBox.innerText = "You win! I'll get you next time . . .";
            addWin(user);
        } else if (dealer.SCORE == user.SCORE && user.SCORE == 21) {
            messageBox.innerText = "Tie. I'm sure you want to play again, right?";
        } else if (dealer.SCORE >= user.SCORE && dealer.SCORE < 22) {
            messageBox.innerText = "I win! I win! I win!";
            addWin(dealer);
        } else if(dealer.SCORE > 21) {
            messageBox.innerText = "You win! I'll get you next time . . .";
            addWin(user);
        } else {
            messageBox.innerText = "Can't figure out who won . . . Let's just play again, shall we?";
        }
    }
}