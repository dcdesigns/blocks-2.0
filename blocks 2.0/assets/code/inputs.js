
function getButtonInd()
{
	var ret = null;
	if(click.end[0] > 0 && click.end[0] < scrn.w && click.end[1] > 0 && click.end[1] < scrn.h)
	{
		//buttons are vertical: check if x is in the button range
		if(scrn.butX && click.end[0] > scrn.w - scrn.butX) ret = Math.floor((scrn.h - click.end[1])/scrn.but)
		
		//buttons are horizontal: check if y is in the button range
		else if(scrn.butY && click.end[1] > scrn.h - scrn.butY) ret = Math.floor(click.end[0]/scrn.but);
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
	if(!validDelta(click.delta) || !onBoard(player.pos, click.delta))
	{
		click.delta[0] = null;
	}

}


function startClick(e)
{
	//check for mobile vs computer
	mobile = e.type.indexOf('touch') > -1;
	
	//set XY
	click.start = getDisplayXY(e);
	click.end = click.start;
	
	setActiveButton(true);
	
}

function moveClick(e)
{	
	//check for mobile vs computer
	mobile = e.type.indexOf('touch') > -1;
	
	//console.log("move");
	
	//prevent default action if we're not zooming
	if(click.act !== SELECT_ZOOM) e.preventDefault();
	
	if(!mobile && (click.start[0] == -1 && (click.act == SELECT_BUT || click.act == SELECT_MOVE || click.act == SELECT_ZOOM)))
	{
		click.act = null;
	}
	//if(click.act === null) return;
	
	click.end = getDisplayXY(e);
	setActiveButton(false);
}

function endClick(e)
{
	//zoom: toggle fullscreen (doesn't work on all platforms... looking at you ios) 
	if(click.act === SELECT_ZOOM)
	{
		if(!ios)
		{
			fullS = !fullS;
			var elem = document.documentElement;
			if(fullS)
			{
			 
				if (elem.requestFullscreen) elem.requestFullscreen();
				else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen();
				else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
				else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
				
				butts[0][0] = scrnButFull;
				butts[1][0] = scrnButFull;
			}
			else
			{
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
				else if (document.msExitFullscreen)  document.msExitFullscreen();
				
				butts[0][0] = scrnButNotFull;
				butts[1][0] = scrnButNotFull;
			}
		}
	}
	
	//buttons
	else if(click.act === SELECT_BUT && click.but !== null)
	{
		butts[paused][click.but].action();

	}
	
	//targets
	else if(click.act === SELECT_MOVE && click.delta[0] !== null && player.state == IDLE && !outOfMoves()) //&& not dead and moves left and blah blah
	{
		player.history.push(vectorCopy(player.pos));
		player.lastMatchPos = vectorCopy(player.pos);
		player.target = click.delta;
		startJump();
	}
	
	//reset place holders/action status
	click.but = null;
	click.delta = [null, null];
	click.start = [-1,-1];
	click.act = null;
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
	
function setSquareAction()
{
	if(onBoard(player.pos))
	{
		console.log("here, ", player.pos);
		console.log(level.squares[player.pos[1]][player.pos[0]]);
		level.squares[player.pos[1]][player.pos[0]].act();
	}
	else
	{
		player.jumping = false;
		player.nowMillis = 0;
	}
	
}
