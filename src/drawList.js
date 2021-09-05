import { getWeather, showWeather} from "./createWeatherPage.js";
export const key = "key";
function readCities() {
  let result = localStorage.getItem(key); 
  if (result === null) {
    return [];
  }
  return JSON.parse(result);
}
export const items = readCities();
export  function drawList(el, items) {
   el.innerHTML = `<ol>${items.map((item) => `<li>${item}</li>`).join("")}</ol>`;
}

export async function formSubmit(form, input, list, el) {
  await form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const cityName = input.value;
      input.value = "";
      const weather = await getWeather(cityName);
      if(weather.cod != 404) {
        showWeather(el, weather);
        if(items.indexOf(cityName) === -1) {
          items.push(cityName); 
        }
        if (items.length > 5) {
          items.shift();
        }
        saveCities(items);
        drawList(list, items);
      }
  });
}

function saveCities(items) {
  localStorage.setItem(key, JSON.stringify(items));
}