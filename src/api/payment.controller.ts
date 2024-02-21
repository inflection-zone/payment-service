// src/controllers/PaymentController.ts
import { Request, Response } from 'express';
// import { PaymentService } from '../services/PaymentService';
 import { PaymentService } from 'database/service/payment.service';
 import { RazorpayService } from 'database/service/irazorpay.service';
 import { StripeService } from 'database/service/istripe.service';
 import { Order } from 'database/models/order.model';
import { Repository } from 'typeorm';
import { PaymentInitiationRequestDto } from 'domain.types/payment.initiation.request.dto';
import { PaymentInitiationResponseDto } from 'domain.types/payment.initiation.response.dto';
PaymentInitiationResponseDto
import { PaymentGatewayResponseDto } from 'domain.types/payment.gateway.response.dto';
import { Payment } from 'database/models/payment.model';





export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  // Route to initiate a payment
  initiatePayment = async (req: Request, res: Response) => {
    try {
      const orderDetails: PaymentInitiationRequestDto = req.body;
      const paymentResult: PaymentInitiationResponseDto = await this.paymentService.initiatePayment(orderDetails);
      res.status(200).json(paymentResult);
    } catch (error) {
      console.error('Error initiating payment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };



  // Route to check payment status
  checkPaymentStatus = async (req: Request, res: Response) => {
    try {
      const paymentId: string = req.params.paymentId;
      const paymentStatus: string = await this.paymentService.paymentStatus(paymentId);
      res.status(200).json({ paymentId, status: paymentStatus });
    } catch (error) {
      console.error('Error getting payment status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  // Route to get payment details
  getPaymentDetails = async (req: Request, res: Response) => {
    try {
      const paymentId: string = req.params.paymentId;
      const paymentDetails: Payment = await this.paymentService.getPaymentDetails(paymentId);
      res.status(200).json(paymentDetails);
    } catch (error) {
      console.error('Error getting payment details:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


}
