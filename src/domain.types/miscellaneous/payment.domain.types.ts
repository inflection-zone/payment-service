export interface PaymentCreateModel {
  PaymentGatewayType: string;
  PaymentType       : string;
  OrderId           : string;
  Amount            : number;
  PaymentTimestamp  : Date;
  CreatedAt         : Date;
}
