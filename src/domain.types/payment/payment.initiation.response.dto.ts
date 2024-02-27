import { Payment } from "../../database/models/payment.model";
import { PaymentStatus } from "./payment.status.enum";
export class PaymentInitiationResponseDto {
    PaymentId      : string;
    TransactionId? : string;
    Status?        : PaymentStatus|string;
  }