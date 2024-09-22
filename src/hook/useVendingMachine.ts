import { VendingMachine, VendingMachineParams } from "../class/VendingMachine";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { useState } from "react";

export const useVendingMachine = (
  VendingMachineParams: VendingMachineParams,
): IVendingMachine => {
  const vendingMachine = useState(new VendingMachine(VendingMachineParams))[0];
  const captureVendingMachineSnapshot = (): Pick<
    IVendingMachine,
    "changeValue" | "salesItems"
  > => ({
    changeValue: vendingMachine.changeValue,
    salesItems: vendingMachine.salesItems,
  });
  const [vendingMachineSnapshot, setVendingMachineSnapshot] = useState(
    captureVendingMachineSnapshot(),
  );

  return {
    ...vendingMachineSnapshot,
    inputPayment: (payment) => {
      vendingMachine.inputPayment(payment);
      setVendingMachineSnapshot(captureVendingMachineSnapshot());
    },
  };
};
