let messageBox;
let canStand;
let numDecks;
let deck;
let users;
let dealer;
let usersBox;
let chipsBox;
let firstWager;
let activePlayer = 0;
let netChips = 0
const cardTypes = {
    A: 11, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10
}

function initialize() {
    numDecks = document.getElementById("number-decks").value
    firstWager = document.getElementById("initial-wager").value
    localStorage.setItem("deckCount", numDecks);
    localStorage.setItem("initialWager", firstWager);
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
            IMAGEHTML: "<img src=" + "../blackjack-cards/"+type+suit+".svg "+ "class='blackjack-card' alt=" + type + suit + ">"});
            
    }
    return suitDeck
}

function advancePlayer() {
    let currentPlayer = activePlayer
    while(true){
        activePlayer = (activePlayer+1)%users.length
        if (users[activePlayer].CANPLAY == true) {
            messageBox.innerText = "It's hand " + (activePlayer+1) +"'s turn"
            return
        } else if (activePlayer == currentPlayer) {
            dealerTurn()
            return
        }
    }
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

function updateScore(player, newScore){
    player.SCORE = newScore;
    player.SCOREBOX.innerText = newScore;
    
}

function payout(player, win){
    if(win) {
        netChips += player.WAGER
    } else {
        netChips -= player.WAGER
    }
}

function updateWager(player, newWager){
    player.WAGER = newWager
    player.WAGERBOX.innerText = newWager
}

function resetCards(player) {
    player.CARDS = [];
    player.CARDBOX.innerHTML = "";
}

function drawCard(player){
    let drawnCard = deck.pop();
    player.CARDBOX.innerHTML += drawnCard.IMAGEHTML;
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

function reset(override) {
    let allScored = true 
    if(!override) {
        for(player of users) {
            if (!player.SCORED){
                allScored = false
            }
        }
    }
    
    if (allScored){
        activePlayer = 0
        messageBox = document.getElementById("message-box");
        usersBox = document.getElementById("users-box");
        chipsBox = document.getElementById("user-points")
        canStand = false;
        usersBox.innerHTML = '<div class="player-container"> <h3 class="small-header"> Hand ' + 
        1 + '; Total: <span class="blackjack-number" id="player' + 
        0 + '-score"></span>; Wager: <span class="blackjack-number" id="player' + 
        0 +'-wager"></span> </h3> <div class="cards" id = "player' + 
        0 +'-cards"></div> <div class = "wager" id = "player' +  
        0 + '-wager"></div><div class="actions"><button class="control-button" onclick="hitClicked('+ 
        0 + ')">Hit</button><button class="control-button" onclick="standClicked(' +
        0 + ')">Stand</button><button class="control-button" onclick="doubleDown(' +
        0 + ')">Double Down</button><button class="control-button" onclick="split(' +
        0 + ')">Split</button></div></div><div id="divider"></div>'
    // The user and dealer are objects with the same properties so functions can be shared between them.
        users = [{
            CARDBOX: document.getElementById("player0-cards"),
            SCOREBOX: document.getElementById("player0-score"),
            WAGERBOX: document.getElementById("player0-wager"),
            SCORE: 0,
            CARDS: [],
            GAMESWON: 0,
            // Change this to get something from local storage (later)
            WAGER: firstWager,
            CANPLAY: true,
            BUST: false,
            SCORED: false
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
        messageBox.innerText = "Hand 1's turn";
        if (deck.length < 10) {
            alert("The deck is very small and is being reshuffled.");
            deck = makeDeck();
        }
        drawCard(users[0]);
        drawCard(users[0]);
        drawCard(dealer);
        let drawnCard = deck.pop();
        dealer.CARDBOX.innerHTML += "<img src='../blackjack-cards/back.png' class = 'blackjack-card' alt= 'card back'>";
        dealer.CARDS.push(drawnCard);
        dealer.SCOREBOX.innerText = "?";
        updateWager(users[0],users[0].WAGER)
    } 
}

function hitClicked(playerNum) {
    if(playerNum == activePlayer){
        player = users[playerNum]
        player.CARDBOX = document.getElementById("player"+playerNum+"-cards")
        player.SCOREBOX = document.getElementById("player"+playerNum+"-score")
        drawCard(player);
        if(player.SCORE > 21){
            player.CANPLAY = false
            player.BUST = true
        }
        advancePlayer()
    }
}

function standClicked(playerNum) {
    if(playerNum == activePlayer){
        users[playerNum].CANPLAY = false
        advancePlayer()
    }
}

function doubleDown(playerNum){
    player = users[playerNum]
    player.CARDBOX = document.getElementById("player"+playerNum+"-cards")
    player.SCOREBOX = document.getElementById("player"+playerNum+"-score")
    player.WAGERBOX = document.getElementById("player"+playerNum+"-wager")
    if(playerNum == activePlayer && player.CARDS.length == 2){
        updateWager(player,player.WAGER*2)
        drawCard(player)
        if(player.SCORE > 21){
            player.BUST = true
        }
        player.CANPLAY = false
        advancePlayer()
    }
}

function split(playerNum){
    player = users[playerNum]
    if (player.CARDS.length == 2 && player.CARDS[0].TYPE == player.CARDS[1].TYPE && playerNum == activePlayer){
        splitCard = player.CARDS.pop()
        player.CARDBOX = document.getElementById("player"+playerNum+"-cards")
        player.SCOREBOX = document.getElementById("player"+playerNum+"-score")
        drawCard(player)
        
        player.CARDBOX.innerHTML = ""
        for (card of player.CARDS) {
            player.CARDBOX.innerHTML += card.IMAGEHTML
        }
        newHandNumber = users.length
        usersBox.innerHTML += '<div class="player-container"> <h3 class="small-header"> Hand ' + 
        (newHandNumber + 1) + '; Total: <span class="blackjack-number" id="player' + 
        newHandNumber + '-score"></span>; Wager: <span class="blackjack-number" id="player' + 
        newHandNumber +'-wager"></span> </h3> <div class="cards" id = "player' + 
        newHandNumber +'-cards"></div> <div class = "wager" id = "player' +  
        newHandNumber + '-wager"></div><div class="actions"><button class="control-button" onclick="hitClicked('+ 
        newHandNumber + ')">Hit</button><button class="control-button" onclick="standClicked(' +
        newHandNumber + ')">Stand</button><button class="control-button" onclick="doubleDown(' +
        newHandNumber + ')">Double Down</button><button class="control-button" onclick="split(' +
        newHandNumber + ')">Split</button></div></div><div id="divider"></div>'
        users.push({
            CARDBOX: document.getElementById("player"+newHandNumber+"-cards"),
            SCOREBOX: document.getElementById("player"+newHandNumber+"-score"),
            WAGERBOX: document.getElementById("player"+newHandNumber+"-wager"),
            SCORE: 0,
            CARDS: [splitCard],
            GAMESWON: 0,
            // Change this to get something from local storage (later)
            WAGER: firstWager,
            CANPLAY: true,
            BUST: false,
            SCORED: false
        })
        newPlayer = users[newHandNumber]
        newPlayer.CARDBOX.innerHTML += newPlayer.CARDS[0].IMAGEHTML
        drawCard(newPlayer)
        updateWager(newPlayer, newPlayer.WAGER)
    }
}

async function dealerTurn() {
    // Effectively disables all player moves
    activePlayer = -1
    //Change to check if any hand didn't bust
    let allBust = true
    for (player of users) {
        if (!player.BUST){
            allBust = false
        } else {
            payout(player, false)
            player.SCORED = true
        }
    }
    if (!allBust){
        dealer.CARDBOX.innerHTML = "";
        dealer.SCORE = 0;
        // "Redraws" the two cards the dealer already has. This is a somewhat roundabout way of turning over the hidden card
        for (card of dealer.CARDS) {
            dealer.SCORE += card.VALUE;
            dealer.CARDBOX.innerHTML += card.IMAGEHTML;
        }
        dealer.SCOREBOX.innerText = dealer.SCORE;
        // Deals with natural blackjack
        for (player of users){
            if (player.SCORE == 21 && player.CARDS.length == 2) {
                player.SCORED = true
                if(dealer.SCORE != 21) {
                    payout(player, true)
                }
            }
        }
        let allScored = true
        for (player of users) {
            if (!player.SCORED) {
                allScored = false
            }
        }
        if(!allScored){
            messageBox.innerHTML = "The dealer will hit until their score is at least 17, then they will stand.";
            while(dealer.SCORE < 17){
                await sleep(1500);
                drawCard(dealer); 
            }
            for (player of users) {
                if(player.SCORED){
                    continue
                }
                // If the user score is > 21, they've already been scored
                if (player.SCORE > dealer.SCORE) {
                    payout(player, true);
                    player.SCORED = true
                } else if (dealer.SCORE == player.SCORE && player.SCORE == 21) {
                    player.SCORED = true
                } else if (dealer.SCORE >= player.SCORE && dealer.SCORE < 22) {
                    payout(player, false);
                    player.SCORED = true
                } else if(dealer.SCORE > 21) {
                    payout(player, true);
                    player.SCORED = true
                } else {
                    console.log( "Error calculating victory for this player: " + player);
                }
            }
        }
    }
    chipsBox.innerText = netChips
    messageBox.innerHTML = "Payouts calculated. Press reset to play again."
}

// Some inital steps. Gets the stored number of decks if it exists. Defaults to 8 decks
// NaN and 0 are falsy, other numbers are truthy, so the if basically just checks if an nonzero integer was entered
if(parseInt(localStorage["deckCount"])){
    numDecks = Math.abs(parseInt(localStorage["deckCount"]));
} else {
    numDecks = 8;
}
if(parseInt(localStorage["initialWager"])){
    firstWager = Math.abs(parseInt(localStorage["initialWager"]));
} else {
    firstWager = 1;
}
deck = makeDeck();
// Should establish an initial wager
reset(true);