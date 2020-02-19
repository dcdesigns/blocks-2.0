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

function vectorAdd(v1, v2)
{
	var vsum = [];
	for(i = 0; i < v1.length; i += 1)
	{
		vsum.push(v1[i] + v2[i]);
	}
	console.log(vsum);
	return vsum;
}