import { Coin, Paper, Payment } from "../types/payment";
import { Product } from "../types/product";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { CashVault } from "./CashVault";
import { ChangeIndicator } from "./ChangeIndicator";
import { ChangeStorage } from "./ChangeStorage";
import { SalesItems } from "./SalesItems";
import { CardReader } from "./paymentReader/CardReader";
import { CoinReader } from "./paymentReader/CoinReader";
import { PaperReader } from "./paymentReader/PaperReader";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  salesItems: SalesItems;
  paymentReader: {
    coin: CoinReader;
    paper: PaperReader;
    card: CardReader;
  };
  changeIndicator: ChangeIndicator;
  cashVault: CashVault;
}
export class VendingMachine implements IVendingMachine {
  #salesItems;
  #paymentReader;
  #cashVault;
  #changeIndicator;
  #changeStorage = {
    coin: new ChangeStorage(),
    paper: new ChangeStorage(),
  };

  constructor({
    salesItems,
    paymentReader,
    changeIndicator,
    cashVault,
  }: VendingMachineParams) {
    autoBind(this);
    this.#salesItems = salesItems;
    this.#paymentReader = paymentReader;
    this.#changeIndicator = changeIndicator;
    this.#cashVault = cashVault;
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
    if (payment.kind === "card") {
      this.#paymentReader.card.input(payment);
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

      if (isValidCash && this.#cashVault.canSave(payment)) {
        this.#cashVault.save(payment);
        this.#changeIndicator.add(payment.value.value);
      } else {
        //TODO - 입력값 즉시 반환
      }
    }
  }
  removePayment(payment: Payment["kind"]) {
    switch (payment) {
      case "card":
        this.#paymentReader.card.remove();
        break;
      case "cash": {
        for (const cash of this.#cashVault.withdraw({
          value: this.#changeIndicator.value,
          currency: this.#changeIndicator.currency,
        })) {
          this.#changeIndicator.subtract(cash.value.value);
          //TODO - 반환값 현금 반환함으로 이동
        }
      }
    }
  }

  #checkSellable(product: Product["name"]) {
    if (!this.#salesItems.hasStockOf(product)) {
      return false;
    }

    if (this.#paymentReader.card.read()) {
      return true;
    }

    // 가격이 잔돈 이하의 상품인지 확인
    const price = this.#salesItems.getProductPrice(product);
    if (
      price === undefined ||
      this.#changeIndicator.currency !== price.currency ||
      this.#changeIndicator.value < price.value
    ) {
      return false;
    }

    if (!this.#cashVault.canWithdraw(price)) {
      return false;
    }

    return true;
  }
}
