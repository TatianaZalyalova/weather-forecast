import { createAddForm, createAddList } from "./drawList";

export const APP_ID = "f91294195b850a1f739d40dd214b1feb";

export async function getLocationUser() {
  const url = "https://get.geojs.io/v1/ip/geo.json";
  let objLocationUser;
  try {
    const response = await fetch(url);
    if (response.ok) {
      objLocationUser = await response.json();
      return objLocationUser.city;
    } else {
      document.querySelector(".location-error").classList.add("active");
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${APP_ID}`;
  let objWeather;
  try {
    const response = await fetch(url);
    objWeather = await response.json();
    if (!response.ok) {
      document.querySelector(".location-error").classList.add("active");
    }
  } catch (e) {
    console.log(e);
  }
  return objWeather;
}

function getWetherIconSrc(weather) {
  return `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
}

function getMapImageSrc(weather) {
  return `https://static-maps.yandex.ru/1.x/?ll=${weather.coord.lon},${weather.coord.lat}&size=450,450&z=13&l=map`;
}

export async function createWeatherPage(el) {
  createAddForm(el);
  const city = await getLocationUser();
  const weather = await getWeather(city);
  if (weather) {
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const icon = document.createElement("img");
    const mapImg = document.createElement("img");

    h2.innerHTML = weather.name;
    p.innerHTML = `${Math.round(weather.main.temp)} °`;
    icon.classList.add("icon");
    icon.src = getWetherIconSrc(weather);
    mapImg.classList.add("map");
    mapImg.src = getMapImageSrc(weather);

    el.appendChild(h2);
    el.appendChild(p);
    el.appendChild(icon);
    el.appendChild(mapImg);
  }
  createAddList(el);
}

export function showWeather(el, weather) {
  el.querySelector("h2").innerHTML = weather.name;
  el.querySelector("p").innerHTML = `${Math.round(weather.main.temp)} °`;
  el.querySelector("img.icon").src = getWetherIconSrc(weather);
  el.querySelector("img.map").src = getMapImageSrc(weather);
}
