import { Effect, pipe } from "effect";
import { BASE_API } from "../constants.js";
import { PokemonSchema, type Pokemon } from "../models/pokemon.model.js";
import { Schema } from "@effect/schema";
import { JsonParseError, NetworkError } from "../errors.js";

const pokemonParser = Schema.decodeUnknown(PokemonSchema);

const pokemonResponse = (
  name: string
): Effect.Effect<unknown, NetworkError | JsonParseError> =>
  pipe(
    Effect.tryPromise({
      try: () => fetch(`${BASE_API}/${name}`),
      catch: () => new NetworkError(),
    }),
    Effect.flatMap((response) =>
      Effect.tryPromise({
        try: () => response.json(),
        catch: () => new JsonParseError(),
      })
    )
  );

export const getPokemon = (name: string) =>
  pipe(pokemonResponse(name), Effect.flatMap(pokemonParser));
