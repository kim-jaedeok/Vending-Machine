import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { ChangeIndicator } from "./ChangeIndicator";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  changeIndicator: ChangeIndicator;
}
export class VendingMachine implements IVendingMachine {
  #changeIndicator;

  constructor({ changeIndicator }: VendingMachineParams) {
    autoBind(this);
    this.#changeIndicator = changeIndicator;
  }

  get changeValue() {
    return this.#changeIndicator.toString();
  }
}
