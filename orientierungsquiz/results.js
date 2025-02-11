import { showStartpage, showParties } from "./index.js";

export function drawCoordinateSystem(ctx, width, height) {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
    ctx.lineWidth = 1;
}

export function drawResults(canvas, width, height, werteorientierung, wirtschaft, questions) {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, width, height);
    drawCoordinateSystem(ctx, width, height);
    
    drawParty(ctx, width, height, "Du", "#FFFFFF", 0.05, werteorientierung, wirtschaft, questions);
    if (showParties) {
        let partySize = 0.075;
        drawParty(ctx, width, height, "Union", "#000000", partySize, -3, -4, questions);
        drawParty(ctx, width, height, "SPD", "#FF0000", partySize, 4, 4, questions);
        drawParty(ctx, width, height, "FDP", "#FFFF00", partySize, -10, 3, questions);
        drawParty(ctx, width, height, "Grünen", "#00FF00", partySize, 3, 11, questions);
        drawParty(ctx, width, height, "Linke", "#FF00FF", partySize, 10, 6, questions);
        drawParty(ctx, width, height, "AfD", "#00C0FF", partySize, -5, -12, questions);
        drawParty(ctx, width, height, "BSW", "#C000C0", partySize, 6, -5, questions);
    }
}

export function drawParty(ctx, width, height, label, color, radius, werteorientierung, wirtschaft, questions) {
	ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color + "A0";
    let centerX = (-werteorientierung + questions.length) / (questions.length * 2) * (width - (radius * width) * 2 - 4) + (radius * width) + 2;
    let centerY = (wirtschaft + questions.length) / (questions.length * 2) * (height - (radius * height) * 2 - 4) + (radius * height) + 2;
	ctx.ellipse(
        centerX,
        centerY,
        radius * width,
        radius * height,
        0, 0, 2 * Math.PI);
	ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF"
    drawText(ctx, label, centerX, centerY);
}

export function drawText(ctx, text, x, y) {
    let textMeasurements = ctx.measureText(text);
    ctx.fillText(text, x - textMeasurements.width / 2, y + (textMeasurements.actualBoundingBoxAscent + textMeasurements.actualBoundingBoxDescent) / 2)
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