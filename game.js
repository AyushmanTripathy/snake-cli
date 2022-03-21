export function State() {
  this.player = {
    vel: { x: 1, y: 0 },
    head: { x: 3, y: 2 },
    body: [
      { x: 1, y: 2 },
      { x: 2, y: 2 },
      { x: 3, y: 2 },
    ],
  };
  this.food = generateFood([]);
}

export function gameLoop(state) {
  if (!state) return;

  const player = state.player;

  //update head
  player.head.x += player.vel.x;
  player.head.y += player.vel.y;

  //checking for collision with walls
  if (player.head.x < 0 || player.head.y < 0) return false;
  if (player.head.x >= gridSize || player.head.y >= gridSize) return false;

  //check deadth
  for(const cell of player.body) if (isEqual(cell, player.head)) return false;

  //check for food
  if (isEqual(player.head, state.food)) {
    //make a new cell
    player.body.push({ ...player.head });
    state.food = generateFood(player.body);
  }

  //moving the snake forward
  player.body.push({ ...player.head });
  player.body.shift();

  return true;
}

function generateFood(body) {
  let food = {};
  food.x = Math.floor(Math.random() * gridSize);
  food.y = Math.floor(Math.random() * gridSize);
  for(const cell of body)
    if (isEqual(cell, food)) return generateFood(body);

  return food;
}
