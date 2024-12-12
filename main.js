//IIFE
(() => {

    //Define API URL and initialize variable to hold puzzle data
    const apiURL = "https://prog2700.onrender.com/threeinarow/sample";
    let puzzleData = {};

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

        //Create a new table element
        const table = document.createElement('table');

        //Iterate over each row in the grid data and create a table row
        gridData.forEach((rowData, rowIndex) => {
            const rowElement = document.createElement('tr');

            //Iterate over each cell in the row
            rowData.forEach((squareData, columnIndex) => {
                const squareCell = document.createElement('td');

                //Set data attributes for row and column
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
        if (event.target.checked) {
            highlightErrors();
        } else {
            clearErrors();
        }
    });

    //Add event listener to start the game when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', fetchPuzzleData);
})();
