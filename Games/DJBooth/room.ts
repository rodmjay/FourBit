// room.ts

export function drawRoom(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  // Clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the ceiling (top 25% of the canvas)
  const ceilingHeight = canvas.height * 0.25;
  ctx.fillStyle = "#ccc"; // light grey for the ceiling
  ctx.fillRect(0, 0, canvas.width, ceilingHeight);

  // Draw the back wall (next 25% of the canvas)
  const wallY = ceilingHeight;
  const wallHeight = canvas.height * 0.25;
  ctx.fillStyle = "#aaa"; // medium grey for the back wall
  ctx.fillRect(0, wallY, canvas.width, wallHeight);

  // Draw the floor (remaining bottom 50% of the canvas)
  const floorY = ceilingHeight + wallHeight;
  ctx.fillStyle = "#888"; // dark grey for the floor
  ctx.fillRect(0, floorY, canvas.width, canvas.height - floorY);
}
