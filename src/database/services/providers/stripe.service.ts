
import Stripe from 'stripe';
import { Payment } from '../../models/payment.model';
import { PaymentGatewayResponseDto } from '../../../domain.types/payment/payment.gateway.response.dto';
import { PaymentGatewayType } from '../../../domain.types/payment/payment.gateway.type.enum';
import { PaymentType } from '../../../domain.types/payment/payment.type.enum';
import { PaymentStatus } from '../../../domain.types/payment/payment.status.enum';
import { IPaymentGatewayService } from '../../../domain.types/payment/payment.gateway.interface';

///////////////////////////////////////////////////////////////////////////////////////

export class StripeService implements IPaymentGatewayService {

  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('your_stripe_secret_key', {
      apiVersion: '2023-10-16',
    });
  }

  private mapPaymentTypeToStripe(paymentType: PaymentType): string[] {
    return [PaymentType[paymentType].toLowerCase() + '_stripe_method'];
  }


  async processPayment(
    payment: Payment,
    paymentType: PaymentType,
    amount: number,
    //paymentMethodTypes: string[] = PaymentType,
  ): Promise<PaymentGatewayResponseDto> {
    // Implement Stripe SDK for integration
    const stripePaymentMethodTypes = this.mapPaymentTypeToStripe(paymentType);

    try {
      const response = await this.stripe.paymentIntents.create({
        amount,
        currency: 'INR',
        payment_method_types: stripePaymentMethodTypes
      });

      if (response && response.id) {
        return {
          PaymentId: payment.id,
          TransactionId: response.id,
          Status: PaymentStatus.CAPTURED,
        };
      }

    } catch (error) {
      console.error('Stripe error:', error);
      return {
        PaymentId: payment.id,
        TransactionId: null,
        Status: PaymentStatus.FAILED,
      };
    }
  }

}