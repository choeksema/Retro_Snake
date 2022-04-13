var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var loseText = document.getElementById("lose");
var scoreText = document.getElementById("score");
var usrColCnt = document.getElementById("numCols");
var usrRowCnt = document.getElementById("numRows");
var newGameBtn = document.getElementById("newGame");
var helpBtn= document.getElementById("help");

var defaultRows = 12;
var defaultCols = 17;
var minRows = 10;
var maxRows = 50;
var minCols = 10;
var maxCols = 50;
var rows = defaultRows;
var columns = defaultCols;
var blockSize = 16;
var stepSize = blockSize;
var blockPos;    // Array storing current positions of snake blocks <-- TODO: make block class and make member variables
var startingSize = 3;    // Number of segments in snake

const arrowKeys = {"left": 37, "up": 38, "right": 39, "down": 40};

// Snake blocks
var block = new Image();
block.src = "images/block.png";

// Set grid size
canvas.width = blockSize * columns;
canvas.height = blockSize * rows;

// Snake class
class Snake
{	
	direction = arrowKeys['left']

	constructor()
	{
		blockPos = new Array(startingSize);
		for (let i=0; i < blockPos.length; i++)
		{
			blockPos[i] = {
				"x": (Math.round((columns/2) + i) * blockSize),
				"y": (Math.round((rows/2)) * blockSize)
			};
			// console.log("Position " + i + ": " + blockPos[i]["x"] + ", " + blockPos[i]["y"]);
		}
	}
	
	moveBody()
	{
		for(let i=blockPos.length-1; i > 0; i--)
		{
			blockPos[i]["x"] = blockPos[i-1]["x"];
			blockPos[i]["y"] = blockPos[i-1]["y"];
		}
	}
	
	moveHead()
	{
		// console.log(blockPos[0]["x"] + " (" + blockPos[0]["x"]/blockSize + ") | " 
			  //+ blockPos[0]["y"] + " (" + blockPos[0]["y"]/blockSize + ")");
		switch(snake.direction)
		{
			case 37:    // left
				snake.moveBody();
				blockPos[0]["x"] -= stepSize;
				
				// Wrap to right
				if ((blockPos[0]["x"] + blockSize) <= 0)    // If right side leaves canvas
				{
					blockPos[0]["x"] = canvas.width - blockSize;    // Reset left side to right of canvas
				}
				break;
			case 38:    // up
				snake.moveBody();
				blockPos[0]["y"] -= stepSize;
				
				// Wrap to bottom
				if ((blockPos[0]["y"] + blockSize) <= 0)    // If bottom side leaves canvas
				{
					blockPos[0]["y"] = canvas.height - blockSize;    // Reset top side to bottom of canvas
				}
				break;
			case 39:    // right
				snake.moveBody();
				blockPos[0]["x"] += stepSize;
				
				// Wrap to left
				if ((blockPos[0]["x"]) >= canvas.width)    // If left side leaves canvas
				{
					blockPos[0]["x"] = 0;    // Reset right side to left of canvas
				}
				break;
			case 40:    // down
				snake.moveBody();
				blockPos[0]["y"] += stepSize;
				
				// Wrap to top
				if ((blockPos[0]["y"]) >= canvas.height)    // If top side leaves canvas
				{
					blockPos[0]["y"] = 0;    // Reset bottom side to top of canvas
				}
				break;
			default:
				// Don't care
		}
	}
	
	keepMoving(e)
	{
		if (e != undefined)
		{
			switch(e.keyCode)
			{
				case 37:    // left
					e.preventDefault();
					snake.direction = arrowKeys["left"];
					break;
				case 38:    // up
					e.preventDefault();
					snake.direction = arrowKeys["up"];
					break;
				case 39:    // right
					e.preventDefault();
					snake.direction = arrowKeys["right"];
					break;
				case 40:    // down
					e.preventDefault();
					snake.direction = arrowKeys["down"];
					break;
				default:
					// Don't care
			}
		}
		snake.moveHead();
	}
	
	addBlock()
	{
		let curTailX = blockPos[blockPos.length-1]["x"];
		let curTailY = blockPos[blockPos.length-1]["y"];
		blockPos.push({"x": curTailX, "y": curTailY + blockSize});
	}
	
	collisionWithSelf()
	{
		let xHead = blockPos[0]["x"];
		let yHead = blockPos[0]["y"];
		
		// console.log("Head: (" + xHead + "," + yHead + ")");
		
		for (let i=blockPos.length-1; i>0; i--)
		{			
			// console.log("Body (" + i + "): (" + blockPos[i]["x"] + "," + blockPos[i]["y"] + ")");
			
			if ( (blockPos[i]["x"] == xHead) &&
				 (blockPos[i]["y"] == yHead) )
				return true;
		}
		return false;
	}
}

class Apple
{
	constructor()
	{
		this.x = ((Math.floor(Math.random() * columns)) * blockSize);
		this.y = ((Math.floor(Math.random() * rows)) * blockSize);
		// console.log("(" + this.x + ", " + this.y + ") --> (" + this.x/blockSize + ", " + this.y/blockSize + ")");
		this.img = new Image();
		this.img.src = "images/apple.png";
	}
}

function draw()
{
	scoreText.innerHTML = "Score: " + (blockPos.length - startingSize);
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	if (snake.collisionWithSelf())
	{
		loseText.innerHTML = "You Lose";
		delete snake;    // TODO: If you move, the snake just reappears and you can continue
	}
	else if (snakeGetsApple())
		apple = new Apple();
	else
	{
		for(let i=0; i < blockPos.length; i++)
			context.drawImage(block, blockPos[i]["x"], blockPos[i]["y"], blockSize, blockSize);
		
		context.drawImage(apple.img, apple.x, apple.y, blockSize, blockSize);
	}
	requestAnimationFrame(draw);
}

function snakeGetsApple()
{
	if ((apple.x == blockPos[0]["x"]) && (apple.y == blockPos[0]["y"]))
	{
		delete apple;
		snake.addBlock();
		return true;
	}
	return false;
}

function newGameBtnClick(e)
{
	if (snake !== undefined)
		delete snake;

	if (apple !== undefined)
		delete apple;

	context.clearRect(0, 0, canvas.width, canvas.height);

	if (usrColCnt === undefined)
		columns = defaultCols;

	else if (usrColCnt.value < minCols)
		columns = minCols;

	else if (usrColCnt.value > maxCols)
		columns = maxCols;

	else
		columns = usrColCnt.value;
	

	if (usrRowCnt === undefined)
		rows = defaultRows;

	else if (usrRowCnt.value < minRows)
		rows = minRows;

	else if (usrRowCnt.value > maxRows)
		rows = maxRows;

	else
		rows = usrRowCnt.value;


	// TODO: Check for ridiculous col/row combos
	canvas.width = blockSize * columns;
	canvas.height = blockSize * rows;

	snake = new Snake();
	apple = new Apple();
	requestAnimationFrame(draw);
}


var snake = new Snake();
newGameBtn.addEventListener("click", newGameBtnClick);

setInterval(snake.keepMoving, 500);
// Listen for key presses
document.addEventListener("keydown", snake.keepMoving);
// document.addEventListener("keydown", snake.moveHead);

var apple = new Apple();

draw();