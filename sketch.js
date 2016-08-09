var blockSize = 30;

var gameActive = false;
var gamePaused = true;

var canvasWidth = 300;
var canvasHeight = 600;
var currBlock;
var numRows = canvasHeight / blockSize;
var numCols = canvasWidth / blockSize;
var board;
var speedMillis = 500;
var speedUpTime = 100;
var time = 0;
var currKey = null;
var prevKey = null;
var previewBlock = null;
var blockLocked = false;

function setup() {
    createCanvas(canvasWidth * 2, canvasHeight);
	frameRate(10);
}

function draw() {

	if (!gameActive) {
		drawMainMenu();
		if (playButtonPressed()) {
			newGame();
		}
		return;
	}

	if (gamePaused) {
		currBlock.draw();
		board.drawBoard();
		checkMousePos();
		return;
	}

    background(50);

	// Draw right menu
	drawSideBar();
	checkMousePos();

	resetDefaultStyles();
    if (currBlock == null) {
        setNewBlock();
    }

	// Check for auto move bc time
	if (Math.abs(time - millis()) > speedMillis) {
		fastTime = millis();
		if (board.canFallDown(currBlock)) {
			currBlock.siftDown();
		} else {
			board.addBlock(currBlock);
			blockLocked = true;
			currBlock = null;
			setNewBlock();
		}
		time = millis();
	}


	if (keyIsDown(DOWN_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) {
		nonUpKeyPressed();
	}

	if (blockLocked) {
		board.deleteRows();
		blockLocked = false;
	}

    currBlock.draw();
    board.drawBoard();
	if (board.gameIsOver()) {
		gameOver();
		console.log('GAME OVER');
	}
}

function drawMainMenu() {
	background(100);

	// Tetris label
	strokeWeight(4);
	stroke(0, 0, 0);
	fill(53, 25, 33);
	textSize(50);
	text("Tetris", 240, 100);

	// Play box
	fill('white');
	rect(200, 200, 200, 100);
	text("PLAY", 240, 265);

}

function drawSideBar() {
    drawPreviewBlock();

	strokeWeight(4);
	stroke(255, 204, 100);
	line(canvasWidth, 0, canvasWidth, canvasHeight);

	fill('orange');
	rect(370, 270, 140, 40);
	rect(370, 350, 140, 40);

	fill(255, 255, 255);
	strokeWeight(1);
	textSize(30);
	textStyle(NORMAL);
	text("Lines: " + board.getScore(), 400, 500);
	fill(0, 0, 0);
	text("Reset", 400, 300);
	fill("black");
	text("Pause", 400, 380);
}

function playButtonPressed() {
	if (mouseIsPressed) {
		if (mouseX < 400 && mouseX > 200 && mouseY < 300 && mouseY > 200) {
			return true;
		}
	}
	return false;
}

function drawPreviewBlock() {
	resetDefaultStyles();
	text("Next Piece", 380, 40)
    previewBlock.draw();
}

function resetDefaultStyles() {
	fill(255, 255, 255);
	stroke(255, 255, 255);
	strokeWeight(2);
}

function checkMousePos() {
	if (mouseIsPressed) {
		if (mouseX > 370 && mouseX < 510 && mouseY > 270 && mouseY < 310) {
			//RESET GAME
			newGame();
		} else if (mouseX > 370 && mouseX < 510 && mouseY > 350 && mouseY < 390) {
			if (gamePaused) {
				gamePaused = false;
			} else {
				gamePaused = true;
			}
		}
	}
}

function keyPressed() {
	if (currKey != null){
		prevKey = currKey;
		currKey = keyCode;
	} else {
		currKey = keyCode;
	}

	if (currKey == UP_ARROW) {
		// Check if block can rotate
		var newStructure = currBlock.getNextVariation().s;
		var blocks = currBlock.getAllSquaresOfBlock(newStructure);
		if (board.canRotate(blocks)) {
			currBlock.rotate();
		}
	}
}

function nonUpKeyPressed() {
	if (keyIsDown(DOWN_ARROW)) {
		if (board.canFallDown(currBlock)) {
			currBlock.siftDown();
		} else {
			board.addBlock(currBlock);
			board.deleteRows();
			currBlock = null;
			setNewBlock();
		}

	}
	if (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW)) {
		if (currKey == RIGHT_ARROW) {
			if (board.canMoveRight(currBlock)) {
				currBlock.moveRight();
			}
		}
	} else {

	if (keyIsDown(LEFT_ARROW)) {
		if (board.canMoveLeft(currBlock)) {
			currBlock.moveLeft();
		}
	} if (keyIsDown(RIGHT_ARROW)) {
		if (board.canMoveRight(currBlock)) {
			currBlock.moveRight();
		}
	}

//	if (currKey == RIGHT_ARROW) {
//		if (board.canMoveRight(currBlock)) {
//			currBlock.moveRight();
//		}
//	} if (currKey == LEFT_ARROW) {
//		if (board.canMoveLeft(currBlock)) {
//			currBlock.moveLeft();
//		}
//	} if (currKey == DOWN_ARROW) {
//		if (board.canFallDown(currBlock)) {
//			currBlock.siftDown();
//		} else {
//			board.addBlock(currBlock);
//			board.deleteRows();
//			currBlock = null;
//			setNewBlock();
//		}
		time = millis();
	}
}

function keyReleased() {

	if (keyIsDown(RIGHT_ARROW)) {
		currKey = RIGHT_ARROW;
	} else if (keyIsDown(LEFT_ARROW)) {
		currKey = LEFT_ARROW;
	} else if (keyIsDown(DOWN_ARROW)) {
		currKey = DOWN_ARROW;
	}
}

function setNewBlock() {
    time = millis();
    if (previewBlock != null) {
        currBlock = previewBlock;
        currBlock.setAnchorSpace(new Space(4, 0));
    } else {
        currBlock = getNewBlock(4, 0);
    }
    previewBlock = getNewBlock(14, 2);
}

function newGame() {
	gameActive = true;
	board = new Board(numCols, numRows);
	setNewBlock();
	gamePaused = false;
}

function gameOver() {
	fill('white');
	rect(150, 200, 300, 200);
	fill('black');
	stroke(3);
	text('Game Over', 220, 300);
	if (mouseIsPressed) {
		newGame();
	}
}

function getNewBlock(x, y) {
    var choice = Math.floor(Math.random() * 7);
    var block;
    switch (choice) {
        case 1:
            block = new SquareBlock(new Space(x, y));
			break;

		case 2:
			block = new BLBlock(new Space(x, y));
			break;

		case 3:
			block = new LineBlock(new Space(x, y));
			break;

		case 4:
			block = new ZBlock(new Space(x, y));
			break;

		case 5:
			block = new BZBlock(new Space(x, y));
			break;

		case 6:
			block = new TBlock(new Space(x, y));
			break;

		default:
			block = new LBlock(new Space(x, y));
			break;
    }
    return block;
}
