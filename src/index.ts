import { Weather } from "./Weather";
import "./css/style.css";

const myObj = new Weather(document.getElementById("app") as HTMLElement);
myObj.init(async function () {
  await myObj.getLocationUser();
  myObj.elem.innerHTML = await myObj.renderWeather();
  myObj.setupEvents();
});
