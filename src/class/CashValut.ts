import { Coin, Paper } from "../types/payment";
import { Price } from "../types/product";
import autoBind from "auto-bind";

type SupportCash = Coin["value"] | Paper["value"];

export class CashVault {
  #supportCash;
  #cashStock = new Map<string, number>();
  #maxCapacity: number;

  constructor(
    supportCash: (SupportCash & { stock: number })[],
    maxCapacity: number,
  ) {
    autoBind(this);
    this.#supportCash = supportCash.map(({ kind, value, currency }) => ({
      kind,
      value,
      currency,
    })) as SupportCash[];
    supportCash.forEach((cash) => {
      this.#cashStock.set(this.#getCashSignature(cash), cash.stock);
    });
    this.#maxCapacity = maxCapacity;
  }

  #getCashSignature(cash: Cash["value"]) {
    return `${cash.kind}-${cash.value}-${cash.currency}`;
  }
}
