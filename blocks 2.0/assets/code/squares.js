var Grass = {
	imgInd: 0,
	act: function()
	{
		killAll();
	}
};

var Goal = {
	imgInd:  1,
	act:  function()
	{
		//console.log("WINNNNNNNNNNNNN", player.state);
		killXY();
		startJump(z_vel_init_goal);
		if(player.state == ACTIVE)
		{
			player.state = WINNING;
			player.goalLoops = 0;
		}
		else if(++player.goalLoops >= 3 && !gameOver)
		{
			nextLevel();
		}		
	}
};

var Ice = {
	imgInd:  5,
	act:  function()
	{
		console.log("ice");
		player.jumping = false;
		slowSpin();
	}
};

var Portal = {
	imgInd: 6,
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
	imgInd:  6,
	act:  function()
	{
		player.jumping = false;
	}
};

var TrampReg = {
	imgInd:  9,
	act:  function()
	{
		startJump();
		//player.z_vel = z_vel_init;
	}
};

var TrampHor = {
	imgInd:  10,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel[1] = -player.vel[1];
		startJump();
	}
};

var TrampVrt = {
	imgInd:  11,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel[0] = -player.vel[0];
		startJump();
	}
};

var TrampDDn = {
	imgInd:  12,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel = [player.vel[1], player.vel[0]];
		startJump();
	}
};

var TrampDUp = {
	imgInd:  13,
	act:  function()
	{
		//player.z_vel = z_vel_init;
		player.vel = [-player.vel[1], -player.vel[0]];
		startJump();
	}
};

var TrampSpin = {
	imgInd:  10,
	act:  function()
	{
		player.vel = [player.vel[1], -player.vel[0]];
		startJump();
	}
};

var Lava = {
	imgInd:  2,
	act:  function()
	{
		killXY();
		startFade();
		slowSpin();
		player.jumping = false;
		player.state = BURNING;

	}
};



 
