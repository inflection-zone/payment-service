import { PaymentStatus } from "./payment.status.enum";
export class PaymentGatewayResponseDto {
    paymentId: string;
    transactionId?: string;
    status: PaymentStatus;
  }