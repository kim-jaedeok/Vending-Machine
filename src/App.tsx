import { CashVault } from "./class/CashVault";
import { ChangeIndicator } from "./class/ChangeIndicator";
import { ProductVault } from "./class/ProductVault";
import { CardReader } from "./class/paymentReader/CardReader";
import { CoinReader } from "./class/paymentReader/CoinReader";
import { PaperReader } from "./class/paymentReader/PaperReader";
import { useVendingMachine } from "./hook/useVendingMachine";
import { Card } from "./types/payment";
import classNames from "classnames";
import { useState } from "react";

function App() {
  const vendingMachine = useVendingMachine({
    productVault: new ProductVault([
      { name: "콜라", price: { value: 1100, currency: "원" }, stock: 1 },
      { name: "물", price: { value: 600, currency: "원" }, stock: 10 },
      { name: "커피", price: { value: 700, currency: "원" }, stock: 5 },
    ]),
    paymentReader: {
      card: new CardReader(),
      coin: new CoinReader([
        { value: 100, currency: "원" },
        { value: 500, currency: "원" },
      ]),
      paper: new PaperReader([
        { value: 1000, currency: "원" },
        { value: 5000, currency: "원" },
        { value: 10000, currency: "원" },
      ]),
    },
    changeIndicator: new ChangeIndicator(0, "원"),
    cashVault: new CashVault(
      [
        {
          kind: "coin",
          value: 100,
          currency: "원",
          stock: 10,
        },
        {
          kind: "coin",
          value: 500,
          currency: "원",
          stock: 10,
        },
        {
          kind: "paper",
          value: 1000,
          currency: "원",
          stock: 10,
        },
        {
          kind: "paper",
          value: 5000,
          currency: "원",
          stock: 10,
        },
        {
          kind: "paper",
          value: 10000,
          currency: "원",
          stock: 10,
        },
      ],
      100,
    ),
  });
  const [actionLog] = useState<string[]>([]);

  return (
    <div className="flex flex-col items-center p-4">
      <h1>Vending Machine</h1>

      <div className="flex justify-around gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <section>
            <h3>판매 품목</h3>
            <ul className="flex gap-4">
              {vendingMachine.salesItems.map(
                ({ name, price, sellable, sell }) => (
                  <li key={name}>
                    <div>{name}</div>
                    <div>{price}</div>
                    <div>{sellable ? "구매 가능" : "구매 불가능"}</div>
                    <button disabled={!sellable} onClick={sell}>
                      구매
                    </button>
                  </li>
                ),
              )}
            </ul>
          </section>

          <div className="flex flex-col gap-1">
            <section>
              <h3>카드 입력기</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    const card: Card = {
                      kind: "card",
                      value: {
                        kind: "credit",
                        expiration: {
                          from: new Date("2/1/22"),
                          to: new Date("2/1/28"),
                        },
                      },
                    };
                    vendingMachine.inputPayment(card);
                  }}
                >
                  카드 입력
                </button>
                <button
                  onClick={() => {
                    vendingMachine.removePayment("card");
                  }}
                >
                  카드 제거
                </button>
              </div>
            </section>
            <section>
              <h3>현금 입력기</h3>
              <ul className="flex gap-1">
                {[
                  {
                    kind: "cash",
                    value: { kind: "coin", value: 10, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "coin", value: 100, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "coin", value: 500, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "paper", value: 1000, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "paper", value: 5000, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "paper", value: 10000, currency: "원" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "coin", value: 50, currency: "¢" },
                  },
                  {
                    kind: "cash",
                    value: { kind: "paper", value: 1, currency: "$" },
                  },
                ].map((money, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        vendingMachine.inputPayment({
                          ...money,
                          value: { ...money.value },
                        });
                      }}
                    >{`${money.value.value}${money.value.currency}`}</button>
                  </li>
                ))}
              </ul>
            </section>
            <div>{`잔돈: ${vendingMachine.changeValue}`}</div>
            <button onClick={() => vendingMachine.removePayment("cash")}>
              잔돈 반환
            </button>
            <section>
              <h3>동전 반환함</h3>
              <ul>
                {vendingMachine.changeStorage.coin.map((change, index) => (
                  <li key={index}>
                    <button
                      onClick={change.remove}
                    >{`${change.cash.value.value}${change.cash.value.currency}`}</button>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3>지폐 반환함</h3>
              <ul>
                {vendingMachine.changeStorage.paper.map((change, index) => (
                  <li key={index}>
                    <button
                      onClick={change.remove}
                    >{`${change.cash.value.value}${change.cash.value.currency}`}</button>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div>구매품 보관함</div>
        </div>

        <section className="flex flex-col w-full">
          <h2>Action Log</h2>
          <ul
            className={classNames("flex flex-col gap-1 grow", "overflow-auto")}
          >
            {actionLog.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
