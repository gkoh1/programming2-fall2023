let rouletteWheel = document.getElementById("roulette-wheel");
let pointer = document.getElementById("roulette-pointer");
let currentRotation = 0 ;
let betSelctor = document.getElementById("roulette-bets");
let rolledNumBox = document.getElementById("roulette-rolled-number");
let bettingBox = document.getElementById("roulette-bet-info");
let wagerBox = document.getElementById("roulette-wager");
let messageBox = document.getElementById("roulette-message-box");
let betList = document.getElementById("roulette-list");
let netChipsBox = document.getElementById("user-points");
let netChips = 0;
let canRoll = true;
// 0 is represented as 0 and 00 as -1 here
const wheelOrder = [6, 21, 33, 16, 4 ,23, 35, 14, 2, 0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 35, 29, 12, 8, 19, 31, 18];
// From https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let wheelRect;
let pointerRect;
let bets = [];
resetWheel();
rolledNumBox.hidden = true;

function resetWheel() {

    wheelBoxRect = document.getElementById("roulette-vertical-display").getBoundingClientRect();
    console.log(wheelBoxRect);
    rouletteWheel = document.getElementById("roulette-wheel");
    // Wheel is a square and grows vertically so easiest to set max height
    rouletteWheel.style.maxHeight = wheelBoxRect.width+"px";
    console.log(rouletteWheel.style.maxHeight);
    wheelRect = rouletteWheel.getBoundingClientRect();
    // If we don't go to 0 rotation, the top of the pointer may be in a weird place (i.e. not the top line of the arrowhead, which is what we want)
    pointer.style.transform = "rotate(0deg)";
    pointerRect = pointer.getBoundingClientRect();
    pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.height))/2 + "px";
    pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px";
    pointer.style.width = (wheelRect.width/2)*.875  + "px";
    pointer.style.transform = "rotate("+currentRotation+"deg)";
}

async function rotate() {
    if(canRoll){
        rolledNumBox.hidden = true;
        let sleepLength = 3;
        // From https://cloudinary.com/blog/rotating_images_in_javascript_three_quick_tutorials#:~:text=To%20animate%20rotations%2C%20apply%20the,second%20with%20a%20slow%20start.&text=By%20default%2C%20the%20image%20rotates%20around%20its%20center%20point.
        for(let addedRotation = 0; addedRotation<540; addedRotation++){
            await sleep(3);
            currentRotation++;
            pointer.style.transform = "rotate("+currentRotation+"deg)";
        }
        let beforeRandom = currentRotation
        let randomRotation = 360*Math.random()
        if(randomRotation < 50){
            randomRotation += 360
        }
        sleepLength = 3
        for(let addedRotation = 0; addedRotation<randomRotation; addedRotation++){
            await sleep(sleepLength);
            if ((randomRotation - addedRotation) < 100) {
                sleepLength += .5
            }
            if ((randomRotation - addedRotation) < 20) {
                sleepLength += .5
            }
            if ((randomRotation - addedRotation) < 5) {
                sleepLength += .5
            }
            currentRotation++
            pointer.style.transform = "rotate("+currentRotation+"deg)"
        }
        currentRotation = beforeRandom+randomRotation
        pointer.style.transform = "rotate("+currentRotation+"deg)"
        console.log(currentRotation)
        currentRotation = currentRotation%360
        console.log(currentRotation)
        let tileNumber = Math.floor(currentRotation*38/360)
        console.tileNumber
        let rolledNumber = wheelOrder[tileNumber]
        console.log(rolledNumber)
        if (rolledNumber > -1) {
            rolledNumBox.innerText = "The wheel landed on " + rolledNumber
        } else {
            rolledNumBox.innerText = "The wheel landed on 00"
        }
    
        if(currentRotation < 180) {
            rolledNumBox.style.top = (wheelRect.top*.57+wheelRect.bottom*.43) + "px"
        } else {
            rolledNumBox.style.top = (wheelRect.top*.43+wheelRect.bottom*.57) + "px"
        }
        rolledNumBox.hidden = false
        rolledNumBoxDims = rolledNumBox.getBoundingClientRect()
        rolledNumBox.style.left = pointer.style.left = (wheelRect.right+wheelRect.left-(rolledNumBoxDims.right-rolledNumBoxDims.left))/2 + "px"
        // If I don't do this, the pointer moves in a weird way. Not sure why.
        pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.bottom-pointerRect.top))/2 + "px"
        pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px"
        console.log(bets)
        for (bet of bets){
            payout = false;
            console.log(bet.WIN)
            for(win of bet.WIN){
                if(rolledNumber == win){
                    netChips += bet.PAYOUT;;
                    payout = true;
                    break;
                }
            }
            if(!payout){
                netChips += -bet.WAGER;
            }
        }
        netChipsBox.innerText = netChips
        messageBox.innerText = "Bets paid out. Press reset to go again."
        canRoll = false
    }
}

// This is not mine. From Stack Overflow.
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

function betChange() {
    messageBox.innerText = "Place your bets and click spin wheel when you're done."
    bettingBox.innerHTML = ""
    switch(betSelctor.value) {
        case "number":
            bettingBox.innerHTML += "Input one number: <input type='number' name='number input' class='roulette-bet-number'>";
            break;
        case "split":
            bettingBox.innerHTML += "Input two numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
            break;
        case "street":
            bettingBox.innerHTML += "Input three numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
            break;
        case "corner":
            bettingBox.innerHTML += "Input four numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
            break;
        case "double-street":
            bettingBox.innerHTML += "Input six numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
            break;
        case "trio":
            bettingBox.innerHTML += "<select name='trio' id='trio-choice'> <option value='Placeholder'> Choose a trio </option> <option value='0-1-2'> 0-1-2 </option> <option value='0-00-2'> 0-00-2 </option> <option value='00-2-3'> 00-2-3 </option></select>" 
            break;    
        case "high/low":
            bettingBox.innerHTML += "<select name='high/low' id='high/low-choice'> <option value='Placeholder'> High or low? </option><option value='low'> Low </option><option value='high'> High</option></select>" 
            break;
        case "color":
            bettingBox.innerHTML += "<select name='color' id='color-choice'> <option value='Placeholder'> Red or black? </option> <option value='red'> Red</option> <option value='black'> Black </option></select>" 
            break;
        case "dozen":
            bettingBox.innerHTML += "<select name='dozen' id='dozen-choice'> <option value='Placeholder'> Whiich dozen? </option> <option value='1-12'> 1-12</option> <option value='13-24'> 13-24 </option><option value='25-36'> 25-36 </option></select>" 
            break;
        case "column":
            bettingBox.innerHTML += "<select name='column' id='column-choice'> <option value='Placeholder'> Which column? </option> <option value='column-1'> 1st column</option> <option value='column-2'> 2nd column </option><option value='column-3'>3rd column</option></select>" 
            break;
    }
    // In case the wheel shrinks for flex reasons
    resetWheel()
}

function updateBets(wins, wager, payout) {
    let newBet = {
        WIN: wins,
        PAYOUT: payout,
        WAGER: wager
    }
    let betText = wins.join(", ")
    bets.push(newBet)
    betList.innerHTML += "<div> Bet on "+betText+" with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
}

function addBetToHTML(text, wager, payout){
    
}

function extractNumbers(boxes){
    // From https://www.geeksforgeeks.org/most-efficient-way-to-convert-an-htmlcollection-to-an-array/
    let inputArray = Array.prototype.slice.call(boxes)
    let betNumbers = []
    inputArray.forEach((element) => 
        betNumbers.push(Math.round(element.value))
    );
    betNumbers.sort(function(a, b){return a - b})
    return betNumbers
}

// This function is a bit cursed but I can't really think of a better way because the conditions change for each type of bet 
function addBet() {
    if(wagerBox.value < 1){
        messageBox.innerText = "Enter a wager of at least 1";
        return;
    }
    switch(betSelctor.value){
        case "0":
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: [0],
                PAYOUT: wager*35,
                WAGER: wager
            }
            bets.push(newBet)
            betList.innerHTML += "<div> Bet on 0 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
            break;
        case "00":
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: [-1],
                PAYOUT: wager*35,
                WAGER: wager
            }
            bets.push(newBet)
            betList.innerHTML += "<div> Bet on 00 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
            break;
        case "number":
            messageBox.innerText = "Place your bets and click roll when you're done."
            //We need this to be an integer and the isInteger method doesn't really work
            let inputNumber = Math.round(document.getElementsByClassName("roulette-bet-number")[0].value)
            if(inputNumber < 37 && inputNumber){
                wager = Math.round(wagerBox.value*100)/100
                updateBets([inputNumber], wager, wager*35)
            } else {
                messageBox.innerText = "Invalid bet - must bet one a number 1 to 36"
            }
            break;
        case "split": 
            betNumbers = extractNumbers(document.getElementsByClassName("roulette-bet-number"))
            if(betNumbers.length == 2 && betNumbers[1] < 37 && betNumbers[0]>0 && ((betNumbers[0]+1==betNumbers[1]&&betNumbers[0]%3 != 0)||betNumbers[0]+3==betNumbers[1])){
                messageBox.innerText = "Place your bets and click roll when you're done."
                wager = Math.round(wagerBox.value*100)/100
                updateBets(betNumbers, wager, wager*17)
            } else {
                messageBox.innerText = "Invalid bet - must bet on two adjacent (by side) numbers"
            }
            break;
        case "top-row":
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: [-1,0],
                PAYOUT: wager*17,
                WAGER: wager
            }
            bets.push(newBet)
            betList.innerHTML += "<div> Bet on 0 and 00 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
            break;
        case "street":
            betNumbers = extractNumbers(document.getElementsByClassName("roulette-bet-number"))
            if(betNumbers.length == 3 && betNumbers[2] < 37 && betNumbers[0]>0 && betNumbers[0]%3 == 1&&betNumbers[0]+1==betNumbers[1]&&betNumbers[0]+2==betNumbers[2]){
                messageBox.innerText = "Place your bets and click roll when you're done."
                wager = Math.round(wagerBox.value*100)/100
                updateBets(betNumbers, wager, wager*11)
            } else {
                messageBox.innerText = "Invalid bet - must bet on three numbers in a row on the betting board"
            }
            break;
        case "corner":
            betNumbers = extractNumbers(document.getElementsByClassName("roulette-bet-number"))
            if(betNumbers.length == 4 && betNumbers[3] < 37 && betNumbers[0]>0 && betNumbers[0]%3 != 0 &&betNumbers[0]+1==betNumbers[1]&&betNumbers[0]+3==betNumbers[2]&&betNumbers[0]+4==betNumbers[3]){
                messageBox.innerText = "Place your bets and click roll when you're done."
                wager = Math.round(wagerBox.value*100)/100
                updateBets(betNumbers, wager, wager*8)
            } else {
                messageBox.innerText = "Invalid bet - must bet on four numbers sharing a corner"
            }
            break;
        case "double-street":
            betNumbers = extractNumbers(document.getElementsByClassName("roulette-bet-number"))
            console.log(betNumbers)
            if(betNumbers.length == 6 && betNumbers[5] < 37 && betNumbers[0]>0 && betNumbers[0]%3 == 1 &&betNumbers[0]+1==betNumbers[1]&&betNumbers[0]+2==betNumbers[2]&&betNumbers[3]%3==1&&betNumbers[3]+1==betNumbers[4]&&betNumbers[3]+2==betNumbers[5]){
                messageBox.innerText = "Place your bets and click roll when you're done."
                wager = Math.round(wagerBox.value*100)/100
                updateBets(betNumbers, wager, wager*5)
            } else {
                messageBox.innerText = "Invalid bet - must bet on two rows of numbers"
            }
            break;
        case "trio":
            switch(document.getElementById("trio-choice").value){
                case "0-1-2":
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: [0,1,2],
                        PAYOUT: wager*11,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 0, 1, and 2 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "0-00-2":
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: [0,-1,2],
                        PAYOUT: wager*11,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 0, 00, and 2 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "00-2-3":
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: [-1,3,2],
                        PAYOUT: wager*11,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 00, 2, and 3 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                default:
                    messageBox.innerText = "Please select a valid trio"
                    break;
            }
            break;
        case "top-line":
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: [-1,0,1,2,3],
                PAYOUT: wager*6,
                WAGER: Math.round(wager*100*33/5)/100
            }
            bets.push(newBet)
            betList.innerHTML += "<div> Bet on 0, 00, 1, 2, and 3 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
            break;
        // There is a better way to do this without repeating all the newBet = ... boilerplate    
        case "high/low":
            switch(document.getElementById("high/low-choice").value){
                case "high":
                    wins = []
                    for(let i=19; i<37; i++){
                        wins.push(i)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 19-36 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "low":
                    wins = []
                    for(let i=1; i<19; i++){
                        wins.push(i)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 1-18 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                default:
                    messageBox.innerText = "Please select a valid option"
                    break;
            }
            break;
        case "color":
            switch(document.getElementById("color-choice").value){
                case "red":
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: [27, 35, 12, 19, 18, 21, 16, 23, 14, 9, 30, 7, 32, 5, 34, 3, 36, 1],
                        PAYOUT: wager,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on red with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "black":
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: [10, 29, 8, 31, 6, 33, 4, 35, 2, 28, 26, 11, 20, 17, 22, 15, 24, 13],
                        PAYOUT: wager,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on black with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                default:
                    messageBox.innerText = "Please select a valid option"
                    break;
            }
            break;
        case "dozen":
            switch(document.getElementById("dozen-choice").value){
                case "1-12":
                    wins = []
                    for(let i=1; i<13; i++){
                        wins.push(i)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 1-12 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "13-24":
                    wins = []
                    for(let i=13; i<15; i++){
                        wins.push(i)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 13-25 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "25-36":
                    wins = []
                    for(let i=25; i<37; i++){
                        wins.push(i)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on 25-36 with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                default:
                    messageBox.innerText = "Please select a valid option"
                    break;
            }
            break;
        case "column":
            switch(document.getElementById("column-choice").value){
                case "column-1":
                    wins = []
                    for(let i=1; i<13; i++){
                        wins.push(3*i-2)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on the left column with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "column-2":
                    wins = []
                    for(let i=1; i<13; i++){
                        wins.push(3*i-1)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on the middle column with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                case "column-3":
                    wins = []
                    for(let i=1; i<13; i++){
                        wins.push(3*i-1)
                    }
                    wager = Math.round(wagerBox.value*100)/100
                    newBet = {
                        WIN: wins,
                        PAYOUT: wager*2,
                        WAGER: wager
                    }
                    bets.push(newBet)
                    betList.innerHTML += "<div> Bet on the right column with a wager of "+newBet.WAGER+" and a payout of "+ newBet.PAYOUT+ "</div>"
                    break;
                default:
                    messageBox.innerText = "Please select a valid option"
                    break;
            }
    }
   
    // In case the wheel shrinks for flex reasons
    resetWheel()
}

function reset(){
    bets = []
    betList.innerHTML = " <div> Placed Bets:</div>"
    canRoll = true
    messageBox.innerText = "Place your bets"
}
