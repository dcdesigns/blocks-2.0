

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
			player.rewindPos = player.history[0];
			player.history = [];
			player.lastMatchPos = vectorCopy(player.pos);
			
		}
		for(var i = 0; i < level.triggers.length; i += 1)
		{
			var trigger = level.triggers[i];
			trigger.ind = trigger.init;
			level.squares[trigger.y][trigger.x] = trampRotateGroup[trigger.ind];				
			drawSquare(trigger.x, trigger.y, trampRotateGroup[trigger.ind].imgInd);	
			console.log(trigger);
		}
		for(var i = 0; i < level.timers.length; i += 1)
		{
			var timer = level.timers[i];
			timer.ind = timer.init;
			timer.time = 0;
			level.squares[timer.y][timer.x] = trampRotateGroup[timer.ind];				
			drawSquare(timer.x, timer.y, trampRotateGroup[timer.ind].imgInd);	
			console.log(timer);
		}
		for(var i = 0; i < level.toggles.length; i += 1)
		{
			var toggle = level.toggles[i];
			level.squares[toggle.pos[1]][toggle.pos[0]] = toggle.type;				
			drawSquare(toggle.pos[0], toggle.pos[1], toggle.type.imgInd);	
			console.log(toggle);
		}
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
			player.rewindPos = player.history.pop();
			player.lastMatchPos = vectorCopy(player.pos);
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


