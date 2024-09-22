import { Cash, Coin, Paper, Payment } from "../types/payment";
import { Product } from "../types/product";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { CashVault } from "./CashVault";
import { ChangeIndicator } from "./ChangeIndicator";
import { ProductVault } from "./ProductVault";
import { Storage } from "./Storage";
import { CardReader } from "./paymentReader/CardReader";
import { CoinReader } from "./paymentReader/CoinReader";
import { PaperReader } from "./paymentReader/PaperReader";
import autoBind from "auto-bind";

export interface VendingMachineParams {
  productVault: ProductVault;
  paymentReader: {
    coin: CoinReader;
    paper: PaperReader;
    card: CardReader;
  };
  changeIndicator: ChangeIndicator;
  cashVault: CashVault;
}
export class VendingMachine implements IVendingMachine {
  #productVault;
  #paymentReader;
  #cashVault;
  #changeIndicator;
  #changeStorage = {
    coin: new Storage<Cash>(),
    paper: new Storage<Cash>(),
  };
  #productStorage = new Storage<Product>();

  constructor({
    productVault,
    paymentReader,
    changeIndicator,
    cashVault,
  }: VendingMachineParams) {
    autoBind(this);
    this.#productVault = productVault;
    this.#paymentReader = paymentReader;
    this.#changeIndicator = changeIndicator;
    this.#cashVault = cashVault;
  }

  get salesItems() {
    return this.#productVault.list.map((item) => {
      const sellable = this.#checkSellable(item.name);

      return {
        name: item.name,
        price: item.price.toString(),
        sellable,
        sell: () => this.#sell(item.name),
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
  get productStorage() {
    return this.#productStorage.list;
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
    if (!this.#productVault.hasStockOf(product)) {
      return false;
    }

    if (this.#paymentReader.card.read()) {
      return true;
    }

    // 가격이 잔돈 이하의 상품인지 확인
    const price = this.#productVault.getProductPrice(product);
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
  #sell(product: Product["name"]) {
    const price = this.#productVault.getProductPrice(product);
    if (price && this.#checkSellable(product)) {
      if (!this.#paymentReader.card.pay(price)) {
        this.#changeIndicator.subtract(price.value);
      }

      this.#productStorage.add(this.#productVault.subtractItem(product, 1));
    } else {
      throw new Error("상품을 판매할 수 없습니다.");
    }
  }
}
