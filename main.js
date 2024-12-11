// IIFE
(() => {

//Req 1: Retrieval of the JSON starting data
//Define API url
var apiURL = "https://prog2700.onrender.com/threeinarow/sample";

alert("Hello");

function fetchPuzzleData(){
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            //Variables to store the puzzle and solution data
            createPuzzleGrid(data.rows);
        })      
}


//Req 2: Draw and display 3-in-a-row table with JS only
//Function to create the puzzle grid (unobtrusive JS)
function createPuzzleGrid(rows) {
    const gameContainer = document.getElementById("game-container");

    
   







}

//Req 3: Changing of aquare colours with mouse clicks

//Req 4: 3-in-a-row puzzle status checking

//Req 5: Error display checkbox

//Req 6: Adding innovative feature 



})();

