import { Card } from "../../types/payment";
import { PaymentReader } from "../../types/paymentReader";
import autoBind from "auto-bind";

export class CardReader implements PaymentReader {
  constructor() {
    autoBind(this);
  }

  read(card: Card) {
    if (this.#isValidCard(card)) {
      return true;
    } else {
      return false;
    }
  }

  #isValidCard(card: Card) {
    //NOTE - 카드사와 통신하여 카드가 유효한지 확인한다고 가정
    if (card) {
      return true;
    } else {
      return false;
    }
  }
}
