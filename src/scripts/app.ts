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
const cueBall = {
  x: W / 2,
  y: H * 0.618,
  lastX: W / 2,
};
const objectBall = { x: 0, y: 0 };
const palette = {
  table: 0x38a327,
  cueBall: 0xffffff,
  objectBall: 0xce352d,
  linesAndTexts: 0x333333,
  route: 0xffffff,
};
let touchstartX;
let angle = 0;
let radian = 0;

function touchstart(event) {
  touchstartX = event.data.global.x;
  cueBall.lastX = cueBall.x;
}

function touchmove(event) {
  const x = event.data.global.x;
  cueBall.x = cueBall.lastX + (x - touchstartX) / 5;

  // set limit
  if (cueBall.x > W / 2 + radius) {
    cueBall.x = W / 2 + radius;
  } else if (cueBall.x < W / 2 - radius) {
    cueBall.x = W / 2 - radius;
  }

  angle = (90 * (W / 2 - cueBall.x)) / radius;
  radian = angleToRadian(angle);
}

function drawRoute() {
  const route = new PIXI.Graphics();
  route.beginFill(palette.route);
  route.alpha = 0.25;
  route.drawRect(cueBall.x - radius, cueBall.y - 10000, radius * 2, 10000);
  table.addChild(route);
}

function drawCueBall() {
  // draw cue ball
  const ball = new PIXI.Graphics();
  ball.beginFill(palette.cueBall);
  ball.drawCircle(cueBall.x, cueBall.y, radius);
  table.addChild(ball);
}

function drawObjectBall() {
  objectBall.x = Math.sin(radian) * radius * 2 + cueBall.x;
  objectBall.y = cueBall.y - Math.cos(Math.abs(radian)) * radius * 2;

  // draw object ball
  const ball = new PIXI.Graphics();
  ball.beginFill(palette.objectBall);
  ball.drawCircle(objectBall.x, objectBall.y, radius);
  table.addChild(ball);
}

function drawLines() {
  const line = new PIXI.Graphics();
  line
    .lineStyle(pixelRatio, palette.linesAndTexts)
    .moveTo(cueBall.x, cueBall.y)
    .lineTo(
      objectBall.x + (objectBall.x - cueBall.x) * 10,
      objectBall.y + (objectBall.y - cueBall.y) * 10
    );
  line.moveTo(cueBall.x, cueBall.y).lineTo(cueBall.x, -10000);
  table.addChild(line);
}

function drawAngleText() {
  const style = new PIXI.TextStyle({
    fontSize: 15 * pixelRatio,
    fill: palette.linesAndTexts,
  });
  const text = new PIXI.Text(Math.abs(Math.round(angle)) + "°", style);
  text.anchor.set(0.5);
  text.x = cueBall.x;
  text.y = cueBall.y + 15 * pixelRatio;
  table.addChild(text);
}

function drawScales() {
  const line = new PIXI.Graphics();
  line
    .lineStyle(pixelRatio, palette.linesAndTexts)
    .moveTo(objectBall.x - radius * 2, objectBall.y)
    .lineTo(objectBall.x + radius * 2, objectBall.y);

  const scales = [
    { offsetX: 0, text: "0", orien: "up" },
    { offsetX: -radius * 0.5, text: "½", orien: "up" },
    { offsetX: +radius * 0.5, text: "½", orien: "up" },
    { offsetX: -radius * 1, text: "1", orien: "up" },
    { offsetX: +radius * 1, text: "1", orien: "up" },
    { offsetX: -radius * 1.5, text: "½", orien: "up" },
    { offsetX: +radius * 1.5, text: "½", orien: "up" },
    { offsetX: -radius * 2, text: "1", orien: "up" },
    { offsetX: +radius * 2, text: "1", orien: "up" },
    { offsetX: -radius * 0.25, text: "¼", orien: "up" },
    { offsetX: +radius * 0.25, text: "¼", orien: "up" },
    { offsetX: -radius * 0.75, text: "¾", orien: "up" },
    { offsetX: +radius * 0.75, text: "¾", orien: "up" },
    { offsetX: -radius * 1.25, text: "¼", orien: "up" },
    { offsetX: +radius * 1.25, text: "¼", orien: "up" },
    { offsetX: -radius * 1.75, text: "¾", orien: "up" },
    { offsetX: +radius * 1.75, text: "¾", orien: "up" },
    { offsetX: -(radius * 1) / 3, text: "⅓", orien: "down" },
    { offsetX: +(radius * 1) / 3, text: "⅓", orien: "down" },
    { offsetX: -(radius * 2) / 3, text: "⅔", orien: "down" },
    { offsetX: +(radius * 2) / 3, text: "⅔", orien: "down" },
    { offsetX: -(radius * 4) / 3, text: "⅓", orien: "down" },
    { offsetX: +(radius * 4) / 3, text: "⅓", orien: "down" },
    { offsetX: -(radius * 5) / 3, text: "⅔", orien: "down" },
    { offsetX: +(radius * 5) / 3, text: "⅔", orien: "down" },
  ];

  const style = new PIXI.TextStyle({
    fontSize: 13 * pixelRatio,
    fill: palette.linesAndTexts,
  });

  scales.forEach((item) => {
    const text = new PIXI.Text(item.text, style);
    text.anchor.set(0.5);
    text.x = objectBall.x + item.offsetX;
    text.y = objectBall.y + (item.orien === "up" ? -15 : 15) * pixelRatio;
    table.addChild(text);

    // draw from down to up
    line
      .moveTo(
        objectBall.x + item.offsetX,
        objectBall.y + (item.orien === "up" ? 3 : 6) * pixelRatio
      )
      .lineTo(
        objectBall.x + item.offsetX,
        objectBall.y - (item.orien === "up" ? 6 : 3) * pixelRatio
      );
  });

  table.addChild(line);
}

// clear table before drawing
function clearTable() {
  table.clear();
  table.removeChild(...table.children);
  table.beginFill(palette.table);
  table.drawRect(0, 0, W, H);
}

let cueBallX;

app.ticker.add((delta) => {
  // skip unnecessary render
  if (cueBallX === cueBall.x) return;

  clearTable();
  drawRoute();
  drawCueBall();
  drawObjectBall();
  drawLines();
  drawAngleText();
  drawScales();

  cueBallX = cueBall.x;
});

export {};
