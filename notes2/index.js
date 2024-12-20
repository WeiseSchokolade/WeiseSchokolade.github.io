let simpleNames = false;
let onlyNaturalNotes = false;
let inputType = "THREE_BUTTONS";

if (document.cookie) {
	let settings = JSON.parse(document.cookie);
	simpleNames = settings.simpleNames;
	onlyNaturalNotes = !settings.chromatic;
	inputType = settings.keyboard_type;
}

const TYPE = {
	NATURAL: {type: "NATURAL"},
	SHARP: {type: "SHARP", file: "sharp"},
	FLAT: {type: "FLAT", file: "flat"},
}

const NOTES = [
	{height:  0, name: "c1"  , simple: "C"  , base: "C", type: TYPE.NATURAL},
	{height:  0, name: "cis1", simple: "Cis", base: "C", type: TYPE.SHARP},
	{height:  1, name: "des1", simple: "Des", base: "D", type: TYPE.FLAT},
	{height:  1, name: "d1"  , simple: "D"  , base: "D", type: TYPE.NATURAL},
	{height:  1, name: "dis1", simple: "Dis", base: "D", type: TYPE.SHARP},
	{height:  2, name: "es1" , simple: "Es" , base: "E", type: TYPE.FLAT},
	{height:  2, name: "e1"  , simple: "E"  , base: "E", type: TYPE.NATURAL},
	{height:  3, name: "f1"  , simple: "F"  , base: "F", type: TYPE.NATURAL},
	{height:  3, name: "fis1", simple: "Fis", base: "F", type: TYPE.SHARP},
	{height:  4, name: "ges1", simple: "Ges", base: "G", type: TYPE.FLAT},
	{height:  4, name: "g1"  , simple: "G"  , base: "G", type: TYPE.NATURAL},
	{height:  4, name: "gis1", simple: "Gis", base: "G", type: TYPE.SHARP},
	{height:  5, name: "as1" , simple: "As" , base: "A", type: TYPE.FLAT},
	{height:  5, name: "a1"  , simple: "A"  , base: "A", type: TYPE.NATURAL},
	{height:  5, name: "ais1", simple: "Ais", base: "A", type: TYPE.SHARP},
	{height:  6, name: "b1"  , simple: "B"  , base: "B", type: TYPE.NATURAL},
	{height:  6, name: "h1"  , simple: "H"  , base: "H", type: TYPE.NATURAL},
	{height:  7, name: "c2"  , simple: "C"  , base: "C", type: TYPE.NATURAL},
	{height:  7, name: "cis2", simple: "Cis", base: "C", type: TYPE.SHARP},
	{height:  8, name: "des2", simple: "Des", base: "D", type: TYPE.FLAT},
	{height:  8, name: "d2"  , simple: "D"  , base: "D", type: TYPE.NATURAL},
	{height:  8, name: "dis2", simple: "Dis", base: "D", type: TYPE.SHARP},
	{height:  9, name: "es2" , simple: "Es" , base: "E", type: TYPE.FLAT},
	{height:  9, name: "e2"  , simple: "E"  , base: "E", type: TYPE.NATURAL},
	{height: 10, name: "f2"  , simple: "F"  , base: "F", type: TYPE.NATURAL},
	{height: 10, name: "fis2", simple: "Fis", base: "F", type: TYPE.SHARP},
	{height: 11, name: "ges2", simple: "Ges", base: "G", type: TYPE.FLAT},
	{height: 11, name: "g2"  , simple: "G"  , base: "G", type: TYPE.NATURAL},
	{height: 11, name: "gis2", simple: "Gis", base: "G", type: TYPE.SHARP},
	{height: 12, name: "as2" , simple: "As" , base: "A", type: TYPE.FLAT},
	{height: 12, name: "a2"  , simple: "A"  , base: "A", type: TYPE.NATURAL},
	{height: 12, name: "ais2", simple: "Ais", base: "A", type: TYPE.SHARP},
	{height: 13, name: "b2"  , simple: "B"  , base: "B", type: TYPE.NATURAL},
	{height: 13, name: "h2"  , simple: "H"  , base: "H", type: TYPE.NATURAL},
	{height: 14, name: "c3"  , simple: "C"  , base: "C", type: TYPE.NATURAL},
];

let NATURAL_NOTES = [];
for (let i = 0; i < NOTES.length; i++) {
	if (NOTES[i].type == TYPE.NATURAL && NOTES[i].base != "B") {
		NATURAL_NOTES.push(NOTES[i]);
	}
}

function pickThreeRandomNotes(notes) {
	let possibleNotes = [...notes];
	let results = [];
	results.push(possibleNotes.splice(Math.floor(Math.random() * possibleNotes.length), 1)[0]);
	results.push(possibleNotes.splice(Math.floor(Math.random() * possibleNotes.length), 1)[0]);
	results.push(possibleNotes.splice(Math.floor(Math.random() * possibleNotes.length), 1)[0]);
	return results;
}

function showNote(note) {
	let displayedNote = document.getElementById("displayed_note");
	displayedNote.style.transform = `translate(${note.type == TYPE.NATURAL ? "5.8vw" : "1vw"}, ${(-note.height + 4) * 5}%)`
	let displayedNotePrefix = document.getElementById("displayed_note_prefix");
	let displayedNoteLineContainer = document.getElementById("displayed_note_lines");
	if (note.type == TYPE.NATURAL) {
		displayedNotePrefix.innerHTML = "";
	} else {
		displayedNotePrefix.innerHTML = `
			<img src="assets/${note.type.file}.svg" draggable="false"/>
		`
	}
	if (note.height >= 14) {
		displayedNoteLineContainer.innerHTML = `
			<img src="assets/line.svg" style="transform: translateY(-40%)"/>
			<img src="assets/line.svg" style="transform: translateY(-150%)"/>
		`
	} else if (note.height >= 12) {
		displayedNoteLineContainer.innerHTML = `
			<img src="assets/line.svg" style="transform: translateY(-40%)"/>
		`
	} else if (note.height <= 0) {
		displayedNoteLineContainer.innerHTML = `
			<img src="assets/line.svg" style="transform: translateY(20%)"/>
		`
	} else {
		displayedNoteLineContainer.innerHTML = ``;
	}
}

let options;
let correct;
function attempt(note) {
	if (note == correct) {
		document.getElementById("body").animate(
				{backgroundColor: ["#00FF00", "#FFFFFF"]}
			, 400);
	} else {
		document.getElementById("body").animate(
				{backgroundColor: ["#FF0000", "#FFFFFF"]}
			, 400);
	}
	updateInputs();
}

function showNoteOnThreeInputButton(button, note) {
	if (simpleNames) {
		button.textContent = note.simple;
	} else {
		button.textContent = note.name;
	}
	button.onclick = () => {
		attempt(note);
	}
}

let selectedKey;
let selectedKeyButton;
let selectedPrefix;
let selectedPrefixButton;
function prepareKeyboardButton(button, isPrefix, type) {
	button.onclick = () => {
		if (isPrefix) {
			if (selectedPrefixButton) selectedPrefixButton.removeAttribute("disabled");
			selectedPrefix = type;
			selectedPrefixButton = button;
			selectedPrefixButton.setAttribute("disabled", "disabled");
		} else {
			if (selectedKeyButton) selectedKeyButton.removeAttribute("disabled");
			selectedKey = type;
			selectedKeyButton = button;
			selectedKeyButton.setAttribute("disabled", "disabled");
		}
		if (selectedPrefixButton && selectedKeyButton) document.getElementById("keyboard_submit_button").removeAttribute("disabled");
	};
	return button;
}

function keyboardSubmit() {
	let prefix = TYPE.NATURAL;
	switch (selectedPrefix) {
		case "#":
			prefix = TYPE.SHARP;
			break;
		case "b":
			prefix = TYPE.FLAT;
			break;
	}
	if (selectedKey == correct.base && prefix == correct.type) {
		document.getElementById("body").animate(
			{backgroundColor: ["#00FF00", "#FFFFFF"]}
		, 400);
	} else {
		document.getElementById("body").animate(
				{backgroundColor: ["#FF0000", "#FFFFFF"]}
			, 400);
	}
	console.log(selectedKey, selectedPrefix, correct);
	updateInputs();
}

function updateInputs() {
	options = pickThreeRandomNotes(onlyNaturalNotes ? NATURAL_NOTES : NOTES);
	correct = options[Math.floor(Math.random() * options.length)];
	showNote(correct);
	
	let selectionOptionsMenu = document.getElementById("selection_options");
	switch (inputType) {
		case "THREE_BUTTONS":
			selectionOptionsMenu.innerHTML = `
                    <button id="selection_button_a" class="selection_button">A</button>
                    <button id="selection_button_b" class="selection_button">B</button>
                    <button id="selection_button_c" class="selection_button">C</button>`
			showNoteOnThreeInputButton(document.getElementById("selection_button_a"), options[0]);
			showNoteOnThreeInputButton(document.getElementById("selection_button_b"), options[1]);
			showNoteOnThreeInputButton(document.getElementById("selection_button_c"), options[2]);
			break;
		case "KEYBOARD":
			selectionOptionsMenu.innerHTML = `
				<div class="keyboardMenu">
					<div class="keyboard">
						<div>
							<button class="selection_button" id="keyboard_button_sharp">#</button>
							<button class="selection_button" id="keyboard_button_natural" disabled> </button>
							<button class="selection_button" id="keyboard_button_flat">b</button>
						</div>
						<div>
							<button class="selection_button" id="keyboard_button_c">C</button>
							<button class="selection_button" id="keyboard_button_d">D</button>
							<button class="selection_button" id="keyboard_button_e">E</button>
							<button class="selection_button" id="keyboard_button_f">F</button>
							<button class="selection_button" id="keyboard_button_g">G</button>
							<button class="selection_button" id="keyboard_button_a">A</button>
							<button class="selection_button" id="keyboard_button_b">B</button>
							<button class="selection_button" id="keyboard_button_h">H</button>
						</div>
					</div>
					<div>
						<button id="keyboard_submit_button" disabled>Überprüfen</button>
					</div>
				</div>
				`
			prepareKeyboardButton(document.getElementById("keyboard_button_sharp"), true, "#");
			selectedPrefixButton = prepareKeyboardButton(document.getElementById("keyboard_button_natural"), true, " ");
			selectedPrefix = " ";
			prepareKeyboardButton(document.getElementById("keyboard_button_flat"), true, "b");
			prepareKeyboardButton(document.getElementById("keyboard_button_c"), false, "C");
			prepareKeyboardButton(document.getElementById("keyboard_button_d"), false, "D");
			prepareKeyboardButton(document.getElementById("keyboard_button_e"), false, "E");
			prepareKeyboardButton(document.getElementById("keyboard_button_f"), false, "F");
			prepareKeyboardButton(document.getElementById("keyboard_button_g"), false, "G");
			prepareKeyboardButton(document.getElementById("keyboard_button_a"), false, "A");
			prepareKeyboardButton(document.getElementById("keyboard_button_b"), false, "B");
			prepareKeyboardButton(document.getElementById("keyboard_button_h"), false, "H");
			document.getElementById("keyboard_submit_button").onclick = () => {
				keyboardSubmit();
			};
			break;
	}

}
updateInputs();
