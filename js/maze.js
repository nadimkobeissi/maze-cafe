const chooseVertical = (width, height) => {
	if (width > height) {
		return true;
	}
	if (width < height) {
		return false;
	}
	return ((Math.floor(Math.random() * 2)) === 0);
};

const chooseWallPosition = (c, w, h) => {
	return {
		width: c + Math.floor(
			Math.random() * ((w / c) - 1)
		) * c,
		height: c + Math.floor(
			Math.random() * ((h / c) - 1)
		) * c
	}
};

const choosePassagePosition = (c, w, h) => {
	return {
		width: Math.floor(
			Math.random() * (w / c)
		) * c,
		height: Math.floor(
			Math.random() * (h / c)
		) * c
	}
};

const divide = (context, maze, x, y, width, height, moves, m) => {
	let c = maze.cellSize;
	if ((width < c * 2) || (height < c * 2)) {
		return false;
	}
	let v = chooseVertical(width, height);
	let cw = chooseWallPosition(c, width, height);
	let cp = choosePassagePosition(c, width, height);
	let wx = x + (v ? cw.width : 0);
	let wy = y + (v ? 0 : cw.height);
	let px = wx + (v ? 0 : cp.width);
	let py = wy + (v ? cp.height : 0);
	let dx = (v ? 0 : 1);
	let dy = (v ? 1 : 0);
	let len = (v ? height : width);
	for (let i = 0; i < len; i += 1) {
		if (
			((wx - px < 0) || (wx - px > c)) ||
			((wy - py < 0) || (wy - py > c))
		) {
			Array.isArray(moves[m]) ? true : moves[m] = [];
			moves[m].push([wx, wy]);
			m++;
		}
		wx += dx;
		wy += dy;
	}
	let nx = x;
	let ny = y;
	let w = (v ? (wx - x) : width);
	let h = (v ? height : (wy - y));
	divide(context, maze, nx, ny, w, h, moves, m);
	nx = (v ? wx : x);
	ny = (v ? y : wy);
	w = (v ? (x + width - wx) : width);
	h = (v ? height : y + height - wy);
	divide(context, maze, nx, ny, w, h, moves, m);
};

const newMaze = (w, h, c) => {
	w = Math.round(w);
	h = Math.round(h);
	c = Math.round(c);
	while (w % c) {
		w++
	};
	while (h % c) {
		h++
	};
	return {
		width: w,
		height: h,
		cellSize: c
	};
};

const drawMaze = (width, height, cell) => {
	const Maze = newMaze(width, height, cell);
	let Canvas = document.createElement('canvas');
	let moves = [];
	Canvas.setAttribute('width', Maze.width);
	Canvas.setAttribute('height', Maze.height);
	document.getElementsByTagName('body')[0].appendChild(Canvas);
	Canvas.context = Canvas.getContext('2d');
	Canvas.context.fillStyle = '#FAEBD7';
	Canvas.context.fillRect(0, 0, Maze.width, Maze.height);
	Canvas.context.fillStyle = '#645E56';
	divide(Canvas.context, Maze, 0, 0, Maze.width, Maze.height, moves, 0);
	setTimeout(() => {
		for (let m = 0; m < moves.length; m++) {
			setTimeout(() => {
				moves[m].forEach((p) => {
					Canvas.context.fillRect(p[0], p[1], 3, 3);
				});
			}, m * 3);
		};
	}, 777);
};

window.onload = () => {
	drawMaze(window.innerWidth - 40, window.innerHeight - 40, 12);
};
