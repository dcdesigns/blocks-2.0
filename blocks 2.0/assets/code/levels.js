

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
			"GGGEX"
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
			"IGIG",
			"IIII",
			"IIXI",
			"GIII",
			"IIII",
			"GIGI"
		],
		player: [3,0],
		moves: 3
	},

	{
		map: [
			"IGIGIG",
			"GIIIIG",
			"IIIGII",
			"GIIIII",
			"IIIIGI",
			"GIIIII",
			"IIXIII",
			"GIIIGI"
		],
		player: [3,0],
		moves: 4
	},

	{
		map: [
			"LIIGIGL",
			"LIIIIIL",
			"LIIIGIL",
			"GIGIIIG",
			"LIIIIIL",
			"LXIIIIL",
			"LIIIIIL",
			"LIGIGGL"
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
			"GGTGTGTEX"
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
			"EETTTET",
			"EETXTEI",
			"EETTTET",
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
			"GGILGTIIIGG",
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
			"LL-ZGGR",
			"GL-LGZG",
			"GL-ZGZX",
			"GL-LGZZ",
			"LL-ZGG/"
		],
		player: [0,2],
		moves: 3
	},

	{
		map: [
			"GZGEEEEE",
			"ZGZGEEEE",
			"GZIZIEEE",
			"EGZTZIEE",
			"EEIZZZIE",
			"EEEIZIZG",
			"EEEEIZXE",
			"EEEEEIEE"
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
		specialCodes: [
			{x: 6, y:0, type: Portal, portalGroup: PortalZero},
			{x: 1, y:2, type: Portal, portalGroup: PortalZero},
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
		specialCodes: [
			{x: 0, y:4, type: Portal, portalGroup: PortalZero},
			{x: 6, y:4, type: Portal, portalGroup: PortalZero},
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
		specialCodes: [
			{x: 2, y:0, type: Portal, portalGroup: PortalZero},
			{x: 5, y:1, type: Portal, portalGroup: PortalZero},
		],
		player: [3,1],
		moves: 3
	},

	{
		map: [
			"EGGPGGEEE",
			"EEEEEIEEE",
			"E-I-I/EIX",
			"EEEEZEEEE",
			"GGGPEGEEE"
		],
		specialCodes: [
			{x: 3, y:0, type: Portal, portalGroup: PortalZero},
			{x: 3, y:4, type: Portal, portalGroup: PortalZero},
		],
		player: [0,4],
		moves: 5
	},

	{
		map: [
			"LGPLLLLLL",
			"LBGTLIIIX",
			"LLTLLLLLL",
			"LLLLLLLLL",
			"LLILLLLGL",
			"LGGLLLGGL",
			"LGGLTLBPL",
			"LLLLLLLLL"
		],
		specialCodes: [
			{x: 2, y:0, type: Portal, portalGroup: PortalZero},
			{x: 1, y:1, type: PortalB, portalGroup: PortalZero},
			{x: 6, y:6, type: PortalB, portalGroup: PortalZero},
			{x: 7, y:6, type: Portal, portalGroup: PortalZero},
		],
		player: [1,0],
		moves: 6
	},

	{
		map: [
			"LLPLXLL",
			"LLLLLLL",
			"LLBGBLL",
			"LLGGGLL",
			"LLPGGLL"
		],
		specialCodes: [
			{x: 2, y:0, type: Portal, portalGroup: PortalZero},
			{x: 2, y:2, type: PortalB, portalGroup: PortalZero},
			{x: 4, y:2, type: PortalB, portalGroup: PortalZero},
			{x: 2, y:4, type: Portal, portalGroup: PortalZero},
		],
		player: [3,3],
		moves: 2
	},

	{
		map: [
			"LLLLLLX",
			"LBLLLLI",
			"GIIIIPI",
			"LPTLIGL",
			"LLLLLGB",
			"LLLLLLL"
		],
		specialCodes: [
			{x: 1, y:1, type: PortalB, portalGroup: PortalZero},
			{x: 5, y:2, type: Portal, portalGroup: PortalZero},
			{x: 1, y:3, type: Portal, portalGroup: PortalZero},
			{x: 6, y:4, type: PortalB, portalGroup: PortalZero},
		],
		player: [0,2],
		moves: 3
	},

	{
		map: [
			"GGBGTILGII",
			"IITIIIIIII",
			"IIIIIIIIII",
			"IIIIIIIIII",
			"PLIILLLRLG",
			"LLILLLLLLL",
			"TLGLLLLLLP",
			"LLLLLGLLLG",
			"TLLXLBLLLL",
			"GLLILLLLLL",
			"GLGLLLLLLL"
		],
		specialCodes: [
			{x: 2, y:0, type: PortalB, portalGroup: PortalZero},
			{x: 0, y:4, type: Portal, portalGroup: PortalZero},
			{x: 9, y:6, type: Portal, portalGroup: PortalZero},
			{x: 5, y:8, type: PortalB, portalGroup: PortalZero},
		],
		player: [0,0],
		moves: 9
	},

	{
		map: [
			"GZPZ/IIGGR",
			"GZXZGGIIIG",
			"IZZZGIIIIB",
			"RR/GIIIIZZ",
			"/GGIIIIIZB",
			"|GIIIIIIZG",
			"R-------ZP"
		],
		specialCodes: [
			{x: 2, y:0, type: Portal, portalGroup: PortalZero},
			{x: 9, y:2, type: PortalB, portalGroup: PortalZero},
			{x: 9, y:4, type: PortalB, portalGroup: PortalZero},
			{x: 9, y:6, type: Portal, portalGroup: PortalZero},
		],
		player: [0,0],
		moves: 6
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
			"GL-LGLG",
			"LLLLLLL",
			"GLWLWLC",
			"LLLLLLL",
			"GL-LLLX"
		],
		player: [0,2],
		moves: 2
	},

	{
		map: [
			"EEGEE",
			"EEEEE",
			"GE-EG",
			"EEEEE",
			"EEIEE",
			"EEIEE",
			"EEIEE",
			"EEIEE",
			"EEXEE"
		],
		specialCodes: [
			{x: 2, y:2, trigger: JumpTrigger, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,2],
		moves: 3
	},

	{
		map: [
			"GEEEEX",
			"EEEEEE",
			"-EEEE-",
			"EEEEEE",
			"GEEEEG",
			"EEEEEE",
			"-EIGE-"
		],
		specialCodes: [
			{x: 0, y:2, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 0, y:6, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:2, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:6, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
		],
		player: [0,0],
		moves: 4
	},

	{
		map: [
			"GEEXE-",
			"EEEEEE",
			"-EEEE-",
			"EEEEEE",
			"GEEEEG",
			"EEEEEE",
			"-EEEE-",
			"EEEEEE",
			"-EIGE-"
		],
		specialCodes: [
			{x: 0, y:2, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 0, y:6, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 0, y:8, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:0, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:2, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:6, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
			{x: 5, y:8, timer: TimerTrigger, direction: RotateCounterClockwise, inc: RotateSingle},
		],
		player: [0,0],
		moves: 4
	},

	{
		map: [
			"1ERE-EIIX",
			"EEEEEEEEE",
			"GE|E/EEEE",
			"EEEEEEEEE",
			"|E|E-EEEE"
		],
		specialCodes: [
			{x: 2, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 0, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,2],
		moves: 5
	},

	{
		map: [
			"KZZ1K",
			"KZZZK",
			"KZZZK",
			"K1ZZX"
		],
		specialCodes: [
			{x: 0, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 0, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 3, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 0, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 1, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 0, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,0],
		moves: 6
	},

	{
		map: [
			"G1Z1Z3Z3ZX"
		],
		specialCodes: [
			{x: 2, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:0, trigger: SwitchTrigger3, direction: RotateClockwise, inc: RotateSingle},
			{x: 8, y:0, trigger: SwitchTrigger3, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,0],
		moves: 7
	},

	{
		map: [
			"KIRIIIZIX",
			"GGGIGRZII",
			"GG1GIKZII",
			"GGGIGRZII",
			"KIRIIIZI/"
		],
		specialCodes: [
			{x: 0, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 5, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 5, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 5, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 0, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,2],
		moves: 5
	},

	{
		map: [
			"IIXII",
			"IIIII",
			"IIIII",
			"IIIII",
			"IIZII",
			"GG-GG",
			"GGGGG",
			"GG-GG",
			"GGEGG",
			"2GGG1"
		],
		specialCodes: [
			{x: 2, y:4, timer: TimerTrigger, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:5, trigger: SwitchTrigger2, direction: RotateCounterClockwise, inc: RotateDouble},
			{x: 2, y:7, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateDouble},
		],
		player: [2,9],
		moves: 4
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
			"GUUU",
			"UUUX"
		],
		player: [0,0],
		moves: 7
	},

	{
		map: [
			"GUVUUVUUVX"
		],
		player: [0,0],
		moves: 6
	},

	{
		map: [
			"XZGZGE1ES"
		],
		specialCodes: [
			{x: 1, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 3, y:0, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [4,0],
		moves: 2
	},

	{
		map: [
			"EE1",
			"EEE",
			"XZG",
			"EEE",
			"EES"
		],
		specialCodes: [
			{x: 1, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [2,2],
		moves: 1
	},

	{
		map: [
			"GGGGGGSG1",
			"GGGGGR||K",
			"XIIIRIZI|",
			"GGGGG//|Z",
			"GGGGGG/|G"
		],
		specialCodes: [
			{x: 5, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 7, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 8, y:1, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 8, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 5, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 7, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 8, y:3, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 7, y:4, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [8,4],
		moves: 2
	},

	{
		map: [
			"1K2G3IIIII",
			"GGGIIKIIII",
			"GG-IKIZIIX",
			"GGGIIIIIII",
			"GGGG/IIIII"
		],
		specialCodes: [
			{x: 1, y:0, trigger: SwitchTrigger2, direction: RotateClockwise, inc: RotateSingle},
			{x: 5, y:1, trigger: SwitchTrigger2, direction: RotateClockwise, inc: RotateSingle},
			{x: 2, y:2, trigger: SwitchTrigger1, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:2, trigger: SwitchTrigger2, direction: RotateClockwise, inc: RotateSingle},
			{x: 6, y:2, trigger: SwitchTrigger2, direction: RotateClockwise, inc: RotateSingle},
			{x: 4, y:4, trigger: SwitchTrigger3, direction: RotateClockwise, inc: RotateSingle},
		],
		player: [0,2],
		moves: 5
	},

];
