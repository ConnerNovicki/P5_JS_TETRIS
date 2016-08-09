var blockSize = 30;

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
var resetTextColor = 'white';
var resetBoxColor = 'orange';
var previewBlock = null;

function setup() {
    createCanvas(canvasWidth * 2, canvasHeight);
    board = new Board(numCols, numRows);
	setNewBlock();
	frameRate(10);
}

function draw() {
    background(50);

	// Draw right menu
	drawMenu();
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
			board.deleteRows();
			currBlock = null;
			setNewBlock();
		}
		time = millis();
	}


	if (keyIsDown(DOWN_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) {
		nonUpKeyPressed();
	}

    currBlock.draw();
    board.drawBoard();
	if (board.gameIsOver()) {
		console.log('GAME OVER');
	}
}

function drawMenu() {
    drawPreviewBlock();

	strokeWeight(4);
	stroke(255, 204, 100);
	line(canvasWidth, 0, canvasWidth, canvasHeight);

	fill(resetBoxColor);
	rect(370, 270, 140, 40);

	fill("orange");
	rect(370, 350, 140, 40);

	fill(255, 255, 255);
	strokeWeight(1);
	textSize(30);
	textStyle(NORMAL);
	text("Lines: " + board.getScore(), 400, 500);
	fill(resetTextColor);
	text("Reset", 400, 300);
	fill("white");
	text("Pause", 400, 380);
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
	if (mouseX > 400 && mouseX < 550 && mouseY > 275 && mouseY < 325) {
		resetTextColor = 'red';
		resetBoxColor = 'blue';
		if (mouseIsPressed) {
			//RESET GAME
			console.log("reset");
		}
	} else {
		resetBoxColor = 'orange';
		resetTextColor = 'white';
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
	if (currKey == RIGHT_ARROW) {
		if (board.canMoveRight(currBlock)) {
			currBlock.moveRight();
		}
	} else if (currKey == LEFT_ARROW) {
		if (board.canMoveLeft(currBlock)) {
			currBlock.moveLeft();
		}
	} else if (currKey == DOWN_ARROW) {
		if (board.canFallDown(currBlock)) {
			currBlock.siftDown();
		} else {
			board.addBlock(currBlock);
			board.deleteRows();
			currBlock = null;
			setNewBlock();
		}
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
        currBlock.setAnchorSpace(new Space(3, 0));
    } else {
        currBlock = getNewBlock(3, 0);
    }
    previewBlock = getNewBlock(14, 2);
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
