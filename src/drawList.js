import { getWeather, showWeather, weatherInfoEl, listEl } from "./index.js";
const key = "key";
function readCities() {
  let result = localStorage.getItem(key); //
  if (result === null) {
    return [];
  }
  return JSON.parse(result);
}
export const items = readCities();


export function drawList(el, items) {
  el.innerHTML = `<ol>${items.map((el) => `<li>${el}</li>`).join("")}</ol>`;
}

export async function formSubmit(form, input) {
  await form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const cityName = input.value;
      input.value = "";
      const weather = await getWeather(cityName);
      if(weather.cod != 404) {
        showWeather(weatherInfoEl, weather);
        items.push(cityName);
        if (items.length > 5) {
          items.shift();
        }
        saveCities(items);
        drawList(listEl, items);
      } 
  });
}

function saveCities(items) {
  localStorage.setItem(key, JSON.stringify(items));
}