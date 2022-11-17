const canvas = document.getElementById("canvas1");
const note_input = document.getElementById("note_input");
const prompt_item = document.getElementById("prompt");
canvas.width = 200;
canvas.height = 150;
const ctx = canvas.getContext("2d");
const notes = ["C", "D", "E", "F", "G", "A", "H", "C", "D", "E", "F", "G", "A", "H", "C"];
let lastNote = 0;
let i = 0;

function drawLine(y) {
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, y);
	ctx.lineTo(canvas.width, y);
	ctx.stroke();
}

function getNote() {
	return Math.floor(Math.random() * 13);
}

function drawNote(note) {
	let lineSpacing = canvas.height / 10;
	let centerLine = canvas.height / 2;
	
	let y = -note * lineSpacing / 2 + centerLine + lineSpacing * 3

	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.arc(canvas.width / 2, y, lineSpacing / 2, 0, Math.PI * 2);
	ctx.stroke();
}

function redraw() {

	let lineSpacing = canvas.height / 10;
	let centerLine = canvas.height / 2;
	drawLine(centerLine - lineSpacing * 2);
	drawLine(centerLine - lineSpacing);
	drawLine(centerLine);
	drawLine(centerLine + lineSpacing);
	drawLine(centerLine + lineSpacing * 2);

	ctx.font = 85 + "px Helvetica";
	ctx.fillText("𝄞", 0, centerLine + lineSpacing * 1.75);
	
}

function check(event) {
	if (event.keyCode == 13) {
		let input = note_input.value.toUpperCase();
		if (notes.indexOf(input) != -1) {
			let isCorrect = false;
			for (let i = 0; i < notes.length; i++) {
				if (notes[i] == input && i == lastNote) {
					isCorrect = true;
				}
			}
			if (isCorrect) {
				prompt_item.textContent = "Correct! Enter the note you see here";
				lastNote = getNote();
				animate();
			} else {
				prompt_item.textContent = "'" + input + "' is not the correct note! Try again!";
			}
		} else {
			prompt_item.textContent = "'" + input + "' is not a valid note! Try again!";
		}
		note_input.value = "";
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	redraw();
	drawNote(lastNote);
}
lastNote = getNote();
animate();
