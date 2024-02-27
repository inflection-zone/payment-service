import { PaymentInitiationRequestDto } from "../../domain.types/payment/payment.initiation.request.dto";
import { PaymentGatewayResponseDto } from "../../domain.types/payment/payment.gateway.response.dto";
import { PaymentInitiationResponseDto } from "../../domain.types/payment/payment.initiation.response.dto";
import { Payment } from "../models/payment.model";
import { Order } from "../models/order.model";
import { Repository } from "typeorm";
import { PaymentGatewayType } from "../../domain.types/payment/payment.gateway.type.enum";
import { PaymentStatus } from "../../domain.types/payment/payment.status.enum";
import { PaymentType } from "../../domain.types/payment/payment.type.enum";
import { RazorpayService } from "./irazorpay.service";
import { PaymentGatewayService } from "../../domain.types/payment/payment.gateway.interface";
import { StripeService } from "./istripe.service";

export class PaymentService {
  private gatewayServices: Map<PaymentGatewayType, PaymentGatewayService>;
  constructor(
    private orderRepository: Repository<Order>,
    private razorpayService: RazorpayService,
    private stripeService: StripeService
  ) {
    this.gatewayServices = new Map<PaymentGatewayType, PaymentGatewayService>()
      .set(PaymentGatewayType.RAZORPAY, this.razorpayService)
      .set(PaymentGatewayType.STRIPE, this.stripeService);
  }

  async initiatePayment(
    orderDetails: PaymentInitiationRequestDto
  ): Promise<PaymentInitiationResponseDto> {
    const order = await this.orderRepository.findOne({
      where: { id: orderDetails.OrderId },
      relations: ["user"],
    });

    if (!order) {
      throw new Error("Order not found.");
    }

    const payment = new Payment();
    payment.id = orderDetails.OrderId;
    payment.PaymentGatewayType = orderDetails.PaymentGatewayType;
    payment.PaymentType = orderDetails.PaymentType;
    payment.Amount = orderDetails.Amount;
    payment.Order = order;
    payment.PaymentStatus = PaymentStatus.INITIATED;
    const createdPayment = await this.orderRepository.save(payment);
    const paymentGatewayService = this.gatewayServices.get(
      orderDetails.PaymentGatewayType as PaymentGatewayType
    );

    if (!paymentGatewayService) {
      throw new Error("Invalid payment gateway type.");
    }
    const paymentGatewayResponse = await paymentGatewayService.processPayment(
      createdPayment,
      orderDetails.PaymentType,
      orderDetails.Amount,
      orderDetails.PaymentGatewayType
    );
    createdPayment.TransactionId =
      paymentGatewayResponse?.TransactionId || null;
    createdPayment.PaymentStatus = paymentGatewayResponse?.Status || null;
    await this.orderRepository.save(createdPayment);
    if (paymentGatewayResponse.Status === PaymentStatus.SUCCESS) {
      await this.onPaymentSuccess(createdPayment);
    } else {
      await this.onPaymentFailure(createdPayment);
    }
    return {
      PaymentId: createdPayment.id,
      Status: createdPayment.PaymentStatus,
      TransactionId: createdPayment.TransactionId,
    };
  }

  async paymentStatus(paymentId: string): Promise<string> {
    const payment = await this.orderRepository.findOne({
      where: { id: paymentId },
      relations: ["payment"],
    });
    if (!payment || !payment.Payment) {
      throw new Error(
        `Payment with ID ${paymentId} not found or payment not initialized.`
      );
    }
    return payment.Payment.PaymentStatus;
  }

  async getPaymentDetails(paymentId: string): Promise<Payment> {
    const payment = await this.orderRepository.findOne({
      where: { id: paymentId },
      relations: ["payment"],
    });

    if (!payment || !payment.Payment) {
      throw new Error(
        `Payment with ID ${paymentId} not found or payment not initialized.`
      );
    }
    return payment.Payment;
  }

  async processPayment(
    orderId: string,
    paymentGatewayResponse: PaymentGatewayResponseDto
  ): Promise<void> {
    let payment;
    try {
      payment = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ["payment"],
      });

      if (!payment || !payment.payment) {
        throw new Error(
          `Order with ID ${orderId} not found or payment not initialized.`
        );
      }
      const paymentGatewayService = this.gatewayServices.get(
        payment.payment.paymentGatewayType as PaymentGatewayType
      );

      if (!paymentGatewayService) {
        throw new Error("Invalid payment gateway type.");
      }

      await paymentGatewayService.processPayment(
        payment.payment,
        payment.payment.paymentType as PaymentType,
        payment.payment.amount,
        payment.payment.paymentGatewayType as PaymentGatewayType
      );
      payment.payment.paymentStatus = PaymentStatus.SUCCESS;
      await this.orderRepository.save(payment);
    } catch (error) {
      console.error(error);
      payment.payment.paymentStatus = PaymentStatus.FAILED;
      await this.orderRepository.save(payment);
    }
  }

  async handlePaymentGatewayResponse(
    paymentGatewayResponse: PaymentGatewayResponseDto
  ): Promise<void> {
    const payment = await this.orderRepository.findOne({
      where: { id: paymentGatewayResponse.PaymentId },
      relations: ["order"],
    });

    if (payment instanceof Payment) {
      payment.TransactionId = paymentGatewayResponse.TransactionId;
      payment.PaymentStatus = paymentGatewayResponse.Status;
      payment.PaymentTimestamp = new Date();

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
