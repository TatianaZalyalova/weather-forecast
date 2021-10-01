import { getWeather, showWeather } from "./createWeatherPage";

const key = "key";
function readCities() {
  const result = localStorage.getItem(key);
  if (result === null) {
    return [];
  }
  return JSON.parse(result);
}
export const items = readCities();
export function drawList(listEl, elems) {
  listEl.innerHTML = `<ol>${elems
    .map((item) => `<li>${item}</li>`)
    .join("")}</ol>`;
}

export function saveCities(elems, cityName) {
  let newCityName = cityName.trim();
  newCityName = cityName[0].toUpperCase() + cityName.toLowerCase().slice(1);
  if (elems.indexOf(newCityName) === -1) {
    elems.push(newCityName);
  }

  if (elems.length > 10) {
    elems.shift();
  }

  localStorage.setItem(key, JSON.stringify(elems));
}

export async function formSubmit(form, input, el) {
  await form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const cityName = input.value;
    const list = document.querySelector(".list");
    input.value = "";
    const weather = await getWeather(cityName);
    if (weather.cod !== "404") {
      showWeather(el, weather);
      saveCities(items, cityName);
      drawList(list, items);
    } else {
      document.querySelector(".location-error").classList.add("active");
    }
  });
}

export function createAddForm(el) {
  const formEl = document.createElement("form");
  const inputEl = document.createElement("input");
  const button = document.createElement("button");

  inputEl.id = "userInput";
  inputEl.placeholder = "Введите название города";
  button.innerHTML = "Узнать погоду";

  formEl.appendChild(inputEl);
  formEl.appendChild(button);
  el.appendChild(formEl);
  formSubmit(formEl, inputEl, el);
}

export function createAddList(el) {
  const listEl = document.createElement("div");
  listEl.addEventListener("click", async function (event) {
    const target = event.target;
    if (target.tagName !== "LI") return;
    const city = target.innerHTML;
    const weather = await getWeather(city);
    showWeather(el, weather);
  });
  listEl.classList.add("list");
  el.appendChild(listEl);
  drawList(listEl, items);
}
