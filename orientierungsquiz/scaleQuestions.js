import { drawResults, showResultsFAQ } from "./results.js";
import { questions } from "./questions.js";

const dynamicContent = document.getElementById("dynamicContent");

let responses = [];

let currentResponse = {

};

let currentQuestion = 0;

export function startScaleQuestions() {
    responses = [];
    currentResponse = {};
    currentQuestion = 0;

    showScaleDisplay();
}

function showScaleDisplay() {
    dynamicContent.innerHTML = `
        <div class="title">
            <div>Frage <span id="questionIndex">${currentQuestion + 1}</span> / ${questions.length}</div>
            <div>Ordne deinen Standpunkt ein!</div>
        </div>
        <div class="questionContainerContainer">
            <div class="questionContainer" id="questionContainerA">
                ${questions[currentQuestion].question_a}
            </div>
            <div class="questionContainer" id="questionContainerB">
                ${questions[currentQuestion].question_b}
            </div>
        </div>
        <div class="scaleButtons">
            <div id="agreementScale">
                <div id="agreementThumb" style="margin-left: calc(0.5 * (100% - 25px)); height: 0px;"></div>
            </div>
            <button class="metaButton interactionButton" id="dontCareBtn">Ist mir egal</button>
        </div>
        <div class="buttonContainer">
            <button class="metaButton interactionButton" id="proceedBtn" disabled>Weiter</button>
            <button class="metaButton interactionButton" id="backBtn" disabled>Zurück</button>
        </div>
    `;
    document.getElementById("dontCareBtn").onclick = () => {
        delete currentResponse.agreement;
        delete currentResponse.hasAgreed;
        currentResponse.dontCare = true;
        updateDisplayButtons();
    }
    const agreementScale = document.getElementById("agreementScale");
    const agreementThumb = document.getElementById("agreementThumb");
    let mouseX;
    function moveThumb(event) {
        if (event && event.clientX) mouseX = event.clientX;
        const scaleBox = agreementScale.getBoundingClientRect();
        delete currentResponse.dontCare;
        currentResponse.agreement = Math.max(Math.min((mouseX - (scaleBox.x + 12.5)) / (scaleBox.width - 25), 1), 0);
        currentResponse.hasAgreed = true;
        agreementThumb.style.marginLeft = `calc(${currentResponse.agreement} * (100% - 25px))`
        updateDisplayButtons();
    }
    agreementScale.onclick = moveThumb;
    let mouseDown = false;
    agreementScale.ontouchstart = agreementScale.onmousedown = () => {
        mouseDown = true;
    }
    window.onmouseup = () => {
        mouseDown = false;
    }
    window.onmousemove = (event) => {
        if (mouseDown) {
            moveThumb(event);
        }
    }
    window.ontouchend = () => {
        mouseDown = false;
    }
    agreementScale.ontouchmove = (event) => {
        if (mouseDown) {
            mouseX = event.touches[0].clientX;
            moveThumb();
        }
    }
    updateDisplayButtons();
    document.getElementById("proceedBtn").onclick = () => {
        if (currentQuestion >= responses.length) {
            responses.push(currentResponse);
        } else {
            responses[currentQuestion] = currentResponse;
        }
        currentQuestion++;
        currentResponse = {};
        if (currentQuestion < questions.length) {
            showScaleDisplay();
        } else {
            showResults();
        }
    };
    document.getElementById("backBtn").onclick = () => {
        if (currentQuestion >= responses.length) {
            responses.push(currentResponse);
        } else {
            responses[currentQuestion] = currentResponse;
        }
        currentQuestion--;
        currentResponse = responses[currentQuestion];
        showScaleDisplay();
    }
}

function updateDisplayButtons() {
    if (currentResponse.dontCare) {
        document.getElementById("dontCareBtn").setAttribute("disabled", "disabled");
        document.getElementById("agreementScale").style.filter = "brightness(100%)";
        document.getElementById("agreementThumb").style.height = "0px";
    } else {
        document.getElementById("dontCareBtn").removeAttribute("disabled");
    }
    if (currentResponse.hasAgreed) {
        document.getElementById("agreementScale").style.filter = "brightness(60%)";
        document.getElementById("agreementThumb").style.height = "25px";
    }
    
    if (currentResponse.dontCare || currentResponse.hasAgreed) {
        document.querySelector("#proceedBtn").removeAttribute("disabled");
    } else {
        document.querySelector("#proceedBtn").setAttribute("disabled", "disabled");
    }

    if (currentQuestion > 0) {
        document.getElementById("backBtn").removeAttribute("disabled");
    } else {
        document.getElementById("backBtn").setAttribute("disabled", "disabled");
    }
}

function showResults() {
    let werteorientierung = 0;
    let wirtschaft = 0;
    let werteorientierungWeight = 0;
    let wirtschaftWeight = 0;
    for (let i = 0; i < questions.length; i++) {
        const response = responses[i];
        if (response.dontCare) {
            continue;
        }
        if (i < 7) {
            werteorientierungWeight += 2;
            werteorientierung += response.agreement * 4 - 2;
        } else {
            wirtschaftWeight += 2;
            wirtschaft += response.agreement * 4 - 2;
        }
    }
    dynamicContent.innerHTML = `
        <div class="title">
            <div>Ergebnis</div>
        </div>
        <div class="results">
            <div class="resultCoord">
                <div>
                    konservativ/autoritär
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
            <div id="resultsFAQ">
            </div>
        </div>
    `;
    showResultsFAQ();
    const resultsCanvas = document.getElementById("resultsCanvas");
    const draw = window.onresize = () => {
        resultsCanvas.width = resultsCanvas.clientWidth;
        resultsCanvas.height = resultsCanvas.clientHeight;
        drawResults(resultsCanvas, resultsCanvas.width, resultsCanvas.height, -(wirtschaft / wirtschaftWeight) * questions.length, -(werteorientierung / werteorientierungWeight) * questions.length, questions);
    }
    draw();
}
