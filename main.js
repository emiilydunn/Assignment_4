(() => {
    //Req 1: Retrieval of the JSON starting data
    const apiURL = "https://prog2700.onrender.com/threeinarow/sample";

    function fetchPuzzleData() {
        fetch(apiURL)
            .then((response) => response.json())
            .then((data) => {
                createPuzzleGrid(data.rows);
            });
    }

    //Req 2: Draw and display 3-in-a-row table with JS only
    function createPuzzleGrid(gridData) {
        const gameContainer = document.getElementById("game-container");

        //Clear previous grid if exists
        gameContainer.innerHTML = "";

        //Create the table and append to the game container
        gridData.forEach((rowData, rowIndex) => {
            const rowElement = document.createElement('tr');

            rowData.forEach((squareData, columnIndex) => {
                const squareCell = document.createElement('td');
                squareCell.dataset.row = rowIndex;
                squareCell.dataset.column = columnIndex;

                //Set initial state of the square (color) based on currentState
                if (squareData.currentState === 0) {
                    squareCell.classList.add('empty'); //Empty state (initial)
                } else if (squareData.currentState === 1) {
                    squareCell.classList.add('state-1'); //First state
                } else if (squareData.currentState === 2) {
                    squareCell.classList.add('state-2'); //Second state
                }

                //Add event listener for clicking on the square
                squareCell.addEventListener('click', () => {
                    handleSquareClick(squareCell, squareData);
                });

                rowElement.appendChild(squareCell);
            });

            gameContainer.appendChild(rowElement);
        });
    }

    //Req 3: Changing of square colors with mouse clicks
    // Handles a click event on a square cell
    function handleSquareClick(squareCell, squareData) {
        // If the square can be toggled, cycle through the states
        if (squareData.canToggle) {
            const currentState = squareData.currentState;

            // Cycle through states: 0 -> 1 -> 2 -> 0
            if (currentState === 0) {
                squareCell.classList.remove('empty');
                squareCell.classList.add('state-1');
                squareData.currentState = 1;
            } else if (currentState === 1) {
                squareCell.classList.remove('state-1');
                squareCell.classList.add('state-2');
                squareData.currentState = 2;
            } else if (currentState === 2) {
                squareCell.classList.remove('state-2');
                squareCell.classList.add('empty');
                squareData.currentState = 0;
            }
        }
    }

    //Initialize by fetching puzzle data
    fetchPuzzleData();

    //Req 4: 3-in-a-row puzzle status checking

    //Check the currentState for the puzzle and update status message

    //Req 5: Error display checkbox

    //Req 6: Adding innovative feature 
})();
