//sets the width to be 7 cells
let width = 7;
//sets the height to be 6 tall
let height = 6;

// active player: 1 or 2
//setting the player to 1 which we will alternate with 2 later
let currPlayer = 1;
//creates our empty board
const board = []; // array of rows, each row will contain an array of cells  (board[y][x])

//sets a variable that is selecting our header that has the players turn class
const playerTurn = document.querySelector('.playerTurn');

//alternating the color and header based off of who has the current move. set to the default value for player one
playerTurn.textContent = `Player ${currPlayer}'s Turn`;

playerTurn.style.color = 'orangered';

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
//create the board function
function makeBoard() {
	//we have our empty board array which we want to go through, with a for loop to set the rows ( the height variable)
	for (let i = 0; i < height; i++) {
		//inside the board array , at every index for the height we are going to set another empty array , this is our rows
		board[i] = [];
		//we loop through the rows we just set to insert the value of another array , so we end up with columns equal to the width variable with the value of null inside of each of the arrays we set in rows.
		for (let j = 0; j < width; j++) {
			//for the boards index at every row(i) , in every column(j), set it equal to null to fill in the cells of the array
			board[i][j] = null;
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	//select our htmlBoard from our index.html using a dom selector
	const htmlBoard = document.getElementById('board');

	//create a new table row element on the document, variable name of top
	const top = document.createElement('tr');
	//set the attribute of ID of the new table row element to be id="column-top" , makes it easier to select for styling and scripting
	top.setAttribute('id', 'column-top');
	//adds an event listener whenever the table row element is clicked, using our callback function handleClick
	top.addEventListener('click', handleClick);

	//Use a for loop to cycle through the number of columns to ultimately add table data for each column in the new top(table row element)
	for (let x = 0; x < width; x++) {
		//creates a headcell variable which will be our clickable area, makes 7 as determined by our width
		const headCell = document.createElement('td');
		//we give the headCell and id="x" for styling and scripting access
		headCell.setAttribute('id', x);
		//we append each headCell to the table row element (top) for the value of width so for every column
		top.append(headCell);
	}
	//here we append the top (table row element) to the htmlBoard (our array full of null values) , which is also appended with the headCell (table data) and has an event listener, listening for a click that runs handleClick callback when clicked
	htmlBoard.append(top);

	//we are going to loop through each row as determined by the value of the height variable
	for (let y = 0; y < height; y++) {
		//set variable of row equal to a new table row element, this will be done for the value of height so we end up with rows equal to the number of rows of arrays in our game board
		const row = document.createElement('tr');
		//then we cycle through for all the columns using the width variable value
		for (let x = 0; x < width; x++) {
			//create a table data element and set it equal to each individual cell in our matrix (2D Array of rows and columns) but in a table form of rows and columns filled with td , and each td is a variable called cell
			const cell = document.createElement('td');
			//sets the attribute of id for each cell equal to the grid x-y values using string template literal , we can use this later to either style or to know where a piece is currently occupying
			cell.setAttribute('id', `${y}-${x}`);
			//append each cell to each row

			row.append(cell);
		}
		//append each row to the gameboard itself
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	//in the given column of x , cycle through each index vertically using a set x coordinate and then a changing y coordinate.
	for (let y = height - 1; y >= 0; y--) {
		//when a value returns false(y)  it means the current value is null so there is an empty space there , that would be the lowest column
		if (!board[y][x]) {
			//return the coordinates for the game piece to drop into
			return y;
		}
	}
	//if all of the board coorinates in that column come back truthy then we know that the column is full so we can not place a piece there
	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	//create a variable for the game piece which we are creating as a div
	const gamePiece = document.createElement('div');
	//add a couple of classes to the game piece that we will be dropping which will be piece and then p(1 or 2) depending on who has their turn next
	gamePiece.classList.add('piece');
	gamePiece.classList.add(`p${currPlayer}`);
	//set the id of the piece to be the correct td that they well be in
	gamePiece.setAttribute('id', `${y}-${x}`);
	//append the gamepiece to the column that we click from the head row. we are appending a div specifically to the cell
	document.getElementById(`${y}-${x}`).append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
	//give it a small delay so that we can let the last piece drop before the later pops up so the player can see the victory
	setTimeout(function() {
		//our pop up message
		alert(msg);
	}, 300);
	//changes the header showing the current players' turn to a congratulatory message
	playerTurn.textContent = `Congratulations Player ${currPlayer}`;
	//removing the event listener so that the player can no longer set down pieces
	document.getElementById('column-top').removeEventListener('click', handleClick);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	placeInTable(y, x);
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) {
		return endGame(`Player ${currPlayer} wins!`);
	}

	// check for tie

	//goes through every cell of every row and checks if the value is truthy , once there is no more null squares the value will be truthy for all so this will run and give us the tie message
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame("I don't know how, but you tied!");
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
	//simple if else statement to alternate between the players
	if (currPlayer === 1) {
		currPlayer = 2;
		playerTurn.textContent = `Player ${currPlayer}'s Turn`;
		playerTurn.style.color = 'lightgreen';
	} else {
		currPlayer = 1;
		playerTurn.textContent = `Player ${currPlayer}'s Turn`;
		playerTurn.style.color = 'orangered';
	}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		//using the array method every, within the bound of the grid as determined by x and y , AND each cell belongs to the player. Returns true if all conditions are met
		return cells.every(([ y, x ]) => y >= 0 && y < height && x >= 0 && x < width && board[y][x] === currPlayer);
	}

	//looping through our coordinate system
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			//checking for a horizontal win , adding one to the x coordinate each time
			const horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			//added a way to hilight the squares that signify a horizontal win, loop through the winning values when the horizontal win is true and change the background color of those cells to be gold . can also be done with a class but its just a simple change on the background color of the squares so not really necessary unless we want to abide to the seperation of responsiblities
			if (_win(horiz)) {
				horiz.forEach(() => {
					document.getElementById(`${y}-${x++}`).style.backgroundColor = 'gold';
				});
			}
			//checking for the vertical win by changing the y axis element
			const vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			if (_win(vert)) {
				vert.forEach(() => {
					document.getElementById(`${y++}-${x}`).style.backgroundColor = 'gold';
				});
			}
			//changing both element positively to check upwards diagonally to the right (the positive axis)
			const diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			if (_win(diagDR)) {
				diagDR.forEach(() => {
					document.getElementById(`${y++}-${x++}`).style.backgroundColor = 'gold';
				});
			}
			//changing the y element positively and the x element negatively to check for wins to the diagonal left
			const diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];
			if (_win(diagDL)) {
				diagDL.forEach(() => {
					document.getElementById(`${y++}-${x--}`).style.backgroundColor = 'gold';
				});
			}
			//just overall if any of these are true we return true to run the endgame function
			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				//if
				//want to add a classlist of victory to see if i can hilight the squares to show where the victory is if it is not automatically apparent
				return true;
			}
		}
	}
}
//activating our board functions to start the game when the page is loaded
makeBoard();
makeHtmlBoard();
