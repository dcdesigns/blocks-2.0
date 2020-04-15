

var t_ind = 0;

var scrnButNotFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
	}
};


var scrnButFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){

	}
};



var scrnButIosNotFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};



var scrnButIosFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};



var menuBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//load menu
		paused = (paused)? 0: 1;
		console.log(paused);
		if(paused) audioCx.suspend();
		else audioCx.resume();
		levels_menu.topInd = level.index;
		levels_menu.levelInd = null;
		drawBase();
	}
};


var restartBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		//killAll();
		if(player.history.length)
		{
			
			//player.state = IDLE;
			player.state = REWIND;
			playSound(ACTION_SOUNDS, swoopSnd);
			gameOver = false;
			player.rewindPos = player.history[0].pos;
			player.history = [];
			player.lastMatchPos = vectorCopy(roundVector(player.pos));
			
		}
		for(var i = 0; i < level.triggers.length; i += 1)
		{
			var trigger = level.triggers[i];
			trigger.ind = trigger.init;
			var sq = trigger.group[trigger.ind];
			var imgInd = sq.imgInd;
			if(isDefined(trigger.onOff))
			{
				imgInd += trigger.onOff;
			}
			level.squares[trigger.y][trigger.x] = sq;				
			drawSquare(trigger.x, trigger.y, sq, imgInd);	
			console.log(trigger);
		}
		for(var i = 0; i < level.timers.length; i += 1)
		{
			var timer = level.timers[i];
			timer.ind = timer.init;
			var sq = timer.group[timer.ind];
			timer.time = 0;
			level.squares[timer.y][timer.x] = sq;				
			drawSquare(timer.x, timer.y, sq);	
			console.log(timer);
		}
		level.activated = 0;
		for(var i = 0; i < level.activators.length; i += 1)
		{
			var activator = level.activators[i];
			activator.ind = activator.init;
			level.activated += activator.ind
			var sq = (activator.ind == 1) ? Activated: UnActivated;
			level.squares[activator.y][activator.x] = sq;				
			drawSquare(activator.x, activator.y, sq);	
			console.log(activator);
		}
		/* for(var i = 0; i < level.toggles.length; i += 1)
		{
			var toggle = level.toggles[i];
			level.squares[toggle.pos[1]][toggle.pos[0]] = toggle.type;				
			drawSquare(toggle.pos[0], toggle.pos[1], toggle.type);	
			console.log(toggle);
		} */
		level.locked = level.initLocked;
		setLocks(level.locked);
	}
};


var undoBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		//killAll();
		if(player.history.length)
		{
			
			//player.state = IDLE;
			player.state = REWIND;
			playSound(ACTION_SOUNDS, swoopSnd);
			gameOver = false;
			var hist = player.history.pop();
			player.rewindPos = hist.pos;
			player.lastMatchPos = vectorCopy(roundVector(player.pos));
			
			if(!level.locked)
			{
				var backSnd = null;
				
				for(var i = 0; i < hist.triggers.length; i += 1)
				{	
					var trig = hist.triggers[i];
					level.triggers[i].ind = trig.ind;
					var sq = level.triggers[i].group[level.triggers[i].ind];
					var imgInd = sq.imgInd;
					console.log("onoff", trig.onOff);
					if(isDefined(trig.onOff))
					{
						imgInd += trig.onOff;
					}
					if(level.triggers[i].ind != trig.ind && isDefined(trig.sound))
					{
						backSnd = trig.sound;
					}
					
					level.squares[trig.y][trig.x] = sq;
					drawSquare(trig.x, trig.y, sq, imgInd);				
				}
				level.activated = 0;
				for(var i = 0; i < hist.activators.length; i += 1)
				{
					var activator = hist.activators[i];
					level.activators[i].ind = activator.ind;
					level.activated += activator.ind;
					var sq = (activator.ind == 1) ? Activated: UnActivated;
					level.squares[activator.y][activator.x] = sq;				
					drawSquare(activator.x, activator.y, sq);	
					//console.log(activator);
				}
				/* for(var i = 0; i < hist.toggles.length; i += 1)
				{
					var toggle = hist.toggles[i];
					level.squares[toggle.y][toggle.x] = toggle.type;
					drawSquare(toggle.x, toggle.y, toggle.type);	
				} */
				if(backSnd != null)
				{
					console.log('backsnd', backSnd);
					playSound(BACK_SOUNDS, backSnd);
				}
			}
			
		}
	}
};


var movesBut = {
	imgInd: t_ind++,
	ignore: true,
	action: function(){
		//toggle hints
	}
};



var prevBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		levels_menu.topInd -= (levels_menu.rows - 1);
		drawBase();
		//toggle hints
	}
};



var nextBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		levels_menu.topInd += (levels_menu.rows - 1);
		drawBase();
		//toggle hints
	}
};


var userBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//toggle hints
	}
};

var hintBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		
	}
};

var muteBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		toggleSound();
	}
};

var unMuteBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		toggleSound();
	}
};

function toggleSound()
{
	val = g.gain.value ? 0 : 1;
	g.gain.value = val;
	gTheme.gain.value = val;
	
	butts[0][MUTE_IND] = val ? muteBut : unMuteBut;
	drawButton(butImg, cx[BUT_CANV], butts[0][MUTE_IND].imgInd, MUTE_IND, true);

};

 //screen buttons
var butts = [
	[scrnButNotFull, restartBut, undoBut, hintBut, muteBut, menuBut, movesBut],
	[scrnButNotFull, nextBut, prevBut, menuBut, userBut]
];


