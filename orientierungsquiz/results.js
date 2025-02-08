import { showStartpage } from "./index.js";

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

export function showResultsFAQ() {
    document.getElementById("resultsFAQ").innerHTML = `
            <h1>FAQ</h1>
            <h3>Woher kommen die Fragen?</h3>
            <span>
                Die Fragen wurden basierend auf dem Fragenkatalog von <a href="https://www.politnavi.de/">https://www.politnavi.de/</a> erstellt. 
            </span>
            <h3>Was fange ich mit meinem Ergebnis an?</h3>
            <span>
                Politische Orientierung ist komplexer, als dass sie auf zwei Achsen dargestellt werden könnte. Ein kurzes Online-Quiz bricht komplexe
                Themen auf vereinfachte Fragen herunter. Wie du vielleicht gemerkt hast, bräuchte man für all diese Fragen viel mehr Antwortmöglichkeiten -
                von "Stimme zu, aber nur unter der Bedingung, dass..." bis hin zu "Stimme nicht zu, aber nur, weil ..." kann alles dabei sein. Es ist somit
                wichtig, sich für die Wahl einer Partei die Parteiprogramme und die Kandidaten der Parteien genauer anzuschauen. Die Ergebnisse dieses Quiz
                können zumindest dazu verwendet werden, einzuschränken, welche Parteiprogramme man sich überhaupt anschauen möchte. 
            </span>
            <h3>Ich habe ein Ergebnis erhalten, das nicht zu mir passt.</h3>
            <span>
                Das kann schon mal passieren! Das kann daran liegen, dass die Fragen, die dir wichtig sind, in diesem Quiz nicht enthalten sind.
                Denke mal darüber nach! Wenn du zu unserem Stand kommst, können wir auch noch mehr darüber sprechen, welche Parteien dir gefallen könnten.
            </span>
            <h3>Werden meine Daten gespeichert?</h3>
            <span>
                Nein! Sobald die Seite neu geladen wird, sind deine Daten gelöscht.
            </span>
            <h3>Kann ich das Quiz wiederholen?</h3>
            <span>
                <button id="restartButton" class="metaButton">Quiz wiederholen</button>
            </span>
        `;
    document.getElementById("restartButton").onclick = showStartpage;
}