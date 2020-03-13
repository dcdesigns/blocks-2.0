
//used to track when screen height changes (i.e. zoomed in) on ios
var landscapeLast = 10000;
var portraitLast = 10000;
var rotating = false;
var gameOver = false;

var deadLast = false;
var wasIdle = false;
var wasHint = false;

//used for calculating target fading 
var flashingPhase = 0;
var phase = 0;
var targetAlpha = 1;
var optionAlpha = 0;
var lastTime = new Date();
var bridgeBuffer = 1;
var lastCX = null;
var idleMillis = 0;
var idleFlash = false;
var hintActive = false;

function posToPix(pos)
{
	return [scrn.sx + (pos[0] + .5) * scrn.sq, scrn.sy + (pos[1] + .5) * scrn.sq];
}

//reset screen sizing to fill properly
function reConfigure()
{
	//console.log(mobile, ios);
	if(!ios) document.body.style.overflow = 'hidden';
	
	//get new sizing
	var oldH = scrn.h;
	scrn.t = (window.pageYOffset || document.documentElement.scrollTop);
	scrn.l = (window.pageXOffset || document.documentElement.scrollLeft);
	scrn.w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	scrn.h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	
	// if(isFullScreen) scrn.h = Math.min(scrn.h, screen.availHeight);
	// if(isFullScreen) scrn.w = Math.min(scrn.w, screen.availWidth);
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
		sqSide = Math.min((scrn.w- butX)/(effX + 2 * outBord), (scrn.h - butY)/(effY + 2 * outBord));
		

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
			scrn.imgBuffer = imgBuffer * squareImg.height;
			scrn.imgReduc = squareImg.height - 2 * scrn.imgBuffer;
			scrn.sqBuffer = sqBuffer * scrn.sqReduc;
			scrn.sqReducPlus = scrn.sqReduc + 2 * scrn.sqBuffer;
			scrn.targetSq = scrn.sq * targetSize;
			scrn.targetOff = (scrn.targetSq - scrn.sq) /2;
			
			
			if(!flipped)
			{
				scrn.centerIndX = centerRatio(level.size[0],  focusHor);
				scrn.centerIndY = centerRatio(level.size[1],  focusVert);
			}
			else if(flipped < 0)
			{
				scrn.centerIndX = centerRatio(level.size[0], focusVert);
				scrn.centerIndY = centerRatio(level.size[1], focusHor, true);
			}
			else
			{
				scrn.centerIndX = centerRatio(level.size[0], focusVert, true);
				scrn.centerIndY = centerRatio(level.size[1], focusHor);
			}
			scrn.centerIndX = Math.floor(scrn.centerIndX) + .5;
			scrn.centerIndY = Math.floor(scrn.centerIndY) + .5;

			scrn.centerX = scrn.centerIndX * scrn.sq;
			scrn.centerY = scrn.centerIndY * scrn.sq;
			scrn.centerIndX -= .5;
			scrn.centerIndY -= .5;
			scrn.radius = (scrn.sqReduc/2)/(Math.sin(Pi_4));
			player.radius = (scrn.sqReduc * playerSize/2)/(Math.sin(Pi_4));
			bridgeBuffer = bridgeBufferScale * scrn.imgBuffer;
			
			if(!flipped)
			{
				scrn.adjL = - scrn.sx;
				scrn.adjT = -scrn.sy;
				scrn.adjW = scrn.w;
				scrn.adjH = scrn.h;
			}
			else 
			{
				scrn.adjT = - scrn.sx;
				scrn.adjL = -scrn.sy;
				scrn.adjW = scrn.h;
				scrn.adjH = scrn.w;
			}
		}

	}
	console.log("flipped", flipped);
	//console.log(butSide);
	
	//resize/translate/rotate canvases 
	for(var i = 0; i < canv.length; i += 1)
	{
		canv[i].width = scrn.w + scrollAmt;
		canv[i].height = scrn.h + scrollAmt;
		cx[i].resetTransform();
		cx[i].save();
		cx[i].translate(0, scrn.t);
		
		//rotate and move squares/player canvas
		if(!([BUT_CANV, BUT_SEL_CANV, BACK].includes(i)))
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
	if(level.index > -1 && level.index < GAME_LEVELS.length)
	{
		drawBase();	
	}
	
	if(level.drawn == false)
	{
		player.pos = vectorCopy(level.playerStart);
		player.lastMatchPos = vectorCopy(level.playerStart);
		killXY();
		level.drawn = true;
		idleMillis = 0;
		idleFlash = false;
	}
}

function centerRatio(dimension, setting, invert = false)
{
	if(!invert)
	{
		if(setting[0] == 'outer')
		{
			if(setting[1] < 0) return setting[1];
			else return dimension + setting[1];
		}
		else
		{
			return dimension * setting[1];
		}
	}
	else
	{
		if(setting[0] == 'outer')
		{
			if(setting[1] < 0) return dimension - setting[1];
			else return -setting[1];
		}
		else
		{
			return dimension * (1 - setting[1]);
		}
	}
}
	

function drawButton(img, cx, imgInd, butInd, clearIt = false)
{
	//horizontal buttons
	if(!buttsFlipped)
	{
		if(clearIt) cx.clearRect(scrn.butOff[paused] + scrn.but * butInd, scrn.h - scrn.but, scrn.but, scrn.but);
		cx.drawImage(img, imgInd * img.height, 0, img.height, img.height,
			scrn.butOff[paused] + scrn.but * butInd, scrn.h - scrn.but, scrn.but, scrn.but);
	}
	//vertical buttons
	else
	{
		if(clearIt) cx.clearRect(scrn.w - scrn.but, scrn.h - scrn.butOff[paused] - scrn.but * (butInd + 1), scrn.but, scrn.but);
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

/* function drawBridge(pX, pY, sizeX, sizeY)
{
	
	cx[BASE].drawImage(squareImg, (Ice.imgInd) * squareImg.height + bridgeBuffer, bridgeBuffer, squareImg.height - 2 * bridgeBuffer, squareImg.height - 2 * bridgeBuffer,
		pX, pY, sizeX, sizeY);
}

function connectIce()
{
	var sizeXhor = 2 * scrn.sqOff;
	var sizeYhor = sizeXhor * .2;
	var sizeXvert = sizeYhor;
	var sizeYvert = sizeXhor;
	cx[BASE].globalAlpha = 1;
	for(var y = 0; y < level.size[1]; y += 1)
	{
		var pYhor = (y + .5) * scrn.sq - sizeYhor/2;
		var pYvert = (y) * scrn.sq + scrn.sqReduc + scrn.sqOff;
		for(var x = 0; x < level.size[0]; x += 1)
		{
			if(level.squares[y][x] == Ice)
			{				
				//check hor to right
				if(x < level.size[0] - 1 && level.squares[y][x + 1] == Ice)
				{
					var pXhor = (x) * scrn.sq + scrn.sqReduc + scrn.sqOff;
					drawBridge(pXhor, pYhor, sizeXhor, sizeYhor);
				}
				
				//check vert down
				if(y < level.size[1] - 1 && level.squares[y + 1][x] == Ice)
				{
					var pXvert = (x + .5) * scrn.sq - sizeXvert/2;
					drawBridge(pXvert, pYvert, sizeXvert, sizeYvert);
				}
				
				//check diag down right
				if(x < level.size[0] - 1 && y < level.size[1] - 1 && level.squares[y + 1][x + 1] == Ice)
				{
					cx[BASE].save();
					cx[BASE].translate(scrn.sq * (x + 1), scrn.sq * (y + 1));
					cx[BASE].rotate(Pi_4);
					cx[BASE].translate(-scrn.sq/2  , -sizeYhor/2);
					drawBridge(0, 0, scrn.sq, sizeYhor);
					cx[BASE].restore();
				}
				
				//check diag down left
				if(x > 0 && y < level.size[1] - 1 && level.squares[y + 1][x - 1] == Ice)
				{
					cx[BASE].save();
					cx[BASE].translate(scrn.sq * (x), scrn.sq * (y + 1));
					cx[BASE].rotate(-Pi_4);
					cx[BASE].translate(-scrn.sq/2  , -sizeYhor/2);
					drawBridge(0, 0, scrn.sq, sizeYhor);
					cx[BASE].restore();
				}
			}
		}
	}
	cx[BASE].globalAlpha = 1;
} */

function drawRoads()
{
	cx[GROUND].fillStyle = COLOR_ROADS;
	
	var height =  - blockDepth;
	
	//convert postion to pixels
	var pos0 = posToPix([0,0]);
	var pos1 = posToPix([1,0]);
	
	var xIndMin = 0;
	var xIndMax = 0;
	var yIndMin = 0;
	var yIndMax = 0;
	
	//scale x, y, radius
	var adj0 = [scrn.centerX + adjust(height, pos0[0] - scrn.centerX, posXYScale), scrn.centerY + adjust(height, pos0[1] - scrn.centerY, posXYScale)];
	var adj1 = [scrn.centerX + adjust(height, pos1[0] - scrn.centerX, posXYScale), scrn.centerY + adjust(height, pos1[1] - scrn.centerY, posXYScale)];
	var adjR = adjust(height, scrn.radius, posRadiusScale, 1);	
	
	//locate the four corners
	var pts0 = roundPts(getPoints(adj0[0], adj0[1], adjR, 0));
	var pts1 = roundPts(getPoints(adj1[0], adj1[1], adjR, 0));
	
	var w = (pts1[0][0] - pts0[1][0]);
	var l = pts0[1][0];
	var t = pts0[3][1];
	var gap = pts0[1][0] - pts0[0][0] + w;

	while(l > scrn.adjL)
	{
		l -= gap;
		--xIndMin;
	}
	xIndMax = xIndMin;
	
	while(l < scrn.adjW + scrn.adjL)
	{
		cx[GROUND].fillRect(l-2, scrn.adjT, w + 4, scrn.adjH);
		l += gap;
		++xIndMax;
	}
	
	while(t > scrn.adjT)
	{
		t -= gap;
		--yIndMin;
	}
	yIndMax = yIndMin;
	while(t < scrn.adjT + scrn.adjH)
	{
		cx[GROUND].fillRect(scrn.adjL, t - 2, scrn.adjW, w + 4);
		t += gap;
		++yIndMax;
	}
	
	var xRange = xIndMax - xIndMin;
	var yRange = yIndMax - yIndMin;
	
	console.log(xIndMin, xIndMax, yIndMin, yIndMax);
	var sorted = [];
	var dists = [];
	var used = [];
	console.log(xRange * yRange);
	var cnt = xRange * yRange / 4;
	for(var i = 0; i < cnt; i += 1)
	{
		var xInd = Math.round(Math.random() * xRange + xIndMin);
		var yInd = Math.round(Math.random() * yRange + yIndMin);
		var depth = Math.random() * (.4* blockDepth);
		var r1 = depth/(-z_min);
		var r2 = 1 - r1;
		var height = -(blockDepth - depth);
		if((xInd < 0 || xInd > level.size[0] - 1) || (yInd < 0 || yInd > level.size[1] - 1) || level.squares[yInd][xInd] == EmptySquare)
		{
			var beenUsed = false;
			for(var u = 0; u < used.length; u += 1)
			{
				if(used[u][0] == xInd && used[u][1] == yInd) 
				{
					beenUsed = true;
					break;
				}
			}
			if(beenUsed) continue;
			
			var dist = Math.pow(Math.pow(xInd - scrn.centerIndX, 2) + Math.pow(yInd - scrn.centerIndY, 2), .5);

			var j;
			for(j = 0; j < dists.length; j += 1)
			{
				if(dist > dists[j]) break;
			}
			sorted.splice(j, 0, [[xInd, yInd], depth]);
			dists.splice(j, 0, dist);
			used.push([xInd, yInd]);
		}
	}
	return [sorted, dists];
	
	

}
var backRGB  = [100,100,100];
var colorVar = 15;
function RandRGB(gray = false)
{
	var RGB = [];
	var varLeft = colorVar;
	for(var i = 0; i < 3; i += 1)
	{
		//console.log(blend);
		var del = (- varLeft) + Math.random() * (varLeft) * 2;
		del = Math.min(del, 255-backRGB[i]);
		del = Math.max(del, -backRGB[i]);
		RGB.push(Math.floor(backRGB[i]+del));
		RGB[i] = Math.floor(RGB[i]);
		if(gray)
		{
			RGB.push(RGB[0]);
			RGB.push(RGB[0])
			return RGB;
		}
		
		
		varLeft -= Math.abs(del);
	}
	return RGB;
}

function arrToRGB(arr)
{
	return 'RGB(' + arr[0] + ',' + arr[1] + ',' + arr[2] + ')'; 
}

//draws the buttons and game board
function drawBase()
{
	//reset and draw a black background
	cx[GROUND].fillStyle = COLOR_BACK;
	cx[GROUND].fillRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
	cx[BACK].clearRect(0,0, scrn.w,scrn.h);
	cx[BUT_CANV].clearRect(0, 0, canv[BASE].width, canv[BASE].height);
	
	//horizontal buttons
	cx[BACK].fillStyle = COLOR_BUTTON_BACK;
	if(!buttsFlipped) cx[BACK].fillRect(0, scrn.h - scrn.but, scrn.w, scrn.but);
	else cx[BACK].fillRect(scrn.w - scrn.but, 0, scrn.but, scrn.h);
	
		

	//draw buttons: this canvas is not rotated
	for(var i = 0; i < butts[paused].length; i += 1)
	{
		drawButton(butImg, cx[BUT_CANV], butts[paused][i].imgInd, i);
	}
	
	var roads = drawRoads();
	var sorted = roads[0]
	var dists = roads[1];

	for(var x = 0; x < level.size[0]; x += 1)
	{
		for(var y = 0; y < level.size[1]; y += 1)
		{
			if(level.squares[y][x] == EmptySquare) continue;
			
			var dist = Math.pow(Math.pow(x - scrn.centerIndX, 2) + Math.pow(y - scrn.centerIndY, 2), .5);

			var i;
			for(i = 0; i < dists.length; i += 1)
			{
				if(dist > dists[i]) break;
			}
			sorted.splice(i, 0, [[x, y], blockDepth]);
			dists.splice(i, 0, dist);
		}
	}
	for(var i = 0; i < sorted.length; i += 1)
	{
		if(sorted[i][1] < blockDepth)
		{
			var top = arrToRGB(RandRGB(true));
			var A = arrToRGB(RandRGB(true));
			var B = arrToRGB(RandRGB());
			draw3DSquare(sorted[i][0], -blockDepth, sorted[i][1], 0, scrn.radius, scrn.r2, scrn.r1, cx[GROUND], top, A, B, 1, true, true);
			
		}
		else
		{
			draw3DSquare(sorted[i][0], -blockDepth, sorted[i][1], 0, scrn.radius, scrn.r2, scrn.r1, cx[GROUND], COLOR_BUILDING_TOP, COLOR_BUILDING_SIDEA, COLOR_BUILDING_SIDEB, 1, true, true);
		}
	}
	
	
	for(var i = 0; i < level.size[0]; i += 1)
	{
		for(var j = 0; j < level.size[1]; j += 1)
		{
			drawSquare(i, j, level.squares[j][i].imgInd);
		}
	}
	
	//connectIce();
	
}


function drawSquare(ind_x, ind_y, imgInd)
{
	//cx[BASE].clearRect(ind_x * (scrn.sq), ind_y * (scrn.sq), scrn.sq, scrn.sq);
	cx[BASE].drawImage(squareImg, (imgInd) * squareImg.height + scrn.imgBuffer, scrn.imgBuffer, squareImg.height - 2* scrn.imgBuffer, squareImg.height - 2*scrn.imgBuffer,
		scrn.sqOff + scrn.sqBuffer + ind_x * (scrn.sq), scrn.sqOff + scrn.sqBuffer + ind_y * (scrn.sq), scrn.sqReduc - 2 * scrn.sqBuffer, scrn.sqReduc - 2 * scrn.sqBuffer);
}


function drawTarget()
{
	var CX = cx[ABOVE_BASE];	
	if(level.index < helperLevels || hintActive)
	{
		//create target lines emanating from the player
		CX.beginPath();
		CX.globalAlpha = 1;
		CX.lineWidth = scrn.sq/20;
		CX.strokeStyle = COLOR_TARGET_LINES;
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
					CX.moveTo(pX + x * scrn.sq, pY + y * scrn.sq);
					CX.lineTo(pX, pY);
				}
			}
		}
		CX.stroke();

		//erase lines outsize of the current radius
		var curR = scrn.targetR * optionAlpha;	
		CX.globalAlpha = .6;
		CX.globalCompositeOperation = 'destination-in';
		CX.beginPath();
		CX.arc(pX, pY, curR, 0, 2 * Math.PI);
		CX.fill();

		//either erase parts of the inner radius or fade out
		curR -= scrn.sq/8;
		if(curR > 0)
		{
			//second half of phase: fade out
			if(optionAlpha > 1) CX.globalAlpha = .4 + (optionAlpha - 1) * .6;
			
			//first half of phase: constant level
			else CX.globalAlpha = .4;
			
			CX.beginPath();
			CX.arc(pX, pY, curR, 0, 2 * Math.PI);
			CX.globalCompositeOperation = 'destination-out';
			CX.fill();
		}
		CX.globalCompositeOperation = 'source-over';
	}
	
	//highlight active target
	if(click.act == SELECT_MOVE && click.delta[0] !== null)
	{
		
		CX.globalAlpha = targetAlpha;
		CX.fillStyle = COLOR_TARGET;
		//CX.fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) + scrn.sqOff, (player.pos[1] + click.delta[1]) * (scrn.sq) + scrn.sqOff, scrn.sqReduc, scrn.sqReduc);
		CX.fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) - scrn.targetOff, (player.pos[1] + click.delta[1]) * (scrn.sq) - scrn.targetOff, scrn.targetSq, scrn.targetSq);
	}
	CX.globalAlpha = 1;
	
}



//gets the distance from a midpoint of two points to the focus center
function middleToCenter(pA, pB)
{
	return Math.pow(Math.pow((pA[0] + pB[0])/2 - scrn.centerX, 2) + Math.pow((pA[1] + pB[1])/2 - scrn.centerY, 2), .5);
}

//gets the four corners of a shape
function getPoints(x, y, r, theta)
{
	var t_theta = theta + Pi5_4;
	var pts = []
	for(var i = 0; i < 4; i += 1)
	{	
		pts.push([x + r * Math.cos(t_theta), y + r * Math.sin(t_theta)]);	
		t_theta += Pi_2;
	}
	return pts;
}

//gets two groups of points that represent the visible sides of an object
function getVisibleSides(theta, pts, sideColorA, sideColorB)
{
	//get the distance from the focal point to the center of each side
	var dAB, dBC, dCD, dDA;
	dAB = middleToCenter(pts[0], pts[1]);
	dBC = middleToCenter(pts[1], pts[2]);
	dCD = middleToCenter(pts[2], pts[3]);
	dDA = middleToCenter(pts[3], pts[0]);
	var ordered = [];
	var dists = [];
	var comp, sides;
	
	//now we're going to sort them by distance descending
	for(var i = 0; i < 4; i += 1)
	{
		switch(i)
		{
			case 0: comp = dAB; sides = [pts[0], pts[1]]; col = sideColorA; break;
			case 1: comp = dBC; sides = [pts[1], pts[2]]; col = sideColorB; break;
			case 2: comp = dCD; sides = [pts[2], pts[3]]; col = sideColorA; break;
			case 3: comp = dDA; sides = [pts[3], pts[0]]; col = sideColorB; break;
		}
		
		var ind;
		for(ind = 0; ind < dists.length; ind += 1)
		{
			if(comp > dists[ind]) break;
		}
		ordered.splice(ind, 0, [sides, col]);
		dists.splice(ind, 0, comp);
	}
	
	//return the closest two faces (the other two are not visible)
	return ordered.slice(-2);
}

function roundPts(pts)
{
	var rounded = [];
	for(var i = 0; i < pts.length; i += 1)
	{
		rounded.push([Math.round(pts[i][0]), Math.round(pts[i][1])]);
	}
	return rounded;
}

//draws/fills a shape by connecting a series of points
function drawShapeFromPoints(pts, CX, color, fadeAlpha, stroke = false)
{
	CX.fillStyle = color;
	CX.globalAlpha = fadeAlpha;
	CX.beginPath();
	CX.moveTo(pts[0][0], pts[0][1]);
	
	rounded = roundPts(pts);

	for(var i = 1; i < pts.length; i += 1)
	{
		CX.lineTo(rounded[i][0], rounded[i][1]);
	}
	CX.lineTo(rounded[0][0], rounded[0][1]);
	CX.fill();
	
	if(stroke)
	{
		/* CX.strokeStyle = 'black';
		CX.globalCompositeOperation = 'source-atop';
		CX.lineWidth = scrn.sq * .055; */
		CX.strokeStyle = color;
		CX.stroke();
		CX.globalCompositeOperation = 'source-over';
		CX.lineWidth = scrn.sq * .005;
		
		CX.stroke();
	}
}

//scale a value based on an object's height
function adjust(height, value, posPower = 1, negPower = 1)
{
	var t_height = height - z_min;
	if(t_height <= 0) return 0;
	
	var ratio = t_height/(-z_min);
	
	if(ratio >= 1) return value * Math.pow(ratio, posPower);
	else return value * Math.pow(ratio, negPower);
	
}

function posToPix(pos)
{
	return [(pos[0] + .5) * scrn.sq, (pos[1] + .5) * scrn.sq];
}


function draw3DSquare(p, height, self_height, theta, radius, r2, r1, CX, topColor, sideAColor, sideBColor, fadeAlpha, strokeTop, strokeSides, negRScale = 1)
{
	if(height <= z_min) return;
	
	var t_height = height + self_height;
	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//scale x, y, radius
	var adjX = scrn.centerX + adjust(t_height, pixPos[0] - scrn.centerX, posXYScale);
	var adjY = scrn.centerY + adjust(t_height, pixPos[1] - scrn.centerY, posXYScale);
	//console.log(p[0], p[1], pixPos[0], pixPos[1]);

	var adjR = adjust(t_height, radius, posRadiusScale, negRScale);	
	
	//locate the four corners
	var pts = roundPts(getPoints(adjX, adjY, adjR, theta));

	//get and draw the two visible sides
	var sides = getVisibleSides(theta, pts, sideAColor, sideBColor);
	var fromBase = t_height - z_min;
	var r = self_height/(fromBase);
	for(var i = 0; i < 2; i += 1)
	{
		//first two points are on the square itself, second two are calculated based on the object's height size
		var p1, p2, p3, p4;
		p1 = sides[i][0][0];
		p2 = sides[i][0][1];
		// p3 = [p2[0] * r2 + r1 * scrn.centerX, p2[1] * r2 + r1 * scrn.centerY];
		// p4 = [p1[0] * r2 + r1 * scrn.centerX, p1[1] * r2 + r1 * scrn.centerY];
		p3 = [p2[0] - r * (p2[0] - scrn.centerX), p2[1] - r * (p2[1] - scrn.centerY)];
		p4 = [p1[0] - r * (p1[0] - scrn.centerX), p1[1] - r * (p1[1] - scrn.centerY)];
		

		drawShapeFromPoints([p1,p2,p3,p4], CX, sides[i][1], fadeAlpha, strokeSides);
	}
	
	
	//draw the top
	drawShapeFromPoints(pts, CX, topColor, fadeAlpha, strokeTop);
}

function drawShadow(p, height, theta, radius, CX, color, fadeAlpha)
{
	if(!onBoard()) return;
	
	var adjR = adjust(height, radius, posRadiusScale, 1);	
		
	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//locate the four corners
	var pts = getPoints(pixPos[0], pixPos[1], adjR, theta);
	//draw the top
	drawShapeFromPoints(pts, CX, color, fadeAlpha);
}


function drawPlayer(elapsed)
{
	//scale player at and above base
	if(player.z >= 0) nowSize = scrn.sq * interp(0, player.z, playerJumpHeight, 1, playerScaleTopJump);

	//scale player falling off edge
	else nowSize = scrn.sq * interp(z_min, player.z, 0, 0, 1);
	
	var CX = (player.z >= 0) ? cx[ABOVE_BASE] : (player.z > -blockDepth) ? cx[BELOW_BASE] : cx[BELOW_ALL];

	CX.save();
	CX.translate((player.pos[0] + .5) * (scrn.sq), (player.pos[1] + .5) * (scrn.sq));
	CX.rotate(player.theta);
	CX.globalAlpha = player.opacity;
	CX.drawImage(player.img, 0, 0, player.img.height, player.img.height, -.5 * nowSize, -.5 * nowSize, nowSize, nowSize);
	CX.restore();
	CX.globalAlpha = 1;
}

function animate()
{
	
	var newTime = new Date();
	var elapsed = Math.min(17, newTime - lastTime);
	lastTime = newTime;
	player.targetPhase += elapsed;
	var sinVal = Math.sin( 2 * Math.PI * player.targetPhase/targetMillis);
	targetAlpha = targetMean + targetScale * sinVal;
	
	
	//check for screen changes and redraw if necessary	
	var now_w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	var now_h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	// if(isFullScreen) now_h = Math.min(now_h, screen.availHeight);
	// if(isFullScreen) now_w = Math.min(now_w, screen.availWidth);
	
	if(rotating == false && click.act !== SELECT_ZOOM && (level.drawn == false ||(window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || 
		(window.pageYOffset || document.documentElement.scrollTop) !== scrn.t || 
		now_w !== scrn.w || 
		now_h !== scrn.h))
	{
		reConfigure();	
	}
	

	//clear the temp canvases
	if(lastCX != null)
	{
		lastCX.clearRect(scrn.adjL - scrn.but, scrn.adjT - scrn.but, scrn.adjW + 2 * scrn.but, scrn.adjH + 2 * scrn.but);
	}
	cx[BUT_SEL_CANV].clearRect(0,0,canv[BUT_SEL_CANV].width, canv[BUT_SEL_CANV].height);
	
	
	//highlight buttons
	if((click.act === SELECT_ZOOM && click.but === SELECT_ZOOM_COL[paused]) || (click.act === SELECT_BUT && click.but !== SELECT_ZOOM_COL[paused] && click.but !== null && !butts[paused][click.but].ignore))
	{
		drawButtonHighlight(cx[BUT_SEL_CANV], click.but, COLOR_BUTTON_HOVER, 1, 1);
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
				
				{	
					if(anim.ind > anim.animate.maxInd) anim.ind = anim.animate.minInd;
					drawSquare(anim.ind_x, anim.ind_y, anim.ind);
				}
			}
			
		}
		
		var backSnd = null;
		for(var i = 0; i < level.timers.length; i += 1)
		{
			var timer = level.timers[i];
			timer.time += elapsed;
			if(timer.time >= timer.limit)
			{
				timer.time = 0;
				timer.ind = (timer.ind + timer.inc * timer.direction + 4) % 4;
				if(typeof(timer.sound) != "undefined")
				{
					backSnd = timer.sound;
				}
				console.log(timer.ind);
				level.squares[timer.y][timer.x] = trampRotateGroup[timer.ind];
				drawSquare(timer.x, timer.y, trampRotateGroup[timer.ind].imgInd);
			}
		}
		if(backSnd !== null) playSound(BACK_SOUNDS, backSnd);
		

		
		cx[BUT_SEL_CANV].font = (scrn.but * .2) + 'px Roboto';
		cx[BUT_SEL_CANV].textAlign = 'center';
		cx[BUT_SEL_CANV].textBaseline = 'top';
		cx[BUT_SEL_CANV].fillStyle = COLOR_LEVEL_TEXT;
		
		//horizontal buttons
		if(!buttsFlipped) cx[BUT_SEL_CANV].fillText("LEVEL " + (level.index + 1), scrn.butOff[paused] + scrn.but * (MOVES_DISPLAY + .5), scrn.h - scrn.but + scrn.but * .1);	
		
		//vertical buttons
		else cx[BUT_SEL_CANV].fillText("LEVEL " + (level.index + 1),  scrn.w - (.5 * scrn.but), scrn.h -scrn.butOff[paused] - scrn.but * (MOVES_DISPLAY + .9));
		
		flashingPhase += elapsed;
		var fade = .7 * Math.abs(Math.sin( 2 * Math.PI * flashingPhase/flashMillis));
		
		//highlight restart/undo buttons if failed		
		if(failed())
		{	
			drawButtonHighlight(cx[BUT_SEL_CANV], UNDO_IND, COLOR_BUTTON_FLASH , fade, .8);
			drawButtonHighlight(cx[BUT_SEL_CANV], RESTART_IND, COLOR_BUTTON_FLASH , fade, .8);
			if(flashingPhase < flashMillis/2 && outOfMoves()) drawButtonHighlight(cx[BUT_SEL_CANV], MOVES_DISPLAY, COLOR_BUTTON_FLASH , fade, 1.005);
		}
		else if(player.state == IDLE && player.history.length && vectorEqual(player.history[player.history.length - 1], player.pos))
		{
			
			drawButtonHighlight(cx[BUT_SEL_CANV], UNDO_IND, COLOR_BUTTON_FLASH , fade, .8);
			if(flashingPhase < flashMillis/2) drawButtonHighlight(cx[BUT_SEL_CANV], MOVES_DISPLAY, COLOR_BUTTON_FLASH , fade, 1.005);
		}
		else
		{
			flashingPhase = 0;
		}	
		
		//highlight hint button after idle timeout
		if(player.state == IDLE && level.index >= helperLevels)
		{
			idleMillis += elapsed;
			
			//look for flash trigger (idle timeout or hint button)
			if(!idleFlash && idleMillis > idleWaitMillis)
			{
				idleFlash = true;
				idleMillis = 0;
			}
			
			//look for flash end (finished cycle and hint button not active
			if(idleFlash && idleMillis > flashMillis)
			{
				idleFlash = false;
				idleMillis = 0;
			}

			
			if(idleFlash)
			{
				var fade = .7 * Math.abs(Math.sin( 2 * Math.PI * idleMillis/flashMillis));
				drawButtonHighlight(cx[BUT_SEL_CANV], HINT_IND, COLOR_BUTTON_HOVER , fade, 1);
			}
				
		}
		else
		{
			idleMillis = 0;
			idleFlash = false;
		}
		
		if(player.state == IDLE)
		{
			
			//look for ON trigger
			if(!hintActive && (click.act == SELECT_BUT && click.but == HINT_IND))
			{
				
				hintActive = true;
				player.targetPhase = 0;
				//console.log("hint active");
			}

			//look for OFF trigger
			if(hintActive && player.targetPhase > targetMillis)
			{
				hintActive = false;
				//console.log("hint off", player.targetPhase);
				
				idleFlash = false;
				idleMillis = 0;
			}
			
			optionAlpha = 2* (player.targetPhase % targetMillis) / targetMillis;
			drawTarget();
		
		}
		else
		{
			player.targetPhase = 0;
			hintActive = false;
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
		//drawPlayer(elapsed);
		
		var CX = (player.z > -(3 * playerThickness)) ? cx[ABOVE_BASE] : (player.z > -blockDepth) ? cx[BELOW_BASE] : cx[BELOW_ALL];
		lastCX = CX;
		
		if(player.opacity == 1 && player.state !== FALLING) drawShadow(player.pos, player.z, player.theta, player.radius, CX, 'black', shadowAlpha);
		draw3DSquare(player.pos, player.z, playerThickness, player.theta, player.radius, player.r2, player.r1,CX, COLOR_PLAYER_TOP, COLOR_PLAYER_SIDEA, COLOR_PLAYER_SIDEB, player.opacity, false, false, playerNegRScale);
	}
	
	
	
	
	
	
	//next loop
	requestAnimationFrame(animate);
}





