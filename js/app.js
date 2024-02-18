import { colors } from "./typeColor.js";

let offset = 0;
let limit = 20;
let favorites = [];
const fetchPokemon = () => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.results;
      const pokemonDataPromises = [];

      pokemonList.forEach((pokemon) => {
        pokemonDataPromises.push(
          fetch(pokemon.url).then((response) => response.json())
        );
      });

      Promise.all(pokemonDataPromises)
        .then((pokemonDataArray) => {
          const sortedPokemonData = pokemonDataArray.sort(
            (a, b) => a.id - b.id
          );

          sortedPokemonData.forEach((pokemonData) => {
            const pokemon = {
              name: pokemonData.name,
              id: pokemonData.id,
              image:
                pokemonData.sprites.other["official-artwork"].front_default,
              type: pokemonData.types.map((type) => type.type.name),
              weight: pokemonData.weight,
            };
            const pokemonBox = document.querySelector(".pokemon-container");
            const pokemonHTML = `
                <div class="col-xl-3 col-lg-4 col-sm-6 pokemon-list">
                    <div class="card text-light bg-dark">
                        <div class="card-body text-center d-flex justify-content-center align-items-center position-relative galaxy-background">
                        <span class="star" id="favorite-btn"><i class="fas fa-star" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="right" title="Add to Favorites"></i></span>
                        <img src="images/game.png" alt="" class="overlay">
                        <img src="${
                          pokemon.image
                        }" alt="" class="pokemon-image">
                        </div>
                        <div class="card-footer">
                        <p class="fs-5 m-0 pokemon-number"># ${pokemon.id
                          .toString()
                          .padStart(4, "0")}</p>
                        <p class="fs-3 m-0 pokemon-name text-capitalize">${
                          pokemon.name
                        }</p>
                        <p class="fs-3 m-0 pokemon-weight text-capitalize" style="display: none;">${
                          pokemon.weight
                        }</p>
                        <div class="d-flex justify-content-evenly fs-5 mt-4 text-center text-capitalize">
                        <p class="mb-2 pokemon-type one" style="background-color: ${
                          colors[pokemon.type[0]]
                        }; box-shadow: 0 0 5px ${colors[pokemon.type[0]]};">
                            ${pokemon.type[0]}
                        </p>
                        ${
                          pokemon.type[1]
                            ? `
                        <p class="mb-2 pokemon-type two" style="background-color: ${
                          colors[pokemon.type[1]]
                        }; box-shadow: 0 0 7px ${colors[pokemon.type[1]]};">
                            ${pokemon.type[1]}
                        </p>`
                            : ""
                        }
                        </div>
                        </div>
                    </div>
                </div>
              `;
            pokemonBox.innerHTML += pokemonHTML;
          });
          const faveBtns = document.querySelectorAll(".star");
          faveBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
              btn.classList.toggle("active");

              const pokemonCard = btn.closest(".pokemon-list");
              const pokemonImage = pokemonCard
                .querySelector(".pokemon-image")
                .getAttribute("src");
              const pokemonNumber =
                pokemonCard.querySelector(".pokemon-number").textContent;
              const pokemonName =
                pokemonCard.querySelector(".pokemon-name").textContent;
              const pokemonWeight =
                pokemonCard.querySelector(".pokemon-weight").textContent; // Corrected line
              const pokemonType =
                pokemonCard.querySelector(".pokemon-type").textContent; // Corrected line

              const isFavorite = favorites.some(
                (pokemon) => pokemon.number === pokemonNumber
              );
              if (isFavorite) {
                favorites = favorites.filter(
                  (pokemon) => pokemon.number !== pokemonNumber
                );
              } else {
                favorites.push({
                  number: pokemonNumber,
                  name: pokemonName,
                  image: pokemonImage,
                  weight: pokemonWeight,
                  type: pokemonType,
                  isActive: true,
                });
                updateNewest();
              }
              updateFavorites();
            });
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};
const loadMoreButton = document.getElementById("load-more-btn");
loadMoreButton.addEventListener("click", loadMore);

function loadMore() {
  offset += limit;
  fetchPokemon();
}

fetchPokemon();

function updateFavorites() {
  const favoritesContainer = document.querySelector(".favorites");

  // Clear existing favorites
  favoritesContainer.innerHTML = "";

  const reversedFavorites = favorites.slice().reverse();

  reversedFavorites.forEach((pokemon) => {
    const favoriteHTML = `
      <div class="col-lg-4 col-sm-6 favorite-pokemon data-active=${pokemon.isActive}">
        <div class="card text-light bg-dark">
          <div class="card-body text-center d-flex justify-content-center align-items-center">
            <img src="images/game.png" alt="" class="overlay">
            <img src="${pokemon.image}" alt="">
          </div>
          <div class="card-footer h-50">
            <p class="fs-5 m-0 pokemon-number">${pokemon.number}</p>
            <p class="fs-3 m-0 pokemon-name text-capitalize">${pokemon.name}</p>
          </div>
        </div>
      </div>
    `;
    favoritesContainer.innerHTML += favoriteHTML;
  });
  saveFavoritesToStorage();
}

function updateNewest() {
  const newestFavoriteContainer = document.querySelector(".newest-fave");

  if (favorites.length > 0) {
    const newestFavorite = favorites[favorites.length - 1];

    const newestFavoriteHTML = `
        <div class="col-5 d-flex justify-content-center align-items-center image">
          <img src="images/game.png" class="overlay">
          <img src="${newestFavorite.image}" alt="" width="140px" class="p-3 pokemon-image">
        </div>
        <div class="col p-0 galaxy-background">
          <p class="m-2 pokemon-number">${newestFavorite.number}</p>
          <p class="m-0 ms-2 my-1 fs-5 text-capitalize pokemon-name">${newestFavorite.name}</p>
          <p class="m-0 ms-2 my-1 pokemon-weight">${newestFavorite.weight} Kg</p>
          <p class="m-0 ms-2 text-capitalize pokemonType ">${newestFavorite.type}</p>
        </div>
      `;
    newestFavoriteContainer.innerHTML = newestFavoriteHTML;
  } else {
    newestFavoriteContainer.innerHTML = "";
  }
  // saveFavoritesToStorage();
}

//Load favorites from local storage
// function loadFavoritesFromStorage() {
//   const storedFavorites = localStorage.getItem("favorites");
//   if (storedFavorites) {
//     favorites = JSON.parse(storedFavorites);
//     favorites.forEach((pokemon) => {
//       pokemon.isActive = true;
//     });
//     updateFavorites();
//     updateNewest();
//   }
// }
// function saveFavoritesToStorage() {
//   localStorage.setItem("favorites", JSON.stringify(favorites));
// }

// window.addEventListener("beforeunload", saveFavoritesToStorage);

// // Load favorites from local storage when the page loads
// window.addEventListener("load", loadFavoritesFromStorage);

// localStorage.clear();
