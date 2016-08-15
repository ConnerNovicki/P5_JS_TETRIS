var blockSize = 30;

var gameActive = false;
var gamePaused = true;

var canvasWidth = 300;
var canvasHeight = 600;
var currBlock;
var numRows = canvasHeight / blockSize;
var numCols = canvasWidth / blockSize;
var board;
var speedMillis = 600;
var speedUpTime = 150;
var time = 0;
var currKey = null;
var prevKey = null;
var previewBlock = null;
var blockLocked = false;
var currGameOver = true;
var sideTimeWait = 100;
var rightTime = 0;
var difficulties = {
    easy: {
        speedMillis: 800,
        speedUpTime: 250,
        sideTimeWait: 125,
        
    }, 
    medium: {
        speedMillis: 400,
        speedUpTime: 125,
        sideTimeWait: 100,
        
    },
    hard: {
        speedMillis: 300,
        speedUpTime: 50,
        sideTimeWait: 75,
        
    }
};
var currDifficulty = difficulties.medium;


function setup() {
    createCanvas(canvasWidth * 2, canvasHeight);
    frameRate(60);
}

function draw() {

    if (!gameActive) {
        drawMainMenu();
        
        return;
    }
    background(50);
    drawSideBar();
    resetDefaultStyles();
    if (gamePaused) {
        currBlock.draw();
        board.drawBoard();
        return;
    }
    resetDefaultStyles();

    // Check for auto move bc time
    if (Math.abs(time - millis()) > currDifficulty.speedMillis) {
        siftBlockDown();
    }

    // Check non-up arrow key pressed
    if (keyIsDown(DOWN_ARROW) || keyIsDown(RIGHT_ARROW) || keyIsDown(LEFT_ARROW)) {
        nonUpKeyPressed();
    }

    updateCanvas();
}

function updateCanvas() {
    if (blockLocked) {
        board.deleteRows();
        blockLocked = false;
    }

    currBlock.draw();
    board.drawBoard();
    if (board.gameIsOver()) {
		currGameOver = true;
        gameOver();
    }
}

function drawMainMenu() {
    background(100);

    // Tetris label
    strokeWeight(4);
    stroke(0, 0, 0);
    fill('white');
    textSize(50);
    text("Tetris", 240, 100);

    // Play box
    rect(200, 200, 200, 100);
    fill('green');
    text("PLAY", 240, 265);
    
    // Diffulcty options
    fill('white');
    rect(100, 400, 100, 50);
    rect(250, 400, 100, 50);
    rect(400, 400, 100, 50);
    if (currDifficulty === difficulties.easy) {
        fill('blue');
        rect(100, 400, 100, 50);
    } else if (currDifficulty === difficulties.medium) {
        fill('blue');
        rect(250, 400, 100, 50);
    } else {
        fill('blue');
        rect(400, 400, 100, 50);
    }
    fill('black');
    strokeWeight(0);
    textSize(20);
    text('easy', 120, 432);
    text('medium', 265, 432);
    text('hard', 430, 432);
}

function drawSideBar() {
    drawPreviewBlock();

    strokeWeight(3);
    stroke(255, 204, 100);
    line(canvasWidth, 0, canvasWidth, canvasHeight);

    strokeWeight(1);
    fill('orange');
    rect(370, 250, 140, 40);
    rect(370, 330, 140, 40);
    rect(370, 410, 140, 40);

    fill(255, 255, 255);
    strokeWeight(1);
    textSize(30);
    textStyle(NORMAL);
    
    fill("white");
    text("Menu", 400, 280);
    text("Reset", 400, 360);
    if (gamePaused) {
        text("Play", 410, 440);
    } else {
        text("Pause", 400, 440);
    }
    
    text("Lines: " + board.getScore(), 400, 510);
    fill(0, 0, 0);
}

function drawPreviewBlock() {
    resetDefaultStyles();
    text("Next Piece", 380, 40);
    previewBlock.draw();
}

function playButtonPressed() {
    if (mouseIsPressed) {
        if (mouseX < 400 && mouseX > 200 && mouseY < 300 && mouseY > 200) {
            return true;
        }
    }
    return false;
}

function resetDefaultStyles() {
    fill(255, 255, 255);
    stroke(255, 255, 255);
    strokeWeight(2);
    textSize(30);
}

function mousePressed() {
	// In main menu
	if (!gameActive) {
		if (mouseX > 200 && mouseX < 400 && mouseY > 200 && mouseY < 300) {
            newGame();
        } else if (mouseX > 100 && mouseX < 200 && mouseY > 400 && mouseY < 450) {
            currDifficulty = difficulties.easy;
        } else if (mouseX > 250 && mouseX < 350 && mouseY > 400 && mouseY < 450) {
            currDifficulty = difficulties.medium;
        } else if (mouseX > 400 && mouseX < 500 && mouseY > 400 && mouseY < 450) {
            currDifficulty = difficulties.hard;
        }
		return;
	}
	
	if (currGameOver) {
		if (mouseIsPressed) {
	        newGame();
	    }
	}
    
	if (mouseX > 370 && mouseX < 510 && mouseY > 250 && mouseY < 290) {
        gameActive = false;
    } else if (mouseX > 370 && mouseX < 510 && mouseY > 330 && mouseY < 370) {
		//RESET GAME
		newGame();
	} else if (mouseX > 370 && mouseX < 510 && mouseY > 410 && mouseY < 450) {
		if (gamePaused) {
			gamePaused = false;
		} else {
			gamePaused = true;
		}
	}
}

function keyPressed() {
    if (currKey !== null) {
        prevKey = currKey;
        currKey = keyCode;
    } else {
        currKey = keyCode;
    }
    leftTime = millis();
    rightTime = millis();

    if (keyCode == LEFT_ARROW) {
        if (board.canMoveLeft(currBlock)) {
            currBlock.moveLeft();
        }
    } else if (keyCode == RIGHT_ARROW) {
        if (board.canMoveRight(currBlock)) {
            currBlock.moveRight();
        }
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
        if (Math.abs(time - millis()) > currDifficulty.speedUpTime) {
            siftBlockDown();
        }
    }
    
    if (keyIsDown(LEFT_ARROW) && keyIsDown(RIGHT_ARROW)) {
        if (currKey == RIGHT_ARROW) {
            if (board.canMoveRight(currBlock) && Math.abs(rightTime - millis()) > currDifficulty.sideTimeWait) {
                currBlock.moveRight();
                rightTime = millis();
            }
        } else if (currKey == LEFT_ARROW) {
            if (board.canMoveLeft(currBlock) && Math.abs(leftTime - millis()) > currDifficulty.sideTimeWait) {
                currBlock.moveLeft();
                leftTime = millis();
            }
        }
    } else {
        if (keyIsDown(LEFT_ARROW)) {
            if (board.canMoveLeft(currBlock) && Math.abs(leftTime - millis()) > currDifficulty.sideTimeWait) {
                currBlock.moveLeft();
                leftTime = millis();
            }
        }
        if (keyIsDown(RIGHT_ARROW)) {
            if (board.canMoveRight(currBlock) && Math.abs(rightTime - millis()) > currDifficulty.sideTimeWait) {
                currBlock.moveRight();
                rightTime = millis();
            }
        }
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
    if (previewBlock !== null) {
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
	currGameOver = false;
}

function gameOver() {
    fill('red');
    rect(150, 200, 300, 200);
    fill('black');
    stroke(3);
    text('Game Over', 220, 300);
	
	stroke(2);
	text('Click for new game', 180, 350);
}

function siftBlockDown() {
    if (board.canFallDown(currBlock)) {
        currBlock.siftDown();
    } else  {
        board.addBlock(currBlock);
        blockLocked = true;
        currBlock = null;
        setNewBlock();
    }
    time = millis();
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