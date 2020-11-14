const body = document.querySelector( 'body' );
const wrap = document.getElementById( 'wrap' );
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
const snake = () => document.querySelectorAll( '.snake' );
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

const isTouch = 'ontouchstart' in window;

if ( isTouch ) {
	body.classList.add( 'is-touch' );
}

let currentScreen = 'start';

setScreen = ( screen ) => {
	for ( let el of document.querySelectorAll( '.screen' ) ) {
		el.remove();
	}
	let screenEl = document.createElement( 'div' );
	let screenTemplate = document.getElementById( 'screen-' + screen + '-template' );
	screenEl.id = screenTemplate.id.replace( '-template', '' );
	screenEl.classList.add( 'screen' );
	screenEl.innerHTML = screenTemplate.innerHTML;
	wrap.appendChild( screenEl );
	currentScreen = screen;

	return screenEl;
};
setScreen( 'start' );

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
	
	let gameOverScreen = setScreen( 'game-over' );

	let gotReplace = [
		'gobbled down',
		'ate',
		'got',
		'munched on'
	];

	let treatReplace = [
		'treats',
		'snacks',
		'candies',
		'sweets'
	];
	
	let gotWord = Math.floor( Math.random() * gotReplace.length );
	let treatWord = Math.floor( Math.random() * treatReplace.length );
	
	gameOverScreen.innerHTML = gameOverScreen.innerHTML
		.replace( '{got}', gotReplace[gotWord] )
		.replace( '{0}', points )
		.replace( '{treats}', treatReplace[treatWord] );

		points = 0;
		snakeHead = [0,0];

		for ( let bit of snake() ) {
			bit.remove();
		}

		moveTreat();
		snakeDirection = [0,1];
	
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

controls.forEach( el => {
	el.addEventListener( 'click', (e) => {
		let moveY = +e.target.getAttribute('data-y') || 0;
		let moveX = +e.target.getAttribute('data-x') || 0;
		
		turn( moveX, moveY );
	} );
} );

body.addEventListener( 'keydown', e => {
	turn( controlKeys[e.key].x, controlKeys[e.key].y );
} );

play = () => {
	document.getElementById( 'screen-' + currentScreen ).remove();
	drawSnake();
	moveTreat();
	setPoints();
	resetInterval();
};