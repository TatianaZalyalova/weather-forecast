import { createWeatherPage } from "./createWeatherPage.js";

describe('createWeatherPage', () => {
    it("is a function", () => {
        expect(createWeatherPage).toBeInstanceOf(Function);
    });
});

describe("functional tests", () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ "city":"Kyiv", "coord":{"lon":30.5167,"lat":50.4333}, "weather":[{"id":800,"main":"Clear","description":"clear sky","icon":"01d"}], "main":{"temp":16.41,"feels_like":15.44,"temp_min":15.95,"temp_max":16.51,"pressure":1015,"humidity":51} }),
        })
    );
    let el;
    el = document.createElement("div");
    function createWeatherPageTest(callback) {
        createWeatherPage(el);
    };
    
    it("createWeatherPage", () => {
        createWeatherPageTest(callback);
        function callback() {
        const formEl = el.querySelector("form");
        expect(formEl).toBeTruthy();
        expect(formEl.querySelector("input#userInput")).toBeTruthy();
        expect(formEl.querySelector("button")).toBeTruthy();
        expect(el.querySelector("h2").innerHTML).toBe('Kyiv');
        expect(el.querySelector("p").innerHTML).toBe('16 °');
        expect(el.querySelector("img.icon").src).toBe('http://openweathermap.org/img/wn/01d@2x.png');
        expect(el.querySelector("img.map").src).toBe('https://static-maps.yandex.ru/1.x/?ll=30.5167,50.4333&size=450,450&z=13&l=map');
        }
    }); 
});
