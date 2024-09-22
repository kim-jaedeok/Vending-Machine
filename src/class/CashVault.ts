import { Cash, CashCurrency, Coin, Paper } from "../types/payment";
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

  canSave(cash: Cash) {
    const stock = this.#cashStock.get(this.#getCashSignature(cash.value));

    if (stock === undefined || this.#maxCapacity <= stock) {
      return false;
    } else {
      return true;
    }
  }
  save(cash: Cash) {
    if (!this.canSave(cash)) {
      throw new Error("현금을 저장할 수 없습니다");
    }

    const stock = this.#cashStock.get(this.#getCashSignature(cash.value)) || 0;
    this.#cashStock.set(this.#getCashSignature(cash.value), stock + 1);
  }
  canWithdraw(price: Price<number, CashCurrency>) {
    const descendingSupportCash = this.#supportCash
      .slice()
      .sort((a, b) => b.value - a.value);

    let remainCash = price.value;
    const usingCash: Record<string, number> = {};

    while (0 < remainCash) {
      const largestSubtractableCash = descendingSupportCash.find(
        (supportCash) => {
          const cashStock = this.#cashStock.get(
            this.#getCashSignature(supportCash),
          );
          const usingCashStock =
            usingCash[this.#getCashSignature(supportCash)] ?? 0;

          return (
            supportCash.value <= remainCash &&
            cashStock &&
            usingCashStock < cashStock
          );
        },
      );

      if (largestSubtractableCash) {
        remainCash -= largestSubtractableCash.value;
        usingCash[this.#getCashSignature(largestSubtractableCash)] =
          (usingCash[this.#getCashSignature(largestSubtractableCash)] ?? 0) + 1;
      } else {
        return false;
      }
    }

    return remainCash === 0;
  }

  #getCashSignature(cash: Cash["value"]) {
    return `${cash.kind}-${cash.value}-${cash.currency}`;
  }
}
