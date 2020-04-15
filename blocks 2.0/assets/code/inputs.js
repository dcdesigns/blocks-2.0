
function wheelEvent(event)
{
	if(paused)
	{
		console.log(event.deltaY);
		if(event.deltaY > 0) nextBut.action();
		else prevBut.action();/*  1 : -1;
		if(Math.abs(event.deltaY) > 125) delta *= 2;
		levels_menu.topInd += delta;
		drawBase(); */
	}
}
function keyEvent(event) 
{
	switch(event.keyCode)
	{
		//s
		case 83:
			level.index = -1;
			gameOver = false;
			//playSound(swoopSnd);
			killAll();
			nextLevel();
			break;
		//e
		case 69:
			gameOver = false;
			//playSound(swoopSnd);
			killAll();
			level.index = GAME_LEVELS.length - 2;
			nextLevel();
			break;
		//n
		case 78:
			gameOver = false;
			//playSound(swoopSnd);
			killAll();
			nextLevel();
			break;
		//p
		case 80:
			level.index = Math.max(-1, level.index - 2);
			gameOver = false;
			//playSound(swoopSnd);
			killAll();
			nextLevel();
			break;
		//r
		case 82:
			restartBut.action();
			break;
		//z
		case 90:
			undoBut.action();
			break;
	}
	
};

function screenFlip() 
{
	rotating = true;
	setTimeout(function()
	{
		rotating = false;
		level.drawn = false;
		landscapeLast = 10000;
		portraitLast = 10000;
	}, 100);
	
};

function screenZoom() 
{
	console.log("zoomevent");
	setTimeout(function()
	{
		rotating = false;
		level.drawn = false;
		landscapeLast = 10000;
		portraitLast = 10000;
	}, 100);
	
};


function getButtonInd()
{
	var ret = null;
	if(click.end[0] > 0 && click.end[0] < scrn.w && click.end[1] > 0 && click.end[1] < scrn.h)
	{
		//buttons are vertical: check if x is in the button range
		if(scrn.butX && click.end[0] > scrn.w - scrn.butX) ret = Math.floor((scrn.h - scrn.butOff[paused] - click.end[1])/scrn.but)
		
		//buttons are horizontal: check if y is in the button range
		else if(scrn.butY && click.end[1] > scrn.h - scrn.butY) ret = Math.floor((click.end[0] - scrn.butOff[paused])/scrn.but);
		
		if(ret < 0 || ret > butts[paused].length -1) ret = null;
		//console.log(ret);
	}
	return ret;
}

function getGridXY()
{
}	

function setActiveButton(isStart)
{

	var temp_ind = getButtonInd();
	
	if(isStart || (!mobile && click.act === null))
	{
		if(temp_ind === null)
		{
			if(click.act === null)
			{
				//console.log("target start");
				click.act = SELECT_MOVE;
			}
		}
		else if(temp_ind === SELECT_ZOOM_COL[paused])
		{
			click.act = SELECT_ZOOM;
			click.but = temp_ind;
		}	
		else
		{
			click.act = SELECT_BUT;
			click.but = temp_ind;
		}
	}
	
	if(click.act == SELECT_MOVE)
	{
		setActiveTarget();
	}
	else if(click.act == SELECT_BUT)
	{
		click.but = temp_ind;
	}

}
 


 
 function setActiveTarget()
{	
	if(paused)
	{
		if(click.act == SELECT_MOVE)
		{
			click.levelInd = null;
			if(click.end[0] < levels_menu.w && click.end[1] < levels_menu.h)
			{				
				click.levelInd = Math.floor(click.end[1]/levels_menu.rowHeight);
			}
		}	
	}
	else
	{
		//ignore if target was not set at start
		if(player.state != IDLE || click.act !== SELECT_MOVE) return false;
		
		click.delta[0] = null;
		//console.log(flipped);
		var adjX, adjY;
		if(flipped == 1)
		{
			adjX = scrn.h - (!buttsFlipped? scrn.but : 0) - click.end[1] - scrn.sy;
			adjY = click.end[0] - scrn.sx; 
		}
		else if(flipped == -1)
		{
			adjX = click.end[1] - scrn.sy;
			adjY = scrn.w - (buttsFlipped? scrn.but : 0) - click.end[0] - scrn.sx; 
		}
		else
		{
			adjX = click.end[0] - scrn.sx;
			adjY = click.end[1] - scrn.sy;
		}
		click.delta[0] = Math.floor((adjX) / scrn.sq) - player.pos[0];
		click.delta[1] = Math.floor((adjY) / scrn.sq) - player.pos[1];
		//console.log("pos " , player.pos, ", delta " ,click.delta);
		if(!validDelta(click.delta) || !onBoard(player.pos, click.delta, true))
		{
			click.delta[0] = null;
		}
	}

}

function ignoreEvent(e)
{
	if(e.type.indexOf("pointer") != -1)
	{
		pointerEvts = true;
	}
	
	if(pointerEvts && (e.type.indexOf("touch") != -1 || e.type.indexOf("mouse") != -1))
	{
		e.preventDefault();
		return 1;
	}
	return 0;
}

function startClick(e)
{
	if(ignoreEvent(e)) return;
	
	//check for mobile vs computer
	mobile = e.type.indexOf('touch') > -1;
	
	//set XY
	click.start = getDisplayXY(e);
	click.end = click.start;
	
	setActiveButton(true);
	
}

function moveClick(e)
{	
	if(ignoreEvent(e)) return;
	
	//check for mobile vs computer
	mobile = e.type.indexOf('touch') > -1;

	//prevent default action if we're not zooming
	if(click.act !== SELECT_ZOOM) e.preventDefault();
	
	//reset highlighting of mouseover square when not clicked
	if(!mobile && (click.start[0] == -1 && (click.act == SELECT_BUT || click.act == SELECT_MOVE || click.act == SELECT_ZOOM)))
	{
		click.act = null;
	}
	
	click.end = getDisplayXY(e);
	setActiveButton(false);
}

function endClick(e)
{
	if(ignoreEvent(e)) return;
	
	//zoom: toggle fullscreen (doesn't work on all platforms... looking at you ios) 
	if(click.act === SELECT_ZOOM)
	{
		if(!ios)
		{
			isFullScreen = !isFullScreen;
			var elem = document.documentElement;
			rotating = true;
			if(isFullScreen)
			{
			 
				if (elem.requestFullscreen) elem.requestFullscreen();
				else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
				else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
				else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
				
				butts[0][SELECT_ZOOM_COL[0]]= scrnButFull;
				butts[1][SELECT_ZOOM_COL[1]] = scrnButFull;
			}
			else
			{
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
				else if (document.msExitFullscreen)  document.msExitFullscreen();
				
				butts[0][SELECT_ZOOM_COL[0]] = scrnButNotFull;
				butts[1][SELECT_ZOOM_COL[1]] = scrnButNotFull;
			}
		}
	}
	
	//buttons
	else if(click.act === SELECT_BUT && click.but !== null)
	{
		butts[paused][click.but].action();

	}

	//level select
	else if(paused)
	{
		if(click.act == SELECT_MOVE && click.levelInd != null)
		{
			var ind = click.levelInd + levels_menu.topInd;
			console.log("ind", ind);
			paused = 0;
			if(ind != level.index)
			{	
				gameOver = false;
				killAll();
				level.index = ind - 1;
				nextLevel();
			}
			else
			{
				drawBase();
			}
			
		}
		
	}
	//targets
	else if(click.act === SELECT_MOVE && click.delta[0] !== null && player.state == IDLE && !outOfMoves()) //&& not dead and moves left and blah blah
	{
		audioCx.resume();
		var trigs = []; 
		var activs = [];
		var activCnt = 0;
		/* var toggles = [];
		for(var x = 0; x < level.size[0]; x += 1)
		{
			for(var y = 0; y < level.size[1]; y += 1)
			{
				if(isLaserOrCover(level.squares[y][x]))
				{
					toggles.push({x: x, y: y, type: level.squares[y][x]});
				}
			}
		} */
		for(var i = 0; i < level.triggers.length; i += 1)
		{	
			var trigger = level.triggers[i];
			var onOff = isDefined(trigger.onOff) ? trigger.onOff : 0;
			trigs.push({x: trigger.x, y: trigger.y, ind: trigger.ind, onOff: onOff});
		}
		for(var i = 0; i < level.activators.length; i += 1)
		{	
			var activ = level.activators[i];
			var ind = (level.squares[activ.y][activ.x] == Activated) ? 1: 0;
			
			activs.push({x: activ.x, y: activ.y, ind: ind});
			//console.log(activs[activs.length - 1]);
			activCnt += ind;
		}
		player.history.push({pos: vectorCopy(player.pos), triggers: trigs, activators: activs, activeCnt: activCnt});
		player.lastMatchPos = vectorCopy(player.pos);
		player.target = click.delta;
		level.someChange = false;
		startJump(0);
	}
	killClick(false);
	
}

function killClick(force = true)
{
	//reset place holders/action status
	click.delta = [null, null];
	click.start = [-1,-1];
	if(force || mobile || click.but == SELECT_MOVE)
	{
		click.but = null;
		click.act = null;
	}
}

function getDisplayXY(e)
{
	var XY = [];
	
	if(mobile)
	{
		XY[0] = e.touches[e.touches.length -1].clientX;
		XY[1] = e.touches[e.touches.length -1].clientY;
	}
	else
	{
		XY[0] = e.clientX;
		XY[1] = e.clientY;
	}
			
	return XY;
}
	
function mobileSet(e)
{
	e.preventDefault();
	mobile = false;
}

function stopIt(e)
{
	e.preventDefault();
}
