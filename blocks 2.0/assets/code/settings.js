

const firstLevel = 0;
const loadLast = false;//true;

const helperLevels = 7;

const outGap = 7;
const inGap = 15 + outGap;

const targetAlphaMin = .5;
const targetAlphaMax = .5;

const optionAlphaMin = .15;
const optionAlphaMax = .6;
const targetMillis = 3200;
const playerMillis = 700;
const flashMillis = 5000;
const playerMoveRotation = 1;
const boardBuffer = 0.7;

const maxSquare = 200;
const maxButton = 200;

//how much bigger the player is at jump apex
const playerScaleTopJump = 2;
const playerScaleGoalJump = 3;



//used to calculate jumps (shouldn't need to change these)
const playerJumpHeight = 35;

//constant jump accel
const z_accel = playerJumpHeight * 2/(Math.pow(playerMillis/2,2) - playerMillis * (playerMillis/2)); 
//constant jump start velocity
const z_vel_init = -.5 * playerMillis * z_accel;
const z_vel_init_goal = z_vel_init * playerScaleGoalJump/ playerScaleTopJump;

//constant point where player disappears
const z_min = -80;//-playerJumpHeight/playerScaleTopJump;
const playerThickness = 4;
const playerSize = .5;
const blockDepth = 45;

const playerScaleLoadJump = 20;
const load_z_accel = 4 * z_accel;
const z_vel_init_load = z_vel_init * 5;//playerScaleLoadJump/ playerScaleTopJump;
const playerLoadHeight = .95 * (.5 * load_z_accel * Math.pow(playerMillis/2, 2) + z_vel_init_load * (playerMillis/2));


//constant rotation speed
const omega_init = 2 * Math.PI * playerMoveRotation / playerMillis;
const omega_load = 3 * omega_init;
const omega_win = 2 * omega_init;
//constant set to kill omega in one cycle
const alpha_slow = .9; 
const alpha_ice = 1;
//constant set to disappear in one cycle
const opacity_rate_init = .98;


//calculated values based on the above settings
const targetMean = (targetAlphaMin + targetAlphaMax) / 2;
const targetScale = (targetAlphaMax - targetAlphaMin) * .5;
const optionMean = (optionAlphaMin + optionAlphaMax) / 2;
const optionScale = (optionAlphaMax - optionAlphaMin) * .5;

const sqBuffer = .01;
const bridgeBufferScale = 7;




const bordPct = .22;
const outBord = .4;


