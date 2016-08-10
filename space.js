var blockSize = 30;

function Space(x, y) {
    var occupied = false;
    this.color = 0;

    this.getX = function() {
        return x;
    };

    this.getY = function() {
        return y;
    };

    this.getCoordinates = function() {
        return [x, y];
    };

    this.getOccupied = function() {
        return occupied;
    };

    this.getColor = function() {
        return this.color;
    };

	this.addBlock = function(clr) {
		this.color = clr;
		occupied = true;
	};

	this.shiftDown = function() {
		y++;
	};
}
