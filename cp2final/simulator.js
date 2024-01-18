const messageBox = document.getElementById("message-box");
const probBox = document.getElementById("win-chance");
const payoutOddsBox = document.getElementById("odds");
const wagerBox = document.getElementById("first-wager");
const maxRoundsBox = document.getElementById("max-rounds");
const maxGainBox = document.getElementById("max-gain");
const maxLossBox = document.getElementById("max-loss");
const winChangeSelector = document.getElementById("win-changes");
const winChangeBox = document.getElementById("win-change-number");
const lossChangeSelector = document.getElementById("loss-changes");
const lossChangeBox = document.getElementById("loss-change-number");

function changeWager(wager, changeType, changeValue){
    switch(changeType){
        case "set":
            wager = changeValue;
            break;
        case "add":
            wager += changeValue;
            break;
        case "multiply":
            wager *= changeValue;
    }
    return wager;
}


function simulate(){
    let prob = probBox.value;
    let odds = payoutOddsBox.value;
    let runningTotal = 0;
    console.log(prob)
    // Testing for empty value from https://stackoverflow.com/questions/6752714/if-input-value-is-blank-assign-a-value-of-empty-with-javascript
    if (prob.length == 0 || odds.length ==  0 || prob < 0 || prob > 1 || odds < 0){
        messageBox.innerText = "Fill out a valid win probability and payout odds";
        return;
    }
    let wager = wagerBox.value;
    if(wager.length == 0){
        wager = 1;
    }
    let rounds = maxRoundsBox.value;
    if(rounds.length == 0){
        rounds = 100;
    }
    let maxgain = maxGainBox.value;
    let maxloss = maxLossBox.value;
    // CSV stuff from https://www.geeksforgeeks.org/how-to-create-and-download-csv-file-in-javascript/
    csvRows = ["Round #, wager, number rolled, win?, gain/loss this round, running total"]
    for(let i=0; i<rounds; i++){
        let roll;
        let payout;
        let win;
        roll = Math.random();
        if (roll<prob){
            payout = wager*odds;
            win = true;
        } else {
            payout = -1*wager;
            win = false;
        }
        runningTotal += payout
        // Collates all the relevant data into a row of comma separated values
        csvRows.push([i+1, wager, roll, win, payout, runningTotal].join(","))
        if ((maxgain.length != 0 && runningTotal > maxgain)||(maxloss.length != 0 && runningTotal < maxloss)){
            break;
        }
        let winChange = winChangeBox.value;
        let lossChange = lossChangeBox.value;
        if (win && winChange.length != 0){
            wager = changeWager(wager, winChangeSelector.value, winChange);
        }
        if (!win && lossChange.length != 0){
            wager = changeWager(wager, lossChangeSelector.value, lossChange);
        }
    }
    output = csvRows.join("\n")
    // All from same geeksforgeeks article
    const blob = new Blob([output], { type: 'text/csv' }); 
    const url = window.URL.createObjectURL(blob); 
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'simulation.csv'); 
    a.click();
    messageBox.innerText = "Fill out the fields below, then click simulate to get a csv simulation of the game";
}