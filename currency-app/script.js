const USDtoEUR = 0.94;
const USDtoGBP = 0.82;
const USDtoCAD = 1.38;
const USDtoCHF = 0.90;
const USDtoJYN = 151.51;

const button = document.getElementById("enterButton");
button.onclick = function() {calculate()}
function calculate() {
    console.log("Calculated")
    const input = document.getElementById("initialVal")
    let USDValue = parseFloat(input.value);
    let EURValue = (USDValue*USDtoEUR).toFixed(2);
    let GBPValue = (USDValue*USDtoGBP).toFixed(2);
    let CADValue = (USDValue*USDtoCAD).toFixed(2);
    let CHFValue = (USDValue*USDtoCHF).toFixed(2);
    let JYNValue = (USDValue*USDtoJYN).toFixed(2);
    
    const USDDisplay = document.getElementById("USD");
    const EURDisplay = document.getElementById("EUR");
    const GBPDisplay = document.getElementById("GBP");
    const CADDisplay = document.getElementById("CAD");
    const CHFDisplay = document.getElementById("CHF");
    const JYNDisplay = document.getElementById("JPY");
    
    USDDisplay.innerText = USDValue;
    EURDisplay.innerText = EURValue;
    GBPDisplay.innerText = GBPValue;
    CADDisplay.innerText = CADValue;
    CHFDisplay.innerText = CHFValue;
    JYNDisplay.innerText = JYNValue;
}



