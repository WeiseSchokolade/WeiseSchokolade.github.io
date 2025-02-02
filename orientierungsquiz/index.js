const dynamicContent = document.getElementById("dynamicContent");

let questions = [
    "Homosexuelle Paare sollten die gleiche Rechte wie heterosexuelle Paare haben.",
    "Abtreibungen bis zur 12. Schwangerschaftswoche sollten grundsätzlich erleichtert und entkriminalisiert werden, auch wenn das Leben der Mutter nicht in Gefahr ist und keine Vergewaltigung vorliegt.",
    "Gendergerechte Sprache soll in schriftlichen Dokumenten gesetzlich verpflichtend sein.",
    "Der persönliche Gebrauch von Drogen wie z.B. Cannabis sollte grundsätzlich legal sein.",
    "Religion ist reine Privatsache und sollte im öffentlichen Raum (z.B. in der Schule) weniger Platz einnehmen.",
    "Zuwanderung ist gut und wichtig für Deutschland und sollte uneingeschränkt gefördert werden.",
    "Die traditionelle Familie (Vater, Mutter, Kind) ist nur eines von vielen Familienmodellen und sollte weder schlechter noch besser als andere Lebensentwürfe beurteilt werden.",
    "Es sollte einen Höchstverdienst geben. Jedem, der mehr verdient, soll das überschüssige Geld weggenommen werden. Dieses soll an ärmere Gesellschaftsschichten verteilt werden.",
    "Die Regierung sollte (v.a. größere) Unternehmen stärker überwachen und kontrollieren, damit diese ihre finanzielle Macht nicht ausnutzen können.",
    "Jeder Mensch sollte ein bedingungsloses Einkommen erhalten, auch wenn er nicht arbeiten kann oder will.",
    "Ich bin dafür, die gesetzliche erlaubte Wochenarbeitszeit von 40 Stunden zu reduzieren.",
    "Um die Umwelt und das Klima zu schützen, muss der Staat auch Maßnahmen ergreifen, die bei den meisten Bürgern unbeliebt sind.",
    "Der Staat sollte stärker eingreifen, damit Mieten in Städten nicht mehr so teuer sind.",
    "Soziale Ungleichheit (z.B. Bildungsungleichheit, Armut vs. Reichtum, Geschlechterungleichheit) und deren Behebung sollte eines der zentralen Themen der Politik sein."
];

let responses = [];
let responded = [];

let currentQuestion = 0;
let buttons;

function showQuestionDisplay() {
    dynamicContent.innerHTML = `
        <div class="title">
            <div>Frage <span id="questionIndex">${currentQuestion + 1}</span> / ${questions.length}</div>
        </div>
        <div class="questionContainerContainer">
            <div id="questionContainer">
                ${questions[currentQuestion]}
            </div>
        </div>
        <div class="agreeButtons">
            <button class="agreeButton interactionButton" id="agreeFullyButton">Stimme voll zu</button>
            <button class="agreeButton interactionButton" id="agreePartlyButton">Stimme eher zu</button>
            <button class="agreeButton interactionButton" id="unsureButton">Unentschieden</button>
            <button class="agreeButton interactionButton" id="disagreePartlyButton">Stimme eher nicht zu</button>
            <button class="agreeButton interactionButton" id="disagreeFullyButton">Stimme gar nicht zu</button>
        </div>
        <div class="buttonContainer">
            <button class="metaButton interactionButton" id="proceedBtn" disabled>Weiter</button>
            <button class="metaButton interactionButton" id="backBtn" disabled>Zurück</button>
        </div>
    `;
    buttons = [
        document.querySelector("#agreeFullyButton"),
        document.querySelector("#agreePartlyButton"),
        document.querySelector("#unsureButton"),
        document.querySelector("#disagreePartlyButton"),
        document.querySelector("#disagreeFullyButton")
    ];
    
    let value = 2;
    for (let button of buttons) {
        const buttonValue = value;
        button.onclick = () => {
            responses[currentQuestion] = buttonValue;
            responded[currentQuestion] = true;
            for (let button2 of buttons) {
                button2.disabled = false;
            }
            button.disabled = true;
            document.querySelector("#proceedBtn").disabled = false;
        };
        value--;
    }
    updateQuestionDisplay();
    document.querySelector("#proceedBtn").onclick = () => {
        currentQuestion++;
        updateQuestionDisplay();
    };
}

function updateQuestionDisplay() {
    if (currentQuestion >= questions.length) {
        showSummary();
        return;
    }
    document.querySelector("#questionIndex").textContent = currentQuestion + 1;
    document.querySelector("#questionContainer").textContent = questions[currentQuestion];
    const backButton = document.querySelector("#backBtn");
    if (currentQuestion > 0) {
        backButton.disabled = false;
        backButton.onclick = () => {
            currentQuestion--;
            updateQuestionDisplay();
        };
    } else {
        backButton.disabled = true;
    }
    for (let button of buttons) {
        button.disabled = false;
    }
    if (responded[currentQuestion]) {
        buttons[-responses[currentQuestion] + 2].disabled = true;
    }
    document.querySelector("#proceedBtn").disabled = !responded[currentQuestion];
}

function showSummary() {
    dynamicContent.innerHTML = `
        <div class="title">
            <div>Übersicht über deine Antworten...</div>
        </div>
        <div id="responses">

        </div>
        <div class="buttonContainer">
            <button class="metaButton interactionButton" id="proceedBtn2">
                Ergebnisse anzeigen...
            </button>
        </div>
    `;
    const responsesDiv = document.querySelector("#responses");
    for (let i = 0; i < questions.length; i++) {
        const questionId = i;
        responsesDiv.innerHTML += `
            <div class="summaryItem">
                <div class="summaryQuestion">${questions[questionId]}</div>
                <div class="summaryResponse">
                    <select class="summarySelect" id="responseSelect${questionId}">
                        <option value="2" ${responses[questionId] == 2 ? "selected" : ""}>Stimme voll zu</option>
                        <option value="1" ${responses[questionId] == 1 ? "selected" : ""}>Stimme eher zu</option>
                        <option value="0" ${responses[questionId] == 0 ? "selected" : ""}>Unsicher</option>
                        <option value="-1" ${responses[questionId] == -1 ? "selected" : ""}>Stimme eher nicht zu</option>
                        <option value="-2" ${responses[questionId] == -2 ? "selected" : ""}>Stimme gar nicht zu</option>
                    </select>
                </div>
            <div>
        `;
        let select = document.querySelector("#responseSelect" + questionId);
        select.onclick = () => {
            responses[questionId] = select.value;
        };
    }
    document.querySelector("#proceedBtn2").onclick = () => {
        showResults();
    }
}

function showResults() {
    let werteorientierung = 0;
    let wirtschaft = 0;
    for (let i = 0; i < questions.length; i++) {
        if (i < 7) werteorientierung += responses[i];
        else wirtschaft += responses[i];
    }
    dynamicContent.innerHTML = `
        <div class="title">
            <div>Ergebnis</div>
        </div>
        <div class="results">
            <div class="resultCoord">
                <div>
                    konservativ
                </div>
                <div class="resultCanvasContainer">
                    <div style="text-align: right;">
                        Links / sozialistisch
                    </div>
                    <canvas id="resultsCanvas"></canvas>
                    <div>
                        Rechts / kapitalistisch
                    </div>
                </div>
                <div>
                    liberal
                </div>
            </div>
            <div>
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
            </div>
        </div>
    `;
    const resultsCanvas = document.getElementById("resultsCanvas");
    resultsCanvas.width = resultsCanvas.clientWidth;
    resultsCanvas.height = resultsCanvas.clientHeight;
    drawResults(resultsCanvas, resultsCanvas.width, resultsCanvas.height, werteorientierung, wirtschaft);
    window.onresize = () => {
        resultsCanvas.width = resultsCanvas.clientWidth;
        resultsCanvas.height = resultsCanvas.clientHeight;
        drawResults(resultsCanvas, resultsCanvas.width, resultsCanvas.height, werteorientierung, wirtschaft);
    }
}

function drawCoordinateSystem(ctx, width, height) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();
}

function drawResults(canvas, width, height, werteorientierung, wirtschaft) {
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

    //drawParty(ctx, width, height, "SPD", "#FF0000", diagonal * 0.05, 5, 3);
}

function drawParty(ctx, width, height, label, color, radius, werteorientierung, wirtschaft) {
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

function drawText() {
    let labelMeasurements = ctx.measureText(label);
    ctx.fillText(label, centerX - labelMeasurements.width / 2, centerY + (labelMeasurements.actualBoundingBoxAscent + labelMeasurements.actualBoundingBoxDescent) / 2)
}

showQuestionDisplay();