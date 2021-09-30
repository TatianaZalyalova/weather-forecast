import { createWeatherPage, getLocationUser } from "./createWeatherPage";
import { saveCities } from "./drawList";

describe("show a list of entered cities", () => {
  global.fetch = jest.fn(() =>
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

  const sleep = (ms) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });

  const elWeather = document.createElement("div");
  const locationError = document.createElement("p");
  locationError.classList.add("location-error");
  document.body.appendChild(elWeather);
  document.body.appendChild(locationError);

  it("adding a city to the list", async () => {
    await createWeatherPage(elWeather);
    elWeather.querySelector("input").value = "Kyiv";
    elWeather.querySelector("form").submit();
    sleep(3000).then(() =>
      expect(elWeather.querySelector(".list ol li").innerHTML).resolves.toBe(
        "Kyiv"
      )
    );
  });

  it("entering an invalid value", async () => {
    await createWeatherPage(elWeather);
    elWeather.querySelector("input").value = "iii";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ cod: "404" }),
      })
    );
    elWeather.querySelector("form").submit();
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
    saveCities(arrCity, "Delhi");
    expect(arrCity.indexOf("Delhi")).toBe(arrCity.lastIndexOf("Delhi"));
  });

  it("could not determine location", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );
    getLocationUser();
    sleep(3000).then(() =>
      expect(document.querySelector(".location-error").className).resolves.toBe(
        "location-error active"
      )
    );
  });
});
