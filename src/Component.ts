interface weatherObj {
  [index: string]: string | number | undefined | weatherObj;
}
export abstract class Component {
  elem: HTMLElement;
  state: weatherObj = {};
  city: any;
  APP_ID = "f91294195b850a1f739d40dd214b1feb";
  key = "key";
  events: Record<string, () => void> = {};

  constructor(elem: HTMLElement) {
    this.elem = elem;
  }

  init(callback: { (): Promise<void>; bind?: any }) {
    callback.bind(this)();
  }

  replaceVariablesValues(tpl: string, data: any): string {
    return tpl.replace(
      /\{\{(\w+)}}/g,
      (tplMatch, groupValue, matchIndex, str) => {
        if (data.hasOwnProperty(groupValue)) {
          return data[groupValue];
        } else {
          return "";
        }
      }
    );
  }

  replaceLoops(tpl: string, data: any): string {
    return tpl.replace(
      /\{\{for (\w+)}}(.+?)\{\{endfor}}/g,
      (tplMatch, groupValue1, subTpl, matchIndex, str) => {
        const arr = data[groupValue1];
        let result = "";
        for (let i = 0; i < arr.length; i++) {
          const subData = arr[i];
          result += this.template(subTpl, subData);
        }
        return result;
      }
    );
  }

  template(tpl: string, data: any): string {
    return this.replaceVariablesValues(this.replaceLoops(tpl, data), data);
  }

  async getLocationUser() {
    const url = "https://get.geojs.io/v1/ip/geo.json";
    let objLocationUser;
    try {
      const response = await fetch(url);
      if (response.ok) {
        objLocationUser = await response.json();
        this.state.CITY = objLocationUser.city;
      } else {
        document.querySelector(".location-error")?.classList.add("active");
      }
    } catch (e) {
      console.log(e);
    }
  }
  async getWeather(city: string): Promise<any> {
    const url = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${this.APP_ID}`;
    let objWeather;
    const templateObg: weatherObj = {};
    try {
      const response = await fetch(url);
      if (response.ok) {
        objWeather = await response.json();
        templateObg.CITY = city;
        templateObg.TEMP = `${Math.round(objWeather.main.temp)} °`;
        templateObg.ICON = objWeather.weather[0].icon;
        templateObg.LON = objWeather.coord.lon;
        templateObg.LAT = objWeather.coord.lat;
        this.state.WEATHER = templateObg;
        return objWeather;
      } else {
        document.querySelector(".location-error")?.classList.add("active");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async renderWeather() {
    document.querySelector(".location-error")?.classList.remove("active");
    const input = document.querySelector("input") as HTMLInputElement;
    input.value = "";
    await this.getWeather(this.state.CITY as string);
    await this.readCities();
    const cities = await this.readCities();
    const citiesObjArr = cities.map((val: { toString: () => any }) => ({
      CITY: val.toString(),
    }));
    this.state.cities = citiesObjArr;
    const sitysTemplate = this.template(
      `<div class="list"><ol>
        {{for cities}}<li>{{CITY}}</li>{{endfor}}
        </ol></div>`,
      this.state
    );
    const weatherTemplate = this.template(
      `
        <h2>{{CITY}}</h2>
        <p>{{TEMP}}</p>
        <img class="icon" src="http://openweathermap.org/img/wn/{{ICON}}@2x.png">
        <img class="map" src="https://static-maps.yandex.ru/1.x/?ll={{LON}},{{LAT}}&amp;size=450,450&amp;z=13&amp;l=map">`,
      this.state.WEATHER
    );
    return weatherTemplate + sitysTemplate;
  }

  async readCities() {
    const result = localStorage.getItem(this.key);
    if (result === null) {
      return [];
    }
    const arrCities = await JSON.parse(result);

    return arrCities;
  }

  async saveCities(cityName: string) {
    let newCityName = cityName.trim();
    newCityName = cityName[0].toUpperCase() + cityName.toLowerCase().slice(1);
    const elems = await this.readCities();
    if (elems.indexOf(newCityName) === -1) {
      elems.push(newCityName);
    } else {
      return;
    }

    if (elems.length > 10) {
      elems.shift();
    }

    localStorage.setItem(this.key, JSON.stringify(elems));
  }
}
