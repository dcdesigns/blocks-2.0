


var Grass = {
	imgInd: 0,
	animate: null,
	sound: grassSnd,
	act: function()
	{
		killAll();
	}
};

var Goal = {
	imgInd:  1,
	animate: null,
	sound: winSnd,
	theme: winTheme,
	act:  function()
	{
		killXY();
		if(player.state == ACTIVE)
		{
			
			player.goalLoops = 0;
			winStart = new Date().getTime();
		}
		
		startJump(z_vel_init, omega_win);
		player.state = WINNING;
		if(++player.goalLoops > 2 && !gameOver) 
		{
			player.z_vel = z_vel_init_load;	
			player.omega = omega_load;
			player.accel = load_z_accel;
		}
	}
};

var Lava = {
	imgInd:  3,
	animate: null, //{time: 500, minInd: 2, maxInd: 4},
	sound: lavaSnd,
	act:  function()
	{
		killXY();
		startFade();
		slowSpin();
		player.jumping = false;
		player.state = BURNING;

	}
};

var Ice = {
	imgInd:  5,
	animate: null,
	sound: iceSnd,
	act:  function()
	{
		//console.log("ice");
		if(!vectorNonZero(player.vel))
		{
			killAll();
		}
		player.jumping = false;
		slowSpin(alpha_ice);
	}
};

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
	player.lastMatchPos = vectorCopy(player.pos);
	if(player.jumping) startJump();
}
	

var Portal = {
	imgInd: 6,
	sound: portalSnd,
	animate: {time: 100, minInd: 6, maxInd: 8},
	act: function()
	{
		portalAction();
	}
};

var PortalB = {
	imgInd: 9,
	sound: portalSnd,
	animate: {time: 100, minInd: 9, maxInd: 11},
	act: function()
	{
		portalAction();
	}
};

/* var Boost = {
	imgInd:  9,
	animate: null,
	act:  function()
	{
		player.jumping = false;
	}
}; */

var EmptySquare = {
	imgInd:  2,
	animate: null,
	sound: fallSnd,
	act:  function()
	{
		killXY();
		player.state = FALLING;
		startFade(opacity_rate_fall);
		//startFade();
	}
};

var TrampReg = {
	imgInd:  12,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		startJump();
	}
};

var TrampHor = {
	imgInd:  13,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel[1] = -player.vel[1];
		startJump();
	}
};

var TrampVrt = {
	imgInd:  14,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel[0] = -player.vel[0];
		startJump();
	}
};

var TrampDDn = {
	imgInd:  15,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel = [player.vel[1], player.vel[0]];
		startJump();
	}
};

var TrampDUp = {
	imgInd:  16,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel = [-player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampClockwise = {
	imgInd:  17,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel = [player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampCounterClockwise = {
	imgInd:  18,
	animate: null,
	sound: trampSnd,
	act:  function()
	{
		player.vel = [-player.vel[1], player.vel[0]];
		startJump();
	}
};

var trampRotateGroup = [TrampHor, TrampDDn, TrampVrt, TrampDUp];


//square modifiers

//specifically for directional tramps
var RotateClockwise = {
	imgInd: 19,
	direction: 1
};
var RotateCounterClockwise = {
	imgInd: 20,
	direction: -1
};

var RotateSingle = {
	imgInd: 21,
	inc: 1
};

var RotateDouble = {
	imgInd: 22,
	inc: 2
};

var NoModifier = {
	imgInd: 29,
	ignore: true
};

var JumpTrigger = {
	imgInd: 23,
	trigger: true,
	any: false,
	sound: swoopSnd,
};

var AnyJumpTrigger = {
	imgInd: 24,
	trigger: true,
	any: true,
	sound: swoopSnd,
};

var TimerTrigger = {
	imgInd: 25,
	limit: 1500,
	sound: swoopSnd,
};


//specifically for portals
var PortalZero = {
	imgInd: 26,
	portalGroup: 0,
};

var PortalOne = {
	imgInd: 27,
	portalGroup: 0,
};

var PortalTwo = {
	imgInd: 28,
	portalGroup: 0,
};


/* var TimerTrampCW = {
	imgInd: 19,
	animate: {time: 1500, ind: 0, group: [TrampHor, TrampDDn, TrampVrt, TrampDUp], sound: swoopSnd}
};

var TimerTrampCCW = {
	imgInd: 20,
	animate: {time: TimerTrampCW.animate.time, ind: 0, group: [TrampHor, TrampDUp, TrampVrt, TrampDDn], sound: TimerTrampCW.animate.sound}
};

var TriggerTrampCW = {
	imgInd: 21,
	animate: {trigger: 1, ind: 0, group: [TrampHor, TrampDDn, TrampVrt, TrampDUp], sound: swoopSnd}
};

var TriggerTrampCCW = {
	imgInd: 22,
	animate: {trigger: 1, ind: 0, group: [TrampHor, TrampDUp, TrampVrt, TrampDDn], sound: TriggerTrampCW.animate.sound}
};

var TriggerAllTrampCW = {
	imgInd: 23,
	animate: {trigger: 'all', ind: 0, group: [TrampHor, TrampDDn, TrampVrt, TrampDUp], sound: swoopSnd}
};

var TriggerAllTrampCCW = {
	imgInd: 24,
	animate: {trigger: 'all', ind: 0, group: [TrampHor, TrampDUp, TrampVrt, TrampDDn], sound: TriggerTrampCW.animate.sound}
};

 */




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
	
};

var modObjects = [
	NoModifier,
	TimerTrigger,
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
	

 
