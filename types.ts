export interface Pokemon {
  id: number;
  name: string;
  height: number;
  abilities: Array<PokemonAbility>;
}

interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: Ability;
}

interface Ability {
  id: number;
  name: string;
}
