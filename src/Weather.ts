import { Cities } from "./Cities";
import { Component } from "./Component";

interface IdataWeather {
  [key: string]: string;
}
interface IWeather {
  formSubmit: (ev: Event) => void;
  getLocationUser: () => Promise<string> | Promise<false>;
  getWeatherData: (city: string) => Promise<IdataWeather>;
  renderWeather: (city: string) => Promise<void>;
}

export class Weather extends Component implements IWeather {
  cities: Cities;
  tpl = `<h2>{{CITY}}</h2>
  <p class="temp">{{TEMP}}</p>
  <img class="icon" src="http://openweathermap.org/img/wn/{{ICON}}@2x.png">
  <img class="map" src="https://static-maps.yandex.ru/1.x/?ll={{LON}},{{LAT}}&amp;size=450,450&amp;z=13&amp;l=map">`;

  constructor(elem: HTMLElement, cities: Cities) {
    super(elem);
    this.init(async () => {
      const city = await this.getLocationUser();
      await this.renderWeather(city);
    });

    this.cities = cities;
    this.cities.init(async function () {
      cities.renderList();
    });
    this.cities.setOnCityClickListener((city: string) => {
      this.renderWeather(city);
    });
  }

  formSubmit = async (ev: Event) => {
    ev.preventDefault();
    const formElement = ev.target as HTMLFormElement;

    const input = formElement.querySelector("input") as HTMLInputElement;
    const objWeather = await this.getWeatherData(input.value);
    if (objWeather) {
      await this.cities.saveCities(input.value);
      this.renderWeather(input.value);
      this.cities.renderList();
    } else {
      document.querySelector(".location-error")?.classList.add("active");
    }
  };

  events = {
    "submit@form": this.formSubmit,
  };

  getLocationUser = async () => {
    const url = "https://get.geojs.io/v1/ip/geo.json";
    let objLocationUser;
    try {
      const response = await fetch(url);
      if (response.ok) {
        objLocationUser = await response.json();

        return objLocationUser.city;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  };

  getWeatherData = async (city: string) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${this.APP_ID}`;
    let objWeather;
    try {
      const response = await fetch(url);
      if (response.ok) {
        objWeather = await response.json();
        return objWeather;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
    }
  };

  renderWeather = async (city: string) => {
    const objWeather = await this.getWeatherData(city);
    if (objWeather) {
      document.querySelector(".location-error")?.classList.remove("active");
      this.setState({
        CITY: objWeather.name,
        TEMP: `${Math.round(objWeather.main.temp)} °`,
        ICON: objWeather.weather[0].icon,
        LON: objWeather.coord.lon,
        LAT: objWeather.coord.lat,
      });
    } else {
      document.querySelector(".location-error")?.classList.add("active");
    }
  };
}
