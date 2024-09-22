import { Cash } from "../types/payment";
import autoBind from "auto-bind";

export class ChangeStorage {
  #storage: Cash[] = [];

  constructor() {
    autoBind(this);
  }

  get list() {
    return this.#storage.map((cash, index) => ({
      cash,
      add: () => this.add(cash),
      remove: () => this.#storage.splice(index, 1),
    }));
  }
  add(cash: Cash) {
    this.#storage.push(cash);
  }
}
