
import Stripe from 'stripe';
import { Payment } from '../models/payment.model';

import { PaymentGatewayResponseDto } from '../../domain.types/payment.gateway.response.dto';
import { PaymentGatewayType } from '../../domain.types/payment.gateway.type.enum';
import { PaymentType } from '../../domain.types/payment.type.enum';
import { PaymentStatus } from '../../domain.types/payment.status.enum';
import { PaymentGatewayService } from '../../domain.types/payment.gateway.interface';
export class StripeService implements PaymentGatewayService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe('your_stripe_secret_key', {
      apiVersion: '2023-10-16',
    });
  }
  private mapPaymentTypeToStripe(paymentType: PaymentType): string []{
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
        payment_method_types:stripePaymentMethodTypes
      });

      if (response && response.id) {
        return {
          paymentId: payment.id,
          transactionId: response.id,
          status: PaymentStatus.CAPTURED,
        };
      }

    } catch (error) {
      console.error('Stripe error:', error);
      return {
        paymentId: payment.id,
        transactionId: null,
        status: PaymentStatus.FAILED,
      };
    }
  }

}