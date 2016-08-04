var blockSize = 30;

function Board(numCols, numRows) {

	var board = [];
    var cols = numCols;
    var rows = numRows;
	var score = 0;

	var setupBoard = function(c, r) {
        for (i = 0; i < r; i++) {
            var tempArr = [];
            for (j = 0; j < c; j++) {
                tempArr.push(new Space(j, i));
            }
            board.push(tempArr);
        }
    }

    setupBoard(cols, rows);

    var getSpaceAt = function(x, y) {
        // Board is set up opposite coordinates
		// console.log(x, y);
		// console.log(board.length, board[0].length);
        return board[y][x];
    }

	this.colorSquare = function(x, y, clr) {
		if (!space instanceof Space) {
			throw new Error("Cannot add non space element");
		}
		var space = getSpaceAt(x, y);
		space.addBlock(clr);
	}

	this.canFallDown = function(block) {
		// allBlcoks is list of all square of block
		if (!block instanceof Block) { throw new Error("Must pass isValidMove a Block object");}

		var allSquares = block.getAllSquaresOfBlock(block.structure);
		for (i = 0; i < allSquares.length; i++) {
			var x = allSquares[i][0];
			var y = allSquares[i][1];

			// Checks if block in way or
			if (y >= (canvasHeight / blockSize) - 1) {
				return false;
			}
			if (getSpaceAt(x, y + 1).getOccupied()) {
				return false
			}

		}
		return true;
	}

	this.canMoveRight = function(block) {
		if (!block instanceof Block) { throw new Error("Must pass canMoveRight a Block object");}

		var allSquares = block.getAllSquaresOfBlock(block.structure);
		for (i = 0; i < allSquares.length; i++) {
			var x = allSquares[i][0];
			var y = allSquares[i][1];

			if (x > canvasWidth / blockSize - 2) {
				return false;
			}
			if (getSpaceAt(x + 1, y).getOccupied()) {
				return false;
			}
		}
		return true;
	}

	this.canMoveLeft = function(block) {
		if (!block instanceof Block) { throw new Error("Must pass canMoveRight a Block object");}

		var allSquares = block.getAllSquaresOfBlock(block.structure);
		for (i = 0; i < allSquares.length; i++) {
			var x = allSquares[i][0];
			var y = allSquares[i][1];

			if (x < 1) {
				return false;
			}
			if (getSpaceAt(x - 1, y).getOccupied()) {
				return false;
			}
		}
		return true;
	}

	this.canRotate = function(arrayOfSquares) {
		for (i = 0; i < arrayOfSquares.length; i++) {
			var x = arrayOfSquares[i][0];
			var y = arrayOfSquares[i][1];
			if (getSpaceAt(x, y).getOccupied()) {
				return false;
			}
		}
		return true;
	}

	this.addBlock = function(block) {
		if (!block instanceof Block) { throw new Error("Must pass addBlock a Block object");}

		allSquares = block.getAllSquaresOfBlock(block.structure);
		var color = block.color;
		for (i = 0; i < allSquares.length; i++) {
			var s = allSquares[i];
			var x = s[0];
			var y = s[1];
			this.colorSquare(x, y, color);
		}
	}

	var getCompletedRows = function() {
		var completedRows = [];
		for (i = 0; i < board.length; i++) {
			var isComplete = true;
			for (j = 0; j < board[i].length; j++) {
				if (!getSpaceAt(j, i).getOccupied()) {
					isComplete = false;
				}
			}
			if (isComplete) {
				completedRows.push(i);
			}
		}
		return completedRows;
	}

	this.deleteRows = function() {
		var completedRows = getCompletedRows();
		for (i = 0; i < completedRows.length; i++) {
			board.splice(completedRows[i], 1);
			shiftBoardDown(completedRows[i]);
			board.unshift(getNewRow());
			score++;
		}

//		var completedRows = getCompletedRows();
//		for (i = 0; i < completedRows.length; i++) {
//			var rowCompleted = completedRows[i];
//
//			board.splice(rowCompleted, 1);
//			this.shiftBoardDown(rowCompleted);
//		}
//
//
//		for (i = 0 ; i < completedRows.length; i++) {
//			var tempArr = [];
//			for (j = 0; j < cols; j++) {
//				tempArr.push(new Space(j, 0));
//			}
//			board.unshift(tempArr);
//		}
	}

	var shiftBoardDown = function(completedRow) {
		for (i = 0; i < completedRow; i++) {
			for (j = 0; j < cols; j++) {
				getSpaceAt(j, i).shiftDown();
			}
		}
	}

	// IMPLEMENT
	this.gameIsOver = function() {
		if (getSpaceAt(3, 0).getOccupied() || getSpaceAt(3, 0).getOccupied() ||
		    getSpaceAt(3, 0).getOccupied() || getSpaceAt(3, 0).getOccupied()) {
			return true;
		}
		return false;
	}

	this.getScore = function() {
		return score;
	}

	var getNewRow = function() {
		var tempArray = [];
		for (i = 0; i < cols; i++) {
			tempArray.push(new Space(i, 0));
		}
		return tempArray;
	}

    this.drawBoard = function() {
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                var s = getSpaceAt(j, i);
                if (s.getOccupied()) {
					fill(s.getColor());
                    rect(s.getX() * blockSize, s.getY() * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}
