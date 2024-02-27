import { PaymentStatus } from "./payment.status.enum";
export class PaymentGatewayResponseDto {
    PaymentId     : string;
    TransactionId?: string;
    Status        : PaymentStatus;
  }