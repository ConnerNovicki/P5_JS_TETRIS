var blockSize = 30;

function Board(numCols, numRows) {

	var board = [];
    var cols = numCols;
    var rows = numRows;

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

		var allSquares = block.getAllSquaresOfBlock();
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

		var allSquares = block.getAllSquaresOfBlock();
		for (i = 0; i < allSquares.length; i++) {
			var x = allSquares[i][0];
			var y = allSquares[i][1];

			if (x > canvasWidth / blockSize - 1) {
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

		var allSquares = block.getAllSquaresOfBlock();
		for (i = 0; i < allSquares.length; i++) {
			var x = allSquares[i][0];
			var y = allSquares[i][1];

			if (x < 0) {
				return false;
			}
			if (getSpaceAt(x - 1, y).getOccupied()) {
				console.log("NO");
				return false;
			}
		}
		return true;
	}

	this.addBlock = function(block) {
		if (!block instanceof Block) { throw new Error("Must pass addBlock a Block object");}

		allSquares = block.getAllSquaresOfBlock();
		var color = block.color;
		for (i = 0; i < allSquares.length; i++) {
			var s = allSquares[i];
			var x = s[0];
			var y = s[1];
			this.colorSquare(x, y, color);
		}
	}

    this.drawBoard = function() {
        for (i = 0; i < board.length; i++) {
            for (j = 0; j < board[i].length; j++) {
                var s = getSpaceAt(j, i);
                if (s.getOccupied()) {
					console.log(s.getColor());
					fill(s.getColor());
                    rect(s.getX() * blockSize, s.getY() * blockSize, blockSize, blockSize);
                }
            }
        }
    }
}
