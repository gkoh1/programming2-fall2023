

// let age = prompt("What is your age?");
// let name = prompt("What is your name");

// // console.log(age);
// // console.log(name);

// // alert("This is an alert!");     

// const myNameParagraph = document.getElementById("name");
// console.log(myNameParagraph);
// myNameParagraph.innerText = name;
// const myAgeParagraph = document.getElementById("age");
// console.log(myAgeParagraph);
// myAgeParagraph.innerText = age;
// myNameParagraph.style.margin = "100px";

let place = prompt("Enter a place");
const placeSpan = document.getElementById("place");
placeSpan.innerText = place;
let adjective = prompt("Enter an adjective");
const adjectiveSpan = document.getElementById("adjective");
adjectiveSpan.innerText = adjective;
let animal = prompt("Enter an animal")
const animalSpan = document.getElementsByClassName("animal");
for (let index = 0; index < animalSpan.length; index++) {
    animalSpan[index].innerText = animal;
}
let verb = prompt("Enter a verb")
const verbSpan = document.getElementById("verb");
verbSpan.innerText = verb;
let adjective2 = prompt("Enter an adjective")
const adjective2Span = document.getElementById("adjective2");
adjective2Span.innerText = adjective2;
let name = prompt("Enter a name")
const nameSpan = document.getElementById("name");
nameSpan.innerText = name;
let pastVerb = prompt("Enter a past tense verb")
const pastVerbSpan = document.getElementById("past-verb");
pastVerbSpan.innerText = pastVerb;

