//state trackers
var ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var flipped;
var buttsFlipped;
var mobile = true;
var fullS = false;
var scrollAmt = 150;
var SELECT_ZOOM_COL = [0,0];
var paused = 0;
var numX = 4;
var numY = 6;

//screen object 
var scrn = {
	L: 0,
	T: 0,
	W: 0,
	H: 0,
	maj: 0,
	min: 0, 
	but: 0,
	box: 0,
	sq: 0,
	sqReduc: 0,
	sqOff: 0,
	butX: 0,
	butY: 0,
	sx: 0,
	sy: 0,
	tx: 0,
	ty: 0
}


//player object
var player = {
	pos: [2,3]
}

//click goal object
var click = {
	act: null,
	butInd: null,
	start : [0,0],
	end: [0,0],
	theta: 0,
	thetaQ: 0,
	dist: 0,
	del: [0,0],
	sect: 0
};


var pos = [0,0];
var act = null;
var squares = 0;
var canv = [];
var cx = [];

