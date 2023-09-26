import { Mouse, Renderer, RRSWJS } from "../rrswjs.js";
import { Game } from "./game.js";

const canvas = document.getElementById("canvas1");
console.log("Area: ", canvas.clientWidth, canvas.clientHeight);
//canvas.width = canvas.clientWidth;
//canvas.height = canvas.clientHeight;

window.addEventListener("load", function() {
	class Render extends Renderer {
		constructor() {
			super();
			this.x = 0;
			this.mouseX = 0;
			this.mouseY = 0;
			this.game = new Game(canvas);
		}

		draw(graph, deltaTime) {
			this.game.draw(graph, deltaTime);

			/*graph.drawRect(graph.convBackFromSX(this.mouse.x), graph.convBackFromSY(this.mouse.y), 0.1, 0.1, "green");
			if (this.mouse.pressed) {
				graph.camera.x -= (this.mouse.x - this.mouseX) / graph.camera.zoom;
				graph.camera.y -= -(this.mouse.y - this.mouseY) / graph.camera.zoom;
			}
			this.mouseX = this.mouse.x;
			this.mouseY = this.mouse.y;
			
			if (this.mouse.scroll > 0) {
				graph.camera.zoom *= 0.95;
			} else if (this.mouse.scroll < 0) {
				graph.camera.zoom /= 0.95;
			}
			this.mouse.scroll = 0;*/

		}
	}

	new RRSWJS(canvas, new Render());
});