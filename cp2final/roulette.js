let rouletteWheel = document.getElementById("roulette-wheel")
let pointer = document.getElementById("roulette-pointer")
let currentRotation = 0 
let betSelctor = document.getElementById("roulette-bets")
// 0 is represented as 0 and 00 as -1 here
let wheelOrder = [6. 21, 33, 16,4 ,23]

// Method from https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
let wheelRect = rouletteWheel.getBoundingClientRect();
console.log(wheelRect.top, wheelRect.right, wheelRect.bottom, wheelRect.left);
let pointerRect = pointer.getBoundingClientRect();

pointer.style.top = (wheelRect.top+wheelRect.bottom-(pointerRect.bottom-pointerRect.top))/2 + "px"
pointer.style.left = (wheelRect.right+wheelRect.left)/2 + "px"
pointer.style.width = (wheelRect.width/2-30) + "px"
console.log(pointer.style.top)
console.log(pointerRect.bottom-pointerRect.top)

async function rotate() {
    console.log(betSelctor.value)
    let sleepLength = 3
    for(let addedRotation = 0; addedRotation<720; addedRotation++){
        await sleep(3);
        currentRotation++
        pointer.style.transform = "rotate("+currentRotation+"deg)"
    }
    let beforeRandom = currentRotation
    let randomRotation = 360*Math.random()
    sleepLength = 3
    for(let addedRotation = 0; addedRotation<randomRotation; addedRotation++){
        await sleep(sleepLength);
        if ((randomRotation - addedRotation) < 100) {
            sleepLength += .5
        }
        if ((randomRotation - addedRotation) < 20) {
            sleepLength += 1
        }
        if ((randomRotation - addedRotation) < 5) {
            sleepLength += 2
        }
        currentRotation++
        pointer.style.transform = "rotate("+currentRotation+"deg)"
    }
    currentRotation = beforeRandom+randomRotation
    pointer.style.transform = "rotate("+currentRotation+"deg)"
}

// This is not mine. From Stack Overflow.
function sleep(ms) {
    return new Promise(resolveFunc => setTimeout(resolveFunc, ms));
}

console.log(betSelctor)

function betChange() {
    if(betSelctor.value == "number"){
        document.getElementById("roulette-list").innerText += "Number"
    }
}

