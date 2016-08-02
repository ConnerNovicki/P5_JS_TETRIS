var blockSize = 30;

var canvasWidth = 300;
var canvasHeight = 600;
var currBlock;
var numRows = canvasHeight / blockSize;
var numCols = canvasWidth / blockSize;
var board;
var speedMillis = 500;
var time = 0;

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    board = new Board(numCols, numRows);
	getNewBlock();

}

function draw() {
    background(50);
    if (currBlock == null) {
        getNewBlock();
    }

	// Check for auto move bc time
	if (Math.abs(time - millis()) > speedMillis) {
		//TODO : FIXME
		if (board.canFallDown(currBlock)) {
			currBlock.siftDown();
		} else {
			board.addBlock(currBlock);
			currBlock = null;
			getNewBlock();
		}
		time = millis();
	}

	//
    currBlock.draw();
    board.drawBoard();
}

function keyPressed() {
	if (keyCode == RIGHT_ARROW) {
		if (board.canMoveRight(currBlock)) {
			currBlock.moveRight();
		}
	} else if (keyCode == LEFT_ARROW) {
		if (board.canMoveLeft(currBlock)) {
			currBlock.moveLeft();
		}
	} else if (keyCode == DOWN_ARROW) {
		if (board.canFallDown(currBlock)) {
			currBlock.siftDown();
		} else {
			board.addBlock(currBlock);
			currBlock = null;
			getNewBlock();
		}
	} else if (keyCode == UP_ARROW) {
		currBlock.rotate();
	}
}

function getNewBlock() {
	time = millis();
    var choice = Math.floor(Math.random() * 7);
    switch (choice) {
        case 1:
            currBlock = new SquareBlock(new Space(3, 0));
			break;

		case 2:
			currBlock = new BLBlock(new Space(3, 0));
			break;

		case 3:
			currBlock = new LineBlock(new Space(3, 0));
			break;

		case 4:
			currBlock = new ZBlock(new Space(3, 0));
			break;

		case 5:
			currBlock = new BZBlock(new Space(3, 0));
			break;

		case 6:
			currBlock = new TBlock(new Space(3, 0));
			break;

		default:
			currBlock = new LBlock(new Space(3, 0));
			break;
    }
}
