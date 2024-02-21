import express, { Request, Response } from 'express';
import { PaymentService } from 'database/service/payment.service';
import { Repository } from 'typeorm';
import { getRepository } from 'typeorm';
import { Order } from 'database/models/order.model';
import { RazorpayService } from 'database/service/irazorpay.service';
import { StripeService } from 'database/service/istripe.service';
import { PaymentController } from './payment.controller';
export const register = (app: express.Application) => {
  const PaymentRouter = express.Router();
const orderRepository: Repository<Order> = getRepository(Order);
const razorpayService = new RazorpayService();
const stripeService = new StripeService();
// Create an instance of PaymentService with the required dependencies
const paymentService = new PaymentService(orderRepository, razorpayService, stripeService);
  const controller = new PaymentController(paymentService);

  // Define route handlers
  PaymentRouter.post('/initiate-payment', controller.initiatePayment);
  PaymentRouter.get('/payment-status/:paymentId', controller.checkPaymentStatus);
  PaymentRouter.get('/payment-details/:paymentId', controller.getPaymentDetails);

  app.use('/api/v5/payment', PaymentRouter);
};

