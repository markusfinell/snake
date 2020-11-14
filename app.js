
const board = document.getElementById( 'board' );
const boardWidth = Math.floor( board.getBoundingClientRect().width, 10 );
const boardHeight = boardWidth;
board.style.width = boardWidth + 'px';
board.style.height = boardHeight + 'px';

const gridSize = 10;
const gridWidth = Math.round(boardWidth / gridSize);
const gridHeight = Math.round(boardHeight / gridSize);
const gridArea = gridWidth * gridHeight;
const grid = [];
for ( let x = 0; x < gridWidth; x++ ) {
	for ( let y = 0; y < gridHeight; y++ ) {
		grid.push( x + '-' + y );
	}
}

const controls = document.querySelectorAll( '#controls button' );

let snakeHead = [0,0];
let snake = () => document.getElementsByClassName( 'snake' );
let snakeDirection = [0,1];
let moveInterval;

let treat = [-1,-1];
const treatEl = document.createElement( 'div' );
treatEl.classList.add( 'treat' );
treatEl.style.width = gridSize + 'px';
treatEl.style.height = gridSize + 'px';
treatEl.id = 't--1--1';
board.appendChild( treatEl );

let points = 0;
let newPoint = false;
const pointsEl = document.getElementById( 'points' );

let playing = false;
let moveCount = 0;

const controlKeys = {
	ArrowUp: { x: 0, y: -1 },
	ArrowDown: { x: 0, y: 1 },
	ArrowLeft: { x: -1, y: 0 },
	ArrowRight: { x: 1, y: 0 }
};

resetInterval = () => {
	clearInterval( moveInterval );
    moveInterval = setInterval( moveSnake, 200 );
};

turn = ( x, y ) => {
	if ( snakeDirection[0] != 0 && y != 0 ) {
		return;
	}
	
	if ( snakeDirection[1] != 0 && x != 0 ) {
		return;
	}

	snakeDirection[0] = y;
	snakeDirection[1] = x;
	
	resetInterval();
	moveSnake();
	
};

drawSnake = () => {
	if ( snake().length && ! newPoint ) {
		snake()[0].remove();
	}
	newPoint = false;
	addSnakeBit();
};

addSnakeBit = () => {
	let bit = document.createElement( 'div' );
	bit.classList.add( 'snake' );
	bit.id = 's-' + snakeHead[0] + '-' + snakeHead[1];
	bit.style.width = gridSize + 'px';
	bit.style.height = gridSize + 'px';
	bit.style.top = gridSize * snakeHead[0] + 'px';
	bit.style.left = gridSize * snakeHead[1] + 'px';
	board.appendChild( bit );
};

drawTreat = () => {
	treatEl.style.top = gridSize * treat[0] + 'px';
	treatEl.style.left = gridSize * treat[1] + 'px';
};

setPoints = () => {
	pointsEl.innerHTML = points;
};

moveTreat = () => {
	let currentGrid = grid.filter( el => {
		return document.getElementById( 's-' + el ) == null;
	} );

	let gridKey = Math.round( Math.random() * currentGrid.length - 1 );
	let cell = currentGrid[ gridKey ].split( '-' );
	treat = [cell[0], cell[1]];
	treatEl.id = 't-' + cell[0] + '-' + cell[1];

	drawTreat();
};

collisionDetected = () => {
	if ( snakeHead[0] < 0 || snakeHead[1] < 0 ) {
		return true;
	}

	if ( snakeHead[0] > boardHeight / gridSize - 1 ) {
		return true;
	}
	
	if ( snakeHead[1] > boardWidth / gridSize - 1 ) {
		return true;
	}

	if ( document.getElementById( 's-' + snakeHead[0] + '-' + snakeHead[1] ) ) {
		return true;
	}

	if ( treatEl.id == 't-' + snakeHead[0] + '-' + snakeHead[1] ) {
		points++;
		newPoint = true;
		setPoints();
		moveTreat();
	}

	return false;
};

gameOver = () => {
	clearInterval( moveInterval );
	if ( confirm( 'You got ' + points + ' points! Play again?' ) ) {
		points = 0;
		snakeHead = [0,0];

		while ( snake().length ) {
			snake()[0].remove();
		}

		moveTreat();
		snakeDirection = [0,1];
		drawSnake();
		play();
	}
};

moveSnake = () => {
	snakeHead[0] += snakeDirection[0];
	snakeHead[1] += snakeDirection[1];
	
	if ( collisionDetected() ) {
		gameOver();
	} else {
		drawSnake();
	}
};

play = () => {
	drawSnake();
	moveTreat();
	setPoints();
	resetInterval();
};

controls.forEach( el => {
	el.addEventListener( 'click', (e) => {
		let moveY = +e.target.getAttribute('data-y') || 0;
		let moveX = +e.target.getAttribute('data-x') || 0;
		
		turn( moveX, moveY );
	} );
} );

document.querySelector( 'body' ).addEventListener( 'keydown', e => {
	turn( controlKeys[e.key].x, controlKeys[e.key].y );
} );

play();

// if ( confirm( 'ready?' ) ) {
// 	play();
// }