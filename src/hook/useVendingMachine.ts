import { VendingMachine, VendingMachineParams } from "../class/VendingMachine";
import { VendingMachine as IVendingMachine } from "../types/vendingMachine";
import { useState } from "react";

export const useVendingMachine = (
  VendingMachineParams: VendingMachineParams,
) => {
  const vendingMachine = useState(new VendingMachine(VendingMachineParams))[0];
  const captureVendingMachineSnapshot = (): IVendingMachine => ({
    changeValue: vendingMachine.changeValue,
    salesItems: vendingMachine.salesItems,
  });
  const [vendingMachineSnapshot] = useState(captureVendingMachineSnapshot());

  return vendingMachineSnapshot;
};
