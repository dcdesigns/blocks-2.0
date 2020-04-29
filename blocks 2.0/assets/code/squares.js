
var t_ind = 0;

var Grass = {
	imgInd: t_ind++,
	animate: null,
	act: function()
	{
		//if([ACTIVE, BURNING].includes(player.state)) 
		playSound(ACTION_SOUNDS, grassSnd);
		killAll(false);
	}
};

var Goal = {
	imgInd:  t_ind++,
	animate: null,
	sound: winSnd,
	theme: winTheme,
	act:  function()
	{
		killTemp(1);
		if(player.state == BURNING || level.activated < level.activators.length)
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
	imgInd:  t_ind++,
	animate: null,
	act:  function()
	{
		playSound(ACTION_SOUNDS, fallSnd);
		killXY();
		if(player.state == BURNING) player.state = FALLBURNING;
		else player.state = FALLING;
		startFade(opacity_rate_fall);
		//startFade();
	}
};

function getShieldNumber(shieldVal)
{
	if(shieldVal == 0) return shield0;
	else if(shieldVal == 1) return shield1;
	else if(shieldVal == 2) return shield2;
	else if(shieldVal == 3) return shield3;
	else if(shieldVal == 4) return shield4;
	
	return null;
}

var Lava = {
	imgInd:  t_ind,
	//animate: {time: 200, minInd: t_ind, maxInd: t_ind + 4},
	act:  function(nowSq, prevSq)
	{
		//if((nowSq != prevSq)) playSound(ACTION_SOUNDS, lavaSnd);
		if((player.state != BURNING)) playSound(ACTION_SOUNDS, lavaSnd);
		
		player.jumping = false;
		player.temp -= 1;
		var snd = getShieldNumber(player.temp);	
		if(snd !== null)
		{
			playSound(BACK_SOUNDS, snd);
		}
		
		if(player.temp < 0)
		{
			killXY();
			startFade();	
			player.state = BURNING;
			slowSpin();
		}
		else slowSpin(lavaTrailSpinAlpha);

	}
};
t_ind += 5;

var Ice = {
	imgInd:  t_ind++,
	animate: null,
	act:  function(nowSq, prevSq)
	{
		
		//console.log("ice");
		if(!vectorNonZero(player.vel))
		{
			killAll(false);
			playSound(ACTION_SOUNDS, iceHitSnd);
		}
		else if(player.jumping || (nowSq != prevSq))
		{
			playSound(ACTION_SOUNDS, iceSnd);
		}
		player.jumping = false;
		slowSpin(alpha_ice);
		if(player.state !== BURNING)
		{
			player.temp += 1;//iceTemp/2 * vectorMaxAbs(player.vel);
			var snd = getShieldNumber(player.temp);	
			if(snd !== null)
			{
				playSound(BACK_SOUNDS, snd);
			}
			player.temp = Math.min(maxIceShield, player.temp);
		}

	}
};

var TrampBackground = t_ind++;			

var TrampReg = {
	backInd: TrampBackground,
	imgInd: t_ind++,
	act:  function()
	{
		startJump();
	}
};


var TrampHorizontal = t_ind;
t_ind += 4;
	
var halfPi = Math.PI / 2;
var TrampHor = {
	backInd: TrampBackground,
	imgInd: TrampHorizontal,
	act:  function()
	{
		player.vel[1] = -player.vel[1];
		startJump();
	}
};

var TrampVrt = {
	backInd: TrampBackground,
	imgInd: TrampHorizontal,
	imgRotate: halfPi,
	act:  function()
	{
		player.vel[0] = -player.vel[0];
		startJump();
	}
};

var TrampDDn = {
	backInd: TrampBackground,
	imgInd: TrampHorizontal,
	imgRotate: halfPi/2,
	act:  function()
	{
		player.vel = [player.vel[1], player.vel[0]];
		startJump();
	}
};

var TrampDUp = {
	backInd: TrampBackground,
	imgInd: TrampHorizontal,
	imgRotate: -halfPi/2,
	act:  function()
	{
		player.vel = [-player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampClockwise = {
	backInd: TrampBackground,
	imgInd: t_ind++,
	act:  function()
	{
		player.vel = [player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampCounterClockwise = {
	backInd: TrampBackground,
	imgInd: t_ind++,
	act:  function()
	{
		player.vel = [-player.vel[1], player.vel[0]];
		startJump();
	}
};



var Laser = {
	imgInd: t_ind,
	airAct: function()
	{
		level.laserFrames = 0;
		level.laserMatch = roundVector(player.pos);
		//startFade(opacity_rate_laser);
		player.state = BURNING;
		player.temp = -1;
		slowSpin();
		stopSound(ACTION_SOUNDS);
		playSound(BACK_SOUNDS, laserSnd); //todo make a laser sizzle sound
		playSound(ACTION_SOUNDS, lavaSnd);
		//playSound(BACK_SOUNDS, lavaSnd);
	},
	act: function()
	{
		level.laserMatch = roundVector(player.pos);
		if(player.state != BURNING)
		{
			player.temp = -1;
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
t_ind += 4;


var LaserCover = {
	imgInd: t_ind,
	act: function()
	{
		playSound(ACTION_SOUNDS, clankSnd);
		killAll(false);
	}
};
t_ind += 4;

var trampRotateGroup = [TrampHor, TrampDDn, TrampVrt, TrampDUp];
var laserGroup = [Laser, LaserCover];
for(var i = 0; i < trampRotateGroup.length; i += 1)
{
	trampRotateGroup[i].group = trampRotateGroup;
}
for(var i = 0; i < laserGroup.length; i += 1)
{
	laserGroup[i].group = laserGroup;
}

function isDirTramp(square)
{
	var res = false;
	if(isDefined(square.group) && square.group == trampRotateGroup)
	{
		res = true;
	}
	return res;
}
function isLaser(square)
{
	var res = false;
	if(isDefined(square.group) && square.group == laserGroup)
	{
		res = true;
	}
	return res;
}
function isSwitchTarget(square)
{
	return isDirTramp(square) || isLaser(square);
}
function getGroup(square)
{
	//console.log(square);
	if(isDefined(square.group))
	{
		//console.log(square);
		return square.group;
	}
	return null;
}

function incTriggerIndex(trigger)
{
	var groupLen = trigger.group.length;
	trigger.ind = ((trigger.ind + trigger.inc * trigger.direction + groupLen) % groupLen);
}

function groupIndex(group, sq)
{
	for(var j = 0; j < group.length; j += 1)
	{
		if(group[j] == sq)
		{
			return j;
		}
	}
	return 0;
}

var Switch1 = {
	imgInd: t_ind++,
	act: function()
	{
		swtichEvent(1);
	}
}

var Switch2 = {
	imgInd: t_ind++,
	act: function()
	{
		swtichEvent(2);
	}
}

var Switch3 = {
	imgInd: t_ind++,
	act: function()
	{
		swtichEvent(3);
	}
}




function swtichEvent(ind)
{
	playSound(ACTION_SOUNDS, onSnd);
	killAll(false);
	level.someChange = true;

	
	snd = false;
	
	//update affected
	for(var i = 0; i < level.triggers.length; i += 1)
	{	
		var trigger = level.triggers[i];
		if(isDefined(trigger.onOff) && trigger.onOff == ind)
		{	
			incTriggerIndex(trigger);
			var sq = trigger.group[trigger.ind];
			if(isDefined(trigger.sound))
			{
				snd = true;
			}	
			level.squares[trigger.y][trigger.x] = sq;			
			drawSquare(trigger.x, trigger.y, sq, sq.imgInd + ind);				
		}
	}

	if(snd)
	{
		playSound(BACK_SOUNDS, gearSnd);
	}
}

var UnLocked = {
	imgInd: t_ind++,
	imgRotate: "screen",
	act: function()
	{
		toggleLocks(false);
	}
}

var Locked = {
	imgInd: t_ind++,
	imgRotate: "screen",
	act: function()
	{
		toggleLocks(true);
	}
}

var LockBorder = {
	imgInd: t_ind++
};

function toggleLocks(wasLocked)
{
	var newSq, snd;
	if(wasLocked)
	{
		newSq = UnLocked;
		snd = offSnd;
	}
	else
	{
		newSq = Locked;
		snd = onSnd;
	}
	playSound(ACTION_SOUNDS, snd);
	killAll(false);
	level.someChange = true;
	setLocks(!level.locked);

}


var UnActivated = {
	imgInd: t_ind++,
	imgRotate: "screen",
	act: function()
	{
		toggleActivated(false);
	}
}

var Activated = {
	imgInd: t_ind++,
	imgRotate: "screen",
	animate: null,
	act: function()
	{
		toggleActivated(true);
	}
}


function toggleActivated(wasActive)
{
	var newSq, snd;
	if(wasActive)
	{
		newSq = UnActivated;
		snd = offSnd;
		level.activated--;
	}
	else
	{
		newSq = Activated;
		snd = onSnd;
		level.activated++;
	}
	playSound(ACTION_SOUNDS, snd);
	killAll(false);
	level.someChange = true;
	level.squares[player.pos[1]][player.pos[0]] = newSq;
	drawSquare(player.pos[0], player.pos[1], newSq);
	
	console.log("active", level.activated, "/", level.activators.length);
	//do something useful

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
	imgInd: t_ind,
	animate: {time: 100, minInd: t_ind, maxInd: t_ind + 2},
	act: function()
	{
		portalAction();
	}
};
t_ind += 3;

var PortalB = {
	imgInd: t_ind,
	animate: {time: Portal.animate.time, minInd: t_ind, maxInd: t_ind + 2},
	act: function()
	{
		portalAction();
	}
};
t_ind += 3;



//square modifiers

//specifically for directional tramps
var RotateClockwise = {
	imgInd: t_ind++,
	direction: 1
};
var RotateCounterClockwise = {
	imgInd: t_ind++,
	direction: -1
};

var RotateSingle = {
	imgInd: t_ind++,
	inc: 1
};

var RotateDouble = {
	imgInd: t_ind++,
	inc: 2
};

var NoModifier = {
	imgInd: t_ind++,
	ignore: true
};

var JumpTrigger = {
	imgInd: t_ind++,
	trigger: true,
	any: false,
	sound: gearSnd,
};

var AnyJumpTrigger = {
	imgInd: t_ind++,
	trigger: true,
	any: true,
	sound: gearSnd,
};

var TimerTrigger = {
	imgInd: t_ind++,
	limit: timerMillis,
	sound: gearSnd,
};


var SwitchTrigger1 = {
	imgInd: t_ind++,
	trigger: false,
	any: false,
	onOff: 1,
	sound: gearSnd
};

var SwitchTrigger2 = {
	imgInd: t_ind++,
	trigger: false,
	any: false,
	onOff: 2,
	sound: gearSnd
};

var SwitchTrigger3 = {
	imgInd: t_ind++,
	trigger: false,
	any: false,
	onOff: 3,
	sound: gearSnd
};

//specifically for portals
var PortalZero = {
	imgInd: t_ind++,
	portalGroup: 0,
};

var PortalOne = {
	imgInd: t_ind++,
	portalGroup: 0,
};

var PortalTwo = {
	imgInd: t_ind++,
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
	"1": Switch1,
	"2": Switch2,
	"3": Switch3,
	"Z": Laser,
	"K": LaserCover,
	"$": Locked,
	"S": UnLocked,
	"U": UnActivated,
	"V": Activated,
	
};

var modObjects = [
	NoModifier,
	TimerTrigger,
	SwitchTrigger1,
	SwitchTrigger2,
	SwitchTrigger3,
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
	

 
