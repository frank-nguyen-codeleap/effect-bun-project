import { Effect, Fiber, Ref } from "effect";
import { getPokemon } from "./api/pokemon.api.js";
import type { Pokemon } from "./models/pokemon.model.js";
import type { ParseError } from "@effect/schema/ParseResult";
import type { JsonParseError, NetworkError } from "./errors.js";

const taskDurationInMs = 300;
const pokemons = ["totodile", "snorlax", "mew", "abra"];

/**
 * Long running get-pokemon task that can be interrupted by another Fiber.
 * @returns {Effect<void, ParseError | NetworkError | JsonParseError>} The effect that fetches the information.
 */
const getPokemonProgram = (
  ref: Ref.Ref<Array<Pokemon>>
): Effect.Effect<void, ParseError | NetworkError | JsonParseError> =>
  Effect.gen(function* () {
    for (const pokemon of pokemons) {
      const pkm = yield* getPokemon(pokemon);
      yield* Effect.log(`Fetched ${pokemon}...`);
      yield* Ref.update(ref, (curRes) => [...curRes, pkm]);
    }
  });

/**
 * Represents the main program that executes a series of effects.
 */
const program = Effect.gen(function* () {
  const resultRef = yield* Ref.make<Array<Pokemon>>([]);
  const getPokemonFiber = yield* Effect.fork(getPokemonProgram(resultRef));

  yield* Effect.sleep(taskDurationInMs);
  yield* Effect.log(
    `${taskDurationInMs}ms have passed! Interrupting getPokemon task!`
  );
  // Interrupt the currently running task
  yield* Fiber.interrupt(getPokemonFiber);

  // Read results from Ref
  const partialRes = yield* Ref.get(resultRef);
  yield* Effect.log(`Partial result: ${JSON.stringify(partialRes, null, 2)}`);

  const finalRes = yield* Effect.either(Fiber.join(getPokemonFiber));
  yield* Effect.log(`Final result: ${finalRes}`);
});

Effect.runPromise(program).then(console.log).catch(console.error);
