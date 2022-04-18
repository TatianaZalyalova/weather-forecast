import { template } from "./template";

export interface IComponent {
  elem: HTMLElement;
  state: State;
  events: {
    [key: string]: (ev: Event) => void;
  };
  setupEvents: (events: IEvents) => void;
  setState: (obj: Partial<State>) => void;
  render: (tpl: string, data: State) => string;
}

interface State {
  city?: string;
  icon?: string;
  lat?: number;
  lon?: number;
  temp?: string;
  cities?: { city: string }[] | [];
}

interface IEvents {
  [key: string]: (ev: Event) => void;
}

export abstract class Component implements IComponent {
  elem;
  state: State = {};
  events = {};

  APP_ID = "f91294195b850a1f739d40dd214b1feb";
  key = "key";
  tpl = ``;

  constructor(elem: HTMLElement) {
    this.elem = elem;
  }

  setupEvents = (events: IEvents): void => {
    Object.entries(events).forEach(([key, value]) => {
      const arr = key.split("@");
      const event = arr[0];
      const selector = arr[1];
      const cb = value;
      document.querySelector(selector)?.addEventListener(event, cb);
    });
  };

  setState = (obj: Partial<State>): void => {
    this.state = {
      ...this.state,
      ...obj,
    };
    this.elem.innerHTML = this.render(this.tpl, this.state);
    this.setupEvents(this.events);
  };
  init = (callback: { (): Promise<void>; bind?: any }): void => {
    callback.bind(this)();
  };

  render = (tpl: string, data: State): string => template(tpl, data);
}
