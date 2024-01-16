let rouletteWheel = document.getElementById("roulette-wheel")
let pointer = document.getElementById("roulette-pointer")
let currentRotation = 0 
let betSelctor = document.getElementById("roulette-bets")
let rolledNumBox = document.getElementById("roulette-rolled-number")
let bettingBox = document.getElementById("roulette-bet-info")
let wagerBox = document.getElementById("roulette-wager")
let messageBox = document.getElementById("roulette-message-box")
let betList = document.getElementById("roulette-list")
// 0 is represented as 0 and 00 as -1 here
const wheelOrder = [6, 21, 33, 16, 4 ,23, 35, 14, 2, 0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 35, 29, 12, 8, 19, 31, 18]
// From https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let wheelRect
let pointerRect
let bets = []
resetWheel()
rolledNumBox.hidden = true

function resetWheel() {

    wheelBoxRect = document.getElementById("roulette-vertical-display").getBoundingClientRect();
    console.log(wheelBoxRect)
    rouletteWheel = document.getElementById("roulette-wheel")
    // Wheel is a square and grows vertically so easiest to set max height
    rouletteWheel.style.maxHeight = wheelBoxRect.width+"px";
    console.log(rouletteWheel.style.maxHeight)
    wheelRect = rouletteWheel.getBoundingClientRect();
    pointerRect = pointer.getBoundingClientRect();
    pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.height))/2 + "px"
    pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px"
    pointer.style.width = (wheelRect.width/2)*.875  + "px"
}

async function rotate() {
    rolledNumBox.hidden = true
    let sleepLength = 3
    // From https://cloudinary.com/blog/rotating_images_in_javascript_three_quick_tutorials#:~:text=To%20animate%20rotations%2C%20apply%20the,second%20with%20a%20slow%20start.&text=By%20default%2C%20the%20image%20rotates%20around%20its%20center%20point.
    for(let addedRotation = 0; addedRotation<540; addedRotation++){
        await sleep(3);
        currentRotation++
        pointer.style.transform = "rotate("+currentRotation+"deg)"
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
}

// This is not mine. From Stack Overflow.
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

function betChange() {
    messageBox.innerText = "Place your bets and click roll when you're done."
    bettingBox.innerHTML = ""
    if(betSelctor.value == "number"){
        bettingBox.innerHTML += "Input one number: <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "split"){
        bettingBox.innerHTML += "Input two numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "street") {
        bettingBox.innerHTML += "Input three numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "corner"){
        bettingBox.innerHTML += "Input four numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "double-street") {
        bettingBox.innerHTML += "Input six numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "trio") {
        bettingBox.innerHTML += "<select name='trio' id='trio-choice'> <option value='Placeholder'> Choose a trio </option> <option value='0-1-2'> 0-1-2 </option> <option value='0-00-2'> 0-00-2 </option> <option value='00-2-3'> 00-2-3 </option></select>" 
    }
    if(betSelctor.value == "high/low") {
        bettingBox.innerHTML += "<select name='high/low' id='high/low-choice'> <option value='Placeholder'> High or low? </option> <option value='high'> High</option> <option value='low'> Low </option></select>" 
    }
    if(betSelctor.value == "color") {
        bettingBox.innerHTML += "<select name='color' id='color-choice'> <option value='Placeholder'> Red or black? </option> <option value='red'> Red</option> <option value='black'> Black </option></select>" 
    }
    if(betSelctor.value == "dozen") {
        bettingBox.innerHTML += "<select name='dozen' id='dozen-choice'> <option value='Placeholder'> Whiich dozen? </option> <option value='1-12'> 1-12</option> <option value='13-24'> 13-24 </option><option value='25-36'> 25-36 </option></select>" 
    }
    if(betSelctor.value == "column") {
        bettingBox.innerHTML += "<select name='column' id='column-choice'> <option value='Placeholder'> Which column? </option> <option value='column-1'> 1st column</option> <option value='column-2'> 2nd column </option><option value='column-3'>3rd column</option></select>" 
    }
    // In case the wheel shrinks for flex reasons
    resetWheel()
}

function updateBets(betText, bet) {
    bets += bet
    betList.innerHTML += "<div> Bet on "+betText+" with a wager of "+bet.WAGER+" and a payout of "+ bet.PAYOUT+ "</div>"
}

// This function is a bit cursed but I can't really think of a better way because the conditions change for each type of bet 
function addBet() {
    if(betSelctor.value == "number"){
        messageBox.innerText = "Place your bets and click roll when you're done."
        //We need this to be an integer and the isInteger method doesn't really work
        let inputNumber = Math.round(document.getElementsByClassName("roulette-bet-number")[0].value)
        if(inputNumber < 37 && inputNumber){
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: [inputNumber],
                PAYOUT: wager*37,
                WAGER: wager
            }
            updateBets(inputNumber, newBet)
        } else {
            messageBox.innerText = "Invalid bet"
        }
    }
    if(betSelctor.value == "split"){
        let inputNumbers = document.getElementsByClassName("roulette-bet-number")
        // From https://www.geeksforgeeks.org/most-efficient-way-to-convert-an-htmlcollection-to-an-array/
        let inputArray = Array.prototype.slice.call(inputNumbers)
        console.log(inputArray)
        console.log(inputArray[0].value)
        let betNumbers = []
        inputArray.forEach((element) => 
            betNumbers.push(Math.round(element.value))
        );
        betNumbers.sort()
        if(betNumbers.length == 2 && betNumbers[1] < 37 && betNumbers[0]>0 && ((betNumbers[0]+1==betNumbers[1]&&betNumbers[0]%3 != 0)||betNumbers[0]+3==betNumbers[1])){
            messageBox.innerText = "Place your bets and click roll when you're done."
            wager = Math.round(wagerBox.value*100)/100
            newBet = {
                WIN: betNumbers,
                PAYOUT: wager*18,
                WAGER: wager
            }
            updateBets(betNumbers.join(" and "), newBet)
        } else {
            messageBox.innerText = "Invalid bet"
        }
    }
    if(betSelctor.value == "top-row"){
        wager = Math.round(wagerBox.value*100)/100
        newBet = {
            WIN: [-1,0],
            PAYOUT: wager*18,
            WAGER: wager
        }
        updateBets("0 and 00", newBet)
    }
    if(betSelctor.value == "street") {
        bettingBox.innerHTML += "Input three numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "corner"){
        bettingBox.innerHTML += "Input four numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "double-street") {
        bettingBox.innerHTML += "Input six numbers: <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'> <input type='number' name='number input' class='roulette-bet-number'>" 
    }
    if(betSelctor.value == "trio") {
        bettingBox.innerHTML += "<select name='trio' id='trio-choice'> <option value='Placeholder'> Choose a trio </option> <option value='0-1-2'> 0-1-2 </option> <option value='0-00-2'> 0-00-2 </option> <option value='00-2-3'> 00-2-3 </option></select>" 
    }
    if(betSelctor.value == "high/low") {
        bettingBox.innerHTML += "<select name='high/low' id='high/low-choice'> <option value='Placeholder'> High or low? </option> <option value='high'> High</option> <option value='low'> Low </option></select>" 
    }
    if(betSelctor.value == "color") {
        bettingBox.innerHTML += "<select name='color' id='color-choice'> <option value='Placeholder'> Red or black? </option> <option value='red'> Red</option> <option value='black'> Black </option></select>" 
    }
    if(betSelctor.value == "dozen") {
        bettingBox.innerHTML += "<select name='dozen' id='dozen-choice'> <option value='Placeholder'> Whiich dozen? </option> <option value='1-12'> 1-12</option> <option value='13-24'> 13-24 </option><option value='25-36'> 25-36 </option></select>" 
    }
    if(betSelctor.value == "column") {
        bettingBox.innerHTML += "<select name='column' id='column-choice'> <option value='Placeholder'> Which column? </option> <option value='column-1'> 1st column</option> <option value='column-2'> 2nd column </option><option value='column-3'>3rd column</option></select>" 
    }
    // In case the wheel shrinks for flex reasons
    resetWheel()
}

