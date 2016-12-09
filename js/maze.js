window.onload = () => {
	'use strict';

	const chooseVertical = (width, height) => {
		if (width > height) { return true; }
		if (width < height) { return false; }
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
		let v   = chooseVertical(width, height);
		let cw  = chooseWallPosition(c, width, height);
		let cp  = choosePassagePosition(c, width, height);
		let wx  = x + (v? cw.width : 0);
		let wy  = y + (v? 0 : cw.height);
		let px  = wx + (v? 0 : cp.width);
		let py  = wy + (v? cp.height : 0);
		let dx  = (v? 0 : 1);
		let dy  = (v? 1 : 0);
		let len = (v? height : width);
		for (let i = 0; i < len; i += 1) {
			if (
				((wx - px < 0) || (wx - px > c)) ||
				((wy - py < 0) || (wy - py > c))
			) {
				if (!Array.isArray(moves[m])) {
					moves[m] = [];
				}
				moves[m].push([wx, wy]);
				m++;
			}
			wx += dx;
			wy += dy;
		}
		let nx = x;
		let ny = y;
		let w = (v? (wx - x) : width);
		let h = (v? height : (wy - y));
		divide(context, maze, nx, ny, w, h, moves, m);
		nx = (v? wx : x);
		ny = (v? y : wy);
		w = (v? (x + width - wx) : width);
		h = (v? height : y + height - wy);
		divide(context, maze, nx, ny, w, h, moves, m);
	};

	const newMaze = (w, h, c) => {
		w = Math.round(w);
		h = Math.round(h);
		c = Math.round(c);
		let c1 = c; let c2 = c;
		while (
			((w % c1) || (h % c1)) &&
			((w % c2) || (h % c2))
		)  {
			c1++;
			c2--;
			if (
				((w < c1) || (h < c1)) &&
				(2 > c2)
			) {
				return false;
			};
		}
		return {
			width: w,
			height: h,
			cellSize: ((w % c1)? c2 : c1)
		};
	};

	const drawMaze = (width, height, cell) => {
		const Maze = newMaze(width, height, cell);
		let Canvas = document.createElement('canvas');
		let moves = [];
		Canvas.setAttribute('width', width);
		Canvas.setAttribute('height', height);
		document.getElementsByTagName('body')[0].appendChild(Canvas);
		Canvas.context = Canvas.getContext('2d');
		Canvas.context.fillStyle = '#FAEBD7';
		Canvas.context.fillRect(0, 0, width, height);
		Canvas.context.fillStyle = '#322F2B';
		Canvas.context.beginPath();
		Canvas.context.arc((Maze.cellSize / 2), (Maze.cellSize / 2), (Maze.cellSize / 4), 0, 2 * Math.PI, true);
		Canvas.context.arc(width - (Maze.cellSize / 2), height - (Maze.cellSize / 2), (Maze.cellSize / 4), 0, 2 * Math.PI, true);
		Canvas.context.fill();
		Canvas.context.closePath();
		Canvas.context.fillStyle = '#645E56';
		setTimeout(() => {
			divide(Canvas.context, Maze, 0, 0, width, height, moves, 0);
			for (let m = 0; m < moves.length; m++) {
				setTimeout(() => {
					moves[m].forEach((p) => {
						Canvas.context.fillRect(p[0], p[1], 3, 3);
					});
				}, m * 7);
			};
		}, 1000);
	};

	let iw = window.innerWidth;
	let ih = window.innerHeight;
	while (iw % 10) { iw++ };
	while (ih % 10) { ih++ };

	drawMaze(iw - 35, ih - 35, 10);
};