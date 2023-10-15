export class RRSWJS {
	constructor(canvas, renderer, renderCosys) {
		this.canvas = canvas;
		this.renderer = renderer;
		this.renderCosys = renderCosys;
		this.camera = new Camera(0, 0, 50);
		this.mouse = new Mouse(canvas, null);

		renderer.load(this);

		this.lastTimeStamp = 0;
		this.requestFrame();
	}

	frame(timestamp) {
		let deltaTime = timestamp - this.lastTimeStamp;
		this.lastTimeStamp = timestamp;
		let g = new Graph(this.canvas, this.camera, this.renderCosys);
		this.mouse.graph = g;
		this.renderer.draw(g, deltaTime);
		this.mouse.update();
		this.requestFrame();
	}

	requestFrame() {
		requestAnimationFrame((timestamp) => this.frame(timestamp));
	}
}

export class Renderer {
	load(rrs) {
	}

	draw(graph, deltaTime) {
		graph.ctx.strokeRect(0, 0, 20, 20);
		graph.ctx.stroke();
	}
}

export class Graph {
	constructor(canvas, camera, renderCosys) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.camera = camera;
		this.zoom = camera.zoom;
		this.camX = camera.x * this.zoom;
		this.camY = -camera.y * this.zoom;
		this.lineWidth = this.camera.zoom;

		this.ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (renderCosys) {
			this.ctx.lineWidth = this.lineWidth / 10;
			this.ctx.beginPath();
			this.ctx.strokeStyle = "blue";
			this.ctx.moveTo(canvas.width / 2 - this.camX, 0);
			this.ctx.lineTo(canvas.width / 2 - this.camX, canvas.height);
			this.ctx.stroke();
			this.ctx.beginPath();
			this.ctx.strokeStyle = "red";
			this.ctx.moveTo(0, canvas.height / 2 - this.camY);
			this.ctx.lineTo(canvas.width, canvas.height / 2 - this.camY);
			this.ctx.stroke();
			for (let i = -10; i < 10; i++) {
				if (i == 0) continue;
				this.drawLine(i, 0.1, i, -0.1, "red");
			}
			for (let i = -10; i < 10; i++) {
				if (i == 0) continue;
				this.drawLine(0.1, i, -0.1, i, "blue");
			}
		}
	}

	drawLine(x0, y0, x1, y1, color) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.moveTo(this.convSX(x0), this.convSY(y0));
		this.ctx.lineTo(this.convSX(x1), this.convSY(y1));
		this.ctx.stroke();
	}

	drawLine(x0, y0, x1, y1, color, strokeWidth) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = this.convStrokeWidth(strokeWidth);
		this.ctx.moveTo(this.convSX(x0), this.convSY(y0));
		this.ctx.lineTo(this.convSX(x1), this.convSY(y1));
		this.ctx.stroke();
	}


	drawRect(x0, y0, x1, y1) {
		this.drawRect(x0, y0, x1, y1, "black");
	}

	drawRect(x0, y0, x1, y1, color) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.strokeRect(this.convSX(x0), this.convSY(y0), this.convSW(x1 - x0), this.convSH(y1 - y0));
		this.ctx.stroke();
	}
	
	fillRect(x0, y0, x1, y1, color) {
		this.ctx.beginPath();
		this.ctx.fillStyle = color;
		this.ctx.fillRect(this.convSX(x0), this.convSY(y0), this.convSW(x1 - x0), this.convSH(y1 - y0));
		this.ctx.fill();
	}

	drawPoint(x, y) {
		this.drawPoint(x, y, "black");
	}
	
	drawPoint(x, y, color) {
		this.ctx.beginPath();
		this.ctx.strokeStyle = color;
		this.ctx.arc(this.convSX(x), this.convSY(y), 1, 0, 2 * Math.PI);
		this.ctx.stroke();
	}

	drawText(text, x, y) {
		this.drawText(text, x, y, "black", "left");
	}

	drawText(text, x, y, color) {
		this.drawText(text, x, y, color, "left");
	}

	drawText(text, x, y, color, textAlign) {
		this.ctx.beginPath();
		this.ctx.textAlign = textAlign;
		this.ctx.fillStyle = color;
		this.ctx.fillText(text, this.convSX(x), this.convSY(y));
	}

	drawImage(img, x, y, scale) {
		this.ctx.drawImage(img, this.convSX(x), this.convSY(y), this.convSW(img.width / scale), this.convSH(img.height / scale));
	}

	convSX(x) {
		return (x * this.zoom + this.canvas.width / 2) - this.camX;
	}

	convSY(y) {
		return (y * -this.zoom + this.canvas.height / 2) - this.camY;
	}

	convBackFromSX(sx) {
		return ((sx + this.camX) - this.canvas.width / 2) / this.zoom;
	}
	
	convBackFromSY(sy) {
		return ((sy + this.camY) - this.canvas.height / 2) / -this.zoom;
	}

	convSW(width) {
		return width * this.zoom;
	}

	convSH(height) {
		return height * -this.zoom;
	}

	convBackFromSW(width) {
		return width / this.zoom;
	}

	convBackFromSH(height) {
		return height / this.zoom;
	}

	convStrokeWidth(width) {
		return width * this.zoom;
	}

	convBackFromScreenStrokeWidth(sw) {
		return sw / this.zoom;
	}
}

export class Camera {
	constructor(x, y, zoom) {
		this.x = x;
		this.y = y;
		this.zoom = zoom;
	}
}

export class Mouse {
	constructor(canvas, graph) {
		this.canvas = canvas;
		this.graph = graph;
		this.x = 0;
		this.y = 0;
		this.screenX = 0;
		this.screenY = 0;
		this.scroll = 0;
		this.pressed = false;
		this.recentlyPressed = false;
		this.startedMobile = false;
		window.addEventListener("mousemove", (event) => this.eventCall(event));
		canvas.addEventListener("click", (event) => this.eventCall(event));
		canvas.addEventListener("mousedown", (event) => {
			this.eventCall(event);
			this.pressed = true;
			this.recentlyPressed = true;
		});
		window.addEventListener("mouseup", (event) => {
			this.eventCall(event);
			this.pressed = false;
			this.recentlyPressed = false;
		});
		canvas.addEventListener("wheel", (event) => {
			event.preventDefault();
			this.scroll += event.deltaY;
		})
		canvas.addEventListener("touchstart", (event) => {
			this.tapCall(event);
			this.pressed = true;
			this.startedMobile = true;
			this.recentlyPressed = true;
		});
		canvas.addEventListener("touchend", (event) => {
			this.pressed = false;
		});
		canvas.addEventListener("touchmove", (event) => {
			event.preventDefault();
			this.tapCall(event);
		})
	}
	update() {
		this.recentlyPressed = false;
		this.startedMobile = false;
	}
	eventCall(event) {
		if (this.graph == null) return;
		this.screenX = event.clientX - this.canvas.getBoundingClientRect().left;
		this.screenY = event.clientY - this.canvas.getBoundingClientRect().top;
		this.x = this.graph.convBackFromSX(this.screenX);
		this.y = this.graph.convBackFromSY(this.screenY);
	}
	tapCall(event) {
		if (this.graph == null) return;
		let point = event.touches[event.touches.length - 1];
		this.screenX = (point.clientX - this.canvas.getBoundingClientRect().left);
		this.screenY = (point.clientY - this.canvas.getBoundingClientRect().top);
		this.x = this.graph.convBackFromSX(this.screenX);
		this.y = this.graph.convBackFromSY(this.screenY);
		
	}
	wasRecentlyPressed() {
		return this.recentlyPressed;
	}
}