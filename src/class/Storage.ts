import autoBind from "auto-bind";

export class Storage<T> {
  #storage: T[] = [];

  constructor() {
    autoBind(this);
  }

  get list() {
    return this.#storage.map((item, index) => ({
      item,
      add: () => this.add(item),
      remove: () => this.#storage.splice(index, 1),
    }));
  }
  add(item: T) {
    this.#storage.push(item);
  }
}
