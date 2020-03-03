

var t_ind = 0;

var scrnButNotFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};


var scrnButFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};



var scrnButIosNotFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};



var scrnButIosFull = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//do nothing
	}
};



var menuBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//load menu
		paused = (paused)? 0: 1;
		console.log(paused);
		drawBase();
	}
};


var restartBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		//killAll();
		if(player.history.length)
		{
			
			//player.state = IDLE;
			player.state = REWIND;
			gameOver = false;
			player.rewindPos = player.history[0];
			player.history = [];
			player.lastMatchPos = vectorCopy(player.pos);
		}
	}
};


var undoBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		//killAll();
		if(player.history.length)
		{
			
			//player.state = IDLE;
			player.state = REWIND;
			gameOver = false;
			player.rewindPos = player.history.pop();
			player.lastMatchPos = vectorCopy(player.pos);
		}
	}
};


var movesBut = {
	imgInd: t_ind++,
	ignore: true,
	action: function(){
		//toggle hints
	}
};



var prevBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//toggle hints
	}
};



var nextBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//toggle hints
	}
};


var userBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		//toggle hints
	}
};

var hintBut = {
	imgInd: t_ind++,
	ignore: false,
	action: function(){
		
		
	}
};

 //screen buttons
var butts = [
	[scrnButNotFull, restartBut, undoBut, hintBut, menuBut, movesBut],
	[scrnButNotFull, prevBut, nextBut, menuBut, userBut]
];


