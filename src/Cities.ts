import { Component } from "./Component";

interface ICitiesObject {
  CITY: string;
}

interface ICities {
  setOnCityClickListener: (cityClick: (city: string) => void) => void;
  clickOncity: (ev: Event) => void;
  readCities: () => Promise<string[] | []>;
  saveCities: (cityName: string) => Promise<void>;
  getСityObjects: () => Promise<ICitiesObject>;
  renderList: () => void;
}

export class Cities extends Component implements ICities {
  tpl = `<div class="list"><ol>
  {{for cities}}<li>{{CITY}}</li>{{endfor}}
  </ol></div>`;
  cityClick!: (city: string) => void;

  setOnCityClickListener(cityClick: (city: string) => void) {
    this.cityClick = cityClick;
  }

  clickOncity = async (ev: Event) => {
    const target = ev.target as HTMLElement;
    if (target.tagName !== "LI") return;
    this.cityClick(target.innerHTML);
  };

  events = {
    "click@.list": this.clickOncity,
  };
  readCities = async () => {
    const result = localStorage.getItem(this.key);
    if (result === null) {
      return [];
    }
    const arrCities = await JSON.parse(result);
    return arrCities;
  };

  saveCities = async (cityName: string) => {
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
  };

  getСityObjects = async () => {
    const cities = await this.readCities();
    const citiesObjArr = cities.map((val: { toString: () => any }) => ({
      CITY: val.toString(),
    }));
    return citiesObjArr;
  };

  renderList = async () => {
    const citiesObj = await this.getСityObjects();
    this.setState({
      cities: citiesObj,
    });
  };
}
