import { VendingMachine, VendingMachineParams } from "../class/VendingMachine";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { useState } from "react";

export const useVendingMachine = (
  VendingMachineParams: VendingMachineParams,
): IVendingMachine => {
  const vendingMachine = useState(new VendingMachine(VendingMachineParams))[0];
  const captureVendingMachineSnapshot = (): Pick<
    IVendingMachine,
    "changeValue" | "changeStorage" | "salesItems"
  > => ({
    changeValue: vendingMachine.changeValue,
    salesItems: vendingMachine.salesItems,
    changeStorage: vendingMachine.changeStorage,
  });
  const [vendingMachineSnapshot, setVendingMachineSnapshot] = useState(
    captureVendingMachineSnapshot(),
  );

  return {
    ...vendingMachineSnapshot,
    salesItems: vendingMachine.salesItems.map((item) => ({
      ...item,
      sell: () => {
        item.sell();
        setVendingMachineSnapshot(captureVendingMachineSnapshot());
      },
    })),
    changeStorage: {
      coin: vendingMachine.changeStorage.coin.map((change) => ({
        ...change,
        add: () => {
          change.add();
          setVendingMachineSnapshot(captureVendingMachineSnapshot());
        },
        remove: () => {
          change.remove();
          setVendingMachineSnapshot(captureVendingMachineSnapshot());
        },
      })),
      paper: vendingMachine.changeStorage.paper.map((change) => ({
        ...change,
        add: () => {
          change.add();
          setVendingMachineSnapshot(captureVendingMachineSnapshot());
        },
        remove: () => {
          change.remove();
          setVendingMachineSnapshot(captureVendingMachineSnapshot());
        },
      })),
    },
    inputPayment: (payment) => {
      vendingMachine.inputPayment(payment);
      setVendingMachineSnapshot(captureVendingMachineSnapshot());
    },
    removePayment: (payment) => {
      vendingMachine.removePayment(payment);
      setVendingMachineSnapshot(captureVendingMachineSnapshot());
    },
  };
};
