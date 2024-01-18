const canvas = document.getElementById("canvas1");
const button_1 = document.getElementById("bt1");
const button_10 = document.getElementById("bt10");
const button_100 = document.getElementById("bt100");
const button_1000 = document.getElementById("bt1000");
const button_10000 = document.getElementById("bt10000");
const infoPoints = document.getElementById("infoPoints");
const infoPi4 = document.getElementById("infoPI4");
const infoPi = document.getElementById("infoPI");
canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext("2d");
let points = []

class Point {
	constructor() {
		this.x = Math.random();
		this.y = Math.random();
		
		this.draw(ctx);
	}
	draw(context) {
		let distance = this.getDistanceToOrigin();
		if (distance <= 1) {
			context.fillStyle = "red";
		} else {
			context.fillStyle = "blue";
		}
		context.beginPath();
		let coords = convSXY(this.x, this.y)
		context.arc(coords[0], coords[1], 2, 0, 2 * Math.PI, true)
		context.fill();
	}
	getDistanceToOrigin() {
		return Math.sqrt((this.x / 1) ** 2 + (this.y / 1) ** 2);
	}
}

function addPoints(amount) {
	for (let i = 0; i < amount; i++) {
		points.push(new Point());
	}
	updateInfo();
}

function getPIby4() {
	total = 0;
	onCircleAmt = 0;
	notOnCircleAmt = 0;
	for (let i = 0; i < points.length; i++) {
		let point = points[i];
		total++;
		if (point.getDistanceToOrigin() <= 1) {
			onCircleAmt++;
		} else {
			notOnCircleAmt++;
		}
	}
	return ((onCircleAmt * 65536 )  / (total * 65536));
}

function updateInfo() {
	infoPoints.textContent = "Punkte: " + points.length;
	infoPi4.textContent = "π/4 ≈ " + getPIby4().toPrecision(6);
	infoPi.textContent = "π ≈ " + (getPIby4() * 4).toPrecision(6);
}

function convSXY(x, y) {
	let zoom = canvas.width / 2.5 * 2;
	let camX = 0.5;
	let camY = 0.5;
	return [(x - camX) * zoom + canvas.width / 2 + camX, (y - camY) * -zoom + canvas.height / 2];
}

function drawLine(context, x0, y0, x1, y1) {
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
}

function drawBackground(context) {
	context.fillStyle ="#FFEFCC";
	context.strokeStyle = "black";
	context.lineWidth = 2;

	let zoom = 2;
	
	context.beginPath();
	let coords = convSXY(0, 0)
	let radius = canvas.width / 2.5 * zoom;
	context.arc(coords[0], coords[1], radius, 0, 2 * Math.PI, true)
	context.fill();
	context.strokeRect(coords[0] - radius, coords[1] - radius, radius * 2, radius * 2);
	context.stroke();

	context.beginPath();
	let coords0 = convSXY(0, -50);
	let coords1 = convSXY(0, 50);
	drawLine(context, coords0[0], coords0[1], coords1[0], coords1[1]);
	for (let i = -1; i <= 1; i += 0.2) {
		coords = convSXY(i, 0);
		drawLine(context, coords[0], coords[1] - 5, coords[0], coords[1] + 5);
	}
	coords0 = convSXY(50, 0);
	coords1 = convSXY(-50, 0);
	drawLine(context, coords0[0], coords0[1], coords1[0], coords1[1]);
	for (let i = -1; i <= 1; i += 0.2) {
		coords = convSXY(0, i);
		drawLine(context, coords[0] - 5, coords[1], coords[0] + 5, coords[1]);
	}

	context.stroke();
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawBackground(ctx);
	
	for (let i = 0; i < points.length; i++) {
		points[i].draw(ctx);
	}
	
	// Disabled for performance reasons
	//requestAnimationFrame(animate);
}

button_1.addEventListener("click", function() {
	addPoints(1);
})
button_10.addEventListener("click", function() {
	addPoints(10);
})
button_100.addEventListener("click", function() {
	addPoints(100);
})
button_1000.addEventListener("click", function() {
	addPoints(1000);
});
button_10000.addEventListener("click", function() {
	addPoints(10000);
});

animate();
