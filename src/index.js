import { drawList, formSubmit, items } from "./drawList.js";
createWeatherPage(document.querySelector("#app"));
const APP_ID = 'f91294195b850a1f739d40dd214b1feb';
const formEl = document.querySelector("form");
export const weatherInfoEl = document.querySelector("#app");
export const listEl = document.querySelector(".list");
const inputEl = document.querySelector("input");

async function getLocationUser() {
    const url = 'https://get.geojs.io/v1/ip/geo.json';
    const response = await fetch(url);
    const  objLocationUser = await response.json();
    return objLocationUser.city;
}

export async function createWeatherPage(el) {
  el.innerHTML = `<form>
                    <input id="userInput" placeholder="Введите название города" required="" autofocus="">
                    <button>Узнать погоду</button>
                  </form>
                  <h2></h2>
                  <p></p>
                  <img class="icon" src="#">
                  <img class="map" src="#">
                  <div class="list"></div>`
  const city = await getLocationUser();
  const weather = await getWeather(city);
  showWeather(weatherInfoEl, weather);
  drawList(listEl, items); 
  validateInput();
   
}
async function validateInput() {
   inputEl.addEventListener("input", function() {
    if (this.value.match(/[^a-zA-Zs]/g)) {
      this.value = this.value.replace(/[^a-zA-Zs]/g, '');
    }
  });
}

export async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${APP_ID}`;
  const response = await fetch(url);
  const  objWeather = await response.json();
  return objWeather;
}

export function showWeather(el, weather) {
  if (weather.cod != 404) {
    el.querySelector('h2').innerHTML = weather.name;
    el.querySelector('p').innerHTML = Math.round(weather.main.temp) + ' °';
    el.querySelector('img.icon').src ="http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
    el.querySelector('img.map').src = `https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&size=450,450&z=13&l=map`;
  }
}

formSubmit(formEl,inputEl);

 

  
