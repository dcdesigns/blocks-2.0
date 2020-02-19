function test_inputs()
{
	console.log("inputs");
}
console.log("heeeeee");
function getButtonInd()
{
	if(click.end[0] > 0 && click.end[0] < scrn.w && click.end[1] > 0 && click.end[1] < scrn.h)
	{
		if(scrn.butX && click.end[0] > scrn.w - scrn.butX) return Math.floor((scrn.h - click.end[1])/scrn.but)
		else if(scrn.butY && click.end[1] > scrn.h - scrn.butY) return Math.floor(click.end[0]/scrn.but);
	}
	return null;
}

function getGridXY()
{
}	

function setActiveButton(isStart)
{
	if(!isStart)
	{
		//ignore if target is active
		if(click.act === SELECT_MOVE) return false;
	
		//ignore if zooming is active
		if(click.act === SELECT_ZOOM) return true;
	}
	
	click.but = getButtonInd();
	if(click.but === null) return false;
	else if(isStart)
	{
		if(click.but === SELECT_ZOOM_COL[paused])
		{
			click.act = SELECT_ZOOM;
			//window.scrollTo(0, 0);
			reConfigure();
		}	
		else
		{
			click.act = SELECT_BUT;
		}		
	}
	return true;
}

function setActiveTarget(isStart)
{
	if(isStart) click.act = SELECT_MOVE;
	
	//ignore if target was not set at start
	if(click.act !== SELECT_MOVE) return false;
	
	click.del[0] = null;
	//find the target angle and quantized angle
	click.theta = Math.atan2(click.end[1]-click.start[1], click.end[0]-click.start[0]);
	if(click.theta < 0) click.theta += Math.PI * 2;
	click.sect = Math.floor((click.theta + Math.PI /8)/(Math.PI/4))%8;
	click.thetaQ = click.sect * Math.PI/4;
	
	//find the scale of the move
	click.dist = distance(click.end, click.start);
	click.scl = -1;
	if(click.dist < targCircT) click.scl = 0;
	else if(click.dist < targInT) click.scl = 1;	
	else if(click.dist < targOutT) click.scl = 2;
	click.dist = Math.min(JOY_MAX, click.dist);
	
	//calculate move delta (if valid target)
	if(click.scl > -1)
	{
		var cos = Math.cos(click.sect * Math.PI/4);
		var xSgn = (cos > 0)? 1: -1;
		var sin = Math.sin(click.sect * Math.PI/4);
		var ySgn = (sin > 0)? 1: -1;
		click.del[0] = ((Math.abs(cos) > .7)? click.scl: 0) * xSgn;
		click.del[1] = ((Math.abs(sin) > .7)? click.scl: 0) * ySgn;

	}
}


function startClick(e)
{
	console.log("start tart");
	//check for mobile vs computer
	mobile = e.type.indexOf('touch') > -1;
	
	//set XY
	click.start = getStandardXY(e);
	click.end = click.start;
	
	if(!setActiveButton(true)) setActiveTarget(true);
	
}

function moveClick(e)
{
	//get rid of scroll bars on pc
	/* if(mobile && e.type === 'mousemove')
	{
		mobile = false;
		reConfigure();
	} */
	
	//prevent default action if we're not zooming
	if(click.act !== SELECT_ZOOM) e.preventDefault();
	
	if(click.act === null) return;
	
	click.end = getStandardXY(e);
	if(!setActiveButton(false)) setActiveTarget(false);
}

function endClick(e)
{
	//zoom: toggle fullscreen (doesn't work on all platforms) 
	if(click.act === SELECT_ZOOM)
	{
		fullS = !fullS;
		var elem = document.documentElement;
		
		if(!ios)
		{
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
	else if(click.act === SELECT_MOVE && click.del[0] !== null) //&& not dead and moves left and blah blah
	{
		player.pos = vectorAdd(player.pos, click.del);
	}
	
	console.log('resetiing');
	//reset place holders/action status
	click.but = null;
	click.del = [null, null];
	click.act = null;
}

function getStandardXY(e)
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
	
/* function updateClick(e)
{
	//click.end = getXY(e);
	click.but = [null, null];
	click.del = [null, null];
		
	//zoom (keep it highlighted regardless of position)
	if(click.act === SELECT_ZOOM)
	{
		click.but[1] = SELECT_BUT;
		click.but[0] = SELECT_ZOOM_COL[paused];
	}
	
	//buttons 
	else if(click.act === SELECT_BUT)
	{
		if(click.end[1] >= (scrn.maj - scrn.but))
		{
			click.but[1] = SELECT_BUT;
			click.but[0] = Math.floor(click.end[0]/scrn.but);

			if(click.but[0] === SELECT_ZOOM_COL[paused] || butts[paused][click.but[0]].ignore)
			{
				click.but[0] = null;
			}
		}
	}
	
	//targets 
	else if(click.act === SELECT_MOVE)
	{
		click.del[0] = null;
		//find the target angle and quantized angle
		click.theta = Math.atan2(click.end[1]-click.start[1], click.end[0]-click.start[0]);
		if(click.theta < 0) click.theta += Math.PI * 2;
		click.sect = Math.floor((click.theta + Math.PI /8)/(Math.PI/4))%8;
		click.thetaQ = click.sect * Math.PI/4;
		
		//find the scale of the move
		click.dist = distance(click.end, click.start);
		click.scl = -1;
		if(click.dist < targCircT) click.scl = 0;
		else if(click.dist < targInT) click.scl = 1;	
		else if(click.dist < targOutT) click.scl = 2;
		click.dist = Math.min(JOY_MAX, click.dist);
		
		//calculate move delta (if valid target)
		if(click.scl > -1)
		{
			var cos = Math.cos(click.sect * Math.PI/4);
			var xSgn = (cos > 0)? 1: -1;
			var sin = Math.sin(click.sect * Math.PI/4);
			var ySgn = (sin > 0)? 1: -1;
			click.del[0] = ((Math.abs(cos) > .7)? click.scl: 0) * xSgn;
			click.del[1] = ((Math.abs(sin) > .7)? click.scl: 0) * ySgn;

		}
	}
} */


