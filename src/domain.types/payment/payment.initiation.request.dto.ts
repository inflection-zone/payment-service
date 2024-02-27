// payment-initiation-request.dto.ts
import { Payment } from "../../database/models/payment.model";
import { PaymentGatewayType } from "./payment.gateway.type.enum";
import { PaymentType } from "./payment.type.enum";
export class PaymentInitiationRequestDto {
    OrderId            : string;
    PaymentGatewayType : PaymentGatewayType;
    PaymentType        : PaymentType;
    Amount             : number;
    
  }
  