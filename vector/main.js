import { Renderer, RRSWJS } from "../games/rrswjs.js";
import { Vector } from "./physics.js";

const body = document.body;
const toolbox = document.getElementById("toolbox");
const cameraHomeButton = document.getElementById("cameraHomeButton");
const wipeButton = document.getElementById("wipeButton");
const duplicateButton = document.getElementById("duplicateButton");
const turnLeftButton = document.getElementById("turnLeftButton");
const turnRightButton = document.getElementById("turnRightButton");
const undoButton = document.getElementById("undoButton");
const redoButton = document.getElementById("redoButton");
const imageSelector = document.getElementById("imageSelect");
const uploadImageInput = document.getElementById("uploadImageInput");
const addButton = document.getElementById("addButton");
const vectorInfoBox = document.getElementById("vectorInfoBox");
const vectorInfo = document.getElementById("vectorInfo");
const vectorColorInput = document.getElementById("vectorColorInput");
const vectorLabelInput = document.getElementById("vectorLabelInput");
const removeSelectedButton = document.getElementById("removeSelectedButton");
const showCosysInput = document.getElementById("showCosysInput");
const darkModeInput = document.getElementById("darkModeInput");
const showToolsInputBox = document.getElementById("showToolsInputBox");
const showToolsInput = document.getElementById("showToolsInput");
const hideToolsInput = document.getElementById("hideToolsInput");
const infoContainer = document.getElementById("infoContainer");
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("canvas");

const colors = ["#008000", "#8b0000", "#ffd700", "#00ff00", "#32cd32", "#ff6347", "#9acd32", "#4682b4", "#6a5acd", "#c0c0c0", "#b0e0e6"];
let unusedColors = [...colors];
function randomColor() {
    if (unusedColors.length == 0) {
        unusedColors = [...colors];
    }
    let randomIndex = Math.floor(Math.random() * unusedColors.length);
    return unusedColors.splice(randomIndex, 1)[0];
}

function setCookie(name, value, daysToLive) {
	const date = new Date()
	date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000)
	let expires = "expires=" + date.toUTCString() + ";"
	document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict`
}

function deleteCookie(name) {
	setCookie(name, null, null)
}

function getCookie(name) {
	const cDecoded = decodeURIComponent(document.cookie)
	const cArray = cDecoded.split("; ")
	let result = null
	cArray.forEach(element => {
		if (element.indexOf(name) == 0) {
			result = element.substring(name.length + 1)
		}
	})
	return result
}

function resize() {
    canvas.width = canvasContainer.clientWidth;
    canvas.height = canvasContainer.clientHeight;
}

function isInCircle(px, py, cx, cy, radius) {
    let dx = px - cx;
    let dy = py - cy;
    let dist = ((dx * dx) + (dy * dy));
    return dist < radius * radius;
}

function isOnLine(p, l1, l2) {
    let dist = l2.subtract(l1).length();
    let d1 = p.subtract(l1).length();
    let d2 = p.subtract(l2).length();

    let buffer = 0.1;

    return (d1 + d2 >= dist - buffer && d1 + d2 <= dist + buffer);
}

window.addEventListener("resize", resize);
canvas.addEventListener("resize", resize);
resize();

class VectorVisual {
    constructor(pos, vector, color) {
        this.pos = pos;
        this.vector = vector;
        this.label = "";
        this.recalculate();
        this.color = color || randomColor();
        this.selected = false;
    }

    copy() {
        let copy = new VectorVisual(this.pos.copy(), this.vector.copy(), this.color);
        return copy;
    }

    recalculate() {
        this.vecTop = this.pos.add(this.vector);
        this.normalisedVector = this.vector.normalise();
        this.leftVec = this.normalisedVector.rotate(0.75 * Math.PI).mulScalar(0.25);
        this.rightVec = this.normalisedVector.rotate(-0.75 * Math.PI).mulScalar(0.25);
    }

    draw(g) {
        let topX = this.vecTop.x - this.vector.normalise().mulScalar(0.2).x;
        let topY = this.vecTop.y - this.vector.normalise().mulScalar(0.2).y;

        let x = topX + this.normalisedVector.x * 0.1;
        let y = topY + this.normalisedVector.y * 0.1;
        if (this.selected) {
            g.drawLine(this.pos.x - this.normalisedVector.x * 0.05, this.pos.y - this.normalisedVector.y * 0.05, topX, topY, "white", 0.2);

            g.drawLine(x, y, topX + this.leftVec.x * 1.2, topY + this.leftVec.y * 1.2, "white");
            g.drawLine(x, y, topX + this.rightVec.x * 1.2, topY + this.rightVec.y * 1.2, "white");
            
		    let triangle = {
			    x0: g.convSX(topX + this.leftVec.x * 1.2),
			    y0: g.convSY(topY + this.leftVec.y * 1.2),
			    x1: g.convSX(x),
			    y1: g.convSY(y),
			    x2: g.convSX(topX + this.rightVec.x * 1.2),
			    y2: g.convSY(topY + this.rightVec.y * 1.2)
		    }
            g.ctx.beginPath();
            
		    g.ctx.moveTo(triangle.x0, triangle.y0);
		    g.ctx.lineTo(triangle.x1, triangle.y1);
		    g.ctx.lineTo(triangle.x2, triangle.y2);
		    g.ctx.stroke();
        }
        
        g.drawLine(this.pos.x, this.pos.y, topX + this.normalisedVector.x * 0.1, topY + this.normalisedVector.y * 0.1, this.color, 0.1);

        g.drawLine(x, y, topX + this.leftVec.x, topY + this.leftVec.y, this.color);
        g.drawLine(x, y, topX + this.rightVec.x, topY + this.rightVec.y, this.color);

		let triangle = {
			x0: g.convSX(topX + this.leftVec.x),
			y0: g.convSY(topY + this.leftVec.y),
			x1: g.convSX(x),
			y1: g.convSY(y),
			x2: g.convSX(topX + this.rightVec.x),
			y2: g.convSY(topY + this.rightVec.y)
		}
        g.ctx.beginPath();
        
		g.ctx.moveTo(triangle.x0, triangle.y0);
		g.ctx.lineTo(triangle.x1, triangle.y1);
		g.ctx.lineTo(triangle.x2, triangle.y2);
		g.ctx.stroke();
        if (this.label) {
            g.ctx.font = "" + (g.camera.zoom * 0.3) + "px Verdana";
            g.drawText(this.label, this.vecTop.x + this.vector.normalise().x * 0.1, this.vecTop.y + this.vector.normalise().y * 0.1, getComputedStyle(canvas).getPropertyValue("--text-color"));
        }
    }

    topTouched(x, y, radius) {
        if (isInCircle(x, y, this.vecTop.x, this.vecTop.y, radius)) {
            return true;
        }
        return false;
    }

    endTouched(x, y, radius) {
        if (isInCircle(x, y, this.pos.x, this.pos.y, radius)) {
            return true;
        }
        return false;
    }

    touched(x, y, radius) { // Thank you to https://www.jeffreythompson.org/collision-detection/line-circle.php
        let lineStart = this.pos;
        let lineEnd = this.vecTop;
        if (isInCircle(lineStart.x, lineStart.y, x, y, radius)) {return true;}
        if (isInCircle(lineEnd.x, lineEnd.y, x, y, radius)) {return true;}
        let length = this.vector.length();
        let dot = (((x - lineStart.x) * (lineEnd.x - lineStart.x)) + ((y - lineStart.y) * (lineEnd.y - lineStart.y))) / (length * length);
        let closestX = lineStart.x + (dot * (lineEnd.x - lineStart.x));
        let closestY = lineStart.y + (dot * (lineEnd.y - lineStart.y));
        if (!isOnLine(new Vector(x, y), lineStart, lineEnd)) return false;
        let dx = closestX - x;
        let dy = closestY - y;
        let distanceSQ = (dx * dx) + (dy * dy);
        return (distanceSQ <= radius * radius);
    }
}

class Render extends Renderer {
    constructor() {
        super();
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.lastScroll = 0;
        this.movingVectorPos = false;
        this.movingVectorTop = false;
        this.movingVectorEnd = false;
        this.draggingCamera = false;
        this.image = null;
        this.vectors = [];
        this.states = [];
        this.stateIndex = 0;
        this.movingVector = null;
        this.useTime = 0;
        this.toolsLocked = false;
        this.vectorInfoVisible = true;
        this.oldMovingVector = new VectorVisual(new Vector(0, 1), new Vector(1, 0));
        this.updateInfo(new VectorVisual(new Vector(0, 0), new Vector(1, 1)));
        this.setMovingVector(null);
    }

    load(rrs) {
        this.rrs = rrs;
        this.mouse = rrs.mouse;
        this.camera = rrs.camera;
        this.camera.x = 0;
        this.camera.y = 0;

        cameraHomeButton.onclick = () => {
            this.camera.x = 0;
            this.camera.y = 0;
            this.camera.zoom = 50;
        };
        wipeButton.onclick = () => {
            this.vectors = [];
            this.setMovingVector(null);
            this.saveState();
        };
        duplicateButton.onclick = () => {
            let newVec = this.movingVector.copy();
            newVec.pos = newVec.pos.add(new Vector(1, -1).mulScalar(0.3));
            newVec.recalculate();
            this.vectors.push(newVec);
            this.setMovingVector(newVec);
            this.saveState();
        };
        turnLeftButton.onclick = () => {
            this.movingVector.vector = this.movingVector.vector.rotate(Math.PI * 0.5);
            this.movingVector.recalculate();
            this.saveState();
        }
        turnRightButton.onclick = () => {
            this.movingVector.vector = this.movingVector.vector.rotate(Math.PI * -0.5);
            this.movingVector.recalculate();
            this.saveState();
        }
        undoButton.onclick = () => {
            this.stateIndex--;
            if (this.stateIndex < 0) {
                this.stateIndex++;
                return;
            }
            this.setMovingVector(null);
            this.vectors = this.copyArray(this.states[this.stateIndex]);
        }
        redoButton.onclick = () => {
            this.stateIndex++;
            if (this.stateIndex >= this.states.length) {
                this.stateIndex--;
                return;
            }
            this.setMovingVector(null);
            this.vectors = this.copyArray(this.states[this.stateIndex]);
        }
        imageSelector.onchange = () => {
            this.selectImage(imageSelector.value);
        };
        uploadImageInput.onchange = () => {
            this.loadSelectedImage();
        };
        addButton.onclick = () => {
            let newVec = new VectorVisual(new Vector(0, 0), new Vector(1, 1));
            this.vectors.push(newVec);
            this.setMovingVector(newVec);
            this.saveState();
        };
        removeSelectedButton.onclick = () => {
            this.movingVector.removed = true;
            this.saveState();
        };
        showCosysInput.onclick = () => {
            rrs.renderCosys = showCosysInput.checked;
        };
        rrs.renderCosys = showCosysInput.checked;
        hideToolsInput.onclick = () => {
            toolbox.style.display = "none";
            showToolsInputBox.style.visibility = "visible";
            this.toolsLocked = true;
            this.setMovingVector(null);
        }
        showToolsInput.onclick = () => {
            toolbox.style.display = "flex";
            showToolsInputBox.style.visibility = "hidden";
            this.toolsLocked = false;
        }
        vectorColorInput.onchange = () => {
            if (this.movingVector) {
                this.movingVector.color = vectorColorInput.value;
                this.saveState();
            }
        }
        vectorLabelInput.value = "";
        vectorLabelInput.oninput = () => {
            if (this.movingVector) {
                this.movingVector.label = vectorLabelInput.value;
                this.saveState();
            }
        }
        vectorLabelInput.onkeyup = (event) => {
            if (event.code == "Enter") {
                vectorLabelInput.blur();
            }
        }
        document.addEventListener("paste", (event) => {
            if (this.toolsLocked) return;
            let content = event.clipboardData.items[0];
            if (content.type.indexOf("image") === 0) {
                uploadImageInput.value = '';
                this.selectImage("custom");
                this.image = null;
                let file = content.getAsFile();
                const fileReader = new FileReader();
                fileReader.onload = (event) => {
                    let image = new Image();
                    image.onload = () => {
                        this.image = image;
                    }
                    image.src = event.target.result;
                }
                fileReader.readAsDataURL(file)
            }
        });
        darkModeInput.onclick = () => {
            body.classList.toggle("darkmode");
            body.classList.toggle("lightmode");
        }
        if (darkModeInput.checked) {
            body.classList.toggle("darkmode");
            body.classList.toggle("lightmode");
        }
        
        this.loadData();
        this.saveState();
    }

    draw(graph, deltaTime) {
        let newMouseX = this.mouse.screenX / this.camera.zoom;
        let newMouseY = -this.mouse.screenY / this.camera.zoom;
        let scroll = this.mouse.scroll;
        let dx = this.lastMouseX - newMouseX;
        let dy = this.lastMouseY - newMouseY;
        if (this.mouse.startedMobile) {
            dx = 0;
            dy = 0;
        }

        for (let i = 0; i < this.vectors.length; i++) {
            if (this.vectors[i].removed) {
                this.vectors.splice(i, 1);
                i--;
            }
        }
        if (this.movingVector != null && this.movingVector.removed) {
            this.setMovingVector(null);
        }

        if (this.mouse.recentlyPressed) {
            let targetFound = false;

            if (!this.toolsLocked) {
                for (let i = this.vectors.length - 1; i >= 0; i--) {
                    let vector = this.vectors[i];
                    if (vector.topTouched(this.mouse.x, this.mouse.y, 0.3)) {
                        this.setMovingVector(vector);
                        targetFound = true;
                        this.movingVectorTop = true;
                        break;
                    }
                    if (vector.endTouched(this.mouse.x, this.mouse.y, 0.3)) {
                        this.setMovingVector(vector);
                        targetFound = true;
                        this.movingVectorEnd = true;
                        break;
                    }
                    if (vector.touched(this.mouse.x, this.mouse.y, 0.1)) {
                        this.setMovingVector(vector);
                        targetFound = true;
                        this.movingVectorPos = true;
                        break;
                    }
                }
            }

            if (!targetFound) {
                this.draggingCamera = true;
            }
        }
        if (!this.mouse.pressed) {
            if (this.useTime > 0 && this.useTime < 0.3 && this.draggingCamera) {
                this.setMovingVector(null);
            }
            if (!this.draggingCamera && this.useTime > 0) {
                this.saveState();
            }
            this.useTime = 0;
            this.draggingCamera = false;
            this.movingVectorPos = false;
            this.movingVectorTop = false;
            this.movingVectorEnd = false;
        } else {
            this.useTime += deltaTime / 1000;
        }
        if (this.movingVectorTop) {
            this.movingVector.vector.x -= dx;
            this.movingVector.vector.y -= dy;
            this.movingVector.recalculate();
        }
        if (this.movingVectorEnd) {
            this.movingVector.pos.x -= dx;
            this.movingVector.pos.y -= dy;
            this.movingVector.vector.x += dx;
            this.movingVector.vector.y += dy;
            this.movingVector.recalculate();
        }
        if (this.movingVectorPos) {
            this.movingVector.pos.x -= dx;
            this.movingVector.pos.y -= dy;
            this.movingVector.recalculate();
        }
        if (this.draggingCamera) {
            this.camera.x += dx;
            this.camera.y += dy;
        }

        
        if (scroll != this.lastScroll) {
            if (scroll - this.lastScroll > 0) {
                this.camera.zoom *= 0.95;
            } else {
                this.camera.zoom /= 0.95;
            }
            this.camera.zoom = Math.max(Math.min(this.camera.zoom, 500), 25);
        }

        this.lastScroll = scroll;
        this.lastMouseX = newMouseX;
        this.lastMouseY = newMouseY;

        
        if (this.movingVector != null && 
            (
                !(this.oldMovingVector.vector.equals(this.movingVector.vector)) ||
                !(this.oldMovingVector.pos.equals(this.movingVector.pos))
            )
            ) {
            this.updateInfo(this.movingVector);
            this.oldMovingVector = this.movingVector.copy();
        }

        this.saveData();

        // Draw
        this.updateStateButtons();

        if (this.image) {
            graph.drawImage(this.image, 0, 0, 100);
        }
        
        this.vectors.forEach((vector) => {
            vector.draw(graph);
        });

        /*
        graph.ctx.beginPath();
        graph.ctx.strokeStyle = "blue";
        graph.ctx.arc(graph.convSX(this.mouse.x), graph.convSY(this.mouse.y), 1, 0, 2 * Math.PI);
        graph.ctx.stroke();
        */
    }

    updateStateButtons() {
        if (this.states[this.stateIndex - 1]) {
            undoButton.removeAttribute("disabled");
        } else {
            undoButton.setAttribute("disabled", "disabled");
        }
        if (this.states[this.stateIndex + 1]) {
            redoButton.removeAttribute("disabled");
        } else {
            redoButton.setAttribute("disabled", "disabled");
        }
    }

    saveState() {
        if (this.stateIndex < this.states.length - 1) {
            this.states.length = this.stateIndex + 1;
        }
        this.stateIndex = this.states.length;
        this.states.push(this.copyArray(this.vectors));
    }

    copyArray(arr) {
        let copy = [];
        for (let i = 0; i < arr.length; i++) {
            copy.push(arr[i].copy());
        }
        return copy;
    }
    
    setMovingVector(vector) {
        if (this.movingVector != null) { // Deselect old vector
            this.movingVector.selected = false;
        }
        if (vector == null) {
            if (this.vectorInfoVisible) {
                vectorInfoBox.style.visibility = "hidden";
                removeSelectedButton.setAttribute("disabled", "disabled");
                duplicateButton.setAttribute("disabled", "disabled");
                turnLeftButton.setAttribute("disabled", "disabled");
                turnRightButton.setAttribute("disabled", "disabled");
                this.vectorInfoVisible = false;
            }
        } else {
            if (!this.vectorInfoVisible) {
                vectorInfoBox.style.visibility = "visible";
                removeSelectedButton.removeAttribute("disabled");
                duplicateButton.removeAttribute("disabled");
                turnLeftButton.removeAttribute("disabled");
                turnRightButton.removeAttribute("disabled");
                this.vectorInfoVisible = true;
            }
            vector.selected = true;
            vectorColorInput.value = vector.color;
            vectorLabelInput.value = vector.label;
            if (this.vectors.includes(vector)) {
                this.vectors.push(this.vectors.splice(this.vectors.indexOf(vector), 1)[0]);
            }
        }
        this.movingVector = vector;
    }

    updateInfo(vector) {
        let angle = (vector.vector.angle(new Vector(1.0, 0)) / -Math.PI) * 180;
        angle += (angle < 0) ? 360 : 0; 
        let info = [
            "Vector: ", vector.vector.toString(),
            "Length: ", vector.vector.length().toFixed(2),
            "Angle: ", angle.toFixed(0) + "°"
        ];
        let result = "";
        for (let i = 0; i < info.length; i += 2) {
            result += "<div>" +
                      info[i] +
                      info[i + 1] + 
                      "</div>"
                      ;
        }
        if (!(vectorInfo.innerHTML == result)) {
            vectorInfo.innerHTML = result;
        }
    }

    selectImage(value) {
        switch (value) {
            case "none":
                this.image = null;
                //uploadImageInput.setAttribute("disabled", "disabled");
                uploadImageInput.style.display = "none";
                break;
            case "custom":
                uploadImageInput.style.display = "block";
                //uploadImageInput.removeAttribute("disabled");
                this.loadSelectedImage();
                break;
            case "looping":
                uploadImageInput.style.display = "none";
                this.image = new Image();
                this.image.src = "./assets/looping.svg";
                break;
            case "looping_carts":
                uploadImageInput.style.display = "none";
                this.image = new Image();
                this.image.src = "./assets/looping_carts.svg";
                break;
            default:
                console.log("Unknown type: " + value);
        }
        imageSelector.value = value;
    }

    loadSelectedImage() {
        this.image = null;
        if (uploadImageInput.files[0] == null) return;
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
            }
            img.src = event.target.result;
        }
        fileReader.readAsDataURL(uploadImageInput.files[0])
    }

    validateData() {
        if (!this.camera.x) this.camera.x = 0;
        if (!this.camera.y) this.camera.y = 0;
        if (!this.camera.zoom) this.camera.zoom = 50;
    }

    saveData() {
        const data = {
            camX: this.camera.x,
            camY: this.camera.y,
            camZoom: this.camera.zoom,
            selectedImage: imageSelector.value
        };
        const jsonString = JSON.stringify(data);
        if (this.dataString == jsonString) return;

        setCookie("data", (jsonString), 365);
        this.dataString = jsonString;
    }

    loadData() {
        const jsonString = getCookie("data");
        if (jsonString == null) {
            this.camera.x = 0;
            this.camera.y = 0;
            this.camera.zoom = 50;
            this.selectImage("none");
            return;
        }
        const data = JSON.parse(jsonString);
        this.camera.x = data.camX;
        this.camera.y = data.camY;
        this.camera.zoom = data.camZoom;
        this.validateData();
        this.selectImage(data.selectedImage);
    }
}

new RRSWJS(canvas, new Render(), true);
