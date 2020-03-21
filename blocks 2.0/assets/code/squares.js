


var Grass = {
	imgInd: 0,
	animate: null,
	act: function()
	{
		//if([ACTIVE, BURNING].includes(player.state)) 
		playSound(ACTION_SOUNDS, grassSnd);
		killAll(false);
	}
};

var Goal = {
	imgInd:  1,
	animate: null,
	sound: winSnd,
	theme: winTheme,
	act:  function()
	{
		if(player.state == BURNING)
		{
			playSound(ACTION_SOUNDS, grassSnd);
			killAll(false);
		}
		else
		{
			killXY();
			if(player.state == ACTIVE)
			{
				playSound(THEME_SOUNDS, winTheme);
				player.goalLoops = 0;
				winStart = new Date().getTime();
			}
			
			startJump(2, z_vel_init, omega_win);
			player.state = WINNING;
			if(++player.goalLoops > 2 && !gameOver) 
			{
				//playSound(THEME_SOUNDS, winTheme);
				player.z_vel = z_vel_init_load;	
				player.omega = omega_load;
				player.accel = load_z_accel;
			}
		}
	}
};

var EmptySquare = {
	imgInd:  2,
	animate: null,
	act:  function()
	{
		playSound(ACTION_SOUNDS, fallSnd);
		killXY();
		player.state = FALLING;
		startFade(opacity_rate_fall);
		//startFade();
	}
};

var Lava = {
	imgInd:  3,
	animate: null, //{time: 500, minInd: 2, maxInd: 4},
	act:  function()
	{
		if(player.state != BURNING) playSound(ACTION_SOUNDS, lavaSnd);
		killXY();
		startFade();
		slowSpin();
		player.jumping = false;
		player.state = BURNING;

	}
};

var Ice = {
	imgInd:  4,
	animate: null,
	act:  function(nowSq, prevSq)
	{
		if(player.jumping || (nowSq != prevSq)) playSound(ACTION_SOUNDS, iceSnd);
		//console.log("ice");
		if(!vectorNonZero(player.vel))
		{
			killAll(false);
		}
		player.jumping = false;
		slowSpin(alpha_ice);
	}
};

var Laser = {
	imgInd: 5,
	animate: null, //{time: 500, minInd: 2, maxInd: 4},
	airAct: function()
	{
		level.laserFrames = 0;
		level.laserMatch = roundVector(player.pos);
		//startFade(opacity_rate_laser);
		player.state = BURNING;
		slowSpin();
		stopSound(ACTION_SOUNDS);
		playSound(BACK_SOUNDS, laserSnd); //todo make a laser sizzle sound
		//playSound(BACK_SOUNDS, lavaSnd);
	},
	act:  function()
	{
		level.laserMatch = roundVector(player.pos);
		if(player.state != BURNING)
		{
			level.laserFrames = 0;
			//startFade(opacity_rate_laser);
			player.state = BURNING;
			stopSound(ACTION_SOUNDS);
			playSound(BACK_SOUNDS, laserSnd);
			//playSound(BACK_SOUNDS, lavaSnd); //todo make a laser sizzle sound
		}
		killSpin();
		player.jumping = false;
		killXY();
	}
};

var LaserCover = {
	imgInd: 6,
	animate: null,
	act: function()
	{
		playSound(ACTION_SOUNDS, clankSnd);
		killAll(false);
	}
};

var OffSwitch = {
	imgInd: 7,
	animate: null,
	act: function()
	{
		playSound(ACTION_SOUNDS, onSnd);
		killAll(false);
		var newSq = OnSwitch;
		level.squares[player.pos[1]][player.pos[0]] = newSq;
		drawSquare(player.pos[0], player.pos[1], newSq.imgInd);	
		toggleLasers();
	}
}

var OnSwitch = {
	imgInd: 8,
	animate: null,
	act: function()
	{
		playSound(ACTION_SOUNDS, offSnd);
		killAll(false);
		var newSq = OffSwitch;
		level.squares[player.pos[1]][player.pos[0]] = newSq;
		drawSquare(player.pos[0], player.pos[1], newSq.imgInd);	
		toggleLasers();
	}
}

function portalAction()
{
	
	for(var i = 0; i < level.portals.length; i += 1)
	{
		if(vectorEqual(player.pos, [level.portals[i].x, level.portals[i].y]))
		{
			player.pos = vectorCopy(level.portals[i].pair);
			break;
		}
	}
/* 	player.lastMatchPos = vectorCopy(player.pos);
	console.log(player.pos, player.lastMatchPos); */
	playSound(ACTION_SOUNDS, portalSnd);
	if(player.jumping) startJump(3);
}
	

var Portal = {
	imgInd: 9,
	animate: {time: 100, minInd: 9, maxInd: 11},
	act: function()
	{
		portalAction();
	}
};

var PortalB = {
	imgInd: 12,
	animate: {time: 100, minInd: 12, maxInd: 14},
	act: function()
	{
		portalAction();
	}
};





function toggleLasers()
{
	var snd = false;
	for(var y = 0; y < level.squares.length; y += 1)
	{
		for(var x = 0; x < level.squares[0].length; x += 1)
		{
			var newSq = null;
			if(level.squares[y][x] == Laser)
			{
				newSq = LaserCover;
			}
			else if(level.squares[y][x] == LaserCover)
			{
				newSq = Laser;
			}
			if(newSq != null) 
			{
				level.squares[y][x] = newSq;
				drawSquare(x, y, newSq.imgInd);
				snd = true;
			}
		}
	}
	if(snd)
	{
		playSound(BACK_SOUNDS, gearSnd);
	}
}
			

var TrampReg = {
	imgInd:  15,
	animate: null,
	act:  function()
	{
		startJump();
	}
};

var TrampHor = {
	imgInd:  16,
	animate: null,
	act:  function()
	{
		player.vel[1] = -player.vel[1];
		startJump();
	}
};

var TrampVrt = {
	imgInd:  17,
	animate: null,
	act:  function()
	{
		player.vel[0] = -player.vel[0];
		startJump();
	}
};

var TrampDDn = {
	imgInd:  18,
	animate: null,
	act:  function()
	{
		player.vel = [player.vel[1], player.vel[0]];
		startJump();
	}
};

var TrampDUp = {
	imgInd:  19,
	animate: null,
	act:  function()
	{
		player.vel = [-player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampClockwise = {
	imgInd:  20,
	animate: null,
	act:  function()
	{
		player.vel = [player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampCounterClockwise = {
	imgInd:  21,
	animate: null,
	act:  function()
	{
		player.vel = [-player.vel[1], player.vel[0]];
		startJump();
	}
};

var trampRotateGroup = [TrampHor, TrampDDn, TrampVrt, TrampDUp];
function isDirTramp(square)
{
	return trampRotateGroup.includes(square);
}

//square modifiers

//specifically for directional tramps
var RotateClockwise = {
	imgInd: 22,
	direction: 1
};
var RotateCounterClockwise = {
	imgInd: 23,
	direction: -1
};

var RotateSingle = {
	imgInd: 24,
	inc: 1
};

var RotateDouble = {
	imgInd: 25,
	inc: 2
};

var NoModifier = {
	imgInd: 26,
	ignore: true
};

var JumpTrigger = {
	imgInd: 27,
	trigger: true,
	any: false,
	sound: gearSnd,
};

var AnyJumpTrigger = {
	imgInd: 28,
	trigger: true,
	any: true,
	sound: gearSnd,
};

var TimerTrigger = {
	imgInd: 29,
	limit: 1500,
	sound: gearSnd,
};


var SwitchTrigger = {
	imgInd: 30,
	trigger: false,
	any: false,
	onOff: true,
	sound: gearSnd
};

//specifically for portals
var PortalZero = {
	imgInd: 31,
	portalGroup: 0,
};

var PortalOne = {
	imgInd: 32,
	portalGroup: 0,
};

var PortalTwo = {
	imgInd: 33,
	portalGroup: 0,
};






var sqCodes = {
	"G": Grass,
	"X": Goal,
	"E": EmptySquare,
	"L": Lava,
	"I": Ice,
	"P": Portal,
	"B": PortalB,
	"T": TrampReg,
	"-": TrampHor,
	"|": TrampVrt,
	"R": TrampDDn,
	"/": TrampDUp,
	"W": TrampClockwise,
	"C": TrampCounterClockwise,
	"Z": Laser,
	"K": LaserCover,
	"F": OffSwitch,
	"O": OnSwitch,
	
};

var modObjects = [
	NoModifier,
	TimerTrigger,
	SwitchTrigger,
	JumpTrigger,
	AnyJumpTrigger,
	RotateClockwise,
	RotateCounterClockwise,
	RotateSingle,
	RotateDouble,
	PortalZero,
	PortalOne,
	PortalTwo,
];
	

 
