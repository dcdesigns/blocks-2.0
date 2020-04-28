

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
const playerMillis = 400;
const timerMillis = 2 * playerMillis;
const flashMillis = 5000;
const playerMoveRotation = .5;
const boardBuffer = 0.5;
const freezeRate = .8/playerMillis;
const auraRscale = 1.2;
const auraAddscale = .3;
const auraWidthScale = .15;
const auraCol = [24,119,254];
const auraMax = [190,255,254];
const auraOpacity = 0.3;
const maxIceShield = 4;
const lavaTrailOpacity = .2;
const lavaTrailSpinAlpha = .95;
const idleWaitMillis = 30000;

const maxSquare = 200;
const maxButton = 125;
const minMenu = 50;

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
const z_min = -200;//-playerJumpHeight/playerScaleTopJump;
const playerThickness = 4;
const playerSize = .5;
const blockDepth = 130;
const posRadiusScale = 6;
const posXYScale = 1;
const shadowAlpha = .8;
const playerNegRScale = 6;

const fallLimit = -blockDepth + playerThickness;

const playerScaleLoadJump = 20;
const load_z_accel = 4 * z_accel;
const z_vel_init_load = z_vel_init * 5;//playerScaleLoadJump/ playerScaleTopJump;
const playerLoadHeight = .95 * (.5 * load_z_accel * Math.pow(playerMillis/2, 2) + z_vel_init_load * (playerMillis/2));

// const focusHor = ['inner', 1.05];
// const focusVert = ['inner', 1.05];
const focusHor = ['inner', .5];
const focusVert = ['outer', .2];

//constant rotation speed
const omega_init = 2 * Math.PI * playerMoveRotation / playerMillis;
const omega_load = 3 * omega_init;
const omega_win = 2 * omega_init;
//constant set to kill omega in one cycle
const alpha_slow = .9; 
const alpha_ice = 1;
//constant set to disappear in one cycle
const opacity_rate_init = .98;
const opacity_rate_fall = .89;
const opacity_rate_laser = .92;
const laser_wait_frames = 20;

const targetSize = 1.2;


//calculated values based on the above settings
const targetMean = (targetAlphaMin + targetAlphaMax) / 2;
const targetScale = (targetAlphaMax - targetAlphaMin) * .5;
const optionMean = (optionAlphaMin + optionAlphaMax) / 2;
const optionScale = (optionAlphaMax - optionAlphaMin) * .5;

const imgBuffer = .05;
const sqBuffer = .07;
const bridgeBufferScale = 7;

const rewindRate = .23;
const closeLimit = .03;






const bordPct = .22;
const outBord = .4;


