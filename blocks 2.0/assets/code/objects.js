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
var HINT_IND = 0;
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
	butOff: [0,0],
	sx: 0,
	sy: 0,
	tx: 0,
	ty: 0,
	targetR: 1,
	centerX: 0,
	centerY: 0,
	radius: 1,
	r1: blockDepth/(-z_min),
	r2: 1 - (blockDepth/(-z_min)),
}


//level
var level = {
	drawn: false,
	index: -1,
	size: [],
	playerStart: [],
	moves: 0,
	squares: []
}

function nextLevel() 
{
	if (level.index >= GAME_LEVELS.length - 1) 
	{
		alert("you win");
		gameOver = true;
		return;
	}
	
	click.act = null;
	killXY();
	
	//killAll();

	level.index += 1;
	
	
	var curLevel = GAME_LEVELS[level.index];
	level.size = [curLevel.map[0].length, curLevel.map.length];
	level.moves = curLevel.moves;
	player.movesLeft = level.moves;
	player.history = [];
	level.playerStart = vectorCopy(curLevel.player);
	
	
	if([BURNING, FALLING, DEAD].includes(player.state))
	{
		player.state = IDLE;
		killAll();
	}
	
	//get the level map
	level.squares = [];
	level.portals = [];
	level.animators = [];
	
	for(var y = 0; y < level.size[1]; y += 1) 
	{
		var row = [];
		for(var x = 0; x < level.size[0]; x += 1)
		{
			var square = sqCodes[curLevel.map[y][x]];
			row.push(square);
			if(square == Portal) level.portals.push([x, y]);
			
			
			if(square.animate !== null)
			{
				//console.log("anim", square.animate);
				level.animators.push({ind_x: x, ind_y: y, time: 0, ind: square.animate.minInd, animate: square.animate});
				
			}
		}
		level.squares.push(row);
	}
	//console.log(level.animators);
	level.drawn = false;
	player.goalLoops = 0;
	console.log("made the level: ", level.size, level.squares[0].length, level.squares.length);

	lastTime = new Date();
	return true;
}



//player object
var player = {
	img: null,
	state: IDLE,
	
	//xy motion
	pos: [2,3],
	vel: [0,0],
	target: [0,0], //probably not necessary once changes are in place
	targetPhase: 0,
	lastMatchPos: [2,3],
	history: [],
	rewindPos: [0,0],
	
	//z motion (jump/fall)
	z: 0,
	z_vel: 0,
	accel: z_accel,
	jumping: false, //probably not necessary once changes are in place
	
	//3d stuff
	r1: playerThickness/(-z_min),
	r2: 1 - (playerThickness/(-z_min)),
	radius: (scrn.sq * playerSize/2)/(Math.sin(Pi_4)),
	
	//rotation
	theta: 0,
	omega: 0,
	alpha: 1, 
	spinDir: 1,
	
	//fading
	opacity: 1,
	opacity_rate: 1,
	
	//winning
	goalLoops: 0,
	
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


function setSquareAction()
{
	if(onBoard(player.pos))
	{
		level.squares[player.pos[1]][player.pos[0]].act();
	}
	else
	{
		player.jumping = false;
	}
	
}


function updatePlayer(elapsed)
{
	if(player.state == REWIND)
	{
		player.pos[0] += (player.rewindPos[0] - player.pos[0]) * rewindRate;
		player.pos[1] += (player.rewindPos[1] - player.pos[1]) * rewindRate;
		player.z += -player.z * rewindRate;
		player.theta -= player.theta * rewindRate;
		player.opacity += (1 - player.opacity) * rewindRate;
		
		if(vectorEqual(player.pos, player.rewindPos, closeLimit) && player.z > -closeLimit && player.z < closeLimit)
		{
			player.pos = vectorCopy(player.rewindPos);
			killAll();
		}
	}
	else
	{
				
		//update xy
		player.pos[0] += elapsed * player.vel[0];
		player.pos[1] += elapsed * player.vel[1];
		
		var on_board = onBoard();
		if(!on_board && player.state !== FALLING)
		{
			player.state = FALLING;
			startFade(opacity_rate_fall);
		}
		
		//update z
		player.z_vel += elapsed * player.accel;
		player.z_vel = Math.max(-z_vel_init, player.z_vel);
		player.z += elapsed * player.z_vel;
		//console.log(player.z);
		if(player.state !== FALLING)
		{
			player.z = Math.max(0, player.z);
			
		}
		else
		{
			if(player.z <= fallLimit)
			{
				player.z = fallLimit;
				killXY();
				killSpin();
			}
		}
		//update angle
		var start_omega = player.omega;
		player.omega *= player.alpha;
		player.theta += elapsed * player.omega * player.spinDir;
		
		//update fade
		player.opacity *= player.opacity_rate;

		//top of winning jump: load next level
		if(player.state == WINNING && !gameOver && player.z >= playerLoadHeight)
		{
			player.state = ACTIVE;
			nextLevel();
		}
		
		//check for landing on a square
		if([ACTIVE, WINNING].includes(player.state) && player.z == 0)
		{
			//reset accel in case winning was active
			player.accel = z_accel;
			
			if(player.jumping == false && player.z == 0)
			{
				player.z_vel = 0;
			}
			
			//see how far we've moved from the last known square
			dist = absVector(vectorSubtract(player.pos, player.lastMatchPos));
		
			//landed from a jump or slid to a new square
			if(player.jumping || dist[0] >= 1 || dist[1] >= 1)
			{
				player.pos = roundVector(player.pos);
				if(on_board)
				{
					if(player.history.length) setSquareAction();
					else killAll();
					player.lastMatchPos = vectorCopy(player.pos);
					
				}
				/* else
				{
					player.state = FALLING;
					startFade();
				} */
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
		ret = true;
		//if(!Number.isInteger(newPos[0]) || !Number.isInteger(newPos[1]) || level.squares[newPos[1]][newPos[0]] !== EmptySquare) ret = true;
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

function playerIdle()
{
	return player.state == IDLE && !outOfMoves();
}

function failed()
{
	return [FALLING, BURNING, DEAD].includes(player.state) || (outOfMoves() && !([ACTIVE, WINNING].includes(player.state)));
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
	player.omega = 0;
	player.alpha = 1;
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
	player.jumping = false;
}

function startFade(rate = opacity_rate_init)
{
	player.opacity_rate = rate;
}

function startSpin(spinVel = omega_init)
{
	player.omega = spinVel;
	player.alpha = 1;
	player.spinDir = -player.spinDir;
}

function slowSpin(alpha = alpha_slow)
{
	player.alpha = alpha;
}

function startJump(jumpVel = z_vel_init, spinVel = omega_init)
{
	player.z_vel = jumpVel;
	player.jumping = true;
	player.vel[0] += player.target[0] / playerMillis;
	player.vel[1] += player.target[1] / playerMillis;
	player.target = zeroVector();
	startSpin(spinVel);
	if(jumpVel < z_vel_init_goal) player.state = ACTIVE;
}



