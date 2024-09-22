import { Product } from "../types/product";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { ChangeIndicator } from "./ChangeIndicator";
import { SalesItems } from "./SalesItems";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  salesItems: SalesItems;
  changeIndicator: ChangeIndicator;
}
export class VendingMachine implements IVendingMachine {
  #salesItems;
  #changeIndicator;

  constructor({ salesItems, changeIndicator }: VendingMachineParams) {
    autoBind(this);
    this.#salesItems = salesItems;
    this.#changeIndicator = changeIndicator;
  }

  get salesItems() {
    return this.#salesItems.list.map((item) => ({
      name: item.name,
      price: item.price.toString(),
      sellable: this.#checkSellable(item.name),
    }));
  }
  get changeValue() {
    return this.#changeIndicator.toString();
  }

  #checkSellable(product: Product["name"]) {
    if (!this.#salesItems.hasStockOf(product)) {
      return false;
    }

    //TODO - 보충 필요

    return true;
  }
}
