$(document).ready(function(){
	$('#resetScore').focus(function(){
		this.blur();
	});
	//Define vars
	var canvas = $('#canvas')[0];
	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;
	var cw = 15;		//cell width
	var d = "right";				//direction
	var food;			
	var score;
	var color = "green";
	var speed = 150;	//default speed
	var paused = false;

	//snake array
	var snakeArray;

	//initializer
	function init(){
		d = "right";
		createSnake();
		createFood();
		score = 0;
		paused = false;

		if(typeof gameLoop != "undefined"){
			clearInterval(gameLoop);
		}
		
		gameLoop = setInterval(paint, speed);
	}

	//Run initializer
	init();

	//create snake
	function createSnake(){
		var length = 5;
		snakeArray = [];
		for(var i=length-1; i>=0; i--){
			snakeArray.push({x:i,y:0});
		}
	}

	//create food
	function createFood(){
		food = {
			x:Math.round(Math.random()*(w-cw)/cw),
			y:Math.round(Math.random()*(h-cw)/cw),
		};
	}

	//Paint function
	function paint(){
		//paint canvas
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,w,h);
		ctx.strokeStyle = "white";
		ctx.strokeRect(0,0,w,h);

		//snake logic
		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;
		//direction logic
		if(d == 'right') nx++;
		else if(d == 'left') nx--;
		else if(d == 'up') ny--;
		else if(d == 'down') ny++;

		//collision
		if(nx <= -1 || nx >= w/cw || ny <= -1 || ny >= h/cw || checkCollision(nx, ny, snakeArray)){
			//init();
			//Insert Final Score
			$('#finalScore').html(score);
			//Show Overlay
			$('#overlay').fadeIn(300);
			return;
		}

		//eating food logic
		if(nx == food.x && ny == food.y){
			var tail = {x:nx, y:ny};
			score+=10;
			createFood();
		}else{
			var tail = snakeArray.pop();
			tail.x = nx;
			tail.y = ny;
		}

		snakeArray.unshift(tail);

		for(var i = 0; i<snakeArray.length; i++){
			var c = snakeArray[i];
			paintCell(c.x, c.y, color);
		}

		//paint cell
		paintCell(food.x, food.y, "red");

		//check logic
		checkScore(score);

		//display score
		$('#score').html('Your Score: '+score);


	}

	function paintCell(x, y, c){
		ctx.fillStyle = c;
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function checkCollision(x, y, array){
		for(var i=0; i<array.length; i++){
			if(array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	function checkScore(s){
		if(localStorage.getItem('highScore') == null){
			localStorage.setItem('highScore', score);
		}else{
			if(score > localStorage.getItem('highScore'))
				localStorage.setItem('highScore', score);
		}
		$('#highScore').html('High Score: '+localStorage.highScore);
	}

	//Keyboard Controller
	$(document).keydown(function(e){
		var key = e.which;
		//spacebar to pause
		if(key == "32"){
			pauseGame();
		}
		if(!paused){
			//arrow keys
			if(key == "37" && d != "right") d = "left";
			else if(key == "38" && d != "down") d = "up";
			else if(key == "39" && d != "left") d = "right";
			else if(key == "40" && d != "up") d = "down";
		}
	});

	function pauseGame(){
		if(!paused){
			gameLoop = clearInterval(gameLoop);
			paused = true;
		}else if(paused){
			gameLoop = setInterval(paint, speed);
			paused = false;
		}
	}
});

function resetScore(){
	localStorage.highScore = 0;
	//Display High Score
	highscorediv = document.getElementById('highScore');
	highscorediv.innerHTML ='High Score: 0';
}