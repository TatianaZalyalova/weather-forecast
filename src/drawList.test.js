import { createWeatherPage} from "./createWeatherPage";
import { saveCities } from "./drawList";

describe("show a list of entered cities", () => {
  const fakeLocalStorage = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = JSON.stringify(value);
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    }
  };
  })();
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ "city":"Kyiv", 
      "coord":{"lon":30.5167,"lat":50.4333}, 
      "weather":[{"id":800,"main":"Clear",
      "description":"clear sky","icon":"01d"}], 
      "main":{"temp":16.41,"feels_like":15.44,
      "temp_min":15.95,"temp_max":16.51,
    
      "pressure":1015,"humidity":51},"name":"Kyiv" }),
    })
  );
  beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });

  const sleep = function(ms) {
    return new Promise(resolve => {
      setTimeout(() => resolve(), ms);
    })
  }
  
  const elWeather = document.createElement("div");

  it("adding a city to the list", async () => {
    await createWeatherPage(elWeather);
    elWeather.querySelector("input").value = "Kyiv";
    elWeather.querySelector("form").submit();
    sleep(3000).then(() => expect(elWeather.querySelector(".list ol li").innerHTML).resolves.toBe("Kyiv"));
  });
  
  it("entering an invalid value", async () => {
    await createWeatherPage(elWeather);
    elWeather.querySelector("input").value = "iii";
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ "cod":"404" }),
      })
    );
    elWeather.querySelector("form").submit();
    sleep(3000).then(() => expect(document.querySelector(".error").className).resolves.toBe("error active"));
  });


  it("do not add a city if it is already in the list", () => {
    const arrCity = ['Adana', 'Baghdad', 'Delhi', 'Copenhagen', 'Milan', 'Donetsk', 'Paris', 'Helsinki', 	'Hiroshima'];
    saveCities(arrCity, 'Delhi');
    expect(arrCity.indexOf('Delhi')).toBe(arrCity.lastIndexOf( 'Delhi'));
  }); 
});
