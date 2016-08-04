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

function setup() {
    createCanvas(canvasWidth * 2, canvasHeight);
    board = new Board(numCols, numRows);
	getNewBlock();
	frameRate(10);
}

function draw() {
    background(50);

	// Draw right menu
	drawMenu();
	checkMousePos();

	resetDefaultStyles();
    if (currBlock == null) {
        getNewBlock();
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
			getNewBlock();
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
	strokeWeight(4);
	stroke(255, 204, 100);
	line(canvasWidth, 0, canvasWidth, canvasHeight);

	fill(resetBoxColor);
	rect(370, 270, 140, 40);

	fill(255, 255, 255);
	strokeWeight(1);
	textSize(30);
	textStyle(NORMAL);
	text("Score: " + board.getScore(), 400, 100);
	fill(resetTextColor);
	text("Reset", 400, 300);
}

function resetDefaultStyles() {
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
			getNewBlock();
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
