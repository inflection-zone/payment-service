import express, { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { getRepository } from 'typeorm';
import { Order } from 'database/models/order.model';
import { RazorpayService } from '../database/service/providers/razorpay.service';
import { StripeService } from '../database/service/providers/stripe.service';
import { PaymentController } from './payment.controller';

export const register = (app: express.Application) => {

  const PaymentRouter = express.Router();
  const orderRepository: Repository<Order> = getRepository(Order);
  const razorpayService = new RazorpayService();
  const stripeService = new StripeService();
  const controller = new PaymentController(orderRepository, razorpayService, stripeService);

  PaymentRouter.post('/initiate-payment', controller.initiatePayment);
  PaymentRouter.get('/payment-status/:paymentId', controller.checkPaymentStatus);

  app.use('/api/v5/payment', PaymentRouter);
};

