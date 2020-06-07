/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])
const playerTurn = document.querySelector('.playerTurn');
playerTurn.textContent = `Player ${currPlayer}'s Turn`;
playerTurn.style.color = 'orangered';

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
	// TODO: set "board" to empty HEIGHT x WIDTH matrix array
	//we have our empty board array which we want to go through, with a for loop to set the rows ( the height variable)
	for (let i = 0; i < HEIGHT; i++) {
		//inside the empty board array , at every index for the height we are going to set another empty array , this is our rows
		board[i] = [];
		//we loop through the rows we just set to insert the value of another array , so we end up with columns equal to the width variable with the value of null inside of each of the arrays we set in rows.
		for (let j = 0; j < WIDTH; j++) {
			//for the boards index at every row(i) , in every column(j), set it equal to null
			board[i][j] = null;
		}
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	// TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
	const htmlBoard = document.getElementById('board');
	// TODO: add comment for this code
	//create a variable to capture a table row element
	const top = document.createElement('tr');
	//set the attribute of ID of the new table row element to be id="column-top" , makes it easier to select for styling and scripting
	top.setAttribute('id', 'column-top');
	//adds an event listener whenever the table row element is clicked
	top.addEventListener('click', handleClick);

	//this "block" of code uses a for loop to cycle through the number of columns to ultimately add table data for each column in the new top(table row element)
	for (let x = 0; x < WIDTH; x++) {
		//creates a headcell variable which is a table data element that we create dynamically
		const headCell = document.createElement('td');
		//we give the headCell and id="x" for styling and scripting access
		headCell.setAttribute('id', x);
		//we append that headCell to the table row element (top) for the value of width so for every column
		top.append(headCell);
	}
	//here we append the top (table row element) to the htmlBoard (our array full of null values) , which is also appended with the headCell (table data) and has an event listener, listening for a click that runs handleClick callback when clicked
	htmlBoard.append(top);

	// TODO: add comment for this code
	//we are going to loop through each row as determined by the values of the HEIGHT variable
	for (let y = 0; y < HEIGHT; y++) {
		//set variable of row equal to a new table row element, this will be done for the value of HEIGHT so we end up with rows equal to the number of rows of arrays in our game board
		const row = document.createElement('tr');
		//then we cycle through for all the columns using the WIDTH variable value
		for (let x = 0; x < WIDTH; x++) {
			//create table data and set it equal to each individual cell in our matrix (2D Array of rows and columns) but in a table form of rows and columns filled with td , and each td is a variable called cell
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
	for (let y = HEIGHT - 1; y >= 0; y--) {
		if (!board[y][x]) {
			return y;
		}
	}
	return null;
	// TODO: write the real version of this, rather than always returning 0
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	// TODO: make a div and insert into correct table cell
	//create a variable for the game piece which we are creating as a div
	const gamePiece = document.createElement('div');
	//add a couple of classes to the game piece that we will be dropping which will be piece and then p(1 or 2) depending on who has their turn next
	gamePiece.classList.add('piece');
	gamePiece.classList.add(`p${currPlayer}`);
	//set the id of the piece to be the correct td that they well be in
	gamePiece.setAttribute('id', `${y}-${x}`);
	//append the gamepiece to the column that we click from the head row
	document.getElementById(`${y}-${x}`).append(gamePiece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	setTimeout(function() {
		alert(msg);
	}, 100);
	playerTurn.textContent = `Congratulations Player ${currPlayer}`;
	document.getElementById('column-top').removeEventListener('click', handleClick, false);
	//removing this event listener took me way too long ! it should be easier because it is not an anyonymous function that I am trying to get rid of , it was missing the false which made it not work .
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
	// TODO: check if all cells in board are filled; if so call, call endGame
	if (board.every((row) => row.every((cell) => cell))) {
		return endGame('Tie!');
	}

	// switch players
	// TODO: switch currPlayer 1 <-> 2
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

		return cells.every(([ y, x ]) => y >= 0 && y < HEIGHT && x >= 0 && x < WIDTH && board[y][x] === currPlayer);
	}

	// TODO: read and understand this code. Add comments to help you.

	for (var y = 0; y < HEIGHT; y++) {
		for (var x = 0; x < WIDTH; x++) {
			var horiz = [ [ y, x ], [ y, x + 1 ], [ y, x + 2 ], [ y, x + 3 ] ];
			var vert = [ [ y, x ], [ y + 1, x ], [ y + 2, x ], [ y + 3, x ] ];
			var diagDR = [ [ y, x ], [ y + 1, x + 1 ], [ y + 2, x + 2 ], [ y + 3, x + 3 ] ];
			var diagDL = [ [ y, x ], [ y + 1, x - 1 ], [ y + 2, x - 2 ], [ y + 3, x - 3 ] ];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				//want to add a classlist of victory to see if i can hilight the squares to show where the victory is if it is not automatically apparent
				return true;
			}
		}
	}
}

makeBoard();
makeHtmlBoard();

//trying to make a reset button
// const init = () => {
// 	makeBoard();
// 	makeHtmlBoard();
// };
// let resetBtn = document.querySelector('#reset');
// resetBtn.addEventListener('click', init());
