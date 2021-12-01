import { Component } from "./Component";
import { Weather } from "./Weather";
import { sleep } from "./utils";

describe("Component", () => {
  let el: HTMLDivElement;
  document.body.innerHTML = `<form>
    <input id="userInput" placeholder="Введите" название="" города="">
    <button>Узнать погоду</button>
  </form>`;
  beforeEach(() => {
    el = document.createElement("div");
  });
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

  const myObj = new Weather(el);
  myObj.init(async function () {
    await myObj.getLocationUser();
    myObj.elem.innerHTML = await myObj.renderWeather();
    myObj.setupEvents();
  });

  it("is a class", () => {
    expect(Component).toBeInstanceOf(Function);
    expect(new Weather(el)).toBeInstanceOf(Component);
  });

  it("renderWeather", async () => {
    const formEl = document.querySelector("form");
    expect(formEl).toBeTruthy();
    expect(formEl.querySelector("input#userInput")).toBeTruthy();
    expect(formEl.querySelector("button")).toBeTruthy();
    sleep(500).then(() =>
      expect(el.querySelector("h2").innerHTML).toBe("Kyiv")
    );
    sleep(500).then(() => expect(el.querySelector("p").innerHTML).toBe("16 °"));
    sleep(500).then(() =>
      expect(el.querySelector("img.icon").src).toBe(
        "http://openweathermap.org/img/wn/01d@2x.png"
      )
    );

    sleep(500).then(() =>
      expect(el.querySelector("img.map").src).toBe(
        "https://static-maps.yandex.ru/1.x/" +
          `?ll=30.5167,50.4333&size=450,450&z=13&l=map`
      )
    );
  });
});
