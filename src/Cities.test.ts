import { Cities } from "./Cities";
import { Weather } from "./Weather";

import { sleep } from "./utils";

describe("show a list of entered cities", () => {
  const el: HTMLDivElement = document.createElement("div");
  document.body.innerHTML = `<form>
  <input id="userInput" placeholder="Введите название города">
  <button>Узнать погоду</button>
</form>
<p class="location-error">Не удалось определить местоположение, введите название города в форму.</p>
      <div id="app"></div>
      <div id="cities-list"></div>`;
  document.body.appendChild(el);
  (global.fetch as any) = jest.fn(() =>
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
    })
  );

  const cities = new Cities(el as HTMLElement);

  const weather = new Weather(el as HTMLElement, cities);

  it("adding a city to the list", async () => {
    document.querySelector("input").value = "Kyiv";
    const form = document.querySelector("form");
    form.submit();
    sleep(3000).then(() =>
      expect(el.querySelector(".list ol li").innerHTML).resolves.toBe("Kyiv")
    );
  });

  it("entering an invalid value", async () => {
    document.querySelector("input").value = "iii";
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ cod: "404" }),
      })
    );
    document.querySelector("form").submit();
    sleep(3000).then(() =>
      expect(document.querySelector(".error").className).resolves.toBe(
        "error active"
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

  it("no more than 10 cities in the list", () => {
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

    cities.saveCities("Seoul");
    const newArrCity = JSON.parse(localStorage.getItem(cities.key));

    sleep(500).then(() => newArrCity.length.toBe(10));
    sleep(500).then(() => expect(newArrCity[0]).toBe("Baghdad"));
    sleep(500).then(() => expect(newArrCity[9]).toBe("Seoul"));
  });
});
