//joystick/targeting parameters
const stem = 40;
const JOY_R = 70;
const JOY_MAX = 70;
const targCircR = 35;
const targInR = 75;
const targOutR = 110;

const targCircT = 30;
const targInT = targCircT + 30;// + scrn.sq;
const targOutT = targInT + 20;// 2.7;//;
const adder = targCircT * .3;
const liner = adder * .3;
const overAng = Math.PI/12;
const underAng = Math.PI/20 * .5;

const outGap = 7;
const inGap = 5;

//enums
const BACK = 4;
const MID = 5;
const FRONT = 6;

const CLICK_START = 0;
const CLICK_MOVE = 1;
const CLICK_END = 2;

const SELECT_BUT = -1;
const SELECT_ZOOM = 2; 
const SELECT_MOVE = 3;