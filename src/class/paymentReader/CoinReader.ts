import { Coin } from "../../types/payment";
import { PaymentReader } from "../../types/paymentReader";
import autoBind from "auto-bind";

export class CoinReader implements PaymentReader {
  #supportCoins;

  constructor(supportCoins: { value: number; currency: string }[]) {
    autoBind(this);
    this.#supportCoins = supportCoins;
  }

  read(coin: Coin) {
    if (
      this.#isValidCoin(coin) &&
      this.#supportCoins.some(
        (supportCoin) =>
          supportCoin.value === coin.value.value &&
          supportCoin.currency === coin.value.currency,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  #isValidCoin(coin: Coin) {
    //NOTE - 동전인지 확인한다고 가정
    if (coin) {
      return true;
    } else {
      return false;
    }
  }
}
