import { PaymentInitiationRequestDto } from '../../domain.types/payment.initiation.request.dto';
import { PaymentGatewayResponseDto } from '../../domain.types/payment.gateway.response.dto';
import { PaymentInitiationResponseDto } from '../../domain.types/payment.initiation.response.dto';
import { Payment } from '../models/payment.model';
import { Order } from '../models/order.model';
import { Repository } from 'typeorm';
import { PaymentGatewayType } from '../../domain.types/payment.gateway.type.enum';
import { PaymentStatus } from '../../domain.types/payment.status.enum';
import { PaymentType } from '../../domain.types/payment.type.enum';
import { RazorpayService } from './irazorpay.service';
import { PaymentGatewayService } from '../../domain.types/payment.gateway.interface';
import { StripeService } from './istripe.service';

export class PaymentService {
  private gatewayServices: Map<
    PaymentGatewayType,
    PaymentGatewayService
  >;
  // GatewaySerivce = mapping between payment gateway types and payment gateway services
  
  constructor(
    private orderRepository:  Repository<Order>,
    private razorpayService: RazorpayService,
    private stripeService: StripeService,
  ) {
    //this.orderRepository = orderRepository;//updated
    this.gatewayServices = new Map<PaymentGatewayType, PaymentGatewayService>()
      .set(PaymentGatewayType.RAZORPAY, this.razorpayService)
      .set(PaymentGatewayType.STRIPE, this.stripeService);
  }

//orderRepository is used to save the payment information to db
async initiatePayment(
  orderDetails: PaymentInitiationRequestDto,
): Promise<PaymentInitiationResponseDto> {
  const order = await this.orderRepository.findOne({
    where: { id: orderDetails.orderId},
    relations: ['user'],
  });

  if (!order) {
    throw new Error('Order not found.');
  }

  const payment = new Payment();
  payment.id = orderDetails.orderId;
  payment.paymentGatewayType = orderDetails.paymentGatewayType;
  payment.paymentType = orderDetails.paymentType;
  payment.amount = orderDetails.amount;
  payment.order = order;
  payment.paymentStatus = PaymentStatus.INITIATED;

  const createdPayment = await this.orderRepository.save(payment);
  // retrieves the specific GatewayService instance based on the paymentGatewayType specified in the order details.
  const paymentGatewayService = this.gatewayServices.get(
    orderDetails.paymentGatewayType as PaymentGatewayType ,// as update
  );

  if (!paymentGatewayService) {
    throw new Error('Invalid payment gateway type.');
  }
 
  
  const paymentGatewayResponse = await paymentGatewayService.processPayment(
    createdPayment,
    orderDetails.paymentType,
    orderDetails.amount,
    orderDetails.paymentGatewayType,
   
  );
//The response from the payment gateway is stored in the paymentGatewayResponse variable.

// update transactionId and PaymentStatus which is obtain feom gateway response
  createdPayment.transactionId =
    paymentGatewayResponse?.transactionId || null;
  createdPayment.paymentStatus = paymentGatewayResponse?.status || null;
// updated payment info save in db
  await this.orderRepository.save(createdPayment);

  if (paymentGatewayResponse.status === PaymentStatus.SUCCESS) {
    await this.onPaymentSuccess(createdPayment);
  } else {
    await this.onPaymentFailure(createdPayment);
  }
//return id status transactionid
  return {
    paymentId: createdPayment.id,
    status: createdPayment.paymentStatus,
    transactionId: createdPayment.transactionId,
  };
}

async paymentStatus(paymentId: string): Promise<string> {
  const payment = await this.orderRepository.findOne({
    where: { id: paymentId },
    relations: ['payment'],
  });

  if (!payment || !payment.payment) {
    throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
  }

  return payment.payment.paymentStatus;
}

async getPaymentDetails(paymentId: string): Promise<Payment> {
  const payment = await this.orderRepository.findOne({
    where: { id: paymentId },
    relations: ['payment'],
  });

  if (!payment || !payment.payment) {
    throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
  }

  return payment.payment;
}


async processPayment(orderId: string, paymentGatewayResponse: PaymentGatewayResponseDto): Promise<void> {
  try {
    const payment = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['payment'],
    });

    if (!payment || !payment.payment) {
      throw new Error(`Order with ID ${orderId} not found or payment not initialized.`);
    }

    const paymentGatewayService = this.gatewayServices.get(payment.payment.paymentGatewayType as PaymentGatewayType);

    if (!paymentGatewayService) {
      throw new Error('Invalid payment gateway type.');
    }

    await paymentGatewayService.processPayment(payment.payment, payment.payment.paymentType as PaymentType, payment.payment.amount,payment.payment.paymentGatewayType as PaymentGatewayType);

    // update the payment status in the database
    payment.payment.paymentStatus = PaymentStatus.SUCCESS;
    await this.orderRepository.save(payment);
  } catch (error) {
    // handle any errors that may occur during the payment process
    console.error(error);
    // update the payment status in the database
    Payment.payment.paymentStatus = PaymentStatus.FAILED;
    await this.orderRepository.save(Payment);
  }
}




// retrives payment from db based on payId updates transctn details status
//handle the payment gateway response when a payment gateway sends a response to the servej
  async handlePaymentGatewayResponse(
    paymentGatewayResponse: PaymentGatewayResponseDto,
  ): Promise<void> {
    const payment = await this.orderRepository.findOne({
     where :{ id: paymentGatewayResponse.paymentId },
       relations: ['order'] 
     } )

    if (payment instanceof Payment) {
      payment.transactionId = paymentGatewayResponse.transactionId;
      payment.paymentStatus = paymentGatewayResponse.status;
      payment.paymentTimestamp = new Date();

      await this.orderRepository.save(payment);
    }
  }

  async onPaymentSuccess(payment: Payment): Promise<void> {
    console.log(`Payment ${payment.id} succeeded.`);
  
  }

  async onPaymentFailure(payment: Payment): Promise<void> {
    console.log(`Payment ${payment.id} failed.`);
    
  }

}









