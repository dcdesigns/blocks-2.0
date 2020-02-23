

var sqCodes = {
	"G": Grass,
	"X": Goal,
	"L": Lava,
	"I": Ice,
	"B": Boost,
	"T": TrampReg,
	"-": TrampHor,
	"|": TrampVrt,
	"R": TrampDDn,
	"/": TrampDUp,
	"O": TrampSpin, 
	"P": Portal,
};



var GAME_LEVELS = [
	
 	{map: [
			"LLLL",
			"GGGX",
			"LLLL"
		],
		player: [0,1],
		moves: 2},
	{map: [
			"LLLLLLL",
			"GGLGLGX",
			"LLLLLLL"
		],
		player: [0,1],
		moves: 4},

	{map: [
		"LGLLLXL",
		"GGLLLLL",
		"LLLGLGL"
	],
	player: [0,1],
	moves: 3},
	
	//first ice
	{map: [
		"LILLLLLLLIX",
		"GLIIIIIIGLI",
		"LILLLLLLGLL"
	],
	player: [0,1],
	moves: 3},
	
	
	{map: [
		"XLLL",
		"LILL",
		"LLLL",
		"LLLG",
		"LIIL",
		"GLLL",
		"GGLL",
		"LILL",
		"LILL",
		"LILL",
		"LGLL",
		"LGLL"
	],
	player: [1,11],
	moves: 4},
	
	{map: [
		"GIXG",
		"IILI",
		"GLIG",
		"LIII",
		"IILI",
		"GGGG",
		"IIII",
		"IIII",
		"IIII"
	],
	player: [2,8],
	moves: 4},
	
	{map: [
		"LLLLLLL",
		"GGTLIIX",
		"LLLLLLL"
	],
	player: [1,1],
	moves: 2},
	
	{map: [
		"GIIIIIIITLG",
		"IGILGTIIIGI",
		"IIIGIITXIII"
	],
	player: [1,1],
	moves: 6}, 
	
	{map: [
		"LLLLLGLL",
		"LLLLLLLL",
		"GGT|IIIG",
		"LLLLLLLG",
		"LLLLLILL",
		"LLLLLLI|",
		"LLLLLLLX"
	],
	player: [1,2],
	moves: 4},
	
	{map: [
		"LLLLLLLL",
		"GGT-|IIX",
		"LLLLLLLL"
	],
	player: [0,1],
	moves: 2},
	
	
	
	
	//first hor tramp
	{map: [
		"LLLLL-LGL-L-L-",
		"G|-LG-IL-L-LLL",
		"LLLLL-L-L-L-LX"
	],
	player: [0, 1],
	moves: 3},
	
	{map: [
		"GIIL-LLLLLL",
		"ILIT-LL/L-L",
		"IIGL/IIIIIX",
		"GLLLRIGGLLL"
	],
	player: [0,0],
	moves: 4},
	
	{map: [
		"IXIIIIPIII",
		"LLLLLLLLLL",
		"IPIIIIIII|"
	],
	player: [0,2],
	moves: 1},
	
	{map: [
		"/LPLLLXLL",
		"|LGGTPI|L",
		"RL-LIG/LL"
	],
	player: [3,1],
	moves: 3},
	
	
	{map: [
		"-L-L-RLLLLL",
		"L/-RL-LGLLL",
		"||G||-IIIIX",
		"LR-/L-LTLLL",
		"-L-L-LLLGLL"
	],
	player: [2,2],
	moves: 3}
	
	
		
];

