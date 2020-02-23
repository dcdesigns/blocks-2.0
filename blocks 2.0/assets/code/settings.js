/* //joystick/targeting parameters
const stem = 40;
const JOY_R = 70;
const JOY_MAX = 70;
const targCircR = 20;
const targInR = 50;
const targOutR = 80;

const targCircT = 30;
const targInT = targCircT + 30;// + scrn.sq;
const targOutT = targInT + 20;// 2.7;//;
const adder = targCircT * .3;
const liner = adder * .3;
const overAng = Math.PI/12;
const underAng = Math.PI/20 * .5; */

const firstLevel = 0;
var gameOver = false;

const outGap = 7;
const inGap = 15 + outGap;

const targetAlphaMin = .8;
const targetAlphaMax = .8;
const optionAlphaMin = .15;
const optionAlphaMax = .6;
const targetMillis = 3200;
const playerMillis = 500;
const flashMillis = 5000;
const playerMoveRotation = 1;
const boardBuffer = 0.3;

//how much bigger the player is at jump apex
const playerScaleTopJump = 2;
const playerScaleGoalJump = 3;

//used to calculate jumps (shouldn't need to change these)
const playerJumpHeight = 3;

//constant jump accel
const z_accel = playerJumpHeight * 2/(Math.pow(playerMillis/2,2) - playerMillis * (playerMillis/2)); 
//constant jump start velocity
const z_vel_init = -.5 * playerMillis * z_accel;
const z_vel_init_goal = z_vel_init * playerScaleGoalJump/ playerScaleTopJump;
//constant point where player disappears
const z_min = -30;//-playerJumpHeight/playerScaleTopJump;

//constant rotation speed
const omega_init = 2 * Math.PI * playerMoveRotation / playerMillis;
//constant set to kill omega in one cycle
const alpha_slow = .97; 
//constant set to disappear in one cycle
const opacity_rate_init = .95;


//calculated values based on the above settings
const targetMean = (targetAlphaMin + targetAlphaMax) / 2;
const targetScale = (targetAlphaMax - targetAlphaMin) * .5;
const optionMean = (optionAlphaMin + optionAlphaMax) / 2;
const optionScale = (optionAlphaMax - optionAlphaMin) * .5;


//enums
const BACK = 3;
const MID = 4;
const BUT_CANV = 5;
const FRONT = 6;

const CLICK_START = 0;
const CLICK_MOVE = 1;
const CLICK_END = 2;

const SELECT_BUT = -1;
const SELECT_ZOOM = 2; 
const SELECT_MOVE = 3;

const ACTIVE = 4;
const IDLE = 5;
const BURNING = 6
const FALLING = 7;
const DEAD = 8;
const WINNING = 9;
const FINISHED = 10;

const bordPct = .1;
const outBord = 5;