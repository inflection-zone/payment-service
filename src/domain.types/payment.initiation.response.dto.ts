import { Payment } from "../database/models/payment.model";
import { PaymentStatus } from "./payment.status.enum";
export class PaymentInitiationResponseDto {
    paymentId: string;
    transactionId?: string;
    status?: PaymentStatus|string;
  }