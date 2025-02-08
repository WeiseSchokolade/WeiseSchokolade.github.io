import { startButtonQuestions } from "./buttonQuestions.js";
import { startScaleQuestions } from "./scaleQuestions.js";

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
        <button id="startReflectionButton" class="interactionButton metaButton">Start (Skala)</button>
        <button id="startClassificationButton" class="interactionButton metaButton" onclick="showQuestionDisplay()">Start (Veraltet)</button>
        </div>
    `;
    document.getElementById("startClassificationButton").onclick = () => {
        startButtonQuestions();
    };
    document.getElementById("startReflectionButton").onclick = () => {
        startScaleQuestions();
    };
}

showStartpage();
