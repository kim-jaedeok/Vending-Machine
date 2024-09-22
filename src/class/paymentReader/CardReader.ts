import { Card } from "../../types/payment";
import { PaymentReader } from "../../types/paymentReader";
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
    if (this.#isValidCard) {
      return true;
    } else {
      return false;
    }
  }

  get #isValidCard() {
    //NOTE - 카드사와 통신하여 카드가 유효한지 확인한다고 가정
    if (this.#card) {
      return true;
    } else {
      return false;
    }
  }
}
