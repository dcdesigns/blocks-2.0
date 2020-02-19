function test_animator()
{
	console.log("animator");
}

const bordPct = .1;
const outBord = 5;

var startHeight = -1;
var startFlippedHeight = -1;

console.log("howdy");

function drawBase()
{
	console.log('base');
	//clear canvases
	cx[0].fillRect(0,0,scrn.w,scrn.h);
	cx[1].clearRect(0, 0, scrn.w, scrn.h);
	console.log(FRONT);
	//front is not rotated so has to be dealt with differently
	cx[FRONT].clearRect(0, 0, canv[FRONT].width, canv[FRONT].height);
	
	//draw buttons
	for(var i = 0; i < butts[paused].length; i += 1)
	{
		if(!buttsFlipped)
		{
			cx[FRONT].drawImage(butImg, butts[paused][i].imgInd * butImg.height, 0, butImg.height, butImg.height,
				scrn.but * i, scrn.h - scrn.but, scrn.but, scrn.but);
		}
		else
		{
			cx[FRONT].drawImage(butImg, butts[paused][i].imgInd * butImg.height, 0, butImg.height, butImg.height,
						 scrn.w - scrn.but, scrn.h - scrn.but * (i + 1), scrn.but, scrn.but);
		}
	}
	cx[FRONT].fillText((ios)? 'ios': 'non -ios', 50, 50);
	
	//draw squares
	var sqInd = 0;

	cx[1].fillStyle = 'black';
	
	for(var i = 0; i < numX; i += 1)
	{
		for(var j = 0; j < numY; j += 1)
		{
			/* if(i === pos[0] && j === pos[1]) cx[1].fillStyle = 'blue';
			else cx[1].fillStyle = 'black';
			cx[1].fillRect(scrn.sqOff + i * (scrn.sq), scrn.sqOff + j * (scrn.sq), scrn.sqReduc, scrn.sqReduc); */
			cx[1].drawImage(squareImg, sqInd * squareImg.height, 0, squareImg.height, squareImg.height,
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

	if(click.del[0] !== null)
	{
		cx[MID].fillStyle = 'RGB(255,255,255)';
		cx[MID].fillRect(scrn.sx + (player.pos[0] + click.del[0]) * (scrn.sq + inGap), scrn.sy + (player.pos[1] + click.del[1]) * (scrn.sq + inGap), scrn.sq, scrn.sq);
	}

	var realPos = [click.start[0] + click.dist * Math.cos(click.theta), click.start[1] + click.dist * Math.sin(click.theta)];
	cx[MID].beginPath();
	cx[MID].moveTo(click.start[0], click.start[1]);
	cx[MID].lineTo(realPos[0], realPos[1]);
	cx[MID].lineWidth = stem;
	cx[MID].strokeStyle = 'rgb(150,150,150)';
	cx[MID].stroke();
	cx[MID].beginPath();
	cx[MID].fillStyle = 'rgb(150,150,150)';
	cx[MID].arc(click.start[0], click.start[1], stem/2, 0, 2 * Math.PI);
	cx[MID].fill();
	
	cx[MID].save();	
	cx[MID].translate(realPos[0], realPos[1], click.end[1]);
	cx[MID].rotate(click.theta);
	var distort = interpLog(5, click.dist + 5, 75, 1, .5);
	cx[MID].scale(distort, 1);
	
	cx[MID].beginPath();
	cx[MID].fillStyle = 'rgb(150,150,150)';
	cx[MID].arc(0, 0, 70, 0, 2 * Math.PI);
	cx[MID].fill();
	cx[MID].restore();
	
	cx[MID].lineWidth = 10;
	cx[MID].strokeStyle = 'rgb(50,50,50)';
	cx[MID].stroke();
	
	//portal target
	cx[MID].fillStyle = 'RGB(25,124,247)';
	cx[MID].beginPath();
	cx[MID].arc(click.start[0], click.start[1], oR, sAng, eAng);
	cx[MID].arc(click.start[0], click.start[1], iR, eAng, sAng, true);
	cx[MID].fill();
	
	cx[MID].beginPath();
	cx[MID].arc(click.start[0], click.start[1], targCircT, 0, 2 * Math.PI);
	cx[MID].stroke();
	cx[MID].lineWidth = 3;
	cx[MID].fillStyle = 'RGB(255,255,255)';
	cx[MID].fillStyle = 'RGB(75,180,247)';
	for(var s = 0; s < 8; s+= 1)
	{
		for(var r = 0; r < 2; r += 1)
		{
			var or, ir;
			if(!r)
			{
				or = targInT - liner;
				ir = targCircT + liner;
				cx[MID].fillStyle = 'RGB(120, 120, 120)';
			}
			else
			{
				or = targOutT - liner;
				ir = targInT + liner;
				cx[MID].fillStyle = 'RGB(201, 201, 201)';
			}
			var sang = -Math.PI/8 + s * Math.PI/4 + underAng;
			var eang = sang + Math.PI/4 - underAng;
			cx[MID].beginPath();
			cx[MID].arc(click.start[0], click.start[1], or, sang, eang);
			cx[MID].arc(click.start[0], click.start[1], ir, eang, sang, true);
			cx[MID].globalAlpha = .7;
			cx[MID].fill();

		}
	}

	var oR = 0;
	var iR = 0
	if(click.scl == 0)
	{
		sAng = 0;
		eAng = 2 * Math.PI;
		oR = targCircT;
		iR = 0;
	}
	else if(click.scl == 1)
	{
		var ot = overAng * 3/2;
		sAng -= ot;
		eAng += ot; 
		oR = targInT + adder;// * 1.1;
		iR = targCircT - adder;//* .9;	
	}
	else if(click.scl == 2) 
	{
		var ot = overAng;
		sAng -= ot;
		eAng +=  ot; 
		oR = targOutT  + adder;//* 1.1;
		iR = targInT - adder;//* .9;

	}
	cx[MID].fillStyle = 'RGB(255,255,255)';
	cx[MID].globalAlpha = .7;
	cx[MID].beginPath();
	cx[MID].arc(click.start[0], click.start[1], targCircT-liner, 0, 2 * Math.PI);
	cx[MID].fill();
	cx[MID].fillStyle = 'black';
	cx[MID].globalAlpha = 1;
	cx[MID].stroke();
	cx[MID].lineWidth = 3;
	cx[MID].fillStyle = 'RGB(255,255,255)';
	
	if(click.scl > -1)
	{
		cx[MID].fillStyle = 'RGB(25,124,247)';
		cx[MID].beginPath();
		cx[MID].arc(click.start[0], click.start[1], oR, sAng, eAng);
		cx[MID].arc(click.start[0], click.start[1], iR, eAng, sAng, true);
		cx[MID].fill();
	}
	
}

//reset screen sizing to fill properly
function reConfigure()
{
	console.log(mobile, ios);
	if(!ios) document.body.style.overflow = 'hidden';
/* 	if(!ios) scrollAmt = 0;
	else document.body.style.overflow = 'hidden'; */
	
	//get new sizing
	var oldW = scrn.w;
	var oldH = scrn.h;

	scrn.t = (window.pageYOffset || document.documentElement.scrollTop);
	scrn.l = (window.pageXOffset || document.documentElement.scrollLeft);
	scrn.w = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
	scrn.h = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
	scrn.maj = Math.max(scrn.w, scrn.h);
	scrn.min = Math.min(scrn.w, scrn.h);
	
	

		
	
	
	
	
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
		var effX = numX;
		var effY = numY;
		if(rotate)
		{
			effX = numY;
			effY = numX;
		}
		sqSide = Math.min((scrn.w- 2* outBord-butX)/effX, (scrn.h - 2* outBord - butY)/effY);
		sqX = (scrn.w - butX - effX * sqSide)/2;
		sqY = (scrn.h - butY - effY * sqSide)/2;

		/* var area = Math.pow(sqSide, 2) * (numX * numY) + Math.pow(butSide, 2) * butts[paused].length;
		var waste = maxArea - area; */
		if(sqSide > bestSide)
		{
			console.log("new min", i);
			bestSide = sqSide
			flipped = (!rotate) ? 0: (numX < numY)? 1 : -1;
			buttsFlipped = butsVert;
			scrn.sq = sqSide;
			scrn.but = butSide;
			scrn.sqReduc = sqSide * (1-bordPct);
			scrn.sqOff = sqSide * bordPct/2;
			scrn.butX = butX;
			scrn.butY = butY;
			scrn.sx = sqX;
			scrn.sy = sqY;
			scrn.tx = (flipped > 0)? scrn.sq * -flipped * numX : 0;
			scrn.ty = (flipped > 0)? 0 : scrn.sq * flipped * numY;
		}

	}

	console.log(scrn);
	console.log(flipped, sqSide, scrn.sx, scrn.sy, scrn.tx, scrn.ty);
	
	//resize/translate/rotate canvases 
	for(var i = 0; i < canv.length; i += 1)
	{
		canv[i].width = scrn.w + scrollAmt;
		canv[i].height = scrn.h + scrollAmt;
		cx[i].restore();
		cx[i].save();
		cx[i].translate(0, scrn.t);
		
		if(i > 0 && i < 4)
		{
			console.log(i);
			cx[i].translate(scrn.sx, scrn.sy);
			cx[i].rotate(-Math.PI/2 * flipped);
			cx[i].translate(scrn.tx, scrn.ty);
		}
	}
	console.log('hi');
	//redraw the screen
	
	
		
/* 	//if we rotated, reset the scroll
	if(oldW !== scrn.w)
	{
		window.scrollTo(0, 0);
	}
	//if the height increased, set the scroll above the minimum
	else if(oldH > scrn.h)
	{
		window.scrollTo(0, 25);
	}
	//if the height decreased, reset the scroll
	else if(oldH < scrn.h)
	{
		window.scrollTo(0, 0);
	}
	
	var nowScroll = window.pageYOffset || document.documentElement.scrollTop;
	
	//if scrolled at all, scroll to max
	window.scrollTo(0, (nowScroll > 20)? scrollAmt: 0); */
	
	
	if(ios)
	{
		var comp_h;
		if(flipped)
		{
			if(startFlippedHeight == -1)
			{
				startFlippedHeight = scrn.h;
			}
			comp_h = startFlippedHeight;
		}
		else
		{
			if(startHeight == -1)
			{
				startHeight = scrn.h;
			}
			comp_h = startHeight;
		}
		
		if(scrn.h > comp_h)
		{
			butts[0][0] = scrnButIosFull;
			butts[1][0] = scrnButIosFull;
			window.scrollTo(0, scrollAmt);
		}
		else
		{
			butts[0][0] = scrnButIosNotFull;
			butts[1][0] = scrnButIosNotFull;
			window.scrollTo(0,0);
		}

	}
	drawBase();
}


function animate()
{
	
	//check for screen changes and redraw if necessary	
	if(click.act !== SELECT_ZOOM && 
		((window.pageXOffset || document.documentElement.scrollLeft) !== scrn.l || 
		(window.pageYOffset || document.documentElement.scrollTop) !== scrn.t || 
		(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) !== scrn.w || 
		(window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight) !== scrn.h))
	{
		reConfigure();
	}
	
	
	//clear the temp canvas
	cx[MID].clearRect(0,0,scrn.w, scrn.h);
	cx[MID].fillStyle = 'RGB(25,124,247)';
	midCxfont="30px";
	
	//highlight buttons
	if((click.act === SELECT_ZOOM && click.but === SELECT_ZOOM_COL[paused]) || (click.act === SELECT_BUT && click.but !== SELECT_ZOOM_COL[paused] && click.but !== null && !butts[paused][click.but].ignore))
	{

		if(!buttsFlipped)
		{
			cx[MID].fillRect(scrn.but * click.but, scrn.h - scrn.but, scrn.but, scrn.but);
		}
		else
		{
			cx[MID].fillRect(scrn.w - scrn.but, scrn.h - scrn.but * (click.but + 1), scrn.but, scrn.but);
		}

	}
	
	//highlight targets
	else if(click.act === SELECT_MOVE && click.del[0] !== null)
	{
		drawTarget();
	}
	
	//player
	cx[MID].fillStyle = 'RGB(25,124,247)';
	cx[MID].fillRect(scrn.sx + player.pos[0] * (scrn.sq + inGap), scrn.sy + player.pos[1] * (scrn.sq + inGap), scrn.sq, scrn.sq);	
	
	//next loop
	requestAnimationFrame(animate);
}

