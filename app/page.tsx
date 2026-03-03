"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GRID_SIZE, moveRover, turnLeft, turnRight } from "../lib/roverLogic";

type Direction = "up" | "down" | "left" | "right";

type Rover = {
  id: number;
  x: number;
  y: number;
  direction: Direction;
};

const initialRovers: Rover[] = [
  { id: 1, x: 0, y: 0, direction: "up" },
  { id: 2, x: 1, y: 1, direction: "up" },
];

function directionToRotation(direction: Direction) {
  switch (direction) {
    case "up":
      return 0;
    case "right":
      return 90;
    case "down":
      return 180;
    case "left":
      return 270;
    default:
      return 0;
  }
}

export default function Home() {
  const [rovers, setRovers] = useState<Rover[]>(initialRovers);
  const [activeRoverId, setActiveRoverId] = useState<number>(1);

  useEffect(() => {
    // Simple effect to mirror the original console logging behavior.
    // This runs whenever rover positions or directions change.
    // eslint-disable-next-line no-console
    console.log("Rovers updated", rovers);
  }, [rovers]);

  const handleMove = () => {
    setRovers((current) => moveRover(current, activeRoverId));
  };

  const handleTurnLeft = () => {
    setRovers((current) => turnLeft(current, activeRoverId));
  };

  const handleTurnRight = () => {
    setRovers((current) => turnRight(current, activeRoverId));
  };

  const handleSelectRover = (id: number) => {
    setActiveRoverId(id);
  };

  const rows = Array.from({ length: GRID_SIZE }, (_, rowIndex) => {
    // Invert y so that higher y values appear visually "up".
    const y = GRID_SIZE - 1 - rowIndex;
    return y;
  });

  const cols = Array.from({ length: GRID_SIZE }, (_, colIndex) => colIndex);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-8 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col gap-8 rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-950">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Rover Grid
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            20×20 playground. Select a rover, then move and rotate it.
          </p>
        </header>

        <section className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <div
              className="aspect-square w-full max-w-xl rounded-lg border border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                className="grid h-full w-full gap-[1px] bg-zinc-300 dark:bg-zinc-800"
                style={{
                  gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {rows.map((y) =>
                  cols.map((x) => {
                    const cellRovers = rovers.filter(
                      (rover) => rover.x === x && rover.y === y,
                    );
                    const isActiveCell = cellRovers.some(
                      (rover) => rover.id === activeRoverId,
                    );

                    return (
                      <button
                        key={`${x}-${y}`}
                        type="button"
                        className={`relative flex items-center justify-center bg-zinc-50 text-xs text-zinc-400 dark:bg-zinc-900 dark:text-zinc-600 ${
                          isActiveCell
                            ? "ring-2 ring-sky-500 ring-offset-1 ring-offset-zinc-200 dark:ring-offset-zinc-900"
                            : ""
                        }`}
                      >
                        {cellRovers.length === 0 ? null : (
                          <div className="flex gap-1">
                            {cellRovers.map((rover) => (
                              <motion.div
                                key={rover.id}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{
                                  scale: 1,
                                  opacity: 1,
                                  rotate: directionToRotation(rover.direction),
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 260,
                                  damping: 20,
                                }}
                                className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold ${
                                  rover.id === activeRoverId
                                    ? "border-sky-500 bg-sky-500/10 text-sky-700 dark:border-sky-400 dark:text-sky-200"
                                    : "border-zinc-400 bg-white/80 text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectRover(rover.id);
                                }}
                              >
                                ▲
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  }),
                )}
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-xs flex-col gap-4">
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Controls
              </h2>
              <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
                Active rover:{" "}
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  #{activeRoverId}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setActiveRoverId(activeRoverId === 1 ? 2 : 1)}
                className="mb-3 w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
              >
                Switch to Rover {activeRoverId === 1 ? 2 : 1}
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleMove}
                  className="flex-1 rounded-md bg-sky-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-900"
                >
                  Move
                </button>
                <button
                  type="button"
                  onClick={handleTurnLeft}
                  className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
                >
                  Turn Left
                </button>
                <button
                  type="button"
                  onClick={handleTurnRight}
                  className="flex-1 rounded-md bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-900"
                >
                  Turn Right
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Rover status
              </h2>
              <ul className="space-y-1">
                {rovers.map((rover) => (
                  <li
                    key={rover.id}
                    className={`flex items-center justify-between rounded px-2 py-1 ${
                      rover.id === activeRoverId
                        ? "bg-sky-50 text-sky-800 dark:bg-sky-950/40 dark:text-sky-100"
                        : ""
                    }`}
                  >
                    <span className="font-medium">Rover {rover.id}</span>
                    <span className="tabular-nums">
                      ({rover.x}, {rover.y}) · {rover.direction}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


