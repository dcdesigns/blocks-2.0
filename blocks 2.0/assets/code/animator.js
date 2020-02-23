
//used to track when screen height changes (i.e. zoomed in) on ios
var landscapeLast = 10000;
var portraitLast = 10000;
var rotating = false;

var targetR = 1;
var deadLast = false;

//used for calculating target fading 
var flashingPhase = 0;
var phase = 0;
var targetAlpha = 1;
var optionAlpha = 0;
var lastTime = new Date();

//draws the buttons and game board
function drawBase()
{
	//clear canvases
	cx[0].fillStyle = 'black';
	cx[0].fillRect(0,0,scrn.w,scrn.h);
	cx[1].clearRect(0, 0, scrn.w, scrn.h);

	//front is not rotated so has to be dealt with differently
	cx[FRONT].clearRect(0, 0, canv[FRONT].width, canv[FRONT].height);
	
	//draw buttons
	for(var i = 0; i < butts[paused].length; i += 1)
	{
		//horizontal buttons
		if(!buttsFlipped)
		{
			cx[FRONT].drawImage(butImg, butts[paused][i].imgInd * butImg.height, 0, butImg.height, butImg.height,
				scrn.but * i, scrn.h - scrn.but, scrn.but, scrn.but);
		}
		//vertical buttons
		else
		{
			cx[FRONT].drawImage(butImg, butts[paused][i].imgInd * butImg.height, 0, butImg.height, butImg.height,
						 scrn.w - scrn.but, scrn.h - scrn.but * (i + 1), scrn.but, scrn.but);
		}
	}
	
	
	
	
	
	//draw squares... currently just loops through the images 
	//drawing all the different squares
	//todo: actually draw a level
	var sqInd = 0;

	cx[1].fillStyle = 'black';
	
	var sqBuffer = squareImg.height * .005;
	
	for(var i = 0; i < level.size[0]; i += 1)
	{
		for(var j = 0; j < level.size[1]; j += 1)
		{
			var sqInd = level.squares[j][i].imgInd;
			cx[1].drawImage(squareImg, (sqInd) * squareImg.height + sqBuffer, sqBuffer, squareImg.height - 2* sqBuffer, squareImg.height - 2*sqBuffer,
						scrn.sqOff + i * (scrn.sq), scrn.sqOff + j * (scrn.sq), scrn.sqReduc, scrn.sqReduc);
			sqInd += 1;
			if(sqInd >= squares) sqInd = 0;
		}
	}
	
}



function drawTarget()
{
	
	var sAng = -Math.PI/8 + click.sect * Math.PI/4;
	var eAng = sAng + Math.PI/4;
	var oR = 0;
	var iR = 0
	
	
	
	cx[MID].fillStyle = 'white';
	//cx[MID].lineCap = "round";
	
	
	
	cx[MID].beginPath();
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
	/* cx[MID].globalAlpha = optionAlpha * .9;
	cx[MID].lineWidth = scrn.sq/9;
	cx[MID].strokeStyle = 'white';
	cx[MID].stroke(); */
	cx[MID].globalAlpha = 1;
	//cx[MID].globalAlpha = 1;//optionAlpha;
	cx[MID].lineWidth = scrn.sq/20;
	cx[MID].strokeStyle = 'rgb(7,61,189)';
	cx[MID].stroke();
	
	cx[MID].globalAlpha = .6;
	
	
	var mainR = targetR * optionAlpha;
	cx[MID].beginPath();
	cx[MID].arc(pX, pY, mainR, 0, 2 * Math.PI);
	cx[MID].globalCompositeOperation = 'destination-in';
	cx[MID].fill();

	mainR -= scrn.sq/8;
	//cx[MID].setLineDash([scrn.sq/7, scrn.sq/7]);
	if(mainR > 0)
	{
		if(optionAlpha > 1) cx[MID].globalAlpha = .4 + (optionAlpha - 1) * .6;
		else cx[MID].globalAlpha = .4;
		cx[MID].beginPath();
		cx[MID].arc(pX, pY, mainR, 0, 2 * Math.PI);
		cx[MID].globalCompositeOperation = 'destination-out';
		cx[MID].fill();
	}
	cx[MID].globalCompositeOperation = 'source-over';
	
	
	
	if(click.act == SELECT_MOVE && click.delta[0] !== null)
	{
		cx[MID].globalAlpha = targetAlpha;
		cx[MID].fillStyle = 'RGB(255,255,255)';
		cx[MID].fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) + scrn.sqOff, (player.pos[1] + click.delta[1]) * (scrn.sq) + scrn.sqOff, scrn.sqReduc, scrn.sqReduc);
	}
	cx[MID].globalAlpha = 1;
	
}

//reset screen sizing to fill properly
function reConfigure()
{
	console.log(mobile, ios);
	if(!ios) document.body.style.overflow = 'hidden';
	
	//get new sizing
	var oldW = scrn.w;
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
		if(butsVert)
		{
			butSide = scrn.h/butts[paused].length;
			butX = butSide;
			butY = 0;
		}
		else
		{
			butSide = scrn.w/butts[paused].length;
			butY = butSide;
			butX = 0;
		}
		var effX = level.size[0];
		var effY = level.size[1];
		if(rotate)
		{
			effX = level.size[1];
			effY = level.size[0];
		}
		sqSide = Math.min((scrn.w- 2* outBord-butX)/effX, (scrn.h - 2* outBord - butY)/effY);
		sqX = (scrn.w - butX - effX * sqSide)/2;
		sqY = (scrn.h - butY - effY * sqSide)/2;

		if(sqSide > bestSide)
		{
			bestSide = sqSide
			flipped = (!rotate) ? 0: (level.size[0] < level.size[1])? 1 : -1;
			buttsFlipped = butsVert;
			scrn.sq = sqSide;
			scrn.but = butSide;
			scrn.sqReduc = sqSide * (1-bordPct);
			scrn.sqOff = sqSide * bordPct/2;
			scrn.butX = butX;
			scrn.butY = butY;
			scrn.sx = sqX;
			scrn.sy = sqY;
			scrn.tx = (flipped > 0)? scrn.sq * -flipped * level.size[0] : 0;
			scrn.ty = (flipped > 0)? 0 : scrn.sq * flipped * level.size[1];
		}

	}
	
	targetR = 2 * scrn.sq * Math.pow(2, .5);
	
	//resize/translate/rotate canvases 
	for(var i = 0; i < canv.length; i += 1)
	{
		canv[i].width = scrn.w + scrollAmt;
		canv[i].height = scrn.h + scrollAmt;
		cx[i].resetTransform();
		cx[i].save();
		cx[i].translate(0, scrn.t);
		
		if(i > 0 && i < 5)
		{
			console.log(i);
			cx[i].translate(scrn.sx, scrn.sy);
			cx[i].rotate(-Math.PI/2 * flipped);
			cx[i].translate(scrn.tx, scrn.ty);
		}
	}
	

	//ios: check if the screen height is higher than the initially stored value. If it is, we're zoomed in
	if(ios)
	{
		var comp_h;
		if(scrn.w > scrn.h)	comp_h = landscapeLast;
		else  comp_h = portraitLast;
		
		if(scrn.h > comp_h)
		{
			butts[0][0] = scrnButIosFull;
			butts[1][0] = scrnButIosFull;
			window.scrollTo(0, scrollAmt);
		}
		else if(scrn.h < comp_h)
		{
			butts[0][0] = scrnButIosNotFull;
			butts[1][0] = scrnButIosNotFull;
			window.scrollTo(0,0);

		}
		
		if(scrn.w > scrn.h) landscapeLast = scrn.h;
		else portraitLast = scrn.h;

	}
	//redraw the screen
	if(level.index > -1)
	{
		drawBase();	
	}

	level.drawn = true;
}
/* 
function screenRotate(oldW, oldH, newW, newH)
{
	if((oldW < oldH && newW > newH) || (oldW > oldH && newW < newH))
	{
		landscapeLast = 10000;
		portraitLast = 10000;
		return true;
	}
} */

function drawPlayer(elapsed)
{
/* 	if(player.state == DEAD) return;
	
	var tPos = [];
	var scale = 0;
			
	//check for end of move
	if(playerActive() && player.nowMillis >= player.moveMillis)
	{
		player.pos = vectorAdd(player.pos, player.target);
		player.nowMillis = 0;
		setSquareAction();
		
		console.log("end of move");

		if(player.state == DEAD) return;
	}
	
	
	//check for active move
	if(playerActive())
	{
		player.nowMillis += elapsed;
		scale = player.nowMillis/player.moveMillis;
		tPos = vectorAdd(player.pos, vectorScale(player.target, scale));
	}
	//idle
	else
	{
		tPos = player.pos;	
	}
	
	if(player.jumping)  player.height = 1 + .9 * (Math.sin(Math.PI * scale));
	else player.height = 1;
	
	if(player.spinning) player.theta = 2 * Math.PI * scale;
	else player.theta = 0;
	
	if(player.fading)
	{
		cx[MID].globalAlpha = Math.max(1 - scale, 0);
		console.log(1 - scale, scale);
	} 
	else cx[MID].globalAlpha = 1;
	*/
	cx[MID].globalAlpha = player.opacity;
	
	if(player.z >= 0) nowSize = scrn.sq * interp(0, player.z, playerJumpHeight, 1, playerScaleTopJump);
	else nowSize = scrn.sq * interp(z_min, player.z, 0, 0, 1);
	//console.log("now size", nowSize);
	//console.log(player.z_min, player.z, playerJumpHeight, playerScaleTopJump, nowSize);
	//console.log(nowSize);
	cx[MID].save();
	cx[MID].translate((player.pos[0] + .5) * (scrn.sq), (player.pos[1] + .5) * (scrn.sq));
	cx[MID].rotate(player.theta);
	cx[MID].drawImage(player.img, 0, 0, player.img.height, player.img.height, -.5 * nowSize, -.5 * nowSize, nowSize, nowSize);
	cx[MID].restore();
	cx[MID].globalAlpha = 1;
}

function animate()
{
	
	var newTime = new Date();
	var elapsed = newTime - lastTime;
	lastTime = newTime;
	phase += elapsed;
	var sinVal = Math.sin( 2 * Math.PI * phase/targetMillis);
	targetAlpha = targetMean + targetScale * sinVal;
	optionAlpha = 2* (phase % targetMillis) / targetMillis;
	
	
	//check for screen changes and redraw if necessary	
	if(rotating == false && click.act !== SELECT_ZOOM && (level.drawn == false ||(window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || 
		(window.pageYOffset || document.documentElement.scrollTop) !== scrn.t || 
		(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) !== scrn.w || 
		(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) !== scrn.h))
	{
		reConfigure();	
	}
	
	
	
	//clear the temp canvas
	//if(flipped) cx[MID].clearRect(-scrn.sy,-scrn.sx,canv[MID].width, canv[MID].height);
	cx[MID].clearRect(-5000,-5000, 10000, 10000);
	cx[BUT_CANV].clearRect(0,0,canv[BUT_CANV].width, canv[BUT_CANV].height);
	cx[MID].fillStyle = 'RGB(25,124,247)';
	cx[BUT_CANV].fillStyle = 'RGB(25,124,247)';
	
	//highlight buttons
	if((click.act === SELECT_ZOOM && click.but === SELECT_ZOOM_COL[paused]) || (click.act === SELECT_BUT && click.but !== SELECT_ZOOM_COL[paused] && click.but !== null && !butts[paused][click.but].ignore))
	{

		if(!buttsFlipped)
		{
			cx[BUT_CANV].fillRect(scrn.but * click.but, scrn.h - scrn.but, scrn.but, scrn.but);
			
			
		}
		else
		{
			cx[BUT_CANV].fillRect(scrn.w - scrn.but, scrn.h - scrn.but * (click.but + 1), scrn.but, scrn.but);
			
			if([FALLING, BURNING, DEAD].includes(player.state) || (!([ACTIVE, WINNING].includes(player.state)) && outOfMoves()))
			{
				console.log("dead");
				
			}
		}

	}
	
	if(!paused)
	{
		cx[BUT_CANV].font = (scrn.but * .2) + 'px Roboto';
		cx[BUT_CANV].textAlign = 'center';
		cx[BUT_CANV].textBaseline = 'top';
		cx[BUT_CANV].fillStyle = 'rgb(135,135,135)';
		
		//horizontal buttons
		if(!buttsFlipped)
		{
			cx[BUT_CANV].fillText("LEVEL " + (level.index + 1), scrn.but * (MOVES_DISPLAY + .5), scrn.h - scrn.but + scrn.but * .1);	
		}
		//vertical buttons
		else
		{
			cx[BUT_CANV].fillText("LEVEL " + (level.index + 1),  scrn.w - (.5 * scrn.but), scrn.h - scrn.but * (MOVES_DISPLAY + .9));
		}
		
		
		if([FALLING, BURNING, DEAD].includes(player.state) || (!([ACTIVE, WINNING].includes(player.state)) && outOfMoves()))
		{
			if(deadLast == false)
			{
				flashingPhase = 0;
				
			}
			else
			{
				flashingPhase += elapsed;
			}
			
			//console.log("dead");
			cx[BUT_CANV].fillStyle = 'RGB(25,124,247)';;//'rgb(111,0,41)';
			var reduc = scrn.but * .1;
			var newSz = scrn.but -2 * reduc;
			cx[BUT_CANV].globalAlpha = .7 * Math.abs(Math.sin( 2 * Math.PI * flashingPhase/flashMillis));
			if(!buttsFlipped)
			{
				cx[BUT_CANV].fillRect(scrn.but * UNDO_IND + reduc, scrn.h - scrn.but + reduc, scrn.but -2 * reduc, newSz);
				cx[BUT_CANV].fillRect(scrn.but * RESTART_IND + reduc, scrn.h - scrn.but + reduc, scrn.but -2 * reduc, newSz);
			}
			else
			{
				cx[BUT_CANV].fillRect(scrn.w - scrn.but + reduc, scrn.h - scrn.but * (UNDO_IND + 1) + reduc, newSz, newSz);
				cx[BUT_CANV].fillRect(scrn.w - scrn.but + reduc, scrn.h - scrn.but * (RESTART_IND + 1) + reduc, newSz, newSz);
			}
			
			deadLast = true;
			cx[BUT_CANV].globalAlpha = 1;
		}
		else
		{
			deadLast = false;
		}
		
		//highlight targets
		if(player.state == IDLE && !outOfMoves()) // && click.delta[0] !== null)
		{
			drawTarget();
		}
		
		//draw moves counter
		var numberInd = level.moves - player.history.length;
		if(player.state !== ACTIVE)
		{
			if(player.state == WINNING) numberInd = 10;
			else if([BURNING, FALLING].includes(player.state)) numberInd = 11;
		}
		//player
		updatePlayer(elapsed);
		//console.log(player.opacity, player.theta, player.omega, player.state);
		drawPlayer(elapsed);
	}
	
	//horizontal buttons
	if(!buttsFlipped)
	{
		
		
		cx[BUT_CANV].drawImage(numbersImg, numberInd * numbersImg.height, 0, numbersImg.height, numbersImg.height,
			scrn.but * MOVES_DISPLAY, scrn.h - scrn.but, scrn.but, scrn.but);
		
		
	}
	//vertical buttons
	else
	{
		cx[BUT_CANV].drawImage(numbersImg, numberInd * numbersImg.height, 0, numbersImg.height, numbersImg.height,
					 scrn.w - scrn.but, scrn.h - scrn.but * (MOVES_DISPLAY + 1), scrn.but, scrn.but);
	}
	
	
	
	
	//next loop
	requestAnimationFrame(animate);
}


function nextLevel() 
{
	if (level.index >= GAME_LEVELS.length - 1) 
	{
		alert("you win");
		gameOver = true;
		return;
	}
	
	click.act = null;
	killAll();

	level.index += 1;
	
	
	var curLevel = GAME_LEVELS[level.index];
	level.size = [curLevel.map[0].length, curLevel.map.length];
	level.moves = curLevel.moves;
	player.movesLeft = level.moves;
	player.history = [];
	player.pos = vectorCopy(curLevel.player);
	player.lastMatchPos = vectorCopy(curLevel.player);
	
	//get the level map
	level.squares = [];
	level.portals = [];

	for(var y = 0; y < level.size[1]; y += 1) 
	{
		var row = [];
		for(var x = 0; x < level.size[0]; x += 1)
		{
			var square = sqCodes[curLevel.map[y][x]];
			row.push(square);
			if(square == Portal) level.portals.push([x, y]);
			
		}
		level.squares.push(row);
	}
	level.drawn = false;
	player.goalLoops = 0;
	console.log("made the level: ", level.size, level.squares[0].length, level.squares.length);
	
	lastTime = new Date();
	return true;
}


