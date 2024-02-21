"use strict";
// import { PaymentService } from './payment.service';
// import { RazorpayService } from './razorpay.service';
// import { StripeService } from './stripe.service';
// import { PaymentGatewayType } from 'domain.types/payment.gateway.type.enum';
// import { Repository } from 'typeorm';
// import { PaymentType } from 'domain.types/payment.type.enum';
// import { PaymentStatus } from 'domain.types/payment.status.enum';
// import { Payment } from 'database/models/payment.model';
// import { Order } from 'database/models/order.model';
// jest.mock('./razorpay.service');
// jest.mock('./stripe.service');
// describe('PaymentService', () => {
//   let paymentService: PaymentService;
//   beforeEach(() => {
//     paymentService = new PaymentService(
//       new Repository<Order>(),
//       new RazorpayService(),
//       new StripeService(),
//     );
//   });
//   describe('initiatePayment', () => {
//     it('should initiate a payment and save it to the database', async () => {
//       const orderDetails = {
//         orderId: '123',
//         paymentGatewayType: PaymentGatewayType.RAZORPAY,
//         paymentType: PaymentType.CREDIT_CARD,
//         amount: 1000,
//       };
//       const paymentResponse = {
//         paymentId: '123',
//         status: PaymentStatus.SUCCESS,
//         transactionId: 'abcdefg',
//       };
//       const mockRazorpayService = new RazorpayService() as jest.Mocked<RazorpayService>;
//       mockRazorpayService.processPayment.mockResolvedValue(paymentResponse);
//       const savedPayment = await paymentService.initiatePayment(orderDetails);
//       expect(savedPayment).toEqual(paymentResponse);
//       expect(mockRazorpayService.processPayment).toHaveBeenCalledWith(
//         expect.any(Payment),
//         PaymentType.CREDIT_CARD,
//         1000,
//         PaymentGatewayType.RAZORPAY,
//       );
//     });
//   });
//   // Add more tests for other methods in the PaymentService class here.
// });
