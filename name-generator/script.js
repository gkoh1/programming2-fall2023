function createName() {
    const age = parseInt(document.getElementById("age").value);
    const month = document.getElementById("birth-month").value;
    const siblings = parseInt(document.getElementById("siblings").value);
    const nameBox = document.getElementById("name-display");
    let name = ""
    if (month == "DEC" || month == "JAN" || month == "FEB"){
        name = "B"
    } else if (month == "MAR" || month == "APR" || month == "MAY"){
        name = "G"
    } else if (month == "JUN" || month == "JUL" || month == "AUG"){
        name = "C"
    } else if (month == "SEP" || month == "OCT" || month == "NOV"){
        name = "Sh"
    } else {
        name = "?"
    }
    if (age < 10) {
        name += "lorf";
    } else if (age < 20) {
        name += "larg";
    } else if (age < 40) {
        name += "orp";
    } else if (age < 80) {
        name += "altch";
    } else if (age < 160){
        name += "ilb";
    } else {
        name += "????";
    }
    if (siblings >= 1 && siblings <= 4) {
        name +=" the wise";
    } else {
        name += " the blessed";
    }
    nameBox.innerText = name;
}