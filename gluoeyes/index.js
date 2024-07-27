const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

let mouseX = 0;
let mouseY = 0;

window.onmousemove = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
};

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}

function clamp(value) {
    return Math.min(Math.max(-4, value), 4);
}

function handleMouse(x, y, maxLength) {
    let relX = mouseX - canvas.getBoundingClientRect().left;
    let relY = mouseY - canvas.getBoundingClientRect().top;
    
    let angle = Math.atan2(y - relY, x - relX);

    let dx = relX - x;
    let dy = relY - y;

    let distance = Math.sqrt(dx * dx + dy * dy);

    let length = Math.min(distance * 0.1, maxLength);

    let drawX = x - Math.cos(angle) * length;
    let drawY = y - Math.sin(angle) * length;

    drawCircle(drawX, drawY, 4);

}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handleMouse(178, 50, 2.5);
    handleMouse(320, 63, 3);
    handleMouse(321, 312.25, 3.2);

    requestAnimationFrame(animate);
}

animate();
