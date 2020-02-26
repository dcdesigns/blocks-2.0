
//used to track when screen height changes (i.e. zoomed in) on ios
var landscapeLast = 10000;
var portraitLast = 10000;
var rotating = false;
var gameOver = false;

var deadLast = false;
var wasIdle = false;

//used for calculating target fading 
var flashingPhase = 0;
var phase = 0;
var targetAlpha = 1;
var optionAlpha = 0;
var lastTime = new Date();

//reset screen sizing to fill properly
function reConfigure()
{
	console.log(mobile, ios);
	if(!ios) document.body.style.overflow = 'hidden';
	
	//get new sizing
	var oldH = scrn.h;
	scrn.t = (window.pageYOffset || document.documentElement.scrollTop);
	scrn.l = (window.pageXOffset || document.documentElement.scrollLeft);
	scrn.w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	scrn.h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	scrn.maj = Math.max(scrn.w, scrn.h);
	scrn.min = Math.min(scrn.w, scrn.h);
	
	
	//try the four arrangements; pick the best one
	var bestSide = 0;	
	var oldFlipped = flipped;
	for(var i = 0; i < 4; i += 1)
	{
		var rotate = true;
		var butsVert = true;
		var area;
		
		if(level.size[0] == level.size[1] && (i < 2))
		{
			continue;
		}
		
		switch(i)
		{
			//vert screen, vert butts
			case 0:
				rotate = 1;
				butsVert = true;
				break;
			//vert screen, hor butts
			case 1:
				rotate = 1;
				butsVert = false;
				break;
			//hor screen, vert butts
			case 2:
				rotate = 0;
				butsVert = true;
				break;
			//hor screen, hor butts
			case 3:
				rotate = 0;
				butsVert = false;
				break;	
		}
		
		var butX, butY, butSide, sqSide, sqX, sqY;
		var butOff = [];
		if(butsVert)
		{
			butSide = Math.min(scrn.h/butts[0].length, scrn.h/butts[1].length, maxButton);
			butX = butSide;
			butY = 0;
			for(var j = 0; j < 2; j += 1)
			{
				butOff.push((scrn.h - butSide * butts[j].length) /2);
			}
		}
		else
		{
			butSide = Math.min(scrn.w/butts[0].length, scrn.w/butts[1].length, maxButton);
			butY = butSide;
			butX = 0;
			for(var j = 0; j < 2; j += 1)
			{
				butOff.push((scrn.w - butSide * butts[j].length) /2);
			}
		}
		var effX = level.size[0];
		var effY = level.size[1];
		if(rotate)
		{
			effX = level.size[1];
			effY = level.size[0];
		}
		sqSide = Math.min((scrn.w- 2* outBord-butX)/effX, (scrn.h - 2* outBord - butY)/effY);
		

		//if the current square size is better, set it as the best
		if(sqSide > bestSide)
		{
			bestSide = sqSide
			sqSide = Math.min(sqSide, maxSquare);
			
			sqX = (scrn.w - butX - effX * sqSide)/2;
			sqY = (scrn.h - butY - effY * sqSide)/2;
			
			//flipped = (!rotate) ? 0: (level.size[0] < level.size[1])? 1 : (level.playerStart[1] > level.size[1]/2) ? 1 : -1;
			flipped = 0;
			if(rotate)
			{
				if(level.size[0] < level.size[1])
				{
					if(level.playerStart[1] > level.size[1]/2) flipped = -1
					else flipped = 1;
				}
				else
				{
					if(level.playerStart[0] > level.size[0]/2) flipped = -1
					else flipped = 1;
				}
			}
			buttsFlipped = butsVert;
			scrn.sq = sqSide;
			scrn.but = butSide;
			scrn.butOff = butOff;
			scrn.sqReduc = sqSide * (1-bordPct);
			scrn.sqOff = sqSide * bordPct/2;
			scrn.butX = butX;
			scrn.butY = butY;
			scrn.sx = sqX;
			scrn.sy = sqY;
			scrn.tx = (flipped > 0)? scrn.sq * -flipped * level.size[0] : 0;
			scrn.ty = (flipped > 0)? 0 : scrn.sq * flipped * level.size[1];
			scrn.targetR = 2 * scrn.sq * Math.pow(2, .5);
			scrn.sqBuffer = sqBuffer * squareImg.height;
		}

	}
	console.log("flipped", flipped);
	
	//resize/translate/rotate canvases 
	for(var i = 0; i < canv.length; i += 1)
	{
		canv[i].width = scrn.w + scrollAmt;
		canv[i].height = scrn.h + scrollAmt;
		cx[i].resetTransform();
		cx[i].save();
		cx[i].translate(0, scrn.t);
		
		//rotate and move squares/player canvas
		if(i == MID || i == BASE)
		{
			cx[i].translate(scrn.sx, scrn.sy);
			cx[i].rotate(-Math.PI/2 * flipped);
			cx[i].translate(scrn.tx, scrn.ty);
		}
	}
	

	//ios: check if the screen height changed
	if(ios)
	{
		var comp_h;
		if(scrn.w > scrn.h)	comp_h = landscapeLast;
		else  comp_h = portraitLast;
		
		//height grew: zoomed in
		if(scrn.h > comp_h)
		{
			butts[0][0] = scrnButIosFull;
			butts[1][0] = scrnButIosFull;
			window.scrollTo(0, scrollAmt);
		}
		//height got smaller: zoomed out
		else if(scrn.h < comp_h)
		{
			butts[0][0] = scrnButIosNotFull;
			butts[1][0] = scrnButIosNotFull;
			window.scrollTo(0,0);
		}
		
		//save the current height
		if(scrn.w > scrn.h) landscapeLast = scrn.h;
		else portraitLast = scrn.h;

	}
	
	//redraw the level
	if(level.index > -1)
	{
		drawBase();	
	}

	level.drawn = true;
}

function drawButton(img, cx, imgInd, butInd)
{
	//horizontal buttons
	if(!buttsFlipped)
	{
		cx.drawImage(img, imgInd * img.height, 0, img.height, img.height,
			scrn.butOff[paused] + scrn.but * butInd, scrn.h - scrn.but, scrn.but, scrn.but);
	}
	//vertical buttons
	else
	{
		cx.drawImage(img, imgInd * img.height, 0, img.height, img.height,
			scrn.w - scrn.but, scrn.h - scrn.butOff[paused] - scrn.but * (butInd + 1), scrn.but, scrn.but);
	}
}

function drawButtonHighlight(cx, butInd, color, alpha, scale = 1)
{
	var size = (scrn.but * scale);
	var offset = (scrn.but - size)/2;
	cx.globalAlpha = alpha;
	cx.fillStyle = color;

	if(!buttsFlipped)
	{
		cx.fillRect(scrn.butOff[paused] + scrn.but * butInd + offset, scrn.h - scrn.but + offset, size, size);
	}
	else
	{
		cx.fillRect(scrn.w - scrn.but + offset, scrn.h - scrn.butOff[paused] - scrn.but * (butInd + 1) + offset, size, size);
	}
	cx.globalAlpha = 1;
}

//draws the buttons and game board
function drawBase()
{
	//reset and draw a black background
	cx[BACK].fillStyle = 'black';
	cx[BACK].fillRect(0,0,scrn.w,scrn.h);
	cx[BUT_CANV].clearRect(-5000,-5000, 10000, 10000);
	cx[BUT_CANV].clearRect(0, 0, canv[BASE].width, canv[BASE].height);

	//draw buttons: this canvas is not rotated
	for(var i = 0; i < butts[paused].length; i += 1)
	{
		drawButton(butImg, cx[BUT_CANV], butts[paused][i].imgInd, i);
	}
	
	
	
	for(var i = 0; i < level.size[0]; i += 1)
	{
		for(var j = 0; j < level.size[1]; j += 1)
		{
			drawSquare(i, j, level.squares[j][i].imgInd);
		}
	}
	
}


function drawSquare(ind_x, ind_y, imgInd)
{
	cx[BASE].clearRect(ind_x * (scrn.sq), ind_y * (scrn.sq), scrn.sq, scrn.sq);
	cx[BASE].drawImage(squareImg, (imgInd) * squareImg.height + scrn.sqBuffer, scrn.sqBuffer, squareImg.height - 2* scrn.sqBuffer, squareImg.height - 2*scrn.sqBuffer,
		scrn.sqOff + ind_x * (scrn.sq), scrn.sqOff + ind_y * (scrn.sq), scrn.sqReduc, scrn.sqReduc);
}


function drawTarget()
{
		
	if(level.index < helperLevels)
	{
		//create target lines emanating from the player
		cx[MID].beginPath();
		cx[MID].globalAlpha = 1;
		cx[MID].lineWidth = scrn.sq/20;
		cx[MID].strokeStyle = 'rgb(7,61,189)';
		var pX = (player.pos[0]) * (scrn.sq) + scrn.sq/2;
		var pY = (player.pos[1]) * (scrn.sq) + scrn.sq/2;
		
		for(var x = -2; x < 3; x += 1)
		{
			for(var y = -2; y < 3; y += 1)
			{
				if(validDelta([x, y]) && onBoard(player.pos, [x, y]))
				{

					tX = player.pos[0] + x;
					tY = player.pos[1] + y;
					cx[MID].moveTo(pX + x * scrn.sq, pY + y * scrn.sq);
					cx[MID].lineTo(pX, pY);
				}
			}
		}
		cx[MID].stroke();

		//erase lines outsize of the current radius
		var curR = scrn.targetR * optionAlpha;	
		cx[MID].globalAlpha = .6;
		cx[MID].globalCompositeOperation = 'destination-in';
		cx[MID].beginPath();
		cx[MID].arc(pX, pY, curR, 0, 2 * Math.PI);
		cx[MID].fill();

		//either erase parts of the inner radius or fade out
		curR -= scrn.sq/8;
		if(curR > 0)
		{
			//second half of phase: fade out
			if(optionAlpha > 1) cx[MID].globalAlpha = .4 + (optionAlpha - 1) * .6;
			
			//first half of phase: constant level
			else cx[MID].globalAlpha = .4;
			
			cx[MID].beginPath();
			cx[MID].arc(pX, pY, curR, 0, 2 * Math.PI);
			cx[MID].globalCompositeOperation = 'destination-out';
			cx[MID].fill();
		}
		cx[MID].globalCompositeOperation = 'source-over';
	}
	
	//highlight active target
	if(click.act == SELECT_MOVE && click.delta[0] !== null)
	{
		
		cx[MID].globalAlpha = targetAlpha;
		cx[MID].fillStyle = targetColor;
		//cx[MID].fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) + scrn.sqOff, (player.pos[1] + click.delta[1]) * (scrn.sq) + scrn.sqOff, scrn.sqReduc, scrn.sqReduc);
		cx[MID].fillRect((player.pos[0] + click.delta[0]) * (scrn.sq), (player.pos[1] + click.delta[1]) * (scrn.sq), scrn.sq, scrn.sq);
	}
	cx[MID].globalAlpha = 1;
	
}




function drawPlayer(elapsed)
{
	//scale player at and above base
	if(player.z >= 0) nowSize = scrn.sq * interp(0, player.z, playerJumpHeight, 1, playerScaleTopJump);
	
	//scale player falling off edge
	else nowSize = scrn.sq * interp(z_min, player.z, 0, 0, 1);

	cx[MID].save();
	cx[MID].translate((player.pos[0] + .5) * (scrn.sq), (player.pos[1] + .5) * (scrn.sq));
	cx[MID].rotate(player.theta);
	cx[MID].globalAlpha = player.opacity;
	cx[MID].drawImage(player.img, 0, 0, player.img.height, player.img.height, -.5 * nowSize, -.5 * nowSize, nowSize, nowSize);
	cx[MID].restore();
	cx[MID].globalAlpha = 1;
}

function animate()
{
	
	var newTime = new Date();
	var elapsed = Math.min(35, newTime - lastTime);
	lastTime = newTime;
	phase += elapsed;
	var sinVal = Math.sin( 2 * Math.PI * phase/targetMillis);
	targetAlpha = targetMean + targetScale * sinVal;
	if(player.state == IDLE)
	{
		if(!wasIdle) 
		{
			phase = 0;
			wasIdle = true;
		}
	}
	else wasIdle = false;
	
	optionAlpha = 2* (phase % targetMillis) / targetMillis;
	
	
	//check for screen changes and redraw if necessary	
	if(rotating == false && click.act !== SELECT_ZOOM && (level.drawn == false ||(window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || 
		(window.pageYOffset || document.documentElement.scrollTop) !== scrn.t || 
		(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) !== scrn.w || 
		(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) !== scrn.h))
	{
		reConfigure();	
	}
	

	//clear the temp canvases
	cx[MID].clearRect(-5000,-5000, 10000, 10000);
	cx[BUT_SEL_CANV].clearRect(0,0,canv[BUT_SEL_CANV].width, canv[BUT_SEL_CANV].height);
	
	
	//highlight buttons
	if((click.act === SELECT_ZOOM && click.but === SELECT_ZOOM_COL[paused]) || (click.act === SELECT_BUT && click.but !== SELECT_ZOOM_COL[paused] && click.but !== null && !butts[paused][click.but].ignore))
	{
		drawButtonHighlight(cx[BUT_SEL_CANV], click.but,'RGB(25,124,247)' , 1, 1);
	}
	
	//draw player/targets/status
	if(!paused)
	{
		//update animated squares
		for(var i = 0; i < level.animators.length; i += 1)
		{
			var anim = level.animators[i];
			anim.time += elapsed;
			if(anim.time > anim.animate.time)
			{
				anim.time = 0;
				anim.ind += 1;
				if(anim.ind > anim.animate.maxInd) anim.ind = anim.animate.minInd;
				
				drawSquare(anim.ind_x, anim.ind_y, anim.ind);
			}
		}
		
		
		cx[BUT_SEL_CANV].font = (scrn.but * .2) + 'px Roboto';
		cx[BUT_SEL_CANV].textAlign = 'center';
		cx[BUT_SEL_CANV].textBaseline = 'top';
		cx[BUT_SEL_CANV].fillStyle = 'rgb(135,135,135)';
		
		//horizontal buttons
		if(!buttsFlipped) cx[BUT_SEL_CANV].fillText("LEVEL " + (level.index + 1), scrn.butOff[paused] + scrn.but * (MOVES_DISPLAY + .5), scrn.h - scrn.but + scrn.but * .1);	
		
		//vertical buttons
		else cx[BUT_SEL_CANV].fillText("LEVEL " + (level.index + 1),  scrn.w - (.5 * scrn.but), scrn.h -scrn.butOff[paused] - scrn.but * (MOVES_DISPLAY + .9));
		
		//highlight restart/undo buttons if failed		
		if(failed())
		{
			//reset phase if we just failed
			if(deadLast == false) flashingPhase = 0;
			else flashingPhase += elapsed;
			
			var fade = .7 * Math.abs(Math.sin( 2 * Math.PI * flashingPhase/flashMillis));
			drawButtonHighlight(cx[BUT_SEL_CANV], UNDO_IND,'RGB(25,124,247)' , fade, .8);
			drawButtonHighlight(cx[BUT_SEL_CANV], RESTART_IND,'RGB(25,124,247)' , fade, .8);

			
			deadLast = true;
			//cx[BUT_SEL_CANV].globalAlpha = 1;
		}
		else
		{
			deadLast = false;
		}
		
		//highlight targets
		if(playerIdle()) // && click.delta[0] !== null)
		{
			drawTarget();
		}
		
		//draw moves counter
		var numberInd = level.moves - player.history.length;
		var cx_ind = BUT_SEL_CANV;
		if(player.state !== ACTIVE)
		{
			if(player.state == WINNING) 
			{
				numberInd = 10;
				cx_ind = BUT_CANV;
			}
			else
			{
				if([BURNING, FALLING].includes(player.state)) numberInd = 11;
				
				if(!buttsFlipped) cx[BUT_CANV].clearRect(scrn.butOff[paused] + scrn.but * MOVES_DISPLAY, scrn.h - scrn.but, scrn.but, scrn.but);
				else cx[BUT_CANV].clearRect(scrn.w - scrn.but, scrn.h - scrn.butOff[paused] - scrn.but * (MOVES_DISPLAY + 1), scrn.but, scrn.but);
					
			}
		}
		
		drawButton(numbersImg, cx[cx_ind], numberInd, MOVES_DISPLAY);

		//player
		updatePlayer(elapsed);
		drawPlayer(elapsed);
	}
	
	
	
	
	
	
	//next loop
	requestAnimationFrame(animate);
}





