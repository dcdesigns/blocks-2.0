var Grass = {
	imgInd: 0,
	animate: null,
	act: function()
	{
		killAll();
	}
};

var Goal = {
	imgInd:  1,
	animate: null,
	act:  function()
	{
		killXY();
		if(player.state == ACTIVE)
		{
			
			player.goalLoops = 0;
		}
		
		startJump(z_vel_init_goal);
		player.state = WINNING;
		if(++player.goalLoops == 2 && !gameOver) 
		{
			player.z_vel = z_vel_init_load;	
			player.accel = load_z_accel;
		}
	}
};

var Ice = {
	imgInd:  5,
	animate: null,
	act:  function()
	{
		console.log("ice");
		if(!vectorNonZero(player.vel))
		{
			killAll();
		}
		player.jumping = false;
		slowSpin(alpha_ice);
	}
};

var Portal = {
	imgInd: 6,
	animate: {time: 100, minInd: 6, maxInd: 8},
	act: function()
	{
		if(level.portals.length == 2)
		{
			if(vectorEqual(player.pos, level.portals[0])) targInd = 1;
			else targInd = 0;
			console.log("target", targInd);
			player.pos = vectorCopy(level.portals[targInd]);
			player.lastMatchPos = vectorCopy(player.pos);
			if(player.jumping) startJump();
		}
	}
};

var Boost = {
	imgInd:  16,
	animate: null,
	act:  function()
	{
		player.jumping = false;
	}
};

var EmptySquare = {
	imgInd:  19,
	animate: null,
	act:  function()
	{
		killXY();
		player.state = FALLING;
		startFade();
	}
};

var TrampReg = {
	imgInd:  9,
	animate: null,
	act:  function()
	{
		startJump();
		//player.z_vel = z_vel_init;
	}
};

var TrampHor = {
	imgInd:  10,
	animate: null,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel[1] = -player.vel[1];
		startJump();
	}
};

var TrampVrt = {
	imgInd:  11,
	animate: null,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel[0] = -player.vel[0];
		startJump();
	}
};

var TrampDDn = {
	imgInd:  12,
	animate: null,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel = [player.vel[1], player.vel[0]];
		startJump();
	}
};

var TrampDUp = {
	imgInd:  13,
	animate: null,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel = [-player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampClockwise = {
	imgInd:  14,
	animate: null,
	act:  function()
	{
		player.vel = [player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampCounterClockwise = {
	imgInd:  15,
	animate: null,
	act:  function()
	{
		player.vel = [-player.vel[1], player.vel[0]];
		startJump();
	}
};

var Lava = {
	imgInd:  2,
	animate: null, //{time: 500, minInd: 2, maxInd: 4},
	act:  function()
	{
		killXY();
		startFade();
		slowSpin();
		player.jumping = false;
		player.state = BURNING;

	}
};


var sqCodes = {
	"G": Grass,
	"X": Goal,
	"L": Lava,
	"I": Ice,
	"B": Boost,
	"T": TrampReg,
	"-": TrampHor,
	"|": TrampVrt,
	"R": TrampDDn,
	"/": TrampDUp,
	"W": TrampClockwise,
	"C": TrampCounterClockwise,
	"P": Portal,
	"E": EmptySquare,
};

 