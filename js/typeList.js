import {colors} from "./typeColor.js";
const fetchTypes = () => {
  const url = "https://pokeapi.co/api/v2/type";
  fetch(url)
  .then(response => response.json())
  .then(data => {
    const types = data.results;
    const filteredTypes = types.slice(0, types.length - 2);
    getTypes(filteredTypes);
  })
  .catch(error => {
    console.log("Error", error);
  })
};

const getTypes = (types) => {
  const container = document.querySelector('.pokemons');
  // const typeList = document.querySelector('type-list');
  types.forEach(type => {
    const typeList = `
      <p class="type-list mx-2 text-capitalize text-center" style="background:${colors[type.name]};  box-shadow: 0 0 7px ${colors[type.name]};">
      ${type.name}
      </p>
    `;
    container.innerHTML += typeList;
  })
}

fetchTypes();