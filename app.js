
const board = document.getElementById( 'board' );
const boardWidth = Math.floor( board.getBoundingClientRect().width, 10 );
const boardHeight = boardWidth;
board.style.width = boardWidth + 'px';
board.style.height = boardHeight + 'px';

const gridSize = 10;
const gridWidth = Math.round(boardWidth / gridSize);
const gridHeight = Math.round(boardHeight / gridSize);
const gridArea = gridWidth * gridHeight;

const controls = document.querySelectorAll( '#controls button' );

let snake = [ [0,0], [0,1] ];
let snakeDirection = [0,1];
let moveInterval;

let treat = [-1,-1];
const treatEl = document.createElement( 'span' );

let points = 0;
const pointsEl = document.getElementById( 'points' );

controls.forEach( el => {
	el.addEventListener('touchstart', (e) => {
		let moveY = +e.target.getAttribute('data-y') || 0;
		let moveX = +e.target.getAttribute('data-x') || 0;
		if ( snakeDirection[0] != 0 && moveY != 0 ) {
			return;
		}
		if ( snakeDirection[1] != 0 && moveX != 0 ) {
			return;
		}
		snakeDirection[0] = moveY;
		snakeDirection[1] = moveX;
		moveSnake();
		play();
	} );
} );

drawSnake = () => {
	for ( let i = 0; i < snake.length; i++ ) {
		let bit = document.createElement( 'div' );
		bit.setAttribute( 'id', 's-' + i );
		bit.style.width = gridSize + 'px';
		bit.style.height = gridSize + 'px';
		bit.style.top = gridSize * snake[i][0] + 'px';
		bit.style.left = gridSize * snake[i][1] + 'px';
		board.appendChild(bit);
	}
};
drawSnake();

drawTreat = () => {
	treatEl.style.top = gridSize * treat[0] + 'px';
    treatEl.style.left = gridSize * treat[1] + 'px';
   	board.appendChild(treatEl);
};
drawTreat();

setPoints = () => {
	pointsEl.innerHTML = points;
};

snakeHead = ( i ) => {
	return snake[snake.length-1][i];
};

moveTreat = () => {
	let grid = [];
    for ( let i = 0; i < gridArea; i++ ) {
		grid.push(i);
	}
	let currentSnake = snake.map( el => {
		return el[0] * gridWidth + el[1];
	} );
	let currentGrid = grid.filter(el => {
		return currentSnake.indexOf(el) == -1;
	} );
	let gridKey = Math.round( Math.random() * currentGrid.length - 1 );
	let cellNum = currentGrid[ gridKey ] / gridWidth;
	let row = Math.floor( cellNum );
	let col = Math.round( ( cellNum - row ) * gridWidth );
	treat = [row, col];
};
moveTreat();

collisionDetected = () => {
	if ( snakeHead(0) < 0 || snakeHead(1) < 0 ) {
		return true;
	}
	if ( snakeHead(0) > boardHeight / gridSize - 1 ) {
		return true;
	}
	if ( snakeHead(1) > boardWidth / gridSize - 1 ) {
		return true;
	}
	for ( let i = 0; i < snake.length - 1; i++ ) {
		if ( snakeHead(0) == snake[i][0] && snakeHead(1) == snake[i][1] ) {
			return true;
		}
	}
	if ( snakeHead(0) == treat[0] && snakeHead(1) == treat[1] ) {
		points++;
		snake.splice( 0, 0, snake[0] );
		moveTreat();
	}
	return false;
};

gameOver = () => {
	clearInterval( moveInterval );
	if ( confirm( 'You got ' + points + ' points! Play again?' ) ) {
		points = 0;
		snake = [ [0,0], [0,1] ];
		moveTreat();
		snakeDirection = [0,1];
		drawSnake();
		play();
	}
};

moveSnake = () => {
	snake.splice(0,1);
	moveY = snake[snake.length-1][0] + snakeDirection[0];
	moveX = snake[snake.length-1][1] + snakeDirection[1];
	snake.push([moveY, moveX]);
	if ( collisionDetected() ) {
		gameOver();
	} else {
		drawSnake();
	} 
};

play = () => {
	clearInterval(moveInterval);
    moveInterval = setInterval(moveSnake, 200);
};

if(confirm('ready?')){
	play();
}
