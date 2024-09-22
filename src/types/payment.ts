export type CashKind = "coin" | "paper";
export type CashCurrency = "원";
export type Mint<
  K extends CashKind,
  V extends number,
  C extends CashCurrency,
> = {
  kind: K;
  value: V;
  currency: C;
};

export type Won =
  | Mint<"coin", 100 | 500, "원">
  | Mint<"paper", 1000 | 5000 | 10000, "원">;
export type Cash = Won;

export type CardKind = "credit" | "debit";
export interface Card {
  kind: CardKind;
  expiration: string;
}

export type Payment = Cash | Card;
