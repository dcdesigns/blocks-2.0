function XOR(expA, expB)
{
	return ((expA && !expB) || (!expA && expB));
}

function interp(xmin, x, xmax, ymin, ymax)
{
	if(xmax == xmin) return 0;
	else return ymin + (ymax - ymin) * (x - xmin)/(xmax - xmin);
}

function interpLog(xmin, x, xmax, ymin, ymax)
{
	var fact = 3;
	xmin = Math.pow(xmin, fact);//log(xmin);
	xmax = Math.pow(xmax, fact);Math.log(xmax);
	x = Math.pow(x, fact);Math.log(x);
	
	if(xmax == xmin) return 0;
	else return ymin + (ymax - ymin) * (x - xmin)/(xmax - xmin);
}

function distance(arr1, arr2)
{
	return Math.pow(Math.pow(arr1[0] - arr2[0], 2) + Math.pow(arr1[1] - arr2[1], 2) ,.5);
}

function vectorEqual(v1, v2, threshold = 0.1)
{
	if(v1.length != v2.length) return false;
	
	for(var i = 0; i < v1.length; i += 1)
	{
		if(Math.abs(v1[i] - v2[i]) > threshold)
		{
			return false;
		}
	}
	return true;
}

function vectorMaxAbs(v)
{
	var max = 0;
	for(i = 0; i < v.length; i += 1)
	{
		max = Math.max(max, Math.abs(v[i] * playerMillis));
	}
	console.log(v, max);
	return max;
}

function vectorNonZero(v)
{
	for(i = 0; i < v.length; i += 1)
	{
		if(v[i] !== 0) return true;
	}
	return false;
}

function vectorAdd(v1, v2)
{
	var vsum = [];
	for(i = 0; i < v1.length; i += 1)
	{
		vsum.push(v1[i] + v2[i]);
	}
	return vsum;
}

function vectorSubtract(v1, v2)
{
	var vres = [];
	for(i = 0; i < v1.length; i += 1)
	{
		vres.push(v1[i] - v2[i]);
	}
	return vres;
}

function vectorScale(v, scale)
{
	var vscl = [];
	for(i = 0; i < v.length; i += 1)
	{
		vscl.push(v[i] * scale);
	}
	return vscl;
}

function vectorCopy(v)
{
	var v2 = [];
	for(i = 0; i < v.length; i += 1)
	{
		v2.push(v[i]);
	}
	return v2;
}

function roundVector(v)
{
	var v_rnd = [];
	for(i = 0; i < v.length; i += 1)
	{
		v_rnd.push(Math.round(v[i]));
	}
	return v_rnd;
}

function absVector(v)
{
	var v_abs = [];
	for(i = 0; i < v.length; i += 1)
	{
		v_abs.push(Math.abs(v[i]));
	}
	return v_abs;
}

function zeroVector(size = 2)
{
	var v = [];
	for(var i = 0; i < size; i += 1)
	{
		v.push(0);
	}
	return v;
}

function isDefined(prop)
{
	return (typeof(prop) != "undefined");
}

 function validDelta(delta)
 {
	var absX = Math.abs(delta[0]);
	var absY = Math.abs(delta[1]);
	var ret = false;
	
	if(absX < 3 && absY < 3 && ((absX == 0 || absY == 0) || absX == absY))
	{
		ret = true;
	}
	return ret;
 }