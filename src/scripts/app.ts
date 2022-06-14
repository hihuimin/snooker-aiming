import * as PIXI from "pixi.js";
import { angleToRadian } from "./utils";

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
const objectBall = { x: 0, y: 0 };
let touchstartX;
let radian = 0;

function touchstart(event) {
  touchstartX = event.data.global.x;
  cueBall.lastX = cueBall.x;
}

function touchmove(event) {
  const x = event.data.global.x;
  cueBall.x = cueBall.lastX + x - touchstartX;

  const angle = (90 * (W / 2 - cueBall.x)) / radius;
  radian = angleToRadian(angle);

  console.log(angle, radian);
  // console.log("touchmove angle: ", angle, " cueBall.x: ", cueBall.x);
}

function drawCueBall() {
  // draw cue ball
  const ball = new PIXI.Graphics();
  ball.beginFill(0xffffff);
  ball.drawCircle(cueBall.x, cueBall.y, radius);
  table.addChild(ball);

  // draw center of the cue ball
  // const center = new PIXI.Graphics();
  // center.beginFill(0x333333);
  // center.drawCircle(cueBall.x, cueBall.y, 5);
  // table.addChild(center);
}

function drawObjectBall() {
  objectBall.x = Math.sin(radian) * radius * 2 + cueBall.x;
  objectBall.y = cueBall.y - Math.cos(Math.abs(radian)) * radius * 2;

  // draw object ball
  const ball = new PIXI.Graphics();
  ball.beginFill(0xbbbbbb); //0xffffff)
  ball.drawCircle(objectBall.x, objectBall.y, radius);
  table.addChild(ball);

  // draw center of the object ball
  // const center = new PIXI.Graphics();
  // center.beginFill(0x333333);
  // center.drawCircle(objectBall.x, objectBall.y, 5);
  // table.addChild(center);
}

function drawLines() {
  const line = new PIXI.Graphics();
  line
    .lineStyle(pixelRatio, 0x000000)
    .moveTo(cueBall.x, cueBall.y)
    .lineTo(
      objectBall.x + (objectBall.x - cueBall.x) * 10,
      objectBall.y + (objectBall.y - cueBall.y) * 10
    );
  line.moveTo(cueBall.x, cueBall.y).lineTo(cueBall.x, -10000);
  line.moveTo(cueBall.x, objectBall.y).lineTo(objectBall.x, objectBall.y);
  table.addChild(line);
}

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
  drawObjectBall();
  drawLines();
});

export {};
