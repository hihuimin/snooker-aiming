import * as PIXI from "pixi.js";

const pixelRatio = 3;
const W = screen.width * pixelRatio;
const H = screen.height * pixelRatio;

const app = new PIXI.Application({
  width: W,
  height: H,
});
// app.renderer.clearBeforeRender = true // seems useless..
document.body.appendChild(app.view);

// snooker table
const table = new PIXI.Graphics();
table.position.set(0, 0);
app.stage.addChild(table);

// bind event
// @ts-ignore
table.interactive = true;
// @ts-ignore
table.on("touchstart", touchstart);
// @ts-ignore
table.on("touchmove", touchmove);

const radius = (W * 0.45) / 2; // radius of ball
const cueBall = { x: W / 2, y: H * 0.5 + radius, lastX: W / 2 };
let touchstartX;
let angle = 0;

function touchstart(event) {
  touchstartX = event.data.global.x;
  cueBall.lastX = cueBall.x;
}

function touchmove(event) {
  const moveDistance = event.data.global.x - touchstartX;
  angle = (180 * moveDistance) / W;
  cueBall.x = cueBall.lastX + moveDistance;
  // console.log("touchmove angle: ", angle, " cueBall.x: ", cueBall.x);
}

function drawCueBall() {
  // draw cue ball
  const ball = new PIXI.Graphics();
  ball.beginFill(0xc6c6c6); //0xffffff)
  ball.drawCircle(cueBall.x, cueBall.y, radius);
  table.addChild(ball);

  // draw center of the cue ball
  const center = new PIXI.Graphics();
  center.beginFill(0x333333);
  center.drawCircle(cueBall.x, cueBall.y, 5);
  table.addChild(center);
}

// draw object ball

// clear table before drawing
function clearTable() {
  table.clear();
  table.removeChild(...table.children);
  table.beginFill(0xcccccc); //0x128512)
  table.drawRect(0, 0, W, H);
}

app.ticker.add((delta) => {
  clearTable();
  drawCueBall();
});

export {};
