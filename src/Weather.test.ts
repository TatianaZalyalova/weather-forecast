import { Weather } from "./Weather";
import { Cities } from "./Cities";
import { sleep } from "./utils";

describe("Weather", () => {
  const weatherEl: HTMLDivElement = document.createElement("div");
  weatherEl.innerHTML = `<form>
    <input id="userInput" placeholder="Введите название города">
    <button>Узнать погоду</button>
  </form>
  <p class="location-error">
    Не удалось определить местоположение, введите название города в форму.
  </p>
  <div id="weather">
  <div id="cities-list"></div>`;
  document.body.appendChild(weatherEl);
  global.fetch = jest.fn(
    () =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            name: "Kyiv",
            city: "Kyiv",
            coord: { lon: 30.5167, lat: 50.4333 },
            weather: [{ icon: "01d" }],
            main: {
              temp: 16.41,
            },
            ok: true,
            status: 200,
            cities: [
              "Adana",
              "Baghdad",
              "Delhi",
              "Copenhagen",
              "Milan",
              "Donetsk",
              "Paris",
              "Helsinki",
              "Hiroshima",
            ],
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

  it("renderWeather", async () => {
    await sleep(500).then(() =>
      expect(weatherEl.querySelector("h2").innerHTML).toBe("Kyiv")
    );
    await sleep(500).then(() =>
      expect(weatherEl.querySelector(".temp").innerHTML).toBe("16 °")
    );
    await sleep(500).then(() => {
      const icon = weatherEl.querySelector("img.icon") as HTMLImageElement;
      expect(icon.src).toBe("http://openweathermap.org/img/wn/01d@2x.png");
    });

    await sleep(500).then(() => {
      const map = weatherEl.querySelector("img.map") as HTMLImageElement;
      expect(map.src).toBe(
        "https://static-maps.yandex.ru/1.x/" +
          `?ll=30.5167,50.4333&size=450,450&z=13&l=map`
      );
    });
  });

  it("could not determine location", async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve({}),
        }) as Promise<Response>
    );
    const locationUser = await weather.getLocationUser();
    weather.renderWeather(locationUser);
    await sleep(500).then(() => expect(locationUser).toBe(undefined));
    await sleep(500).then(() =>
      expect(document.querySelector(".location-error").className).toBe(
        "location-error active"
      )
    );
  });

  it("enter the city in the form", async () => {
    global.fetch = jest.fn(
      () =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              name: "Paris",
              coord: { lon: 36.5167, lat: 55.4333 },
              weather: [{ icon: "01d" }],
              main: {
                temp: 16.41,
              },
              ok: true,
              status: 200,
              cities: [
                "Adana",
                "Baghdad",
                "Delhi",
                "Copenhagen",
                "Milan",
                "Donetsk",
                "Paris",
                "Helsinki",
                "Hiroshima",
              ],
            }),
        }) as Promise<Response>
    );

    const form = document.querySelector("form");
    form.querySelector("input").value = "Paris";
    form.submit();
    await sleep(500).then(() =>
      expect(weatherEl.querySelector("h2").innerHTML).toBe("Paris")
    );
    await sleep(500).then(() =>
      expect(weatherEl.querySelector(".temp").innerHTML).toBe("16 °")
    );
    await sleep(500).then(() => {
      const icon = weatherEl.querySelector("img.icon") as HTMLImageElement;
      expect(icon.src).toBe("http://openweathermap.org/img/wn/01d@2x.png");
    });

    await sleep(500).then(() => {
      const map = weatherEl.querySelector("img.map") as HTMLImageElement;
      expect(map.src).toBe(
        "https://static-maps.yandex.ru/1.x/" +
          `?ll=36.5167,55.4333&size=450,450&z=13&l=map`
      );
    });
  });
});
