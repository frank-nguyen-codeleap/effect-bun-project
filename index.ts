// import { BunRuntime } from "@effect/platform-bun"
// import { Effect } from "effect"
import { Pokemon } from "./types";

// const main = Effect.logInfo("Hello Effect Coding Challenge")

// BunRuntime.runMain(main)

// totodile
// snorlax
// mew
// abra
const response = await fetch("https://pokeapi.co/api/v2/pokemon/abra");
const responseJson = (await response.json()) as Pokemon;
console.log(responseJson.name);
console.log(responseJson.height);
console.log(responseJson.abilities[0]?.ability.name);
