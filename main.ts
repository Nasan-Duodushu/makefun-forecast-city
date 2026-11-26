// Funniest Forecast for a City That Isn't — entry program.
// Writes the one-line forecast (1-120 chars) to /output/entry.txt.
// Deadpan weather voice for a city that does not exist: the tide comes in
// twice a day and leaves a strongly worded letter each time.
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const LIMIT = 120;

function forecast(): string {
  const city = "Nowhere-on-Sea:";
  const tide = "the tide comes in twice a day";
  const twist = "and leaves a strongly worded letter each time.";
  return `${city} ${tide} ${twist}`;
}

function validate(line: string): void {
  const n = [...line].length;
  if (n < 1 || n > LIMIT) {
    throw new Error(`forecast fails the 1-${LIMIT} character gate (${n})`);
  }
  if (/\n/.test(line)) {
    throw new Error("forecast must be a single line");
  }
  // It must be a forecast for a city that does not exist.
  if (!/^Nowhere-on-Sea:/.test(line)) {
    throw new Error("forecast must name the invented city");
  }
  // The joke is the tide's behaviour: a strongly worded letter, twice a day.
  if (!/leaves a strongly worded letter each time\.$/.test(line)) {
    throw new Error("forecast must end on the strongly worded letter");
  }
  // The tide is mentioned exactly once, and the city name is hyphenated.
  if ((line.match(/tide/g) ?? []).length !== 1 || !/^Nowhere-on-Sea:/.test(line)) {
    throw new Error("forecast must name the tide once and the invented city up front");
  }
}

const line = forecast();
validate(line);
const dir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
await mkdir(dir, { recursive: true });
const target = join(dir, "entry.txt");
await writeFile(target, new TextEncoder().encode(line));
console.log(`wrote ${[...line].length} chars to ${target}`);
