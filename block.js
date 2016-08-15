var blockSize = 30;

function inheritsFrom(child, parent) {
    child.prototype = Object.create(parent.prototype);
}

function Block(space) {
    if (!(space instanceof Space)) {
        throw new Error('Wrong parameter!');
    }
    // private
    var anchorSpace = space;


    // public
	this.rightMost = 0;
	this.leftMost = 0;
    this.structure = [[]];
	this.color = color(26, 0, 255);

    this.getAnchorSpace = function() {
        return anchorSpace;
    };

    this.setAnchorSpace = function(space) {
        anchorSpace = space;
    };

	this.siftDown = function() {
		anchorSpace = new Space(anchorSpace.getX(), anchorSpace.getY() + 1);
	};

	this.moveRight = function() {
		anchorSpace = new Space(anchorSpace.getX() + 1, anchorSpace.getY());
	};

    this.moveLeft = function() {
		anchorSpace = new Space(anchorSpace.getX() - 1, anchorSpace.getY());
	};

	this._getNextVariation = function(numVars, allStructs, currVar) {
		var variation;
		if (numVars == 4) {
			switch (this.currVar) {
				case allStructs.var1:
					variation = allStructs.var2;
					break;
				case allStructs.var2:
					variation = allStructs.var3;
					break;
				case allStructs.var3:
					variation = allStructs.var4;
					break;
				case allStructs.var4:
					variation = allStructs.var1;
					break;
			}
		} else {
			switch (this.currVar) {
				case allStructs.var1:
					variation = allStructs.var2;
					break;
				case allStructs.var2:
					variation = allStructs.var1;
					break;
				}
			}
		return variation;
	};

	this.rotateBlock = function(numVars, allStructs, currVar) {
		var variation = this._getNextVariation(numVars, allStructs, currVar);
		this.currVar = variation;
		this.structure = this.currVar.s;
		this.rightMost = this.currVar.rmost;
		this.leftMost = this.currVar.lmost;
	};

	this.getAllSquaresOfBlock = function(structure) {
		// Returns array of [x, y] arrays
		var allSquares = [];
		for (i = 0; i < structure.length; i++) {
			for (j = 0; j < structure[i].length; j++) {
				if (structure[i][j] == 1) {
					var space = this.getAnchorSpace();
					allSquares.push([space.getX() + j, space.getY() + i]);
				}
			}
		}
		return allSquares;
	};
	
	this.instaLockBlock = function() {
		var origAnchor = this.getAnchorSpace();
		while (board.canFallDown(this)) {
			this.siftDown();
		} 
		var squares = this.getAllSquaresOfBlock(this.structure);
		for (i = 0; i < squares.length; i++) {
			stroke(this.color);
			fill(69);
			rect(squares[i][0] * blockSize, squares[i][1] * blockSize, blockSize, blockSize);
		}
		stroke('white');
	}
	
	this.drawFallenBlock = function(board) {
		var origAnchor = this.getAnchorSpace();
		while (board.canFallDown(this)) {
			this.siftDown();
		} 
		var squares = this.getAllSquaresOfBlock(this.structure);
		for (i = 0; i < squares.length; i++) {
			stroke(this.color);
			fill(69);
			rect(squares[i][0] * blockSize, squares[i][1] * blockSize, blockSize, blockSize);
		}
		this.setAnchorSpace(origAnchor);
		stroke('white');
	};

    this.draw = function() {
		var squares = this.getAllSquaresOfBlock(this.structure);
		for (i = 0; i < squares.length; i++) {
			fill(this.color);
			rect(squares[i][0] * blockSize, squares[i][1] * blockSize, blockSize, blockSize);
		}
  };
}



function SquareBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(255, 0, 0); // RED

    this.structure = [[1, 1],
                      [1, 1]];

	this.rightMost = 1;
	this.leftMost = 0;

	this.rotate = function() {
		return;
	};

	this.getNextVariation = function() {
		return {
			s: [[1, 1],
                 [1, 1]],
			rMost: 1,
			lMost: 0
		};
	};
}

function LBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(26, 0, 255); // BLUE

	var allStructs = {
		var1: {
			s: [[1, 0],
          [1, 0],
          [1, 1]],
			rMost: 1,
			lMost: 0
		},
		var2: {
			
			s: [[1, 1, 1],
          [1, 0, 0]],
			rMost: 2,
			lMost: 0
		},
		var3: {
			s: [[1, 1],
         [0, 1],
         [0, 1]],
			rMost: 1,
			lMost: 0
		},
		var4: {
			s: [[0, 0, 1],
          [1, 1, 1]],

			rMost: 2,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
    this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 4;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};
}

function BLBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(0, 153, 0); // GREEN

	var allStructs = {
		var1: {
			s: [[1, 1],
          [1, 0],
          [1, 0]],

			rMost: 1,
			lMost: 0
		},
		var2: {
			s: [[1, 1, 1],
          [0, 0, 1]],

			rMost: 2,
			lMost: 0
		},
		var3: {
			s: [[0, 1],
          [0, 1],
          [1, 1]],
			rMost: 1,
			lMost: 0
		},
		var4: {
			s: [[1, 0, 0],
          [1, 1, 1]],
			rMost: 2,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
    this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 4;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};
}

function LineBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(0, 0, 0); // WHITE

	var allStructs = {
		var1: {
			s: [[0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
		    	[0, 1, 0, 0]],
			rMost: 1,
			lMost: 1
		},
		var2: {
			s: [[0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
				  [0, 0, 0, 0]],
			rMost: 3,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
    this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 2;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};

}

function ZBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(255, 153, 51); // ORANGE

	var allStructs = {
		var1: {
			s: [[0, 1, 1],
          [1, 1, 0]],
			rMost: 2,
			lMost: 0
		},
		var2: {
			s: [[1, 0],
			    [1, 1],
			    [0, 1]],
			rMost: 1,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
  this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 2;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};
}

function BZBlock(space) {
    // Call parent constructor
    Block.call(this, space);

	this.color = color(76, 0, 153); // PURPLE

	var allStructs = {
		var1: {
			s: [[1, 1, 0],
          [0, 1, 1]],
			rMost: 2,
			lMost: 0
		},
		var2: {
			s: [[0, 1],
			    [1, 1],
			    [1, 0]],
			rMost: 1,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
    this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 2;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};
}

function TBlock(space) {
	Block.call(this, space);

	this.color = color(0, 255, 255);

	var allStructs = {
		var1: {
			s: [[1, 0],
                [1, 1],
                [1, 0]],
			rMost: 1,
			lMost: 0
		},
		var2: {
			s: [[1, 1, 1],
                [0, 1, 0]],

			rMost: 2,
			lMost: 0
		},
		var3: {
			s: [[0, 1],
                [1, 1],
                [0, 1]],
			rMost: 1,
			lMost: 0
		},
		var4: {
			s: [[0, 1, 0],
                [1, 1, 1]],
			rMost: 2,
			lMost: 0
		}
	};

	this.currVar = allStructs.var1;
  this.structure = this.currVar.s;
	this.rightMost = this.currVar.rMost;
	this.leftMost = this.currVar.lMost;
	this.numVariations = 4;

	this.getNextVariation = function() {
		return this._getNextVariation(this.numVariations, allStructs, this.currVar);
	};

	this.rotate = function() {
		this.rotateBlock(this.numVariations, allStructs, this.currVar);
	};
}



inheritsFrom(SquareBlock, Block);
inheritsFrom(LBlock, Block);
inheritsFrom(BLBlock, Block);
inheritsFrom(LineBlock, Block);
inheritsFrom(ZBlock, Block);
inheritsFrom(BZBlock, Block);
inheritsFrom(TBlock, Block);
