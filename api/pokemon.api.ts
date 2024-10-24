import { Effect, pipe } from "effect";
import { BASE_API } from "../constants.js";
import type { Pokemon } from "../models/pokemon.model.js";

export const getPokemon = (name: string): Effect.Effect<Pokemon, Error> => {
  return Effect.tryPromise({
    try: async (): Promise<Pokemon> => {
      const response = await fetch(`${BASE_API}/${name}`);
      return response.json();
    },
    catch: (error: unknown) => new Error(`Something went wrong: ${error}`),
  });
};

export const _getPokemon = (name: string) => pipe(
  Effect.tryPromise(async () => fetch(`${BASE_API}/${name}`)),
)
