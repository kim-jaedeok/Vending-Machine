import { CashCurrency } from "../types/payment";
import autoBind from "auto-bind";

export class ChangeIndicator {
  #value;
  #currency;

  constructor(value: number, currency: CashCurrency) {
    autoBind(this);
    this.#value = value;
    this.#currency = currency;
  }

  toString() {
    return `${this.#value}${this.#currency}`;
  }
  add(value: number) {
    this.#value += value;
  }
  subtract(value: number) {
    if (this.#value < value) {
      throw new Error("잔액이 부족합니다.");
    }

    this.#value -= value;
  }
}
