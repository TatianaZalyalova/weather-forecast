import { createWeatherPage } from "./createWeatherPage";
import { sleep } from "./utils";

describe("createWeatherPage", () => {
  it("is a function", () => {
    expect(createWeatherPage).toBeInstanceOf(Function);
  });
});

describe("functional tests", () => {
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
          ok: true,
          status: 200,
        }),
    })
  );

  const el = document.createElement("div");
  const locationError = document.createElement("div");
  locationError.classList.add("location-error");
  document.body.appendChild(el);
  document.body.appendChild(locationError);

  it("createWeatherPage", async () => {
    await createWeatherPage(el);
    const formEl = el.querySelector("form");
    expect(formEl).toBeTruthy();
    expect(formEl.querySelector("input#userInput")).toBeTruthy();
    expect(formEl.querySelector("button")).toBeTruthy();
    sleep(500).then(() =>
      expect(el.querySelector("h2").innerHTML).toBe("Kyiv")
    );
    expect(el.querySelector("p").innerHTML).toBe("16 °");
    expect(el.querySelector("img.icon").src).toBe(
      "http://openweathermap.org/img/wn/01d@2x.png"
    );
    expect(el.querySelector("img.map").src).toBe(
      "https://static-maps.yandex.ru/1.x/" +
        `?ll=30.5167,50.4333&size=450,450&z=13&l=map`
    );
  });
});
