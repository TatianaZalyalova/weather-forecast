import { Cities } from "./Cities";
import { Component } from "./Component";

interface IdataWeather {
  [key: string]: any;
}
interface IWeather {
  formSubmit: (ev: Event) => Promise<void>;
  getLocationUser: () => Promise<string | undefined>;
  getWeatherData: (city: string) => Promise<IdataWeather | undefined>;
  renderWeather: (city: string) => Promise<void>;
}

export class Weather extends Component implements IWeather {
  cities: Cities;
  tpl = `<h2>{{city}}</h2>
  <p class="temp">{{temp}}</p>
  <img class="icon" src="http://openweathermap.org/img/wn/{{icon}}@2x.png">
  <img class="map" src="https://static-maps.yandex.ru/1.x/?ll={{lon}},{{lat}}&amp;size=450,450&amp;z=13&amp;l=map">`;

  constructor(elem: HTMLElement, cities: Cities) {
    super(elem);
    this.init(async () => {
      const city = await this.getLocationUser();
      if (city) {
        await this.renderWeather(city);
      }
    });

    this.cities = cities;
    this.cities.init(async () => {
      cities.renderList();
    });
    this.cities.setOnCityClickListener((city: string) => {
      this.renderWeather(city);
    });
  }

  formSubmit = async (ev: Event): Promise<void> => {
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

  getLocationUser = async (): Promise<string | undefined> => {
    const url = "https://get.geojs.io/v1/ip/geo.json";
    let objLocationUser;
    try {
      const response = await fetch(url);
      if (response.ok) {
        objLocationUser = await response.json();

        return objLocationUser.city;
      } else {
        throw new Error("Местоположение не определено");
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  getWeatherData = async (city: string): Promise<IdataWeather | undefined> => {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${this.APP_ID}`;
    let objWeather;
    try {
      const response = await fetch(url);
      if (response.ok) {
        objWeather = await response.json();
        return objWeather;
      } else {
        throw new Error("Город не найден");
      }
    } catch (e) {
      console.log((e as Error).message);
    }
  };

  renderWeather = async (city: string): Promise<void> => {
    const objWeather = await this.getWeatherData(city);
    if (objWeather) {
      document.querySelector(".location-error")?.classList.remove("active");
      this.setState({
        city: objWeather.name,
        temp: `${Math.round(objWeather.main.temp)} °`,
        icon: objWeather.weather[0].icon,
        lon: objWeather.coord.lon,
        lat: objWeather.coord.lat,
      });
    } else {
      document.querySelector(".location-error")?.classList.add("active");
    }
  };
}
