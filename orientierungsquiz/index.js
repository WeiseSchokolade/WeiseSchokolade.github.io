import { showQuestionDisplay } from "./buttonQuestions.js";

const dynamicContent = document.getElementById("dynamicContent");

export function showStartpage() {
    dynamicContent.innerHTML = `
        <div class="startHeader">
            <h3>84 Millionen Menschen</h3>
            <h2>17 Parteien</h2>
            <h1>Eine Wahl</h1>
            <h4>Und wen wählst du?</h4>
        </div>
        <div class="startButtonContainer">
            <button id="startClassificationButton" class="interactionButton metaButton" onclick="showQuestionDisplay()">Start</button>
            <button id="startReflectionButton" class="interactionButton metaButton">Start (5 Antworten)</button>
        </div>
    `;
    document.getElementById("startReflectionButton").onclick = () => {
        showQuestionDisplay();
    };
}

showStartPage();
