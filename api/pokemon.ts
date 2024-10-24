import { Effect } from "effect";
import type { Pokemon } from "../types.js";
import { BASE_API } from "../constants.js";

export const getPokemon = (name: string): Effect.Effect<Pokemon, Error> => {
  return Effect.tryPromise({
    try: async (): Promise<Pokemon> => {
      const response = await fetch(`${BASE_API}/${name}`);
      return response.json();
    },
    catch: (unknown) => new Error(`Something went wrong: ${unknown}`),
  });
};
