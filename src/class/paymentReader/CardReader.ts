import { Card, CashCurrency } from "../../types/payment";
import { PaymentReader } from "../../types/paymentReader";
import { Price } from "../../types/product";
import autoBind from "auto-bind";

export class CardReader implements PaymentReader {
  #card: Card | null = null;

  constructor() {
    autoBind(this);
  }

  input(card: Card) {
    this.remove();
    this.#card = card;
  }
  remove() {
    this.#card = null;
  }
  read() {
    return this.#isValidCard;
  }
  pay(_price: Price<number, CashCurrency>) {
    return this.#tryPay(_price);
  }

  get #isValidCard() {
    //NOTE - 카드사와 통신하여 카드가 유효한지 확인한다고 가정
    if (this.#card) {
      return true;
    } else {
      return false;
    }
  }
  #tryPay(_price: Price<number, CashCurrency>) {
    //NOTE - 카드사와 통신하여 결제를 진행한다고 가정
    if (this.#card) {
      return true;
    } else {
      return false;
    }
  }
}
