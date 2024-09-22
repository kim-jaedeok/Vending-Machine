import { Product } from "../types/product";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { ChangeIndicator } from "./ChangeIndicator";
import { SalesItems } from "./SalesItems";
import { CardReader } from "./paymentReader/CardReader";
import { CoinReader } from "./paymentReader/CoinReader";
import { PaperReader } from "./paymentReader/PaperReader";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  paymentReader: {
    coin: CoinReader;
    paper: PaperReader;
    card: CardReader;
  };
  salesItems: SalesItems;
  changeIndicator: ChangeIndicator;
}
export class VendingMachine implements IVendingMachine {
  #salesItems;
  #paymentReader;
  #changeIndicator;

  constructor({
    salesItems,
    paymentReader,
    changeIndicator,
  }: VendingMachineParams) {
    autoBind(this);
    this.#salesItems = salesItems;
    this.#paymentReader = paymentReader;
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
