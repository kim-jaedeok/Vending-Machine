import { CashCurrency } from "./payment";

export type Price<V extends number, C extends CashCurrency> = {
  value: V;
  currency: C;
};
export type Produce<N extends string, P extends Price<number, CashCurrency>> = {
  name: N;
  price: P;
};

export type Coke = Produce<"콜라", Price<1100, "원">>;
export type Water = Produce<"물", Price<600, "원">>;
export type Coffee = Produce<"커피", Price<700, "원">>;
export type Product = Coke | Water | Coffee;
