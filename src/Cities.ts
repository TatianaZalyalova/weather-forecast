import { Component } from "./Component";

interface ICitiesObject {
  city: string;
}

interface ICities {
  setOnCityClickListener: (cityClick: (city: string) => void) => void;
  clickOncity: (ev: Event) => Promise<void>;
  readCities: () => Promise<string[] | []>;
  saveCities: (cityName: string) => Promise<void>;
  getСityObjects: () => Promise<ICitiesObject[] | []>;
  renderList: () => void;
}

export class Cities extends Component implements ICities {
  tpl = `<div class="list"><ol>
  {{for cities}}<li>{{city}}</li>{{endfor}}
  </ol></div>`;
  cityClick!: (city: string) => void;

  setOnCityClickListener(cityClick: (city: string) => void): void {
    this.cityClick = cityClick;
  }

  clickOncity = async (ev: Event): Promise<void> => {
    const target = ev.target as HTMLElement;
    if (target.tagName !== "LI") return;
    this.cityClick(target.innerHTML);
  };

  events = {
    "click@.list": this.clickOncity,
  };
  readCities = async (): Promise<string[] | []> => {
    const result = localStorage.getItem(this.key);
    if (result === null) {
      return [];
    }
    const arrCities = await JSON.parse(result);
    return arrCities;
  };

  saveCities = async (cityName: string): Promise<void> => {
    let newCityName: string = cityName.trim();
    newCityName = cityName[0].toUpperCase() + cityName.toLowerCase().slice(1);
    const elems: string[] = await this.readCities();
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

  getСityObjects = async (): Promise<ICitiesObject[] | []> => {
    const cities = await this.readCities();
    const citiesObjArr = cities.map((val: { toString: () => any }) => ({
      city: val.toString(),
    }));
    return citiesObjArr;
  };

  renderList = async (): Promise<void> => {
    const citiesObj = await this.getСityObjects();
    this.setState({
      cities: citiesObj,
    });
  };
}
