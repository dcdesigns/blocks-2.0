//state trackers
var ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var flipped;
var buttsFlipped;
var mobile = true;
var fullS = false;
var scrollAmt = 150;
var SELECT_ZOOM_COL = [0,0];
var MOVES_DISPLAY = 0;
var UNDO_IND = 0;
var RESTART_IND = 0;
var paused = 0;


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
	img: null,
	state: IDLE,
	history: [],
	
	
	//xy motion
	pos: [2,3],
	vel: [0,0],
	target: [0,0], //probably not necessary once changes are in place
	lastMatchPos: [2,3],
	
	//z motion (jump/fall)
	z: 0,
	z_vel: 0,
	
	jumping: false, //probably not necessary once changes are in place
	
	
	//rotation
	theta: 0,
	omega: 0,
	alpha: 1, 
	
	
	
	spinning: false, //probably not necessary once changes are in place
	
	//fading
	opacity: 1,
	opacity_rate: 1,
	
	
	//winning
	goalLoops: 0,
	
	
	//probably not necessary once changes are in place
	moveMillis: playerMillis,
	nowMillis: 0,
	
	
	
	
}


//click goal object
var click = {
	act: null,
	butInd: null,
	start : [-1, -1],
	end: [0,0],
	theta: 0,
	thetaQ: 0,
	dist: 0,
	delta: [0,0],
	sect: 0
};

//level
var level = {
	drawn: false,
	index: -1,
	size: [],
	playerStart: [],
	moves: 0,
	squares: []
}

var pos = [0,0];
var act = null;
var squares = 0;

function updatePlayer(elapsed)
{
	//update xy
	player.pos[0] += elapsed * player.vel[0];
	player.pos[1] += elapsed * player.vel[1];
	
	var on_board = onBoard();
	if(!on_board) console.log("off");
	
	//update z
	player.z_vel += elapsed * z_accel;
	player.z += elapsed * player.z_vel;
	if(player.state !== FALLING) player.z = Math.max(0, player.z);
	else player.z = Math.max(z_min, player.z);
	
	//update angle
	var start_omega = player.omega;
	player.omega *= player.alpha;
	/* if(player.omega < 0) 
	{
		killSpin();
	} */
	player.theta += elapsed * player.omega;
	
	//update fade
	player.opacity *= player.opacity_rate;
	//player.opacity = Math.max(0, player.opacity);
	
	//check for landing on a square
	if([ACTIVE, WINNING].includes(player.state) && player.z == 0)
	{
		dist = absVector(vectorSubtract(player.pos, player.lastMatchPos));
		console.log("maybe landed");
		if(player.jumping || dist[0] >= 1 || dist[1] >= 1)
		{
			console.log("landed");
			player.pos = roundVector(player.pos);
			//player.jumping = false;
			if(on_board)
			{
				setSquareAction();
				player.lastMatchPos = vectorCopy(player.pos);
			}
			else
			{
				player.state = FALLING;
				startFade();
			}
		}
	}
}
			
	

 function onBoard(pos = player.pos, delta = [0,0])
 {
	var newPos = vectorAdd(pos, delta);
	var ret = false;
	
	
	
	if((newPos[0] > -boardBuffer) && (newPos[0] < level.size[0] - 1 + boardBuffer) && (newPos[1] > -boardBuffer) && newPos[1] < (level.size[1] - 1 + boardBuffer))
	{
		//console.log(-boardBuffer, level.size[0] + boardBuffer, level.size[1] + boardBuffer, newPos[0], newPos[1]);
		ret = true;
	}
	return ret;
 }


function playerActive()
{
	return [WINNING, ACTIVE].includes(player.state);
}

function outOfMoves()
{
	return player.history.length >= level.moves;
}


function killXY()
{
	player.vel = zeroVector();
	player.target = zeroVector();
	
	
}

function killZ()
{
	player.z = 0;
	player.z_vel = 0;
	player.jumping = false;
}

function killSpin()
{
	//player.theta = 0;
	player.omega = 0;
	player.alpha = 1;
	player.spinning = false;
}

function killFade()
{
	player.opacity = 1;
	player.opacity_rate = 1;
	player.fading = false;
}

function killAll()
{
	killXY();
	killZ();
	killSpin();
	killFade();
	player.theta = 0;

	player.state = IDLE;
}

function startFade()
{
	player.opacity_rate = opacity_rate_init;
}

function startSpin()
{
	player.omega = omega_init;
	player.alpha = 1;
}

function slowSpin()
{
	player.alpha = alpha_slow;
}

function startJump(jumpVel = z_vel_init)
{
	player.z_vel = jumpVel;
	player.jumping = true;
	player.vel[0] += player.target[0] / playerMillis;
	player.vel[1] += player.target[1] / playerMillis;
	player.target = zeroVector();
	startSpin();
	if(jumpVel < z_vel_init_goal) player.state = ACTIVE;
}

function limitZ()
{
	if(player.z < 0 && onBoard())
	{
		killZ();
	}
}

/* function startXY()
{
	player.vel[0] += player.target[0] / playerMillis;
	player.vel[1] += player.target[0] / playerMillis;
} */

