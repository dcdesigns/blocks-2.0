
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
	//console.log("flipped", flipped);
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
	if(paused || (level.index > -1 && level.index < GAME_LEVELS.length))
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

function specialOffset(mod)
{
	var offset = 0;
	if(isDefined(mod.timer) && mod.timer !== NoModifier) offset = 4;
	else if(isDefined(mod.trigger) && mod.trigger !== NoModifier)
	{
		if(isDefined(mod.trigger.onOff))
		{
			offset = mod.trigger.onOff
		}
		else if(mod.trigger.any) offset = 5;
		else offset = 6;
	}
	return offset;
}

function triggerOffset(mod)
{
	//console.log('trig', mod);
	var offset = 0;
	if(mod !== NoModifier)
	{
		if(isDefined(mod.onOff))
		{
			offset = mod.onOff
		}
		else if(mod.any) offset = 5;
		else offset = 6;
	}
	//console.log('trig', mod, offset);
	return offset;
}


function drawScaledSquare(CX,sq, x, y, l, t, sqReduc, sqSize, sqOff, imgInd)
{
	if(sq == EmptySquare) return;
	
	CX.save();
	CX.translate(l +  (x + .5) * (sqSize), t + (y + .5) * (sqSize));

	if(isDefined(sq.backInd))
	{
		CX.drawImage(squareQuickImg, (sq.backInd) * squareQuickImg.height + scrn.imgBuffer, scrn.imgBuffer, squareQuickImg.height - 2* scrn.imgBuffer, squareQuickImg.height - 2*scrn.imgBuffer,
			- .5 * sqSize + sqOff, - .5 * sqSize + sqOff, sqReduc, sqReduc);
	}
	if(isDefined(sq.imgRotate) && sq.imgRotate != 'screen')
	{
		CX.rotate(sq.imgRotate);
	}
	CX.translate((-.5) * sqSize, (-.5) * sqSize);
	
	CX.drawImage(squareQuickImg, (imgInd) * squareQuickImg.height + scrn.imgBuffer, scrn.imgBuffer, squareQuickImg.height - 2* scrn.imgBuffer, squareQuickImg.height - 2*scrn.imgBuffer,
		sqOff, sqOff, sqReduc, sqReduc);
	
	CX.restore();
}

function drawScaledLevel(levelInd, CX, l, mid_t, w, h)
{
	if(levelInd < 0 || levelInd > GAME_LEVELS.length -1) return;
	
	var level = GAME_LEVELS[levelInd];
	var numY = level.map.length;
	var numX = level.map[0].length;
	

	
 	var sqSize = Math.min(w / numX, h / numY);
	var actW = sqSize * numX;
	var actH = sqSize * numY;
	var sqOff = sqSize * bordPct/2;
	var sqReduc = sqSize - 2 * sqOff;
	
	var t = mid_t - actH / 2;
	t = Math.min(scrn.h - actH, t);
	t = Math.max(0, t);

	/* CX.fillStyle = 'black';
	CX.fillRect(l, t, actW, actH); */
	for(var x = 0; x < numX; x += 1)
	{
		for(var y = 0; y < numY; y += 1)
		{
			var sq = sqCodes[level.map[y][x]];
			var imgInd = sq.imgInd;
			if(isDefined(level.specialCodes))
			{
				for(var i = 0; i < level.specialCodes.length; i += 1)
				{
					var code = level.specialCodes[i];
					if(code.x == x && code.y == y)
					{
						imgInd += specialOffset(code);
						break;
					}
				}
			}
			drawScaledSquare(CX, sq, x, y, l, t, sqReduc, sqSize, sqOff, imgInd)
			
		}
	}
	
	

	CX.fillStyle = 'blue';
	CX.fillRect(l + (level.player[0] + .3) * sqSize, t + (level.player[1] + .3) * sqSize, sqSize * .4, sqSize * .4);
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

function focusDist(x, y)
{
	return Math.pow(Math.pow(x - scrn.centerIndX, 2) + Math.pow(y - scrn.centerIndY, 2), .5);
}

function playerDist(x, y)
{
	return Math.pow(Math.pow(x - player.pos[0], 2) + Math.pow(y - player.pos[1], 2), .5);
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
	
	//console.log(xIndMin, xIndMax, yIndMin, yIndMax);
	var sorted = [];
	var dists = [];
	var used = [];
	//console.log(xRange * yRange);
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
			
			var dist = focusDist(xInd, yInd);//Math.pow(Math.pow(xInd - scrn.centerIndX, 2) + Math.pow(yInd - scrn.centerIndY, 2), .5);

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

function interp(xmin, x, xmax, ymin, ymax)
{
	return (x - xmin) / (xmax - xmin) * (ymax - ymin) + ymin;
}

function setNight(nowCX)
{
	var maxAlpha = .4;
	var vals = [];
	var color = Math.random();
	if(color < .25) vals = [255,255,255];
	else if(color < .5) vals = [255,0,0];
	else if(color < .75) vals = [255,125,0];
	else vals = [255,255,0];
	var nightAmt = Math.random() * maxAlpha;
	var rgb = 'RGB(';
	for(var i = 0; i < 3; i += 1)
	{
		rgb += Math.floor(interp(0, nightAmt, maxAlpha, vals[i], 0));
		if(i < 2) rgb += ',';
		else rgb += ')';
	}
	nowCX.fillStyle = rgb;
	nowCX.globalAlpha = nightAmt;
}

function interpColor(xmin, x, xmax, minCol, maxCol)
{
	var rgb = 'RGB(';
	if(xmin == xmax)
	{
		for(var i = 0; i < 3; i += 1)
		{
			rgb += Math.floor(minCol[i]);
			if(i < 2) rgb += ',';
			else rgb += ')';
		}
	}
	else
	{
		var xRatio = (x - xmin) / (xmax - xmin);
		for(var i = 0; i < 3; i += 1)
		{
			rgb += Math.floor(xRatio * (maxCol[i] - minCol[i]) + minCol[i]);
			if(i < 2) rgb += ',';
			else rgb += ')';
		}
	}
	return rgb;
}


function drawTempLava(drawIt = true)
{
	var nowCX = cx[BASE_TEMP];
	nowCX.clearRect(scrn.adjL - scrn.but, scrn.adjT - scrn.but, scrn.adjW + 2 * scrn.but, scrn.adjH + 2 * scrn.but);
	if(drawIt)
	{
		nowCX.globalAlpha = lavaTrailOpacity;
		nowCX.globalCompositeOperation = 'source-over';
		for(var i = 0; i < level.size[0]; i += 1)
		{
			for(var j = 0; j < level.size[1]; j += 1)
			{
				var sq = level.squares[j][i];
				if(sq == Lava) drawSquare(i, j, sq, sq.imgInd, nowCX);
			}
		}
		nowCX.globalCompositeOperation = 'source-atop';
		nowCX.globalAlpha = 1;
	}
}

//draws the buttons and game board
function drawBase()
{
	//reset and draw a black background
	if(paused)
	{
		cx[GROUND].fillStyle = 'black';
		cx[GROUND].fillRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
	}
	else
	{
	
		cx[GROUND].fillStyle = COLOR_BACK; 
		cx[GROUND].fillRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
		
		
		/* var w = oceanImg.width;
		var h = oceanImg.height;
		var adjW = scrn.adjW/scrn.adjH * h;
		var adjH = scrn.adjH/scrn.adjW * w;
		if(adjW < w) w = adjW;
		else h = adjH;
		cx[GROUND].drawImage(oceanImg, 0,0, w, h, scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH); */
	}
	
	cx[BACK].clearRect(0,0, scrn.w,scrn.h);
	cx[BUT_CANV].clearRect(0, 0, canv[BASE].width, canv[BASE].height);
	cx[BASE].clearRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
	cx[BASE_OVER].clearRect(scrn.adjL - scrn.but, scrn.adjT - scrn.but, scrn.adjW + 2 * scrn.but, scrn.adjH + 2 * scrn.but);
	//cx[BELOW_BASE].clearRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
	//horizontal buttons
	cx[BACK].fillStyle = COLOR_BUTTON_BACK;
	if(!buttsFlipped) cx[BACK].fillRect(0, scrn.h - scrn.but, scrn.w, scrn.but);
	else cx[BACK].fillRect(scrn.w - scrn.but, 0, scrn.but, scrn.h);
	
		

	//draw buttons: this canvas is not rotated
	for(var i = 0; i < butts[paused].length; i += 1)
	{
		drawButton(butImg, cx[BUT_CANV], butts[paused][i].imgInd, i);
	}
	
	if(!paused)
	{
		var sorted = [];
		var dists = [];
		var roads = drawRoads();
		sorted = roads[0]
		dists = roads[1];

		for(var x = 0; x < level.size[0]; x += 1)
		{
			for(var y = 0; y < level.size[1]; y += 1)
			{
				if(level.squares[y][x] == EmptySquare) continue;
				
				var dist = focusDist(x, y);//Math.pow(Math.pow(x - scrn.centerIndX, 2) + Math.pow(y - scrn.centerIndY, 2), .5);

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
		setNight(cx[GROUND]);
		cx[GROUND].fillRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
		cx[GROUND].globalAlpha = 1;
		
		for(var i = 0; i < level.size[0]; i += 1)
		{
			for(var j = 0; j < level.size[1]; j += 1)
			{
				var sq = level.squares[j][i];
				var imgInd = sq.imgInd;
				var done = false;
				for(var k = 0; k < level.triggers.length; k += 1)
				{	
					var trigger = level.triggers[k];
					if(trigger.x == i && trigger.y == j)
					{
						imgInd += triggerOffset(trigger);	
						done = true;
						break;
					}
				}
				for(var k = 0; k < level.timers.length; k += 1)
				{	
					if(done) break;
					var timer = level.timers[k];
					if(timer.x == i && timer.y == j)
					{
						imgInd += 4;	
						done = true;
						break;
					}
				}
				drawSquare(i, j, level.squares[j][i], imgInd);
			}
		}
		/* for(var i = 0; i < level.size[0]; i += 1)
		{
			for(var j = 0; j < level.size[1]; j += 1)
			{
				draw3DSquare([i,j], 0,3000, 0, scrn.radius / 50, scrn.r2, scrn.r1, cx[BASE], COLOR_BUILDING_TOP, COLOR_BUILDING_SIDEA, COLOR_BUILDING_SIDEB, 1, true, true, 1,1);
			}
		} */
		
		//rotate tramps
		/* for(var i = 0; i < level.triggers.length; i += 1)
		{	
			var trigger = level.triggers[i];
			
			if(isDefined(trigger.onOff))
			{	
				//console.log(trigger);
				var sq = trigger.group[trigger.ind];
				level.squares[trigger.y][trigger.x] = sq;			
				drawSquare(trigger.x, trigger.y, sq, sq.imgInd + trigger.onOff);				
			}
		} */
		setLocks(level.locked);
		
		drawTempLava();
	}
	else
	{
		/* var levels_menu = {
			rowWidth: 0,
			rowHeight: minMenu,
			topInd: 0,
			selected: -1,
				
		}; */
		
		drawTempLava(false);

		if(!buttsFlipped)
		{
			levels_menu.w = scrn.w;
			levels_menu.h = scrn.h - scrn.but;
		}
		else
		{
			levels_menu.w = scrn.w - scrn.but;
			levels_menu.h = scrn.h;
		}
		
		levels_menu.rows = Math.floor(levels_menu.h / minMenu);
		levels_menu.rowHeight = levels_menu.h / levels_menu.rows;
		if(levels_menu.topInd + levels_menu.rows > GAME_LEVELS.length)
		{
			levels_menu.topInd = GAME_LEVELS.length - levels_menu.rows;
		}
		if(levels_menu.topInd < 0) levels_menu.topInd = 0;
		cx[BUT_CANV].strokeStyle = 'white';
		cx[BUT_CANV].lineWidth = 1;
		cx[BUT_CANV].font = (levels_menu.rowHeight * .6) + 'px Roboto';
		cx[BUT_CANV].textAlign = 'right';
		cx[BUT_CANV].textBaseline = 'middle';

		var textW = levels_menu.w * .1;
		var buffW = levels_menu.w * .1;
		for(var i = 0; i < levels_menu.rows; i += 1)
		{
			var ind = i + levels_menu.topInd
			if(ind < GAME_LEVELS.length)
			{
				cx[BUT_CANV].strokeRect(0, levels_menu.rowHeight * i, levels_menu.w, levels_menu.rowHeight);
				if(ind == level.index)	cx[BUT_CANV].fillStyle = COLOR_LEVEL_TEXT;
				else cx[BUT_CANV].fillStyle = 'white';
				cx[BUT_CANV].fillText((ind + 1), + buffW + textW, (i + .5) * levels_menu.rowHeight);
				drawScaledLevel(ind, cx[BUT_CANV], 2 * buffW + textW,  (i + .5) * levels_menu.rowHeight, levels_menu.w - (3 * buffW + textW), levels_menu.rowHeight * .8)
			}
				
		}
		
		
		
	}
	
	//connectIce();
	
}


function drawSquare(ind_x, ind_y, square, imgInd = 0, nowCX = cx[BASE])
{
	nowCX.save();
	nowCX.translate((ind_x + .5) * (scrn.sq), (ind_y + .5) * (scrn.sq));
	if(square != null)
	{
		if(imgInd == 0) imgInd = square.imgInd;
		if(isDefined(square.backInd))
		{
			nowCX.drawImage(squareImg, (square.backInd) * squareImg.height + scrn.imgBuffer, scrn.imgBuffer, squareImg.height - 2* scrn.imgBuffer, squareImg.height - 2*scrn.imgBuffer,
				scrn.sqOff + scrn.sqBuffer - .5 * scrn.sq, scrn.sqOff + scrn.sqBuffer - .5 * scrn.sq, scrn.sqReduc - 2 * scrn.sqBuffer, scrn.sqReduc - 2 * scrn.sqBuffer);
		}
		if(isDefined(square.imgRotate))
		{
			if(square.imgRotate == 'screen') nowCX.rotate(flipped * Math.PI/2);
			else
			{
				nowCX.rotate(square.imgRotate);
			}
		}
	}
	nowCX.translate((-.5) * (scrn.sq), (-.5) * (scrn.sq));
	
	nowCX.drawImage(squareImg, (imgInd) * squareImg.height + scrn.imgBuffer, scrn.imgBuffer, squareImg.height - 2* scrn.imgBuffer, squareImg.height - 2*scrn.imgBuffer,
		scrn.sqOff + scrn.sqBuffer, scrn.sqOff + scrn.sqBuffer, scrn.sqReduc - 2 * scrn.sqBuffer, scrn.sqReduc - 2 * scrn.sqBuffer);
	
	nowCX.restore();
	/* if(square == OffSwitch1)
	{
		draw3DSquare([ind_x, ind_y], 0, playerThickness * .7, 0, player.radius*.6, player.r2, player.r1,nowCX, 'yellow', 'red', 'orange', 1, false, false, playerNegRScale);
	}
	else if(square == OnSwitch1)
	{
		draw3DSquare([ind_x, ind_y], 0, playerThickness * .1, 0, player.radius*.6, player.r2, player.r1,nowCX, 'yellow', 'red', 'orange', 1, false, false, playerNegRScale);
	} */
	//cx[BASE].clearRect(ind_x * (scrn.sq), ind_y * (scrn.sq), scrn.sq, scrn.sq);
	// cx[BASE].drawImage(squareImg, (imgInd) * squareImg.height + scrn.imgBuffer, scrn.imgBuffer, squareImg.height - 2* scrn.imgBuffer, squareImg.height - 2*scrn.imgBuffer,
		// scrn.sqOff + scrn.sqBuffer + ind_x * (scrn.sq), scrn.sqOff + scrn.sqBuffer + ind_y * (scrn.sq), scrn.sqReduc - 2 * scrn.sqBuffer, scrn.sqReduc - 2 * scrn.sqBuffer);
}


function drawTarget()
{
	var nowCX = cx[ABOVE_BASE];	
	if(level.index < helperLevels || hintActive)
	{
		//create target lines emanating from the player
		nowCX.beginPath();
		nowCX.globalAlpha = 1;
		nowCX.lineWidth = scrn.sq/20;
		nowCX.strokeStyle = COLOR_TARGET_LINES;
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
					nowCX.moveTo(pX + x * scrn.sq, pY + y * scrn.sq);
					nowCX.lineTo(pX, pY);
				}
			}
		}
		nowCX.stroke();

		//erase lines outsize of the current radius
		var curR = scrn.targetR * optionAlpha;	
		nowCX.globalAlpha = .6;
		nowCX.globalCompositeOperation = 'destination-in';
		nowCX.beginPath();
		nowCX.arc(pX, pY, curR, 0, 2 * Math.PI);
		nowCX.fill();

		//either erase parts of the inner radius or fade out
		curR -= scrn.sq/8;
		if(curR > 0)
		{
			//second half of phase: fade out
			if(optionAlpha > 1) nowCX.globalAlpha = .4 + (optionAlpha - 1) * .6;
			
			//first half of phase: constant level
			else nowCX.globalAlpha = .4;
			
			nowCX.beginPath();
			nowCX.arc(pX, pY, curR, 0, 2 * Math.PI);
			nowCX.globalCompositeOperation = 'destination-out';
			nowCX.fill();
		}
		nowCX.globalCompositeOperation = 'source-over';
	}
	
	//highlight active target
	if(click.act == SELECT_MOVE && click.delta[0] !== null)
	{
		
		nowCX.beginPath();
		nowCX.globalAlpha = targetAlpha;
		nowCX.fillStyle = COLOR_TARGET;
		//nowCX.fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) + scrn.sqOff, (player.pos[1] + click.delta[1]) * (scrn.sq) + scrn.sqOff, scrn.sqReduc, scrn.sqReduc);
		nowCX.fillRect((player.pos[0] + click.delta[0]) * (scrn.sq) - scrn.targetOff, (player.pos[1] + click.delta[1]) * (scrn.sq) - scrn.targetOff, scrn.targetSq, scrn.targetSq);
	}
	nowCX.globalAlpha = 1;
	nowCX.beginPath();
	
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
function drawShapeFromPoints(pts, nowCX, color, fadeAlpha, stroke = false)
{
	nowCX.fillStyle = color;
	nowCX.globalAlpha = fadeAlpha;
	nowCX.beginPath();
	nowCX.moveTo(pts[0][0], pts[0][1]);
	
	rounded = roundPts(pts);

	for(var i = 1; i < pts.length; i += 1)
	{
		nowCX.lineTo(rounded[i][0], rounded[i][1]);
	}
	nowCX.lineTo(rounded[0][0], rounded[0][1]);
	nowCX.fill();
	
	if(stroke)
	{
		/* nowCX.strokeStyle = 'black';
		nowCX.globalCompositeOperation = 'source-atop';
		nowCX.lineWidth = scrn.sq * .055; */
		nowCX.strokeStyle = color;
		nowCX.stroke();
		//nowCX.globalCompositeOperation = 'source-over';
		nowCX.lineWidth = scrn.sq * .005;
		
		nowCX.stroke();
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

function drawIceShield(p, height, radius, radiusW, radiusAdd, nowCX, colorMin, colorMax, fadeAlpha, negRScale = 1, posScale = posRadiusScale)
{
	if(height != 0) return;

	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//scale x, y, radius
	var adjX = scrn.centerX + adjust(height, pixPos[0] - scrn.centerX, posXYScale);
	var adjY = scrn.centerY + adjust(height, pixPos[1] - scrn.centerY, posXYScale);
	//console.log(p[0], p[1], pixPos[0], pixPos[1]);

	var adjR = adjust(height, radius, posScale, negRScale);	
	var adjAdd = adjust(height, radiusAdd, posScale, negRScale);
	
	nowCX.globalAlpha = fadeAlpha;
	nowCX.lineWidth =  adjust(height, radiusW, posScale, negRScale);;
	var nowR = adjR;
	for(var i = 0; i < player.temp; i += 1)
	{
		nowCX.strokeStyle = interpColor(0, i, maxIceShield - 1, colorMin, colorMax);
		nowCX.beginPath();
		nowCX.arc(adjX, adjY, nowR, 0, 2 * Math.PI);
		nowCX.stroke();
		nowR += adjAdd;
	}
}
function draw3DSquare(p, height, self_height, theta, radius, r2, r1, nowCX, topColor, sideAColor, sideBColor, fadeAlpha, strokeTop, strokeSides, negRScale = 1, posScale = posRadiusScale)
{
	if(height <= z_min) return;
	
	var t_height = height + self_height;
	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//scale x, y, radius
	var adjX = scrn.centerX + adjust(t_height, pixPos[0] - scrn.centerX, posXYScale);
	var adjY = scrn.centerY + adjust(t_height, pixPos[1] - scrn.centerY, posXYScale);
	//console.log(p[0], p[1], pixPos[0], pixPos[1]);

	var adjR = adjust(t_height, radius, posScale, negRScale);	
	
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
		

		drawShapeFromPoints([p1,p2,p3,p4], nowCX, sides[i][1], fadeAlpha, strokeSides);
	}
	
	
	//draw the top
	drawShapeFromPoints(pts, nowCX, topColor, fadeAlpha, strokeTop);
}

function drawShadow(p, height, theta, radius, nowCX, color, fadeAlpha)
{
	if(!onBoard()) return;
	
	var adjR = adjust(height, radius, posRadiusScale, 1);	
		
	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//locate the four corners
	var pts = getPoints(pixPos[0], pixPos[1], adjR, theta);
	//draw the top
	drawShapeFromPoints(pts, nowCX, color, fadeAlpha);
}

/* 
function drawLaser(p, height, self_height, radius, r2, r1, nowCX, topColor, sideAColor, sideBcolor, fadeAlpha, negRScale = 1)
{
	if(height <= z_min) return;
	
	var t_height = height + self_height;
	//convert postion to pixels
	var pixPos = posToPix(p);
	
	//scale x, y, radius
	var adjX = scrn.centerX + adjust(t_height, pixPos[0] - scrn.centerX, posXYScale);
	var adjY = scrn.centerY + adjust(t_height, pixPos[1] - scrn.centerY, posXYScale);
	//console.log(p[0], p[1], pixPos[0], pixPos[1]);

	//var adjR = adjust(t_height, radius, posRadiusScale, negRScale);	
	
	//locate the four corners
	var pts = roundPts(getPoints(adjX, adjY, adjR, 0));

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
		

		drawShapeFromPoints([p1,p2,p3,p4], nowCX, sides[i][1], fadeAlpha, strokeSides);
	}
	
	
	//draw the top
	drawShapeFromPoints(pts, nowCX, topColor, fadeAlpha, strokeTop);
} */

function drawPlayer(elapsed)
{
	//scale player at and above base
	if(player.z >= 0) nowSize = scrn.sq * interp(0, player.z, playerJumpHeight, 1, playerScaleTopJump);

	//scale player falling off edge
	else nowSize = scrn.sq * interp(z_min, player.z, 0, 0, 1);
	
	var nowCX = (player.z >= 0) ? cx[ABOVE_BASE] : (player.z > -blockDepth) ? cx[BELOW_BASE] : cx[BELOW_ALL];

	nowCX.save();
	nowCX.translate((player.pos[0] + .5) * (scrn.sq), (player.pos[1] + .5) * (scrn.sq));
	nowCX.rotate(player.theta);
	nowCX.globalAlpha = player.opacity;
	nowCX.drawImage(player.img, 0, 0, player.img.height, player.img.height, -.5 * nowSize, -.5 * nowSize, nowSize, nowSize);
	nowCX.restore();
	nowCX.globalAlpha = 1;
}
var last_w = 0; 
var last_h = 0;

function updateGoalPct()
{
	var total = level.activators.length;
	if(total < 1) return;
	var nowCX = cx[ABOVE_BASE];
	var rad = scrn.sq * .3;
	var angle = (total - level.activated)/total * Math.PI * 2;
	nowCX.save();
	nowCX.translate((level.goal.x + .5) * (scrn.sq), (level.goal.y + .5) * (scrn.sq));
	nowCX.clearRect(-scrn.sq/2, -scrn.sq/2, scrn.sq, scrn.sq);
	if(angle != 0)
	{
		nowCX.rotate(flipped * Math.PI/2);
		nowCX.globalAlpha = .5;
		nowCX.fillStyle = 'black';
		nowCX.beginPath();
		nowCX.moveTo(0,0);
		nowCX.arc(0,0,rad, -Math.PI/2, -Math.PI/2 - angle, true);
		nowCX.fill();
	}
	nowCX.restore();
}

function animate()
{
	
	var newTime = new Date();
	var elapsed = Math.min(40, newTime - lastTime);
	lastTime = newTime;
	player.targetPhase += elapsed;
	var sinVal = Math.sin( 2 * Math.PI * player.targetPhase/targetMillis);
	targetAlpha = targetMean + targetScale * sinVal;
	
	
	//check for screen changes and redraw if necessary	
	var now_w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	var now_h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	
	// if(isFullScreen) now_h = Math.min(now_h, screen.availHeight);
	// if(isFullScreen) now_w = Math.min(now_w, screen.availWidth);
	
	if(last_w == now_w && last_h == now_h && rotating == false && click.act !== SELECT_ZOOM && (level.drawn == false || (window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || 
		(window.pageYOffset || document.documentElement.scrollTop) !== scrn.t || 
		now_w !== scrn.w || 
		now_h !== scrn.h))
	//if(click.act !== SELECT_ZOOM && (level.drawn == false || (ios && (window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || (window.pageYOffset || document.documentElement.scrollTop) !== scrn.t)))
	{
		reConfigure();	
	}
	last_w = now_w;
	last_h = now_h;

	//clear the temp canvases
	if(lastCX != null)
	{
		//lastCX.clearRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
		lastCX.clearRect(scrn.adjL - scrn.but, scrn.adjT - scrn.but, scrn.adjW + 2 * scrn.but, scrn.adjH + 2 * scrn.but);
	}
	cx[BUT_SEL_CANV].clearRect(0,0,canv[BUT_SEL_CANV].width, canv[BUT_SEL_CANV].height);
	
	//console.log(click.but);
	//highlight buttons
	if((click.act === SELECT_ZOOM && click.but === SELECT_ZOOM_COL[paused]) || (click.act === SELECT_BUT && click.but !== SELECT_ZOOM_COL[paused] && click.but !== null && (click.but < butts[paused].length && !butts[paused][click.but].ignore)))
	{
		drawButtonHighlight(cx[BUT_SEL_CANV], click.but, COLOR_BUTTON_HOVER, 1, 1);
	}
	
	//draw player/targets/status
	if(paused)
	{
		if(click.act == SELECT_MOVE && click.levelInd != null && click.levelInd >=0 && click.levelInd < GAME_LEVELS.length)
		{
			//console.log("hovering", click.levelInd);
			cx[BUT_SEL_CANV].fillStyle = COLOR_BUTTON_HOVER;
			cx[BUT_SEL_CANV].fillRect(0, levels_menu.rowHeight * click.levelInd, levels_menu.w, levels_menu.rowHeight);
		}
	}
	else
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
					drawSquare(anim.ind_x, anim.ind_y, null, anim.ind);
				}
			}
		}
		updateGoalPct();
		
		var backSnd = null;
		for(var i = 0; i < level.timers.length; i += 1)
		{
			var timer = level.timers[i];
			timer.time += elapsed;
			if(timer.time >= timer.limit)
			{
				timer.time = 0;
				incTriggerIndex(timer);

				if(isDefined(timer.sound))
				{
					backSnd = timer.sound;
				}
				//console.log(timer.ind);
				level.squares[timer.y][timer.x] = timer.group[timer.ind];
				var sq = timer.group[timer.ind];
				var imgInd = sq.imgInd + 4;
				drawSquare(timer.x, timer.y, sq, imgInd);
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
		
		
		var change = level.someChange;// && !level.locked;
		//auto undo if no effect
		if(player.state == IDLE && player.history.length && !change && vectorEqual(player.history[player.history.length - 1].pos, player.pos))
		{
			undoBut.action(true);
			//drawButtonHighlight(cx[BUT_SEL_CANV], UNDO_IND, COLOR_BUTTON_FLASH , fade, .8);
			//if(flashingPhase < flashMillis/2) drawButtonHighlight(cx[BUT_SEL_CANV], MOVES_DISPLAY, COLOR_BUTTON_FLASH , fade, 1.005);
		}	
		//highlight restart/undo buttons if failed	
		else if(failed())
		{	
			drawButtonHighlight(cx[BUT_SEL_CANV], UNDO_IND, COLOR_BUTTON_FLASH , fade, .8);
			drawButtonHighlight(cx[BUT_SEL_CANV], RESTART_IND, COLOR_BUTTON_FLASH , fade, .8);
			if(flashingPhase < flashMillis/2 && outOfMoves()) drawButtonHighlight(cx[BUT_SEL_CANV], MOVES_DISPLAY, COLOR_BUTTON_FLASH , fade, 1.005);
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
				if([BURNING, FALLING, FALLBURNING].includes(player.state)) numberInd = 11;
				
				if(!buttsFlipped) cx[BUT_CANV].clearRect(scrn.butOff[paused] + scrn.but * MOVES_DISPLAY, scrn.h - scrn.but, scrn.but, scrn.but);
				else cx[BUT_CANV].clearRect(scrn.w - scrn.but, scrn.h - scrn.butOff[paused] - scrn.but * (MOVES_DISPLAY + 1), scrn.but, scrn.but);
					
			}
		}
		
		drawButton(numbersImg, cx[cx_ind], numberInd, MOVES_DISPLAY);

		//player
		updatePlayer(elapsed);

		
		var CX = (player.z > -(3 * playerThickness)) ? cx[ABOVE_BASE] : (player.z > -blockDepth) ? cx[BELOW_BASE] : cx[BELOW_ALL];
		lastCX = CX;
		
		//sort lasers
		/* var allLasers = sortLasers(level.lasers, roundVector(player.pos));
		var further = allLasers[0];
		var match = allLasers[1];
		var closer = allLasers[2]; */
		
		//console.log(further, match, closer);
		
		//draw further lasers (including a match)
		var laserRad = scrn.radius/40;
		if(level.laserMatch != null)
		{
			draw3DSquare(level.laserMatch, 0,3000, 0, laserRad, scrn.r2, scrn.r1, cx[ABOVE_BASE], COLOR_BUILDING_TOP, 'red', 'red', 1, false, false, 1,1);
			//if(level.laserFrames > 7 && level.laserFrames < 17)
			if(player.z > 0 && level.laserFrames < 10)
			{
				
				cx[ABOVE_BASE].globalAlpha = .1;
				cx[ABOVE_BASE].fillStyle = 'red';
				cx[ABOVE_BASE].fillRect(scrn.adjL, scrn.adjT, scrn.adjW, scrn.adjH);
				
			}
			else if(level.laserFrames == laser_wait_frames)
			{
				startFade(opacity_rate_laser);
			}
			level.laserFrames++;
		}
		else
		{
			level.laserFrames = 0;
		}
		/* for(var i = 0; i < further.length; i += 1)
		{
			draw3DSquare(further[i], 0,3000, 0, laserRad, scrn.r2, scrn.r1, cx[ABOVE_BASE], COLOR_BUILDING_TOP, 'red', 'red', 1, false, false, 1,1);
		} */
		
		if(player.state !== IDLE && player.state != REWIND && player.z == 0 && vectorNonZero(player.vel))
		{
			var rounded = roundVector(player.pos);
			if(onBoard(rounded) && level.squares[rounded[1]][rounded[0]] == Lava)
			{
				var col = 'dark-gray';
				draw3DSquare(player.pos, player.z, 0, player.theta, player.radius, player.r2, player.r1,cx[BASE_TEMP], col, col, col, 1, false, false, playerNegRScale);
			}
		}
		
		if(player.temp > 0)
		{
			var auraR = player.radius * auraRscale;
			var auraAdd = player.radius * auraAddscale;
			var auraWidth = auraR * auraWidthScale;
			drawIceShield(player.pos, player.z, auraR, auraWidth, auraAdd, CX, auraCol, auraMax, auraOpacity, playerNegRScale);
			
		}
		
		if(player.opacity == 1 && player.z >= 0) drawShadow(player.pos, player.z, player.theta, player.radius, CX, 'black', shadowAlpha);
		var playerTop, playerSideA, playerSideB;
		if([BURNING, FALLBURNING].includes(player.state))
		{
			playerTop = COLOR_PLAYER_TOP_BURN;
			playerSideA = COLOR_PLAYER_SIDEA_BURN;
			playerSideB = COLOR_PLAYER_SIDEB_BURN;
		}
		else
		{
			playerTop = COLOR_PLAYER_TOP;
			playerSideA = COLOR_PLAYER_SIDEA;
			playerSideB = COLOR_PLAYER_SIDEB;
		}

		
		draw3DSquare(player.pos, player.z, playerThickness, player.theta, player.radius, player.r2, player.r1,CX, playerTop, playerSideA, playerSideB, player.opacity, false, false, playerNegRScale);
		
		
		if(level.laserMatch != null) draw3DSquare(level.laserMatch, player.z + playerThickness, 3000, 0, laserRad, scrn.r2, scrn.r1, cx[ABOVE_BASE], COLOR_BUILDING_TOP, 'red', 'red', 1, false, false, 1,1);
		/* //draw matching laser
		if(match != null)
		{
			//console.log(match);
			draw3DSquare(match, player.z + playerThickness, 3000, 0, laserRad, scrn.r2, scrn.r1, cx[ABOVE_BASE], COLOR_BUILDING_TOP, 'red', 'red', 1, false, false, 1,1);
		}
		
		//draw closer lasers
		for(var i = 0; i < closer.length; i += 1)
		{
			draw3DSquare(closer[i], 0,3000, 0, laserRad, scrn.r2, scrn.r1, cx[ABOVE_BASE], COLOR_BUILDING_TOP, 'red', 'red', 1, false, false, 1,1);
		} */
	}
	
	
	
	
	
	
	//next loop
	requestAnimationFrame(animate);
}

function drawLaserStatus(laserCX, laser)
{
	var armed = false//true;
	var pos = .75
	var offAlpha = .2;
	
	laserCX.clearRect(laser[0] * scrn.sq, laser[1] * scrn.sq, scrn.sq, scrn.sq);
	
	//draw red
	laserCX.beginPath();
	laserCX.globalAlpha = (armed)? 1 : offAlpha;
	laserCX.fillStyle = 'red';
	laserCX.arc((laser[0] + pos) * scrn.sq, (laser[1] + pos) * scrn.sq, scrn.sq / 25, 0, Math.PI * 2);
	laserCX.fill();
	
	//draw green
	laserCX.beginPath();
	laserCX.globalAlpha = (armed)? offAlpha : 1;
	laserCX.fillStyle = 'green';
	laserCX.arc((laser[0] + (1-pos)) * scrn.sq, (laser[1] + (1-pos)) * scrn.sq, scrn.sq / 25, 0, Math.PI * 2);
	laserCX.fill();
	
	laserCX.globalAlpha = 1;
}


function sortLasers(lasers, playerPos)
{
	var further = [];
	var match = null;
	var closer = [];
	var furtherDists = [];
	var closerDists = [];
	
	var playerToFocus = focusDist(playerPos[0], playerPos[1]);
	
	var anyOn = false;
	var playWhir = false;
	for(var i = 0; i < lasers.length; i += 1)
	{
		//drawLaserStatus(cx[ABOVE_BASE], lasers[i].pos);
		var toPlayer = playerDist(lasers[i].pos[0], lasers[i].pos[1]);
		if(toPlayer < .4)
		{
			level.anyLaser = true;
			anyOn = true;
			if(!lasers[i].on) playWhir = true;
			lasers[i].on = true
			var dist = focusDist(lasers[i].pos[0], lasers[i].pos[1]);
			if(vectorEqual(lasers[i].pos, playerPos))
			{	
				match = playerPos;
				//console.log(match);
				further.push(match);
			}
			if(dist >= playerToFocus)
			{
				var j;
				for(j = 0; j < further.length; j += 1)
				{
					if(dist >= furtherDists[j]) break;
				}
				further.splice(j, 0, lasers[i].pos);
				furtherDists.splice(j, 0, dist);
			}
			else
			{
				var j;
				for(j = 0; j < closer.length; j += 1)
				{
					if(dist >= closerDists[j]) break;
				}
				closer.splice(j, 0, lasers[i].pos);
				closerDists.splice(j, 0, dist);
			}
		}
		else
		{
			lasers[i].on = false;
		}
	}	
	/* if(playWhir) playSound(THEME_SOUNDS, whirSnd);
	else if(level.anyLaser && !anyOn)
	{
		level.anyLaser = false;
		if(player.state != WINNING)
		{
			if(audio_tracks[THEME_SOUNDS]) audio_tracks[THEME_SOUNDS].stop();
		}
	} */
	return [further, match, closer];
}

function setLocks(locked = false)
{
	level.locked = locked;
		
	cx[BASE_OVER].clearRect(scrn.adjL - scrn.but, scrn.adjT - scrn.but, scrn.adjW + 2 * scrn.but, scrn.adjH + 2 * scrn.but);
	for(var y = 0; y < level.squares.length; y += 1)
	{
		for(var x = 0; x < level.squares[0].length; x += 1)
		{
			var square = level.squares[y][x];
			/* if(isLaserOrCover(square))
			{
				if(level.locked) drawSquare(x, y, LockBorder, LockBorder.imgInd, cx[BASE_OVER]);
			}
			else  */if([Locked, UnLocked].includes(square))
			{
				square = (level.locked) ? Locked : UnLocked;
				level.squares[y][x] = square;
				drawSquare(x,y, square);
				if(level.locked) drawSquare(x,y, LockBorder, LockBorder.imgInd, cx[BASE_OVER]);
			}
		}
	}
	for(var i = 0; i < level.triggers.length; i += 1)
	{	
		var trigger = level.triggers[i];
		//if(isDefined(trigger.onOff))
		{
			if(level.locked) drawSquare(trigger.x, trigger.y, LockBorder, LockBorder.imgInd, cx[BASE_OVER]);			
		}
	}
}


