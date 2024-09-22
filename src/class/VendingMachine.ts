import { Coin, Paper, Payment } from "../types/payment";
import { Product } from "../types/product";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { CashVault } from "./CashVault";
import { ChangeIndicator } from "./ChangeIndicator";
import { ChangeStorage } from "./ChangeStorage";
import { ProductStorage } from "./ProductStorage";
import { CardReader } from "./paymentReader/CardReader";
import { CoinReader } from "./paymentReader/CoinReader";
import { PaperReader } from "./paymentReader/PaperReader";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  productStorage: ProductStorage;
  paymentReader: {
    coin: CoinReader;
    paper: PaperReader;
    card: CardReader;
  };
  changeIndicator: ChangeIndicator;
  cashVault: CashVault;
}
export class VendingMachine implements IVendingMachine {
  #productStorage;
  #paymentReader;
  #cashVault;
  #changeIndicator;
  #changeStorage = {
    coin: new ChangeStorage(),
    paper: new ChangeStorage(),
  };

  constructor({
    productStorage,
    paymentReader,
    changeIndicator,
    cashVault,
  }: VendingMachineParams) {
    autoBind(this);
    this.#productStorage = productStorage;
    this.#paymentReader = paymentReader;
    this.#changeIndicator = changeIndicator;
    this.#cashVault = cashVault;
  }

  get salesItems() {
    return this.#productStorage.list.map((item) => {
      const sellable = this.#checkSellable(item.name);

      return {
        name: item.name,
        price: item.price.toString(),
        sellable,
        sell: () => {
          // TODO: 상품 판매 로직
        },
      };
    });
  }
  get changeValue() {
    return this.#changeIndicator.toString();
  }
  get changeStorage() {
    return {
      coin: this.#changeStorage.coin.list,
      paper: this.#changeStorage.paper.list,
    };
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
        this.#changeStorage[payment.value.kind].add(payment);
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
          this.#changeStorage[cash.value.kind].add(cash);
        }
      }
    }
  }

  #checkSellable(product: Product["name"]) {
    if (!this.#productStorage.hasStockOf(product)) {
      return false;
    }

    if (this.#paymentReader.card.read()) {
      return true;
    }

    // 가격이 잔돈 이하의 상품인지 확인
    const price = this.#productStorage.getProductPrice(product);
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
