import { drawList, formSubmit, items } from "./drawList.js";

export const APP_ID = 'f91294195b850a1f739d40dd214b1feb';
export async function createWeatherPage(el) {
    const city = await getLocationUser();
    const weather = await getWeather(city);
    const formEl = document.createElement("form");
    const inputEl = document.createElement("input");
    inputEl.id = "userInput";
    inputEl.placeholder = "Введите название города";
    const button = document.createElement("button");
    button.innerHTML = "Узнать погоду";
    formEl.appendChild(inputEl);
    formEl.appendChild(button);
    el.appendChild(formEl);
    const h2 = document.createElement("h2");
    h2.innerHTML = weather.name;
    el.appendChild(h2);
    const p = document.createElement("p");
    p.innerHTML = `${Math.round(weather.main.temp)} °`;
    el.appendChild(p);
    const icon = document.createElement("img");
    icon.classList.add("icon");
    icon.src = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
    el.appendChild(icon);
    const mapImg = document.createElement("img");
    mapImg.classList.add("map");
    mapImg.src = `https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&size=450,450&z=13&l=map`;
    el.appendChild(mapImg);
    const listEl = document.createElement("div");
    listEl.classList.add("list");
    el.appendChild(listEl);
    validateInput(inputEl);
    drawList(listEl, items);
    formSubmit(formEl,inputEl, listEl, el);
  }

export async function getLocationUser() {
    const url = 'https://get.geojs.io/v1/ip/geo.json';
    const response = await fetch(url);
    const  objLocationUser = await response.json();
    return objLocationUser.city;
}

function validateInput(input) {
   input.addEventListener("input", function() {
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

