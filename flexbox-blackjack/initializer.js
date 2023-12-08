function initialize() {
    numDecks = document.getElementById("numDecks").value
    localStorage.setItem("deckCount", numDecks);
}