

var GAME_LEVELS = [
	{
		map: [
			"GGGGX"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"GGGGX"
		],
		player: [0,0],
		moves: 2
	},

	{
		map: [
			"GGGEEEE",
			"GGGGEEE",
			"GGGGGEE",
			"EGGGGGE",
			"EEGGGGG",
			"EEEGGGG",
			"EEEEGGX"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"LLLL",
			"GLGX",
			"LLLL"
		],
		player: [0,1],
		moves: 2
	},

	{
		map: [
			"LLLLLLL",
			"GGLGLGX",
			"LLLLLLL"
		],
		player: [0,1],
		moves: 4
	},

	{
		map: [
			"LGLLLXL",
			"GGLLLLL",
			"LLLGLGL"
		],
		player: [0,1],
		moves: 3
	},

	{
		map: [
			"GGEGG",
			"GEGGG",
			"EGEGG",
			"GGEGG",
			"GGGGX"
		],
		player: [0,0],
		moves: 4
	},

	{
		map: [
			"GGEGG",
			"GEEGG",
			"GEEGG",
			"GGEEE",
			"GGEGX"
		],
		player: [0,0],
		moves: 4
	},

	{
		map: [
			"GEIIIIIIIIX"
		],
		player: [0,0],
		moves: 1
	},

	{
		map: [
			"GEIIIIIIIIG",
			"EEEEEEEEEEE",
			"EXIIIIIIIIG"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"IIIG",
			"IIII",
			"IIXI",
			"GIII",
			"IIII",
			"IIGI"
		],
		player: [3,0],
		moves: 3
	},

	{
		map: [
			"IIIGII",
			"IIIIII",
			"IIIIII",
			"GIIIII",
			"IIIIGI",
			"IIIIII",
			"IIXIII",
			"IIIIGI"
		],
		player: [3,0],
		moves: 4
	},

	{
		map: [
			"LIIGIIL",
			"LIIIIIL",
			"LIIIGIL",
			"GIIIIIG",
			"LIIIIIL",
			"LXIIIIL",
			"LIIIIIL",
			"LIIIGIL"
		],
		player: [3,0],
		moves: 4
	},

	{
		map: [
			"GEIIIIIIIIG",
			"EEEEEEEEEEE",
			"EEGIIIIIIIG",
			"EEEEEEEEEEE",
			"GEIIIIIIIXE"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"LILLLLLLLIX",
			"GLIIIIIIGLI",
			"LILLLLLLGGL"
		],
		player: [0,1],
		moves: 3
	},

	{
		map: [
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
		moves: 4
	},

	{
		map: [
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
		moves: 4
	},

	{
		map: [
			"GTTTTTX"
		],
		player: [0,0],
		moves: 1
	},

	{
		map: [
			"GGTGTGTGX"
		],
		player: [0,0],
		moves: 1
	},

	{
		map: [
			"LLLLLLL",
			"GGTLIIX",
			"LLLLLLL"
		],
		player: [1,1],
		moves: 2
	},

	{
		map: [
			"GGTIIEG",
			"EEEEETE",
			"EETGTET",
			"EEGXGEI",
			"EETGTET",
			"EEEEEEG",
			"EEEEEEG"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"EEGTTLGE",
			"EEEEEEEE",
			"EGTTTIGE",
			"EEEEEEEE",
			"EGIIITLX"
		],
		player: [2,0],
		moves: 5
	},

	{
		map: [
			"LEEEEEEGG",
			"XEEEEEETG",
			"TEEEEEETG",
			"TEEEEEELG",
			"GGTGTTTGG"
		],
		player: [7,0],
		moves: 4
	},

	{
		map: [
			"EEGTTLGEEE",
			"GIETTGEEEE",
			"IGITTTLIIX"
		],
		player: [2,0],
		moves: 5
	},

	{
		map: [
			"GIIIIIIITLG",
			"IGILGTIIIGI",
			"IIIGIITXIII"
		],
		player: [1,1],
		moves: 6
	},

	{
		map: [
			"GGGGGGG",
			"GEE-EEG",
			"GEE-EEG",
			"G--G||X",
			"GEE-EEG",
			"GEE-EEG",
			"GGGGGGG"
		],
		player: [3,3],
		moves: 6
	},

	{
		map: [
			"G---G|||X",
			"EEE---EEE",
			"EE-----EE"
		],
		player: [0,0],
		moves: 2
	},

	{
		map: [
			"GGGGGGG",
			"GIIITG|",
			"GGGGG|G",
			"GGGGGLG",
			"EEEEGIG",
			"EEEEGIG",
			"EEEEGIG",
			"EEEEGXG"
		],
		player: [0,1],
		moves: 3
	},

	{
		map: [
			"LLLLLGLL",
			"LLLLLLLL",
			"GGT|IIIG",
			"LLLLLLLG",
			"LLLLLILL",
			"LLLLLLI|",
			"LLLLLLLX"
		],
		player: [1,2],
		moves: 4
	},

	{
		map: [
			"LLLLLLLL",
			"GGT-|IIX",
			"LLLLLLLL"
		],
		player: [0,1],
		moves: 2
	},

	{
		map: [
			"LLLLL-LGL-L-L-",
			"G|-LG-IL-L-LLL",
			"LLLLL-L-L-L-LX"
		],
		player: [0,1],
		moves: 3
	},

	{
		map: [
			"GIIL-LLLLLL",
			"ILIT-LL/LTL",
			"IIGL/IIIIIX",
			"GLLLRIGGLLL"
		],
		player: [0,0],
		moves: 4
	},

	{
		map: [
			"IXIIIIPIII",
			"LLLLLLLLLL",
			"IPIIIIIII|"
		],
		player: [0,2],
		moves: 1
	},

	{
		map: [
			"GGLLLGG",
			"GGLLLGG",
			"GGLLLGX",
			"GGLLLGG",
			"PG|LLGP",
			"GGLLLGG",
			"GGLLLGG"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"/LPLLLXLL",
			"|LGGTPI|L",
			"RL-LIG/LL"
		],
		player: [3,1],
		moves: 3
	},

	{
		map: [
			"-L-L-RLLLLL",
			"L/-RL-LGLLL",
			"||G||-IIIIX",
			"LR-/L-LTLLL",
			"-L-L-LLLGLL"
		],
		player: [2,2],
		moves: 3
	},

	{
		map: [
			"LLLGLLL",
			"LLLLLLL",
			"GIIWIIX",
			"LLIIILL",
			"LLLGLLL"
		],
		player: [3,4],
		moves: 3
	},

	{
		map: [
			"/G//R/R///---RR",
			"IIIIIIIIIIILIIX",
			"IIIIIIIIIIIIGII",
			"IIIIIIIIIIIIIII",
			"IIIIIIIIIIIIIGI",
			"IIIIIIIGIIIIIII",
			"RR/RG//R-/RR-R/"
		],
		player: [0,3],
		moves: 5
	},

	{
		map: [
			"GGGGG",
			"GEGGG",
			"GGGGG",
			"GGGGG",
			"GGGGX"
		],
		player: [0,0],
		moves: 3
	},

	{
		map: [
			"CCCWW",
			"BCCWW",
			"GCCWW",
			"GGGGG",
			"GGGGG"
		],
		player: [0,0],
		moves: 5
	},

	{
		map: [
			"GIXG",
			"IILI",
			"GLIG",
			"LIII",
			"IILI",
			"GGGG",
			"ICII",
			"IIII",
			"IIII"
		],
		player: [2,8],
		moves: 1
	},

];
