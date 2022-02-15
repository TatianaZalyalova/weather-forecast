import { Weather } from "./Weather";
import { Cities } from "./Cities";
import "./css/style.css";

const cities = new Cities(
  document.getElementById("cities-list") as HTMLElement
);
const weather = new Weather(
  document.getElementById("app") as HTMLElement,
  cities
);
