import { Weather } from "./Weather";
import { sleep } from "./utils";

describe("Weather", () => {
  const el: HTMLDivElement = document.createElement("div");
  document.body.innerHTML = `<form>
    <input id="userInput" placeholder="Введите название города">
    <button>Узнать погоду</button>
  </form>`;
  document.body.appendChild(el);
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
    })
  );

  const myObj = new Weather(el);
  myObj.init(async function () {
    await myObj.getLocationUser();
    myObj.elem.innerHTML = await myObj.renderWeather();
    myObj.setupEvents();
  });

  it("setupEvents formSubmit", async () => {
    document.querySelector("input").value = "Kyiv";
    document.querySelector("form").submit();
    sleep(500).then(() =>
      expect(document.querySelector(".list ol li").innerHTML).resolves.toBe(
        "Kyiv"
      )
    );
  });

  it("setupEvents clickOncity", async () => {
    document.querySelector("input").value = "Kyiv";
    document.querySelector(".list li").click();
    sleep(500).then(() =>
      expect(document.querySelector("h2").innerHTML).resolves.toBe("Adana")
    );
  });

  it("could not determine location", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    );
    await myObj.getLocationUser();
    myObj.elem.innerHTML = await myObj.renderWeather();
    myObj.setupEvents();
    sleep(500).then(() =>
      expect(document.querySelector(".location-error").className).resolves.toBe(
        "location-error active"
      )
    );
  });
});
