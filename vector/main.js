import { Renderer, RRSWJS } from "../games/rrswjs.js";
import { Vector } from "./physics.js";

const cameraHomeButton = document.getElementById("cameraHomeButton");
const wipeButton = document.getElementById("wipeButton");
const imageSelector = document.getElementById("imageSelect");
const uploadImageInput = document.getElementById("uploadImageInput");
const addButton = document.getElementById("addButton");
const vectorInfo = document.getElementById("vectorInfo");
const removeSelectedButton = document.getElementById("removeSelectedButton");
const showCosysInput = document.getElementById("showCosysInput");
const infoContainer = document.getElementById("infoContainer");
const canvasContainer = document.getElementById("canvasContainer");
const canvas = document.getElementById("canvas");

const colors = ["green", "darkred", "gold", "lime", "limeGreen", "tomato", "yellowgreen", "steelblue", "slateblue", "silver", "powderblue"];
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
resize();

class VectorVisual {
    constructor(pos, vector, color) {
        this.pos = pos;
        this.vector = vector;
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

        let x = this.vecTop.x + this.normalisedVector.x * 0.1;
        let y = this.vecTop.y + this.normalisedVector.y * 0.1;
        if (this.selected) {
            g.drawLine(this.pos.x - this.normalisedVector.x * 0.05, this.pos.y - this.normalisedVector.y * 0.05, this.pos.x + this.vector.x, this.pos.y + this.vector.y, "white", 0.2);

            g.drawLine(x, y, this.vecTop.x + this.leftVec.x * 1.2, this.vecTop.y + this.leftVec.y * 1.2, "white");
            g.drawLine(x, y, this.vecTop.x + this.rightVec.x * 1.2, this.vecTop.y + this.rightVec.y * 1.2, "white");
        }
        
        g.drawLine(this.pos.x, this.pos.y, this.pos.x + this.vector.x + this.normalisedVector.x * 0.1, this.pos.y + this.vector.y + this.normalisedVector.y * 0.1, this.color, 0.1);

        g.drawLine(x, y, this.vecTop.x + this.leftVec.x, this.vecTop.y + this.leftVec.y, this.color);
        g.drawLine(x, y, this.vecTop.x + this.rightVec.x, this.vecTop.y + this.rightVec.y, this.color);

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
        this.movingVector = null;
        this.useTime = 0;
        this.vectorInfoVisible = true;
        this.oldMovingVector = new VectorVisual(new Vector(0, 1), new Vector(1, 0));
        this.updateInfo(new VectorVisual(new Vector(0, 0), new Vector(1, 1)));
        this.setMovingVector(null);
    }

    load(rrs) {
        this.mouse = rrs.mouse;
        this.camera = rrs.camera;
        this.camera.x = 0;
        this.camera.y = 0;

        cameraHomeButton.onclick = () => {
            this.camera.x = 0;
            this.camera.y = 0;
            this.camera.zoom = 50;
        }
        wipeButton.onclick = () => {
            this.vectors = [];
            this.setMovingVector(null);
        }
        imageSelector.onchange = () => {
            this.selectImage(imageSelector.value);
        }
        uploadImageInput.onchange = () => {
            loadSelectedImage();
        }
        addButton.onclick = () => {
            let newVec = new VectorVisual(new Vector(0, 0), new Vector(1, 1));
            this.vectors.push(newVec);
            this.setMovingVector(newVec);
        }
        removeSelectedButton.onclick = () => {
            this.movingVector.removed = true;
        }
        showCosysInput.onclick = () => {
            rrs.renderCosys = showCosysInput.checked;
        }
        rrs.renderCosys = showCosysInput.checked;
        
        this.loadData();
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

            for (let i = 0; i < this.vectors.length; i++) {
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

            if (!targetFound) {
                this.draggingCamera = true;
            }
        }
        if (!this.mouse.pressed) {
            if (this.useTime > 0 && this.useTime < 0.3 && this.draggingCamera) {
                this.setMovingVector(null);
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
        if (this.image) {
            graph.drawImage(this.image, 0, 0, 100);
        }
        
        this.vectors.forEach((vector) => {
            vector.draw(graph);
        })
    }
    
    setMovingVector(vector) {
        if (this.movingVector != null) { // Deselect old vector
            this.movingVector.selected = false;
        }
        if (vector == null) {
            if (this.vectorInfoVisible) {
                vectorInfo.style.visibility = "hidden";
                removeSelectedButton.setAttribute("disabled", "disabled");
                this.vectorInfoVisible = false;
            }
        } else {
            if (!this.vectorInfoVisible) {
                vectorInfo.style.visibility = "visible";
                removeSelectedButton.removeAttribute("disabled");
                this.vectorInfoVisible = true;
            }
            vector.selected = true;
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
                uploadImageInput.setAttribute("disabled", "disabled");
                //uploadImageInput.style.display = "none";
                break;
            case "custom":
                //uploadImageInput.style.display = "block";
                uploadImageInput.removeAttribute("disabled");
                this.loadSelectedImage();
                break;
            case "looping":
                uploadImageInput.setAttribute("disabled", "disabled");
                //uploadImageInput.style.display = "none";
                this.image = new Image();
                this.image.src = "./assets/looping.svg";
                break;
        }
        imageSelector.value = value;
    }

    loadSelectedImage() {
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

    saveData() {
        const data = {
            camX: this.camera.x,
            camY: this.camera.y,
            selectedImage: imageSelector.value
        };
        const jsonString = JSON.stringify(data);
        if (this.dataString == jsonString) return;

        setCookie("data", (jsonString), 365);
        this.dataString = jsonString;
    }

    loadData() {
        const jsonString = getCookie("data");
        const data = JSON.parse(jsonString);
        this.camera.x = data.camX;
        this.camera.y = data.camY;
        this.selectImage(data.selectedImage);
    }
}

new RRSWJS(canvas, new Render(), true);
