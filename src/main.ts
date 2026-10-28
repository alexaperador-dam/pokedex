// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits

import {
  BasePokemon,
  DetailedPokemon,
  IPokeApiDetail,
  IPokeApiListResponse,
  IPokeApiTypeResponse,
} from "./models.js";
import {
  mostrarEstat,
  netejarCercador,
  renderitzarLlistaPokemons,
  generarBotonsTipus,
  renderitzarDetallCard,
  marcarItemActiu,
  amagarEstat,
  netejarDetallCard,
} from "./utils.js";

const mapaPokemon = new Map<number, BasePokemon>();
const cachePokemon = new Map<number, DetailedPokemon>();

let pokemonsVisibles: BasePokemon[] = [];

async function carregarLlistaPokemon() {
  netejarCercador();
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
    if (!response.ok) {
      mostrarEstat("No s'ha pogut carregar la llista de Pokémon.", "error");
    }
    const data: IPokeApiListResponse = await response.json();

    for (const pokemon of data.results) {
      const pokemonData: BasePokemon = new BasePokemon(pokemon);
      mapaPokemon.set(pokemonData.id, pokemonData);
    }
  } catch (error) {
    mostrarEstat("Error al carregar la llista de Pokémon.", "error");
  }
  pokemonsVisibles = Array.from(mapaPokemon.values());
  renderitzarLlistaPokemons(pokemonsVisibles);
}

document.getElementById("btn-show-all")?.addEventListener("click", () => {
  carregarLlistaPokemon();
});

// ==========================================================
// EXERCICI 2: Cercador en temps real
// ==========================================================
// TODO: Implementa la lògica de l'exercici 2 seguint els requisits



document.getElementById("search-input")?.addEventListener("input", () => {
  const searchInput = document.getElementById(
    "search-input",
  ) as HTMLInputElement;
  const value = searchInput.value.toLowerCase();
  const filtrarPokemons = pokemonsVisibles.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().trim().includes(value) ||
      pokemon.formattedId.includes(value) ||
      pokemon.id.toString().includes(value),
  );
  renderitzarLlistaPokemons(filtrarPokemons);
});

// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits

document
  .getElementById("pokemon-list")
  ?.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;

    if (target.tagName === "LI") {
      const id = parseInt(target.dataset.id || "0");
      const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
      marcarItemActiu(target);
      await carregarDetallPokemon(id, url);
    }
  });

async function carregarDetallPokemon(id: number, url: string): Promise<void> {
  if (cachePokemon.has(id)) {
    const cachedPokemon = cachePokemon.get(id);
    if (cachedPokemon) {
      renderitzarDetallCard(cachedPokemon);
    }
  }

  try {
    mostrarEstat("Carregant el detall del Pokémon...", "loading");
    const response = await fetch(url);
    if (!response.ok) {
      mostrarEstat("No s'ha pogut carregar el detall del Pokémon.", "error");
      return;
    }

    const data: IPokeApiDetail = await response.json();

    const detailedPokemon = new DetailedPokemon(data, url);
    cachePokemon.set(id, detailedPokemon);
    renderitzarDetallCard(detailedPokemon);
    amagarEstat();
  } catch (error) {
    mostrarEstat("Error al carregar el detall del Pokémon.", "error");
  }
}

// ==========================================================
// EXERCICI 4: Botons de filtre per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 4 seguint els requisits

generarBotonsTipus();

// ==========================================================
// EXERCICI 5: Filtrar la llista per tipus
// ==========================================================
// TODO: Implementa la lògica de l'exercici 5 seguint els requisits

async function carregarPokemonPerTipus(tipus: string) {
  try {
    mostrarEstat(`Carregant Pokémon de tipus ${tipus}...`, "loading");
    const response = await fetch(`https://pokeapi.co/api/v2/type/${tipus}`);

    const data: IPokeApiTypeResponse = await response.json();

    if (!response.ok) {
      mostrarEstat(
        `No s'ha pogut carregar Pokémon de tipus ${tipus}.`,
        "error",
      );
      return;
    }

    // mapaPokemon.clear();
    const pokemons: BasePokemon[] = [];
    for (const pokemon of data.pokemon) {
      if (Number(pokemon.pokemon.url.split("/").filter(Boolean).pop()) <= 151) {
        const pokemonData: BasePokemon = new BasePokemon(pokemon.pokemon);
        pokemons.push(pokemonData);
      }
    }

    pokemonsVisibles = pokemons;
    renderitzarLlistaPokemons(pokemons);
    netejarCercador();
    netejarDetallCard();
    amagarEstat();
  } catch (error) {
    mostrarEstat(`Error al carregar Pokémon de tipus ${tipus}.`, "error");
  }
}
let activo: boolean = false;
document
  .getElementById("type-filter-container")
  ?.addEventListener("click", async (event) => {
    if (!activo) {
      const target = event.target as HTMLElement;
      const tipo: string = target.dataset["type"] as string;
      carregarPokemonPerTipus(tipo);
      activo = true;
    } else {
      carregarLlistaPokemon();
      activo = false;
    }
  });
