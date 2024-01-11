let rouletteWheel = document.getElementById("roulette-wheel")
let pointer = document.getElementById("roulette-pointer")
let currentRotation = 0 
let betSelctor = document.getElementById("roulette-bets")
let numBox = document.getElementById("roulette-number-box")
let bettingBox = document.getElementById("roulette-bet-info")
// 0 is represented as 0 and 00 as -1 here
const wheelOrder = [6, 21, 33, 16, 4 ,23, 35, 14, 2, 0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, -1, 27, 10, 35, 29, 12, 8, 19, 31, 18]
// From https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let wheelRect
let pointerRect
let bets = []
resetWheel()
numBox.hidden = true

function resetWheel() {
    wheelRect = rouletteWheel.getBoundingClientRect();
    pointerRect = pointer.getBoundingClientRect();
    pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.bottom-pointerRect.top))/2 + "px"
    pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px"
    pointer.style.width = (wheelRect.width/2)*.875  + "px"

}

async function rotate() {
    numBox.hidden = true
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
        numBox.innerText = "The wheel landed on " + rolledNumber
    } else {
        numBox.innerText = "The wheel landed on 00"
    }
   
    if(currentRotation < 180) {
        numBox.style.top = (wheelRect.top*.6+wheelRect.bottom*.4) + "px"
    } else {
        numBox.style.top = (wheelRect.top*.4+wheelRect.bottom*.6) + "px"
    }
    numBox.hidden = false
    numBoxDims = numBox.getBoundingClientRect()
    numBox.style.left = pointer.style.left = (wheelRect.right+wheelRect.left-(numBoxDims.right-numBoxDims.left))/2 + "px"
    // If I don't do this, the pointer moves in a weird way. Not sure why.
    pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.bottom-pointerRect.top))/2 + "px"
    pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px"  
}

// This is not mine. From Stack Overflow.
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

function betChange() {
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
    // In case the wheel shrinks for flex reasons
    resetWheel()
}

