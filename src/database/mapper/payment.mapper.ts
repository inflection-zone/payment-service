import { PaymentCreateModel } from 'domain.types/miscellaneous/payment.domain.types';
import { PaymentInitiationResponseDto } from 'domain.types/payment/payment.initiation.response.dto';
import { Order } from 'database/models/order.model';
import { Payment } from 'database/models/payment.model';

export class PaymentMapper {

        static toCreateModel(payment: Payment): PaymentCreateModel {
            if (payment == null) {
                return null;
            }
            const model: PaymentCreateModel = {
                PaymentGatewayType: payment.PaymentGatewayType,
                PaymentType       : payment.PaymentType,
                OrderId           : payment.Order ? payment.Order.id : null,
                Amount            : payment.Amount,
                PaymentTimestamp  : payment.PaymentTimestamp,
                CreatedAt         : payment.CreatedAt,
            };
            return model;
        }
    
        static toInitiationResponseDto(payment: Payment): PaymentInitiationResponseDto {
            if (payment == null) {
                return null;
            }
            const dto: PaymentInitiationResponseDto = {
                PaymentId      : payment.id,
                TransactionId  : payment.TransactionId,
                Status         : payment.PaymentStatus,
            };
            return dto;
        }
    }

