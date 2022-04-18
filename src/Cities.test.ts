import { Cities } from "./Cities";
import { Weather } from "./Weather";

import { sleep } from "./utils";

describe("show a list of entered cities", () => {
  const el: HTMLDivElement = document.createElement("div");
  el.innerHTML = `<form>
  <input id="userInput" placeholder="Введите название города">
  <button>Узнать погоду</button>
</form>
<p class="location-error">Не удалось определить местоположение, введите название города в форму.</p>
      <div id="weather"></div>
      <div id="cities-list"></div>`;
  document.body.appendChild(el);
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            city: "Kyiv",
            coord: { lon: 30.5167, lat: 50.4333 },
            weather: [{ icon: "01d" }],
            main: {
              temp: 16.41,
            },
            name: "Kyiv",
          }),
      }) as Promise<Response>
  );

  const cities = new Cities(
    document.getElementById("cities-list") as HTMLElement
  );

  const weather = new Weather(
    document.getElementById("weather") as HTMLElement,
    cities
  );

  it("adding a city to the list", async () => {
    el.querySelector("input").value = "Kyiv";
    const form = el.querySelector("form");
    form.submit();
    await sleep(3000).then(() =>
      expect(el.querySelector(".list ol li").innerHTML).toBe("Kyiv")
    );
  });

  it("entering an invalid value", async () => {
    el.querySelector("input").value = "iii";
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          json: () => Promise.resolve({ cod: "404" }),
        }) as Promise<Response>
    );
    el.querySelector("form").submit();
    await sleep(3000).then(() =>
      expect(el.querySelector(".location-error").className).toBe(
        "location-error active"
      )
    );
  });

  it("do not add a city if it is already in the list", () => {
    const arrCity = [
      "Adana",
      "Baghdad",
      "Delhi",
      "Copenhagen",
      "Milan",
      "Donetsk",
      "Paris",
      "Helsinki",
      "Hiroshima",
    ];
    localStorage.setItem(cities.key, JSON.stringify(arrCity));
    const newArrCity = JSON.parse(localStorage.getItem(cities.key));
    cities.saveCities("Delhi");
    expect(newArrCity.indexOf("Delhi")).toBe(newArrCity.lastIndexOf("Delhi"));
  });

  it("no more than 10 cities in the list", async () => {
    const arrCity = [
      "Adana",
      "Baghdad",
      "Delhi",
      "Copenhagen",
      "Milan",
      "Donetsk",
      "Paris",
      "Helsinki",
      "Hiroshima",
      "Sydney",
    ];
    localStorage.setItem(cities.key, JSON.stringify(arrCity));

    await cities.saveCities("Seoul");
    const newArrCity = await JSON.parse(localStorage.getItem(cities.key));

    await sleep(500).then(() => expect(newArrCity.length).toBe(10));
    await sleep(500).then(() => expect(newArrCity[0]).toBe("Baghdad"));
    await sleep(500).then(() => expect(newArrCity[9]).toBe("Seoul"));
  });
});
