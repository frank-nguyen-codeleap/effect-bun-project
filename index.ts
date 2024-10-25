import { Effect, Fiber } from "effect";
import { getPokemon } from "./api/pokemon.api.js";
import type { Pokemon } from "./models/pokemon.model.js";
import type { JsonParseError, NetworkError } from "./errors.js";
import type { ParseError } from "@effect/schema/ParseResult";

const taskDurationInMs = 300;
const pokemons = ["totodile", "snorlax", "mew", "abra"];

/**
 * Long running fetch-pokemon task that can be interrupted by another Fiber.
 * @returns {Effect<Pokemon[], ParseError | NetworkError | JsonParseError>} The effect that fetches the information.
 */
const getPokemonProgram: Effect.Effect<
  Pokemon[],
  ParseError | NetworkError | JsonParseError,
  never
> = Effect.gen(function* () {
  const results = [];
  for (const pokemon of pokemons) {
    yield* Effect.log(`Fetching ${pokemon}...`);
    results.push(yield* getPokemon(pokemon));
  }
  return results;
});

/**
 * Represents the main program that executes a series of effects.
 */
const program = Effect.gen(function* () {
  const getPokemonFiber = yield* Effect.fork(getPokemonProgram);

  yield* Effect.sleep(taskDurationInMs);
  yield* Effect.log(
    `${taskDurationInMs}ms have passed! Interrupting getPokemon task!`
  );
  // Interrupt the currently running task
  yield* Fiber.interrupt(getPokemonFiber);

  const result = yield* Effect.either(Fiber.join(getPokemonFiber));
  yield* Effect.log(`Result: ${result}`);
});

Effect.runPromise(program).then(console.log).catch(console.error);
