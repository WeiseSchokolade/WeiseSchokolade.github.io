const difficulty_input = document.getElementById("difficulty");
const canvas = document.getElementById("canvas1");
const note_input = document.getElementById("note_input");
const prompt_item = document.getElementById("prompt");
canvas.width = 200;
canvas.height = 150;
const ctx = canvas.getContext("2d");
let difficulty = "simple";
		  let notes = ["C", "D", "E", "F", "G", "A", "H", "C", "D", "E", "F", "G", "A", "H", "C"];
const extraLines = [[0], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ], [ ],[12],[12],[12,14]];
let lastNote = 0;
let i = 0;

function updateDifficulty() {
	if (difficulty == "simple") {
		notes = ["C", "D", "E", "F", "G", "A", "H", "C", "D", "E", "F", "G", "A", "H", "C"];
	}
	if (difficulty == "normal") {
		notes = ["c1", "d1", "e1", "f1", "g1", "a1", "h1", "c2", "d2", "e2", "f2", "g2", "a2", "h2", "c3"];
	}
}

difficulty_input.addEventListener("change", (event) => {
	difficulty = difficulty_input.value;
	updateDifficulty();
});

window.addEventListener("load", () => {
	difficulty = difficulty_input.value;
	updateDifficulty();
});

function drawLine(y) {
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(0, y);
	ctx.lineTo(canvas.width, y);
	ctx.stroke();
}

function drawNoteLine(note) {
	let lineSpacing = canvas.height / 10;
	let centerLine = canvas.height / 2;

	let x = canvas.width / 2;
	
	let y = -note * lineSpacing / 2 + centerLine + lineSpacing * 3

	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(x + lineSpacing, y);
	ctx.lineTo(x - lineSpacing, y);
	ctx.stroke();
}

function getNote() {
	return Math.floor(Math.random() * notes.length);
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
		let input = note_input.value;
		if (difficulty == "simple") {
			input = note_input.value.toUpperCase();
		}
		
		if (notes.indexOf(input) != -1) {
			let isCorrect = false;
			for (let i = 0; i < notes.length; i++) {
				if (notes[i] == input && i == lastNote) {
					isCorrect = true;
				}
			}
			if (isCorrect) {
				prompt_item.textContent = "Richtig! Gib die Note ein:";
				lastNote = getNote();
				animate();
			} else {
				prompt_item.textContent = "'" + input + "' ist nicht die richtige Note! Veruch es nochmal!";
			}
		} else {
			prompt_item.textContent = "'" + input + "' ist nicht die richtige Note! Versuch es nochmal!";
		}
		note_input.value = "";
	}
}

function animate() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	redraw();
	
	let extraNoteLines = extraLines[lastNote];
	for (let i = 0; i < extraNoteLines.length; i++) {
		drawNoteLine(extraNoteLines[i]);
	}
	drawNote(lastNote);
}
lastNote = getNote();
animate();
