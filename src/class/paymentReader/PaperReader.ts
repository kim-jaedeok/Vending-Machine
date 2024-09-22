import { Paper } from "../../types/payment";
import { PaymentReader } from "../../types/paymentReader";
import autoBind from "auto-bind";

export class PaperReader implements PaymentReader {
  #supportPapers;

  constructor(supportPapers: { value: number; currency: string }[]) {
    autoBind(this);
    this.#supportPapers = supportPapers;
  }

  read(paper: Paper) {
    if (
      this.#isValidPaper(paper) &&
      this.#supportPapers.some(
        (supportPaper) =>
          supportPaper.value === paper.value.value &&
          supportPaper.currency === paper.value.currency,
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  #isValidPaper(paper: Paper) {
    //NOTE - 지폐인지 확인한다고 가정
    if (paper) {
      return true;
    } else {
      return false;
    }
  }
}
