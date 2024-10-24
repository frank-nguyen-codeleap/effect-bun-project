import { Effect } from "effect";
import { getPokemon } from "./api/pokemon.api.js";

const program = Effect.gen(function* () {
  const pokemon = yield* getPokemon("totodile");
  return pokemon.name;
});

Effect.runPromise(program).then(console.log);
