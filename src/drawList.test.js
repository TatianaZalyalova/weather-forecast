import { createWeatherPage } from "./createWeatherPage.js";

describe("show a list of entered cities", () => {
    const fakeLocalStorage = (function () {
        let store = {};
        return {
          getItem: function (key) {
            return store[key] || null;
          },
          setItem: function (key, value) {
            store[key] = JSON.stringify(value);
          },
          removeItem: function (key) {
            delete store[key];
          },
          clear: function () {
            store = {};
          }
        };
      })();
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ "city":"Kyiv", "coord":{"lon":30.5167,"lat":50.4333}, "weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}], "main":{"temp":16.41,"feels_like":15.44,"temp_min":15.95,"temp_max":16.51,"pressure":1015,"humidity":51},"name":"Kyiv" }),
        })
    );
    beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
        value: fakeLocalStorage,
      });
    });
      
    let el;
    el = document.createElement("div");
    createWeatherPage(el);

    it("clears input value on form submit", () => {
      el.querySelector("input").value = "Male";
      el.querySelector("form").submit();
      expect(el.querySelector("input").value).toBe("");
    });

    it("adding a city to the list", async () => {
      el.querySelector("input").value = "Kyiv";
      await el.querySelector("form").submit(callback);
      function callback() {
        expect(el.querySelector(".list ol li").innerHTML).toBe("Kyiv");
      }
    }); 
});