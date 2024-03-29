import Razorpay from 'razorpay';
import { Payment } from '../../models/payment.model';
import { PaymentGatewayResponseDto } from '../../../domain.types/payment/payment.gateway.response.dto';
import { IPaymentGatewayService } from '../../../domain.types/payment/payment.gateway.interface';
import { PaymentType } from '../../../domain.types/payment/payment.type.enum';
import { PaymentStatus } from '../../../domain.types/payment/payment.status.enum';

///////////////////////////////////////////////////////////////////////////////////////

export class RazorpayService implements IPaymentGatewayService {
    private razorpay: Razorpay;
  
    constructor() {
      this.razorpay = new Razorpay({
        key_id: 'your_key_id',
        key_secret: 'your_key_secret',
      });
    }

  
    async processPayment(
      payment: Payment,
      paymentType: PaymentType,
      amount: number,
      
    ): Promise<PaymentGatewayResponseDto> {
   
      const orderOptions = {
        amount: amount * 100, 
        currency: 'INR', 
        receipt: payment.id.toString(), // Unique receipt ID
      };
      const order = await this.createRazorpayOrder({orderOptions});

    if (!order||!order.id) {
      throw new Error('Failed to create Razorpay order.');
    }
    
      try {
        const response = await this.razorpay.payments.fetch(order.id);

        if (response && response.status === 'authorized') {
          const captureResponse = await this.razorpay.payments.capture( order.id ,
            amount * 100, 
            'INR',
            );

          if (captureResponse && captureResponse.status === 'captured') {
            return {
              PaymentId: payment.id,
              TransactionId: captureResponse.id,
              Status: PaymentStatus.SUCCESS,
            };
          }
        }
    
        return {
          PaymentId: payment.id,
          TransactionId: response.id,
          Status: PaymentStatus.FAILED,
        } as PaymentGatewayResponseDto;//update
      }
    
      
      catch (error) {
        console.error('Razorpay payment error:', error);
        throw new Error('Razorpay payment failed.');
      }
      
   
    }
  
    private createRazorpayOrder(orderOptions:any): Promise<any> {
      return new Promise((resolve, reject) => {
        this.razorpay.orders.create( orderOptions, (error,order) => {
          if (error) {
            reject(error);
          } else {
            resolve(order);
          }
        });
      });
    }
  }

