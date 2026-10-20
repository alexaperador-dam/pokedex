// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

import { BasePokemon, IPokeApiListResponse } from "./models.js";
import { mostrarEstat, netejarCercador, renderitzarLlistaPokemons } from "./utils.js";

const mapaPokemon = new Map<number, BasePokemon>();

async function carregarLlistaPokemon() {
  netejarCercador();
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    if (!response.ok) {
      mostrarEstat("No s'ha pogut carregar la llista de Pokémon.", "error");
    }
    const data: IPokeApiListResponse = await response.json();
    data.results.forEach((pokemon) => {
      const pokemonData: BasePokemon = new BasePokemon(pokemon);
      mapaPokemon.set(pokemonData.id, pokemonData);
    });

  } catch (error) {
    mostrarEstat("Error al carregar la llista de Pokémon.", "error");
  }
  renderitzarLlistaPokemons(Array.from(mapaPokemon.values()));
}

document.getElementById("btn-show-all")?.addEventListener("click", () => {
  carregarLlistaPokemon();
});

// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits

document.getElementById("search-input")?.addEventListener("input", () => {
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const value = searchInput.value.toLowerCase();
  const filtrarPokemons = Array.from(mapaPokemon.values()).filter((pokemon) =>
    pokemon.name.toLowerCase().trim().includes(value) ||
    pokemon.formattedId.includes(value) ||
    pokemon.id.toString().includes(value)
  );
  renderitzarLlistaPokemons(filtrarPokemons);
});

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits

// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits
