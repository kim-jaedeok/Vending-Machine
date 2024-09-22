import { CashCurrency } from "../types/payment";
import { ChangeIndicator } from "./ChangeIndicator";
import autoBind from "auto-bind";

export class VendingMachine {
  #changeIndicator;

  constructor(currency: CashCurrency) {
    autoBind(this);
    this.#changeIndicator = new ChangeIndicator(0, currency);
  }

  get changeValue() {
    return this.#changeIndicator.toString();
  }
}
