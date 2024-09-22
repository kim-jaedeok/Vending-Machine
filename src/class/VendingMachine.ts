import { Coin, Paper, Payment } from "../types/payment";
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

  inputPayment(payment: Payment) {
    if (payment.kind === "card" && this.#paymentReader.card.read(payment)) {
      //TODO - 카드 입력 성공 처리
      return;
    }

    if (payment.kind === "cash") {
      let isValidCash = false;

      switch (payment.value.kind) {
        case "coin": {
          isValidCash = this.#paymentReader.coin.read(payment as Coin);
          break;
        }
        case "paper": {
          isValidCash = this.#paymentReader.paper.read(payment as Paper);
          break;
        }
      }

      if (isValidCash) {
        //TODO - 금고에 현금을 넣을 수 있는지 확인
        //TODO - 금고에 현금을 넣는다
        this.#changeIndicator.add(payment.value.value);
      }
    }
  }
  #checkSellable(product: Product["name"]) {
    if (!this.#salesItems.hasStockOf(product)) {
      return false;
    }

    //TODO - 보충 필요

    return true;
  }
}
