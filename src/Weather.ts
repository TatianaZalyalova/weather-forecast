import { Component } from "./Component";

interface weatherObj {
  [index: string]: string | number | undefined;
}
export class Weather extends Component {
  state: weatherObj = {};
  setupEvents() {
    const form = document.querySelector("form") as HTMLElement;
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const input = document.querySelector("input");
      this.state.CITY = input?.value;
      const weather = await this.getWeather(this.state.CITY as string);
      if (weather) {
        await this.saveCities(this.state.CITY as string);
        this.elem.innerHTML = await this.renderWeather();
        this.setupEvents();
      }
    });

    const listEl = document.querySelector(".list ol") as HTMLElement;
    listEl.addEventListener("click", async (ev) => {
      const target = ev.target as HTMLElement;
      if (target.tagName !== "LI") return;
      this.state.CITY = target.innerHTML;
      this.elem.innerHTML = await this.renderWeather();
      this.setupEvents();
    });
  }

  /*events = {
        'submit@form': this.formSubmit,
        'click@.list': this.clickOncity,
    };

    async formSubmit(ev) {
        ev.preventDefault();
        const input = document.querySelector("input");
        this.state["CITY"] = input.value;
        const items = await this.readCities();
        console.log(items);
        await this.saveCities(items, this.state["CITY"]);
        this.elem.innerHTML = await this.renderWeather();
        this.setupEvents();
      }
  
      async clickOncity(ev) {
        const target = ev.target as HTMLElement;
        if (target.tagName !== "LI") return;
        this.state.CITY = target.innerHTML;
        this.elem.innerHTML = await this.renderWeather();
        this.setupEvents();
      }

    setupEvents() {
        Object.entries(this.events).forEach(([key, value]) => {
            const arr = key.split('@');
            const event = arr[0];
            const selector = arr[1];
            const cb =  value;
            this.elem.querySelector(selector)?.addEventListener(event, cb);
        });
    }*/
}
