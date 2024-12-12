//IIFE
(() => {

    //Define API URL and initialize variable to hold puzzle data
    const apiURL = "https://prog2700.onrender.com/threeinarow/sample";
    let puzzleData = {};

    //Initialize timer variables
    let startTime;
    let timerInterval;
    let isGameStarted = false;

    //Function to fetch puzzleData from API
    function fetchPuzzleData() {
        fetch(apiURL)
            .then((response) => response.json())
            .then((data) => {
                //Store the data in puzzleData, and call function to create the grid
                puzzleData = data;
                createPuzzleGrid(data.rows);
            });
    }

    //Function to create the puzzle grid
    function createPuzzleGrid(gridData) {

        //Get the container element where table will be inserted
        const gameContainer = document.getElementById("game-container");
        //Clear any existing content just in case
        gameContainer.innerHTML = "";

        //Create a new table element to hold the game grid
        const table = document.createElement('table');

        //Iterate over each row in the grid data and create a table row
        gridData.forEach((rowData, rowIndex) => {
            const rowElement = document.createElement('tr');

            //Iterate over each cell in the row
            rowData.forEach((squareData, columnIndex) => {
                const squareCell = document.createElement('td');

                //Set data attributes for row and column to identify cells later on in code (I will forget otherwise)
                squareCell.dataset.row = rowIndex;
                squareCell.dataset.column = columnIndex;

                //Update cell's display based on its data
                updateSquareDisplay(squareCell, squareData);

                //Add click event listener if the cell can be toggled
                if (squareData.canToggle) {
                    squareCell.addEventListener('click', () => handleSquareClick(rowIndex, columnIndex));
                }

                //Add the cell to the row
                rowElement.appendChild(squareCell);
            });
            //Add the row to the table
            table.appendChild(rowElement);
        });
        //Add the table to the game container
        gameContainer.appendChild(table);
    }

    //Function to update the display of a cell
    function updateSquareDisplay(squareCell, squareData) {
        //Clear existing classes just in case
        squareCell.className = '';

        //Add appropriate class based on the cell's state
        if (squareData.currentState === 0) {
            squareCell.classList.add('empty');
        } else if (squareData.currentState === 1) {
            squareCell.classList.add('state-1');
        } else if (squareData.currentState === 2) {
            squareCell.classList.add('state-2');
        }

        //Add 'fixed' class to cells that cannot be toggled
        if (!squareData.canToggle) {
            squareCell.classList.add('fixed');
        }
    }


    //Function to handle cell clicks
    function handleSquareClick(rowIndex, columnIndex) {
        //Start timer when a square is clicked
        startTimer();
        const squareData = puzzleData.rows[rowIndex][columnIndex];
        if (squareData.canToggle) {
            //Cycle through states(0 to 1 to 2 back to 0 etc)
            squareData.currentState = (squareData.currentState + 1) % 3;

            //Update cell's display
            const squareCell = document.querySelector(`td[data-row="${rowIndex}"][data-column="${columnIndex}"]`);
            updateSquareDisplay(squareCell, squareData);
        }
    }

    //Function to check the puzzle status
    function checkPuzzleStatus() {
        //Start timer if it hasn't started yet
        startTimer();
     
        let incorrect = 0;
        let incomplete = 0;
        let total = 0;

        //Iterate over all cells to count incorrect, incomplete, correct, and total filled cells
        puzzleData.rows.forEach((row, rowIndex) => {
            row.forEach((squareData, colIndex) => {
                if (squareData.currentState !== 0) {
                    total++;
                    if (squareData.currentState !== squareData.correctState) {
                        incorrect++;
                    }
                } else {
                    incomplete++;
                }
            });
        });

        //Update status message based on puzzle state
        const statusMessage = document.getElementById('status-message');
        if (incorrect === 0 && incomplete === 0) {
            statusMessage.textContent = "You did it!!";
        } else if (incorrect > 0) {
            statusMessage.textContent = "Something is wrong...";
        } else if (total > 0) {
            statusMessage.textContent = "So far, so good!";
        } else {
            statusMessage.textContent = "Click a square to get started!";
        }

        //Time to status message 
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        statusMessage.textContent += ` Time: ${elapsedTime} seconds`;

        //Show or hide errors based on checkbox state
        const showErrorsCheckbox = document.getElementById('show-errors');
        if (showErrorsCheckbox.checked) {
            highlightErrors();
        } else {
            clearErrors();
        }
    }


    //Function to highlight the incorrect cells
    function highlightErrors() {
        puzzleData.rows.forEach((row, rowIndex) => {
            row.forEach((squareData, colIndex) => {
                const cell = document.querySelector(`td[data-row="${rowIndex}"][data-column="${colIndex}"]`);
                if (cell && squareData.currentState !== squareData.correctState) {
                    cell.classList.add('error');
                } else if (cell) {
                    cell.classList.remove('error');
                }
            });
        });
    }

    //Function to clear error highlights
    function clearErrors() {
        const allSquares = document.querySelectorAll('td');
        allSquares.forEach(square => square.classList.remove('error'));
    }

    //Add event listener for the 'check puzzle' button
    document.getElementById('check-puzzle').addEventListener('click', checkPuzzleStatus);

    //Add event listener for the 'show errors' checkbox
    document.getElementById('show-errors').addEventListener('change', (event) => {
        //Start timer when checkbox is toggled
        startTimer();
        if (event.target.checked) {
            highlightErrors();
        } else {
            clearErrors();
        }
    });

    function startTimer() {
        if (!isGameStarted) {
            isGameStarted = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById('time-display').textContent = `Time: ${elapsedTime} seconds`;
    }

    //Add event listener to start the game when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', fetchPuzzleData);
})();
