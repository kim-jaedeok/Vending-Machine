import { ChangeIndicator } from "./class/ChangeIndicator";
import { SalesItems } from "./class/SalesItems";
import { useVendingMachine } from "./hook/useVendingMachine";
import classNames from "classnames";
import { useState } from "react";

function App() {
  const vendingMachine = useVendingMachine({
    salesItems: new SalesItems([
      { name: "콜라", price: { value: 1100, currency: "원" }, stock: 0 },
      { name: "물", price: { value: 600, currency: "원" }, stock: 10 },
      { name: "커피", price: { value: 700, currency: "원" }, stock: 5 },
    ]),
    changeIndicator: new ChangeIndicator(0, "원"),
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
              {vendingMachine.salesItems.map(({ name, price, sellable }) => (
                <li key={name}>
                  <div>{name}</div>
                  <div>{price}</div>
                  <div>{sellable ? "구매 가능" : "구매 불가능"}</div>
                  <button disabled={!sellable}>구매</button>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col gap-1">
            <section>
              <div>카드 입력</div>
              <div></div>
            </section>
            <section>
              <div>현금 입력</div>
              <ul className="flex flex-col gap-1">
                {[10, 50, 100, 500, 1000, 5000, 10000].map((money) => (
                  <li key={money}>
                    <button>{`${money}원`}</button>
                  </li>
                ))}
              </ul>
            </section>
            <div>{`잔돈: ${vendingMachine.changeValue}`}</div>
            <button>잔돈 반환</button>
            <div>거스름돈 보관함</div>
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
