export type CashKind = "coin" | "paper";
export type CashCurrency = "원";
export type Mint<
  K extends CashKind,
  V extends number,
  C extends CashCurrency,
> = {
  kind: "cash";
  value: {
    kind: K;
    value: V;
    currency: C;
  };
};

export type Coin = Mint<"coin", 100 | 500, "원">;
export type Paper = Mint<"paper", 1000 | 5000 | 10000, "원">;
export type Cash = Coin | Paper;

export type CardKind = "credit" | "debit";
export interface Card {
  kind: "card";
  value: {
    kind: CardKind;
    expiration: string;
  };
}

export type Payment = Cash | Card;
export type PaymentKind = Card["kind"] | Cash["value"]["kind"];
