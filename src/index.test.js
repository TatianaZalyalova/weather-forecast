import { createWeatherPage } from "./index.js";
describe('createWeatherPage', () => {
    it("is a function", () => {
        expect(createWeatherPage).toBeInstanceOf(Function);
    });
});

describe("functional tests", () => {
    let el;
    beforeEach(() => {
      el = document.createElement("div");
      createWeatherPage(el);
    });

    it("renders initial markup", () => {
        const form = el.querySelector("form");
        expect(form).toBeTruthy();
        expect(form.querySelector("input#userInput")).toBeTruthy();
        expect(form.querySelector("button")).toBeTruthy();
        expect(el.querySelector("div.list")).toBeTruthy();
        expect(el.querySelector("img").src).toBeTruthy();
    });

    it("clears input value on form submit", () => {
        el.querySelector("input").value = "some text";
        el.querySelector("form").submit();
        expect(el.querySelector("input").value).toBe("");
    });
});