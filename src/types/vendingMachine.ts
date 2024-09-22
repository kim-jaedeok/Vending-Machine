export interface VendingMachine {
  salesItems: { name: string; price: string; sellable: boolean }[];
  changeValue: string;
}
