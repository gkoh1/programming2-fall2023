const USDtoEUR = 0.94;
const USDtoGBP = 0.82;
const USDtoCAD = 1.38;
const USDtoCHF = 0.90;
const USDtoJYN = 151.51;

let exchangeRates = {
    USD: 1,
    EUR: 0.94,
    GBP: 0.82,
    CAD: 1.38,
    CHF: 0.90,
    JPY: 151.51
}

const button = document.getElementById("enterButton")
const dropdown = document.getElementById("")
// button.onclick = function() {calculate()}
function calculate() {
    let intialCurrency = document.getElementById("originalCurrency").value;
    let finalCurrency = document.getElementById("newCurrency").value;
    const input = document.getElementById("initialVal").value;
    let desiredVal = (input/exchangeRates[intialCurrency]*exchangeRates[finalCurrency]).toFixed(2)
    
    const Display = document.getElementById("calculation-display");

    Display.innerText = "Your new value in " + finalCurrency + " is " + desiredVal;
}



