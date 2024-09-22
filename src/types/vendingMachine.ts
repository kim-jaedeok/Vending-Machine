export interface VendingMachine {
  salesItems: { name: string; price: string; sellable: boolean }[];
  /**
   * 현재 남은 잔돈
   */
  changeValue: string;
  /**
   * @param payment 사용자가 입력한 결제 수단. 무엇이 입력되는 지 알 수 없어 any로 정의
   */
  inputPayment(payment: any): void;
}
