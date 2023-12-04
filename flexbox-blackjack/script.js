let messageBox = document.getElementById("game-state-banner");
let userTurn = false;
let canStand = false;
let numDecks = 8;
let deck = [];
let user = {
    CARDBOX: document.getElementById("player-cards"),
    SCOREBOX: document.getElementById("player-score"),
    SCORE: 0,
    CARDS: []
}
let dealer = {
    CARDBOX: document.getElementById("dealer-cards"),
    SCOREBOX: document.getElementById("dealer-score"),
    SCORE: 0,
    CARDS: []
}
const cardTypes = {
    A: 11, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 10: 10, J: 10, Q: 10, K: 10
}

function makeSuitDeck(suit) {
    let suitDeck = [];
    for (value in cardTypes) {
        suitDeck.push({ VALUE: cardTypes[value], NAME: value + suit, IMAGEID: "blackjack-cards/"+value+suit+".svg"});
    }
    return suitDeck
}


function makeDeck() {
    let newDeck = []
    for (let i = 0; i < numDecks; i++) {
        newDeck.push(makeSuitDeck("H"));
        newDeck.push(makeSuitDeck("D"));
        newDeck.push(makeSuitDeck("C"));
        newDeck.push(makeSuitDeck("S"));
        }
        newDeck = newDeck.flat();
        // console.log(JSON.stringify(makeDeck()))
        // let thing = JSON.stringify(makeSuitDeck("H"));
        // console.log(thing)
        // console.log(cardTypes)

        // This is a shuffle that w3 schools says is fair. Algorithm not mine.
        for (let i = newDeck.length -1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i+1));
        let k = newDeck[i];
        newDeck[i] = newDeck[j];
        newDeck[j] = k;
    }
    return newDeck
}
deck = makeDeck()
console.log(JSON.stringify(deck));
console.log(deck.length);

function updateScore(player, newScore){
    player.SCORE = newScore;
    player.SCOREBOX.innerText = newScore;
}

function resetCards(player) {
    player.CARDS = [];
    player.CARDBOX.innerHTML = "";
}

// function updateDealerScore(newScore){
//     dealerScore = newScore;
//     dealerScoreBox.innerText = newScore;
// }

function drawCard(player){
    if (player.SCORE == 21){
        alert("Well, that was awfully silly, wasn't it?");
    }
    let drawnCard = deck.pop();
    player.CARDBOX.innerHTML += "<img src=" + drawnCard.IMAGEID + " alt=" + drawnCard.NAME + ">";
    player.CARDS.push(drawnCard);
    let score = 0
    for (card of player.CARDS) {
        score += card.VALUE;
    }
    for (card of player.CARDS) {
        if (card.VALUE == 11 && score > 21){
            score = score - 10;
        }
    }
    player.SCORE = score;
    player.SCOREBOX.innerText = score;
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
            userTurn = false;
            canStand = false;
        }
        
    }
}

function dealerTurn() {
    if (canStand) {
        userTurn = false;
        dealer.CARDBOX.innerHTML = "";
        dealer.SCORE = 0;
        for (card of dealer.CARDS) {
            dealer.SCORE += card.VALUE;
            dealer.CARDBOX.innerHTML += "<img src=" + card.IMAGEID + " alt=" + card.NAME + ">";
        }
        dealer.SCOREBOX.innerText = dealer.SCORE;
        while(dealer.SCORE < 17){
            drawCard(dealer);
        }
        // If the user score is > 21, the game is already over
        if (user.SCORE > dealer.SCORE) {
            messageBox.innerText = "You win! I'll get you next time . . .";
        } else if (dealer.SCORE == user.SCORE && user.SCORE == 21) {
            messageBox.innerText = "Tie. I'm sure you want to play again, right?";
        } else if (dealer.SCORE >= user.SCORE && dealer.SCORE < 22) {
            messageBox.innerText = "I win! I win! I win!";
        } else if(dealer.SCORE > 21) {
            messageBox.innerText = "You win! I'll get you next time . . .";
        } else {
            messageBox.innerText = "Can't figure out who won . . . Let's just play again, shall we?";
        }
    }
    
}

