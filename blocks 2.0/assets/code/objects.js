//state trackers
var ios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var flipped;
var buttsFlipped;
var mobile = true;
var pointerEvts = false;
var fullS = false;
var scrollAmt = 150;
var SELECT_ZOOM_COL = [0,0];
var MOVES_DISPLAY = 0;
var UNDO_IND = 0;
var RESTART_IND = 0;
var HINT_IND = 0;
var MUTE_IND = 0;
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
	level.timers = [];
	level.triggers = [];
	level.activators = [];
	level.portals = [];
	//level.toggles = [];
	level.laserMatch = null;
	level.laserFrames = 0;
	level.someChange = false;
	level.locked = false;
	level.locks = [];
	level.initLocked = false;
	level.activated = 0;
	level.goal = {x: 0, y: 0};
	
	
	if(isDefined(curLevel.specialCodes))
	{
		var backSnd = null;
		for(var i = 0; i < curLevel.specialCodes.length; i += 1)
		{
			//portal: {x, y, type (a or b), portalGroup (0,1,2)}
			//timer: {x,y, timer, time, direction, inc (1 or 2), ind, init, sound}
			//trig: {x,y, direction, inc (1 or 2), ind, init, any: (true or false), sound}
			var special = curLevel.specialCodes[i];
			//console.log("special", special);
			//portal
			if(isDefined(special.portalGroup))
			{
				level.portals.push(special);
				//console.log("portal", special);
			}
			//trigger/timer tramps
			else
			{
				var copied = {};
				var sq = sqCodes[curLevel.map[special.y][special.x]]
				var group = getGroup(sq);
				if(group == null) continue;
				
				var ind = groupIndex(group, sq);
				copied.x = special.x;
				copied.y = special.y;
				copied.ind = ind;
				copied.init = ind;
				copied.direction = special.direction.direction;
				copied.inc = special.inc.inc;
				copied.group = group;
				
				
				//trigger tramp
				if(isDefined(special.trigger))
				{
					copied.any = special.trigger.any;
					copied.trigger = special.trigger.trigger;
					if(isDefined(special.trigger.sound))
					{
						copied.sound = special.trigger.sound;
					}
					if(isDefined(special.trigger.onOff))
					{
						copied.onOff = special.trigger.onOff;
					}
					
					level.triggers.push(copied);
					//console.log("trig", copied);
				}
				else if(isDefined(special.timer))
				{
					copied.time = 0;
					if(isDefined(special.timer.sound))
					{
						copied.sound = special.timer.sound;
						backSnd = copied.sound;
					}
					copied.limit = special.timer.limit;
					level.timers.push(copied);
					
					//console.log("timer", copied);
					
				}
			}
		}
		if(backSnd != null)
		{
			playSound(BACK_SOUNDS, backSnd);
		}
	}
	for(var i = 0; i < level.portals.length; i += 1)
	{
		if(!isDefined(level.portals[i].pair))
		{
			var found = false;
			for(var j = i + 1; j < level.portals.length; j += 1)
			{
				if(level.portals[i].type == level.portals[j].type && level.portals[i].portalGroup == level.portals[j].portalGroup)
				{
					level.portals[i].pair = [level.portals[j].x, level.portals[j].y];
					level.portals[j].pair = [level.portals[i].x, level.portals[i].y];
					found = true;
					break;
				}
			}
			if(!found)
			{
				level.portals[i].pair = [level.portals[i].x, level.portals[i].y];
			}
			//console.log("portal post", level.portals[i]);
		}
	}
				
	for(var y = 0; y < level.size[1]; y += 1) 
	{
		var row = [];
		for(var x = 0; x < level.size[0]; x += 1)
		{
			var square = sqCodes[curLevel.map[y][x]];
			if(square == Locked)
			{
				level.locked = true;
				level.initLocked = true;
			}
			else if(square == Activated || square == UnActivated)
			{
				var ind = (square == Activated) ? 1: 0;
				level.activators.push({x: x, y: y, ind: ind, init: ind});
				level.activated += ind;
			}
			else if(square == Goal)
			{
				level.goal = {x: x, y: y};
			}
			/* if(square == Laser)
			{
				level.lasers.push({pos: [x,y], on: false});
			} */
/* 			console.log("xy", x, y, "code", curLevel.map[y][x], "square", square);
			if(isDefined(square.animate) == "undefined")  */
			if(isDefined(square.animate) && square.animate !== null)
			{
				level.animators.push({ind_x: x, ind_y: y, time: 0, ind: square.animate.minInd, animate: square.animate});
			}

			/* if(isLaserOrCover(square))
			{
				level.toggles.push({pos: [x,y], type: square});
			} */
			row.push(square);
		}
		level.squares.push(row);
	}

	
	//console.log(level.triggers);
	level.drawn = false;
	player.goalLoops = 0;
	console.log("made the level: ", level.size, level.squares[0].length, level.squares.length);
	//console.log(level.triggers);
	lastTime = new Date();
	return true;
}



//player object
var player = {
	img: null,
	state: IDLE,
	
	//xy motion
	pos: [0,0],
	vel: [0,0],
	target: [0,0], //probably not necessary once changes are in place
	targetPhase: 0,
	lastMatchPos: [0,0],
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
	sect: 0,
	levelInd: null
};

var levels_menu = {
	rowWidth: 0,
	rowHeight: minMenu,
	topInd: 0,
	selected: -1,
		
};


function setSquareAction(rounded)
{
	
	if(onBoard(rounded))
	{
		var sq = level.squares[rounded[1]][rounded[0]];
		var prevSq = level.squares[player.lastMatchPos[1]][player.lastMatchPos[0]];
		/* 				
		if((player.jumping) || (prevSq != sq))
		{
			//iceSnd.stop();
			
			if(sq.sound != null) playSound(ACTION_SOUNDS, sq.sound);
			if(sq.theme != null && player.state == ACTIVE) playSound(THEME_SOUNDS, sq.theme);
			
			//sq.sound.play();
		} */
		var backSnd = null;
		if(player.jumping)
		{
			for(var i = 0; i < level.triggers.length; i += 1)
			{	
				var trigger = level.triggers[i];
				//console.log("trig", trigger);
				if(trigger.any || (trigger.trigger && trigger.x == player.pos[0] && trigger.y == player.pos[1]))
				{	
					incTriggerIndex(trigger);
					if(isDefined(trigger.sound))
					{
						backSnd = trigger.sound;
					}	
					level.squares[trigger.y][trigger.x] = trigger.group[trigger.ind];				
					drawSquare(trigger.x, trigger.y, trigger.group[trigger.ind]);
					level.someChange = true;					
				}
			}
		}
		
		if(backSnd != null)
		{
			playSound(BACK_SOUNDS, backSnd);
		}
		sq.act(sq, prevSq);
		player.lastMatchPos = vectorCopy(roundVector(player.pos));
		//console.log("player", player.pos);
		
		
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
		level.laserMatch = null;
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
		if(on_board && player.state == IDLE && level.squares[player.pos[1]][player.pos[0]] == Laser)
		{
			console.log(player.pos, player.lastMatchPos);
			setSquareAction(roundVector(player.pos));
			
			return;
		}
		/* if(!on_board && player.state !== FALLING)
		{
			player.state = FALLING;
			startFade(opacity_rate_fall);
			playSound(fallSnd);
		} */
		
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
			level.laserMatch = null;
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
		if([ACTIVE, WINNING, BURNING].includes(player.state))
		{
			//reset accel in case winning was active
			
			if(player.z == 0)
			{
				player.accel = z_accel;
			
				if(player.jumping == false && player.z == 0)
				{
					player.z_vel = 0;
				}
			}
			
			//see how far we've moved from the last known square
			dist = absVector(vectorSubtract(player.pos, player.lastMatchPos));
		
			//landed from a jump or slid to a new square
			if(player.jumping || dist[0] >= 1 || dist[1] >= 1)
			{
				
				//console.log(player.jumping, dist);
				var rounded = roundVector(player.pos);
				if(player.z == 0)	
				{
					level.laserMatch = null;
					
					player.pos = vectorCopy(rounded);
					//console.log("square", player.pos[0], player.pos[1], player.vel[0], player.vel[1]);
					if(on_board)
					{
						if(player.history.length) 
						{
							//console.log("down");
							setSquareAction(rounded);
						}
						else
						{
							console.log(new Date().getTime() - winStart, "seconds");
							playSound(ACTION_SOUNDS, grassSnd);
							killAll();
							player.lastMatchPos = vectorCopy(player.pos);
						}
						
						
					}
					else
					{
						player.state = FALLING;
						startFade(opacity_rate_fall);
						playSound(ACTION_SOUNDS, fallSnd);
					}
					//console.log("down",rounded[0], rounded[1], level.laserMatch);
				}
				else if(on_board && (dist[0] >= .6 || dist[1] >= .6))
				{
					
					level.laserMatch = null;
					var sq = level.squares[rounded[1]][rounded[0]];
					if(isDefined(sq.airAct)) sq.airAct();
					player.lastMatchPos = vectorCopy(rounded);
					//console.log("up",rounded[0], rounded[1], level.laserMatch);
					//if(sq == Laser) setSquareAction(rounded);
				}
			}
		}
	}
}
			
	

 function onBoard(pos = player.pos, delta = [0,0], extraBorder = false)
 {
	var newPos = vectorAdd(pos, delta);
	var ret = false;
	var extra = 0;
	if(extraBorder) extra = 1;

	if(extraBorder || ((newPos[0] > -(boardBuffer + extra)) && (newPos[0] < level.size[0] - 1 + extra + boardBuffer) && (newPos[1] > -(boardBuffer + extra)) && newPos[1] < (level.size[1] - 1 + extra + boardBuffer)))
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

function killAll(force = true)
{
	killXY();
	killZ();
	killSpin();
	
	player.theta = 0;
	if(force || ![BURNING].includes(player.state))
	{
		player.state = IDLE;
		killFade();
	}
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

function startJump(jumpType = 1, jumpVel = z_vel_init, spinVel = omega_init)
{
	if(jumpType == 0) playSound(ACTION_SOUNDS, jumpSnd);
	else if(jumpType == 1) playSound(ACTION_SOUNDS, trampSnd);
	else if(jumpType == 2) playSound(ACTION_SOUNDS, winSnd);
	
	
	player.z_vel = jumpVel;
	player.jumping = true;
	player.vel[0] += player.target[0] / playerMillis;
	player.vel[1] += player.target[1] / playerMillis;
	player.target = zeroVector();
	startSpin(spinVel);
	if(jumpVel < z_vel_init_goal && player.state != BURNING) player.state = ACTIVE;
}



