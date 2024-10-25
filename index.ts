import { Effect, Fiber } from "effect";
import { getPokemon } from "./api/pokemon.api.js";

const taskDurationInMs = 300;
const pokemons = ["totodile", "snorlax", "mew", "abra"];

const getPokemonProgram = Effect.gen(function* () {
  const results = [];
  for (const pokemon of pokemons) {
    yield* Effect.log(`Fetching ${pokemon}...`);
    const result = yield* getPokemon(pokemon);
    results.push(result);
  }
  return results;
});

const program = Effect.gen(function* () {
  const getPokemonFiber = yield* Effect.fork(getPokemonProgram);

  yield* Effect.sleep(taskDurationInMs);
  yield* Effect.log(`${taskDurationInMs}ms have passed! Interrupting getPokemon task!`);
  yield* Fiber.interrupt(getPokemonFiber);

  const result = yield* Effect.either(Fiber.join(getPokemonFiber));
  yield* Effect.log(`Result: ${result}`);
});

Effect.runPromise(program).then(console.log).catch(console.error);
