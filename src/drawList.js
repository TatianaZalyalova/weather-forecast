import { getWeather, showWeather } from "./createWeatherPage";

export const key = "key";
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
  if (elems.indexOf(cityName) === -1) {
    elems.push(cityName);
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
      document.querySelector(".location-error").classList.remove("active");
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
  listEl.classList.add("list");
  el.appendChild(listEl);
  drawList(listEl, items);
}
