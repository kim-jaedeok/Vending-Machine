import { Cash, CashCurrency, Coin, Paper } from "../types/payment";
import { Price } from "../types/product";
import autoBind from "auto-bind";

type SupportCash = Coin["value"] | Paper["value"];

export class CashVault {
  #supportCash;
  #cashStock = new Map<string, number>();
  #maxCapacity: number;
  #saveLog: Cash["value"][] = [];

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
    this.#saveLog.push(cash.value);
  }
  canWithdraw(price: Price<number, CashCurrency>) {
    const descendingSupportCash = this.#supportCash
      .slice()
      .sort((a, b) => b.value - a.value);

    let change = price.value;
    const usingCash: Record<string, number> = {};

    while (0 < change) {
      const largestSubtractableCash = descendingSupportCash.find(
        (supportCash) => {
          const cashStock = this.#cashStock.get(
            this.#getCashSignature(supportCash),
          );
          const usingCashStock =
            usingCash[this.#getCashSignature(supportCash)] ?? 0;

          return (
            supportCash.value <= change &&
            cashStock &&
            usingCashStock < cashStock
          );
        },
      );

      if (largestSubtractableCash) {
        change -= largestSubtractableCash.value;
        usingCash[this.#getCashSignature(largestSubtractableCash)] =
          (usingCash[this.#getCashSignature(largestSubtractableCash)] ?? 0) + 1;
      } else {
        return false;
      }
    }

    return change === 0;
  }
  *withdraw(price: Price<number, CashCurrency>): Generator<Cash> {
    let change = price.value;

    // 사용자가 입력한 종류의 현금으로 우선적 반환
    const latestInputCash = this.#saveLog.at(-1);
    while (latestInputCash) {
      const latestInputCashStock = this.#cashStock.get(
        this.#getCashSignature(latestInputCash),
      );
      if (latestInputCashStock && latestInputCash.value <= change) {
        change -= latestInputCash.value;
        this.#saveLog.pop();

        yield {
          kind: "cash",
          value: { ...latestInputCash },
        } as Cash;
      } else {
        break;
      }
    }

    // 나머지 현금을 금고에서 반환
    while (0 < change) {
      const descendingSupportCash = this.#supportCash
        .slice()
        .sort((a, b) => b.value - a.value);
      const largestSubtractableCash = descendingSupportCash.find(
        (supportCash) => {
          const cashStock = this.#cashStock.get(
            this.#getCashSignature(supportCash),
          );

          return supportCash.value <= change && cashStock;
        },
      );

      if (largestSubtractableCash) {
        change -= largestSubtractableCash.value;

        yield {
          kind: "cash",
          value: { ...largestSubtractableCash },
        } as Cash;
      } else {
        throw new Error("현금 재고가 부족합니다");
      }
    }
  }

  #getCashSignature(cash: Cash["value"]) {
    return `${cash.kind}-${cash.value}-${cash.currency}`;
  }
}
