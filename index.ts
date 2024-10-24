import { Effect } from "effect";
import { getPokemon } from "./api/pokemon.api.js";

const pokemons = ["totodile", "snorlax", "mew", "abra"];
const program = Effect.gen(function* () {
  const results = [];
  for (const pokemon of pokemons) {
    const result = yield* getPokemon(pokemon);
    results.push(result);
  }
  return results;
});

Effect.runPromise(program).then(console.log);
