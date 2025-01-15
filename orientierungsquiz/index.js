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
        <div id="questionContainer">
            ${questions[currentQuestion]}
        </div>
        <div class="agreeButtons">
            <button id="agreeFullyButton">Stimme voll zu</button>
            <button id="agreePartlyButton">Stimme eher zu</button>
            <button id="unsureButton">Unentschieden</button>
            <button id="disagreePartlyButton">Stimme eher nicht zu</button>
            <button id="disagreeFullyButton">Stimme gar nicht zu</button>
        </div>
        <div class="buttonContainer">
            <button id="proceedBtn" disabled>Weiter</button>
            <button id="backBtn" disabled>Zurück</button>
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
            <button id="proceedBtn2">
                Ergebnisse anzeigen...
            </button>
        </div>
    `;
    const responsesDiv = document.querySelector("#responses");
    for (let i = 0; i < questions.length; i++) {
        responsesDiv.innerHTML += `
            <div>
                Frage: ${questions[i]}
                Antwort: <select id="responseSelect${i}">
                    <option value="2" ${responses[i] == 2 ? "selected" : ""}>Stimme voll zu</option>
                    <option value="1" ${responses[i] == 1 ? "selected" : ""}>Stimme eher zu</option>
                    <option value="0" ${responses[i] == 0 ? "selected" : ""}>Unsicher</option>
                    <option value="-1" ${responses[i] == -1 ? "selected" : ""}>Stimme eher nicht zu</option>
                    <option value="-2" ${responses[i] == -2 ? "selected" : ""}>Stimme gar nicht zu</option>
                </select>
            <div>
        `;
        let select = document.querySelector("#responseSelect" + i);
        select.onclick = () => {
            responses[i] = select.value;
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
        <div>
            <div class="results_title">
                <div>-7</div>
                <div>Werteorientierung</div>
                <div>7</div>
            </div>
            <input type="range" min="${-2 * questions.length / 2}" max="${2 * questions.length / 2}" value="${-werteorientierung}" disabled>
            <div class="results_title">
                <div>-7</div>
                <div>Wirtschaftliche/Soziale Grundordnung</div>
                <div>7</div>
            </div>
            <input type="range" min="${-2 * questions.length / 2}" max="${2 * questions.length / 2}" value="${-wirtschaft}" disabled>
        </div>
    `;
}

showQuestionDisplay();