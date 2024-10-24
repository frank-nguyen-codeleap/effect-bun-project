import { Schema } from "@effect/schema";

export const PokemonSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  base_experience: Schema.Number,
  height: Schema.Number,
  weight: Schema.Number,
});

export interface Pokemon extends Schema.Schema.Type<typeof PokemonSchema> {}
