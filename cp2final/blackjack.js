let messageBox;
let canStand;
let numDecks;
let deck;
let users;
let dealer;
let usersBox;
let firstWager = 10;
const cardTypes = {
    A: 11, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10
}

function initialize() {
    numDecks = document.getElementById("numDecks").value
    localStorage.setItem("deckCount", numDecks);
}

// Assembles a deck with one of each card in a given suit (1-letter abbreviation is used later on)
function makeSuitDeck(suit) {
    let suitDeck = [];
    for (type in cardTypes) {
        // Adds an object that represesnts that card including the value in blackjack and the name of the image.
        suitDeck.push({ 
            VALUE: cardTypes[type], 
            NAME: type + suit,
            TYPE: type,
            IMAGEID: "../blackjack-cards/"+type+suit+".svg"});
    }
    return suitDeck
}

// This is not mine. From Stack Overflow.
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
// Should establish an initial wager
reset();

function updateScore(player, newScore){
    player.SCORE = newScore;
    player.SCOREBOX.innerText = "Total: " + newScore;
    
}


function resetCards(player) {
    player.CARDS = [];
    player.CARDBOX.innerHTML = "";
}

function drawCard(player){
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
    messageBox = document.getElementById("message-box");
    usersBox = document.getElementById("users-box");
    userTurn = false;
    canStand = false;
    numDecks = 1;
// The user and dealer are objects with the same properties so functions can be shared between them.
    users = [{
    CARDBOX: document.getElementById("player0-cards"),
    SCOREBOX: document.getElementById("player0-score"),
    SCORE: 0,
    CARDS: [],
    GAMESWON: 0,
    // Change this to get something from local storage (later)
    WAGER: firstWager,
    CANPLAY: true
}]
    dealer = {
    CARDBOX: document.getElementById("dealer-cards"),
    SCOREBOX: document.getElementById("dealer-score"),
    SCORE: 0,
    CARDS: [],
    GAMESWON: 0
}
    updateScore(users[0], 0);
    updateScore(dealer, 0);
    resetCards(users[0]);
    resetCards(dealer)
    messageBox.innerText = "Take your turn";
    if (deck.length < 10) {
        alert("The deck is very small and is being reshuffled.");
        deck = makeDeck();
    }
    drawCard(users[0]);
    drawCard(users[0]);
    drawCard(dealer);
    let drawnCard = deck.pop();
    dealer.CARDBOX.innerHTML += "<img src='../blackjack-cards/back.png' alt= card back>";
    dealer.CARDS.push(drawnCard);
    dealer.SCOREBOX.innerText = "Total: ?";
}

function hitClicked(playerNum) {
    player = users[playerNum]
    player.CARDBOX = document.getElementById("player"+playerNum+"-cards")
    player.SCOREBOX = document.getElementById("player"+playerNum+"-score")
    drawCard(player);
    if(player.SCORE > 21){
        player.CANPLAY = false
    }

}

function standClicked(playerNum) {
    users[playerNum].CANPLAY = false
}

function doubleDown(playerNum){
    player = users[playerNum]
    player.WAGER *= 2
    drawCard(player)
    player.CANPLAY = false
}

function split(playerNum){
    player = users[playerNum]
    if (player.CARDS.length == 2 && player.CARDS[0].TYPE == player.CARDS[1].TYPE){
        console.log('hi')
        splitCard = player.CARDS.pop()
        player.CARDBOX = document.getElementById("player"+playerNum+"-cards")
        player.SCOREBOX = document.getElementById("player"+playerNum+"-score")
        drawCard(player)
        
        player.CARDBOX.innerHTML = ""
        for (card of player.CARDS) {
            player.CARDBOX.innerHTML += "<img src=" + card.IMAGEID + " alt=" + card.NAME + ">"
        }
        newHandNumber = users.length
        usersBox.innerHTML += '<div class="player-container"> <div class="small-header"> <h3> Hand ' + 
        (newHandNumber + 1) + '</h3> </div> <div class="small-header" > <h3 id="player' + 
        newHandNumber +'-score">  </h3></div><div class="cards" id = "player' + 
        newHandNumber +'-cards"></div> <div class = "wager" id = "player' +  
        newHandNumber + '-wager"></div><div id="actions"><button onclick="hitClicked('+ 
        newHandNumber + ')">Hit</button><button onclick="standClicked(' +
        newHandNumber + ')">Stand</button><button onclick="doubleDown(' +
        newHandNumber + ')">Double Down</button><button onclick="split(' +
        newHandNumber + ')">Split</button></div></div><div id="divider"></div>'
        users.push({
            CARDBOX: document.getElementById("player"+newHandNumber+"-cards"),
            SCOREBOX: document.getElementById("player"+newHandNumber+"-score"),
            SCORE: 0,
            CARDS: [splitCard],
            GAMESWON: 0,
            // Change this to get something from local storage (later)
            WAGER: firstWager,
            CANPLAY: true
        })
        newPlayer = users[newHandNumber]
        console.log(newPlayer.CARDS)
        newPlayer.CARDBOX.innerHTML += "<img src=" + newPlayer.CARDS[0].IMAGEID + " alt=" + newPlayer.CARDS[0].NAME + ">"
        drawCard(newPlayer)
    }
}

async function dealerTurn() {
    //Change to check if any hand didn't bust
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
        if (users[0].SCORE > dealer.SCORE) {
            messageBox.innerText = "You win! I'll get you next time . . .";
        } else if (dealer.SCORE == users[0].SCORE && users[0].SCORE == 21) {
            messageBox.innerText = "Tie. I'm sure you want to play again, right?";
        } else if (dealer.SCORE >= users[0].SCORE && dealer.SCORE < 22) {
            messageBox.innerText = "I win! I win! I win!";
        } else if(dealer.SCORE > 21) {
            messageBox.innerText = "You win! I'll get you next time . . .";
        } else {
            messageBox.innerText = "Can't figure out who won . . . Let's just play again, shall we?";
        }
    }
}