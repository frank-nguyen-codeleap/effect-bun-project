import { Effect, pipe } from "effect";
import { BASE_API } from "../constants.js";
import { PokemonSchema, type Pokemon } from "../models/pokemon.model.js";
import { Schema } from "@effect/schema";
import { JsonParseError, NetworkError } from "../errors.js";
import type { ParseError } from "@effect/schema/ParseResult";

const pokemonParser = Schema.decodeUnknown(PokemonSchema);

/**
 * Fetches information about a Pokemon from the API.
 * @param name - The name of the Pokemon.
 * @returns An Effect that represents the asynchronous operation of fetching the Pokemon information.
 *          It can either succeed with the parsed JSON response or fail with a NetworkError or JsonParseError.
 */
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

/**
 * Use the schema to parse and validate the response before return.
 *
 * @param name - The name of the Pokemon.
 * @returns An Effect that resolves to a Pokemon object, or an error if the request fails or parsing fails.
 */
export const getPokemon = (
  name: string
): Effect.Effect<Pokemon, ParseError | NetworkError | JsonParseError> =>
  pipe(pokemonResponse(name), Effect.flatMap(pokemonParser));
