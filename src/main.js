// ==========================================================
// EXERCICI 1: Llistar els 151 Pokémon
// ==========================================================
// TODO: Implementa la lògica de l'exercici 1 seguint els requisits
import { BasePokemon, DetailedPokemon } from "./models.js";
import { amagarEstat, generarBotonsTipus, marcarItemActiu, mostrarEstat, netejarCercador, renderitzarDetallCard, renderitzarLlistaPokemons } from "./utils.js";
const mapaPokemon = new Map();
const cachePokemon = new Map();
async function carregarLlistaPokemon() {
    netejarCercador();
    try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
        if (!response.ok) {
            mostrarEstat("No s'ha pogut carregar la llista de Pokémon.", "error");
        }
        const data = await response.json();
        for (const pokemon of data.results) {
            const pokemonData = new BasePokemon(pokemon);
            mapaPokemon.set(pokemonData.id, pokemonData);
        }
    }
    catch (error) {
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
    const searchInput = document.getElementById("search-input");
    const value = searchInput.value.toLowerCase();
    const filtrarPokemons = Array.from(mapaPokemon.values()).filter((pokemon) => pokemon.name.toLowerCase().trim().includes(value) ||
        pokemon.formattedId.includes(value) ||
        pokemon.id.toString().includes(value));
    renderitzarLlistaPokemons(filtrarPokemons);
});
// ==========================================================
// EXERCICI 3: Detall del Pokémon, cache i crit
// ==========================================================
// TODO: Implementa la lògica de l'exercici 3 seguint els requisits
document.getElementById("pokemon-list")?.addEventListener("click", async (event) => {
    const target = event.target;
    if (target.tagName === "LI") {
        const id = parseInt(target.dataset.id || "0");
        const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
        marcarItemActiu(target);
        await carregarDetallPokemon(id, url);
    }
});
async function carregarDetallPokemon(id, url) {
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
        const data = await response.json();
        const detailedPokemon = new DetailedPokemon(data, url);
        cachePokemon.set(id, detailedPokemon);
        renderitzarDetallCard(detailedPokemon);
        amagarEstat();
    }
    catch (error) {
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
document.getElementById("#type-filter-container")?.addEventListener("click", (event) => {
    const target = event.target;
    if (target.tagName === "BUTTON") {
        marcarItemActiu(target);
        const tipus = target.dataset.type;
        carregarPokemonPerTipus(tipus);
    }
});
async function carregarPokemonPerTipus(tipus) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${tipus}`);
        if (!response.ok) {
            mostrarEstat("No s'ha pogut carregar el detall del Pokémon.", "error");
            return;
        }
        const data = await response.json();
    }
    catch (error) {
        mostrarEstat("Error al carregar els tipus de pokemons", "error");
    }
}
//# sourceMappingURL=main.js.map