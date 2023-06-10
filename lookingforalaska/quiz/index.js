const questionBox = document.getElementById("question");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const optionC = document.getElementById("optionC");
const optionBox = document.getElementById("optionBox");
const totalDiv = document.getElementById("total");
const correctDiv = document.getElementById("correct");
const wrongDiv = document.getElementById("wrong");

const endBox = document.getElementById("endBox");
const retryBtn = document.getElementById("retryBtn");
const shareBtn = document.getElementById("shareBtn");
endBox.style.display = "none";

let enterable = true;

const questions = [
    {"question": "Why did Alaska pick her name?", "optionA": "It's far away from home", "optionB": "She went on a trip with her parents", "optionC": "She likes Penguins", "correct": "A"},
    {"question": "Where does Chip live?", "optionA": "In a suburb", "optionB": "In downtown Birmingham", "optionC": "In a trailer park", "correct": "C"},
    {"question": "What's Chip's nickname?", "optionA": "The Chipmunk", "optionB": "The Colonel", "optionC": "The Carrier", "correct": "B"},
    {"question": "What does the term Weekday Warriors refer to?", "optionA": "Students that act like Robin Hood", "optionB": "Students from Birmingham that use Culver Creek as a private school", "optionC": "A group of students that fight against bullying", "correct": "B"},
    {"question": "Which class is mentioned a lot?", "optionA": "World Religions", "optionB": "Physical Education", "optionC": "Latin Literature", "correct": "A"},
    {"question": "How is the principal of the school referred to?", "optionA": "The Eager", "optionB": "The Sleeper", "optionC": "The Eagle", "correct": "C"},
    {"question": "Why do Takumi and Miles light firecrackers in the chapter \"three days before\"?", "optionA": "They want to make him fall into the lake", "optionB": "They want to distract The Eagle from Alaska and Chip", "optionC": "They like making noise", "correct": "B"},
    {"question": "Why might the book be called \"Looking for Alaska\"?", "optionA": "Alaska ran away and the book is about Chip and Miles looking for her", "optionB": "The title is a play on words since Miles and Chip are trying to meet Alaska at the north pole", "optionC": "Miles and Chip try to find out more about Alaska's death", "correct": "C"},
    {"question": "Who wrote \"Looking for Alaska\"?", "optionA": "Joe Blue", "optionB": "Frank Yellow", "optionC": "John Green", "correct": "C"},
    {"question": "What drug do the protagonists excessively consume?", "optionA": "Coffee", "optionB": "Cigarettes", "optionC": "Apple Juice", "correct": "B"},
    {"question": "Which charcter is NOT part of the book?", "optionA": "Frank Walter", "optionB": "William Morse", "optionC": "Kevin Richman", "correct": "A"}
]

function enterValue(question) {
    questionBox.textContent = question.question;
    optionA.textContent = question.optionA;
    optionB.textContent = question.optionB;
    optionC.textContent = question.optionC;
    
    optionA.style.backgroundColor = "white";
    optionB.style.backgroundColor = "white";
    optionC.style.backgroundColor = "white";
    
    optionA.style.borderColor = "black";
    optionB.style.borderColor = "black";
    optionC.style.borderColor = "black";
}

function revealAnswer(question) {
    optionA.style.backgroundColor = "red";
    optionB.style.backgroundColor = "red";
    optionC.style.backgroundColor = "red";

    switch (question.correct) {
        case "A":
            optionA.style.backgroundColor = "green";
            break;
        case "B":
            optionB.style.backgroundColor = "green";
            break;
        case "C":
            optionC.style.backgroundColor = "green";
            break;
        default:
            console.log("Unknown correct option " + question.correct);
            break;
    }
}

function updateStats(total, correct, wrong) {
    totalDiv.textContent = "Total - " + total;
    correctDiv.textContent = "Correct - " + correct;
    wrongDiv.textContent = "Wrong - " + wrong;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log("Copied to clipboard!");
        alert("Copied to clipboard:\n" + text);
    }, function(err) {
        console.error("Async: Could not copy text: ", err);
        alert("Couldn't copy text to clipboard!");
    });
}

function complete(total, correct, wrong) {
    updateStats(total, correct, wrong);
    optionBox.style.display = "none";
    endBox.style.display = "flex";

    retryBtn.addEventListener("click", () => {
        location.reload();
    });
    shareBtn.addEventListener("click", () => {
        let emoji = "😥";
        if (correct == total) {
            emoji = "😁";
        } else if (correct >= total * 0.75) {
            emoji = "😊";
        } else if (correct >= total * 0.5) {
            emoji = "😃";
        } else if (correct >= total * 0.25) {
            emoji = "😐";
        }
        let loc = window.location.href;
        if (loc.endsWith("quiz/")) {
            loc = loc.substring(0, loc.length - "quiz/".length );
        }
        copyToClipboard("Looking for Alaska - Quiz 🔎\nI got " + correct + " out of " + total + "! " + emoji + "\nYou can try it too: " + loc);
    });
}

window.addEventListener("load", () => {
    let currentQuestion = 0;
    let question = null;

    let total = 0;
    let correct = 0;
    let wrong = 0;
    
    function reveal() {
        if (!enterable) return false;
        enterable = false;
        revealAnswer(question);
        total++;
        if (currentQuestion >= questions.length) {
            setTimeout(() => {
                complete(total, correct, wrong);
            }, 1000);
        } else {
            setTimeout(() => {
                nextQuestion();
            }, 1000);
        }
        return true;
    }

    function nextQuestion() {
        enterable = true;
        question = questions[currentQuestion];
        enterValue(question);
        currentQuestion++;
    }

    optionA.addEventListener("click", () => {
        if (reveal()) {
            if (question.correct == "A") {
                correct++;
            } else {
                wrong++;
            }
            optionA.style.borderColor = "white";
            updateStats(total, correct, wrong);
        }
    });

    optionB.addEventListener("click", () => {
        if (reveal()) {
            if (question.correct == "B") {
                correct++;
            } else {
                wrong++;
            }
            optionB.style.borderColor = "white";
            updateStats(total, correct, wrong);
        }
    });
    
    optionC.addEventListener("click", () => {
        if (reveal()) {
            if (question.correct == "C") {
                correct++;
            } else {
                wrong++;
            }
            optionC.style.borderColor = "white";
            updateStats(total, correct, wrong);
        }
    });

    nextQuestion();
});