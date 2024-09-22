export interface PaymentReader {
  /**
   * @param payment 사용자가 입력한 결제 수단
   * @returns 결제 수단이 유효하면 true, 그렇지 않으면 false
   */
  read: (payment?: any) => boolean;
}
