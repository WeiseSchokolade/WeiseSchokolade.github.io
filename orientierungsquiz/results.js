export function drawCoordinateSystem(ctx, width, height) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

export function drawResults(canvas, width, height, werteorientierung, wirtschaft, questions) {
    const diagonal = Math.sqrt(width * width + height * height);
    console.log(width, height, diagonal);
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    drawCoordinateSystem(ctx, width, height);
    
	ctx.beginPath();
	ctx.arc(
        (-werteorientierung + questions.length) / (questions.length * 2) * (width - 10) + 5,
        (wirtschaft + questions.length) / (questions.length * 2) * (height - 10) + 5, 5, 0, 2 * Math.PI);
	ctx.fill();
}

export function drawParty(ctx, width, height, label, color, radius, werteorientierung, wirtschaft, questions) {
	ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color + "A0";
    let centerX = (-werteorientierung + questions.length) / (questions.length * 2) * (width - radius - 2) + radius + 2;
    let centerY = (wirtschaft + questions.length) / (questions.length * 2) * (height - radius - 2) + radius + 2;
	ctx.arc(
        centerX,
        centerY, radius, 0, 2 * Math.PI);
	ctx.fill();
    ctx.stroke();

    let labelMeasurements = ctx.measureText(label);
    ctx.fillStyle = "#FFFFFF"
    ctx.fillText(label, centerX - labelMeasurements.width / 2, centerY + (labelMeasurements.actualBoundingBoxAscent + labelMeasurements.actualBoundingBoxDescent) / 2)
}

export function drawText() {
    let labelMeasurements = ctx.measureText(label);
    ctx.fillText(label, centerX - labelMeasurements.width / 2, centerY + (labelMeasurements.actualBoundingBoxAscent + labelMeasurements.actualBoundingBoxDescent) / 2)
}
