#!/usr/bin/env node

import { State, gameLoop } from "./game.js";
import { green, red } from "btss";
import readline from "readline";

globalThis.gridSize = 20;
globalThis.isEqual = (a, b) => {
  if (a.x == b.x && a.y == b.y) return true;
};
let frameRate = 150;

// parse args
const { words, options } = parseArgs(process.argv.splice(2))
for(const key in options) {
  switch(key) {
    case "f":
      frameRate = Number(options[key]);
      break
    case "g":
      globalThis.gridSize = Number(options[key]);
      break;
    case "h":
      console.log(`
Snake Cli
---------
options:
    f : frameRate
    g : gridSize
    h : help
`)
      process.exit();
  }
}
console.log(gridSize,frameRate)
init();
function parseArgs(args) {
  const options = {};
  const words = [];

  let temp;
  for (const arg of args) {
    if (arg.startsWith("-")) {
      temp = arg.substring(1);
      options[temp] = true;
    } else if (temp) {
      options[temp] = arg;
      temp = null;
    } else {
      words.push(arg);
    }
  }

  return { options, words };
}

function init() {
  const state = new State(),
    vel = state.player.vel,
    head = state.player.head;
  const intervalId = setInterval(() => {
    try {
      const endResult = gameLoop(state);
      if (!endResult) {
        //if game has ended
        console.log("dead");
        process.exit();
      }
      drawGame(state);
    } catch (err) {
      console.error(err);
      clearInterval(intervalId);
    }
  }, frameRate);
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  const lastCell = (a) => a[a.length - 2];
  process.stdin.on("keypress", (str, key) => {
    if (key.name == "c" && key.ctrl) process.exit();
    let x = 0,
      y = 0;
    switch (key.name) {
      case "up":
        x = -1;
        break;
      case "down":
        x = 1;
        break;
      case "right":
        y = 1;
        break;
      case "left":
        y = -1;
        break;
    }
    if (
      isEqual(lastCell(state.player.body), {
        x: head.x + x,
        y: head.y + y,
      })
    )
      return;
    vel.x = x;
    vel.y = y;
  });
}

function drawGame(state) {
  console.clear();
  const grid = generateGrid();
  for (const cell of state.player.body) grid[cell.x][cell.y] = green("#");
  grid[state.food.x][state.food.y] = red("x");
  grid[state.player.head.x][state.player.head.y] = red("#");

  let temp = "";
  for (const row of grid) temp += row.join("") + "\n";
  temp = `length : ${state.player.body.length}\n${"-".repeat(gridSize+1)}\n${temp}${"-".repeat(gridSize+1)}`
  console.log(temp)
}

function generateGrid() {
  const arr = new Array(gridSize);
  for (let i = 0; i < gridSize; i++) {
    arr[i] = new Array(gridSize).fill(" ");
    arr[i].push("|");
  }
  return arr;
}

function chooseRandom(prob) {
  if (!Math.round(Math.random() * prob)) return 1;
  return 0;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
