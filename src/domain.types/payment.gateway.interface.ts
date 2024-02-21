import { Payment } from "../database/models/payment.model";
import { PaymentType } from "./payment.type.enum";
import { PaymentGatewayResponseDto } from "./payment.gateway.response.dto";
import { PaymentGatewayType } from "./payment.gateway.type.enum";
export interface PaymentGatewayService {
    processPayment(
      payment: Payment,
      paymentType: PaymentType,
      amount: number,
      //udpate
      paymentGatewayType : PaymentGatewayType
    ): Promise<PaymentGatewayResponseDto>;
  }