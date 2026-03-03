export const GRID_SIZE = 20;
export const MIN_COORD = 0;
export const MAX_COORD = GRID_SIZE - 1;

const DIRECTIONS = ["up", "right", "down", "left"];

/**
 * Get the active rover by id, or undefined if not found.
 */
function getActiveRover(rovers, activeRoverId) {
  return rovers.find((r) => r.id === activeRoverId);
}

/**
 * True if any non-active rover occupies the given coordinate.
 */
function isOccupiedByOtherRover(rovers, activeRoverId, x, y) {
  return rovers.some(
    (r) => r.id !== activeRoverId && r.x === x && r.y === y,
  );
}

/**
 * Compute the next coordinate for a rover given its direction,
 * clamping to grid bounds (0..19).
 */
function getNextPosition(rover) {
  let nextX = rover.x;
  let nextY = rover.y;

  if (rover.direction === "up" && rover.y < MAX_COORD) {
    nextY = rover.y + 1;
  } else if (rover.direction === "down" && rover.y > MIN_COORD) {
    nextY = rover.y - 1;
  } else if (rover.direction === "left" && rover.x > MIN_COORD) {
    nextX = rover.x - 1;
  } else if (rover.direction === "right" && rover.x < MAX_COORD) {
    nextX = rover.x + 1;
  }

  return { x: nextX, y: nextY };
}

/**
 * Rotate direction index by delta (-1 for left, +1 for right).
 */
function rotateDirection(currentDirection, delta) {
  const currentIndex = DIRECTIONS.indexOf(currentDirection);
  if (currentIndex === -1) return currentDirection;
  let nextIndex = (currentIndex + delta) % DIRECTIONS.length;
  if (nextIndex < 0) nextIndex += DIRECTIONS.length;
  return DIRECTIONS[nextIndex];
}

/**
 * Move the active rover one tile forward, if within bounds and
 * not blocked by another rover.
 */
export function moveRover(rovers, activeRoverId) {
  const active = getActiveRover(rovers, activeRoverId);
  if (!active) return rovers;

  const { x: nextX, y: nextY } = getNextPosition(active);

  // If the position didn't change, we are at an edge.
  if (nextX === active.x && nextY === active.y) {
    return rovers;
  }

  // Block the move if another rover is in the way.
  if (isOccupiedByOtherRover(rovers, activeRoverId, nextX, nextY)) {
    return rovers;
  }

  return rovers.map((rover) =>
    rover.id === activeRoverId ? { ...rover, x: nextX, y: nextY } : rover,
  );
}

/**
 * Turn the active rover 90 degrees to the left.
 */
export function turnLeft(rovers, activeRoverId) {
  const active = getActiveRover(rovers, activeRoverId);
  if (!active) return rovers;

  const nextDirection = rotateDirection(active.direction, -1);

  return rovers.map((rover) =>
    rover.id === activeRoverId ? { ...rover, direction: nextDirection } : rover,
  );
}

/**
 * Turn the active rover 90 degrees to the right.
 */
export function turnRight(rovers, activeRoverId) {
  const active = getActiveRover(rovers, activeRoverId);
  if (!active) return rovers;

  const nextDirection = rotateDirection(active.direction, 1);

  return rovers.map((rover) =>
    rover.id === activeRoverId ? { ...rover, direction: nextDirection } : rover,
  );
}

