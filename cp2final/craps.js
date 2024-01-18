const messageBox = document.getElementById("craps-message-box");
const wagerBox = document.getElementById("craps-wager");
const betSelector = document.getElementById("craps-bets");
const betInfoBox = document.getElementById("bet-info");
const die1 = document.getElementById("die-1");
const die2 = document.getElementById("die-2");
const netChipsBox = document.getElementById("user-points");
const rollBox = document.getElementById("craps-roll");
const rollInfo = document.getElementById("roll-info");
let netChips = 0;
let bet;
let point = undefined;
let canRoll = false;
rollInfo.hidden = true;

function placeBet(){
    if(!canRoll){
        point = undefined;
        wager = wagerBox.value;
        wager = parseInt(Math.floor(wager))
        if(wager < 1){
            betInfoBox.innerText = "Place a wager of at least 1";
            return;
        }
        switch(betSelector.value){
            case "pass":
                bet = {
                    PASS: true,
                    WAGER: wager
                };
                betInfoBox.innerText = "You wagered "+wager+" on pass.";
                break;
            case "dont-pass":
                bet = {
                    PASS: false,
                    WAGER: wager
                };
                betInfoBox.innerText = "You wagered "+wager+" on don't pass.";
                break;
            default:
                betInfoBox.innerText = "Choose pass or don't pass";
                return;
        }
        canRoll = true;
        messageBox.innerText = "Press roll dice to start rolling!";
    }
}

// This is not mine. From Stack Overflow.
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}


async function roll(){
    if(canRoll){
        let rand1;
        let rand2;
        for(let i=0;i<15;i++) {
            await sleep(200);
            rand1 = Math.ceil(Math.random()*6);
            die1.innerHTML = "<img src='../dice-faces/"+rand1+".png' alt='"+rand1+"' class='craps-die'>";
            rand2 = Math.ceil(Math.random()*6);
            die2.innerHTML = "<img src='../dice-faces/"+rand2+".png' alt='"+rand2+"' class='craps-die'>";
        }
        total = rand1+rand2;
        rollInfo.hidden = false;
        rollBox.innerText = total;
        if(point == undefined){
            if(total == 11 || total == 7) {
                if(bet.PASS){
                    messageBox.innerText = "A total of "+total+" on the first roll means pass. You won. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips += bet.WAGER;
                    netChipsBox.innerText = netChips;
                } else {
                    messageBox.innerText = "A total of "+total+" on the first roll means pass. You lost. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips -= bet.WAGER;
                    netChipsBox.innerText = netChips;
                }
                canRoll = false;
                rollInfo.hidden = true;
            } else if(total == 2 || total == 3 || total == 12){
                if(bet.PASS){
                    messageBox.innerText = "A total of "+total+" on the first roll means don't pass. You lost. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips -= bet.WAGER;
                    netChipsBox.innerText = netChips;
                    canRoll = false;
                    rollInfo.hidden = true;
                } else if(total == 12){
                    messageBox.innerText = "A total of 12 pushes if you bet don't pass. That means just roll again. No point is established";
                } else {
                    messageBox.innerText = "A total of "+total+" on the first roll means pass. You lost. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips -= bet.WAGER;
                    netChipsBox.innerText = netChips;
                    canRoll = false;
                    rollInfo.hidden = true;
                }
            } else {
                point = total
                messageBox.innerText = total+" is the point. If the point is rolled before 7, pass wins. If not, don't pass wins. Keep rolling until a payout."
            }
        } else {
            if(point == total){
                if(bet.PASS){
                    messageBox.innerText = "The point was rolled and you bet pass so you win. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips += bet.WAGER;
                    netChipsBox.innerText = netChips;
                } else {
                    messageBox.innerText = "The point was rolled and you bet don't pass so you lost. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips -= bet.WAGER;
                    netChipsBox.innerText = netChips;
                }
                canRoll = false
                rollInfo.hidden = true;
            } else if(total == 7){
                if(bet.PASS){
                    messageBox.innerText = "A 7 was rolled and you bet pass so you lose. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips -= bet.WAGER;
                    netChipsBox.innerText = netChips;
                } else {
                    messageBox.innerText = "A 7 was rolled and you bet don't pass so you win. Place another bet to play again.";
                    betInfoBox.innerText = "You have not placed a bet"
                    netChips += bet.WAGER;
                    netChipsBox.innerText = netChips;
                }
                canRoll = false
                rollInfo.hidden = true;
            }
        }
    }
}

