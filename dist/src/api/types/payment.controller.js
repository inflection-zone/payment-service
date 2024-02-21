"use strict";
// // src/controllers/PaymentController.ts
// import { Request, Response } from 'express';
// import { getRepository } from 'typeorm';
// import { Order } from '../entities/Order';
// import { Payment } from '../entities/Payment';
// export const initiatePayment = async (req: Request, res: Response) => {
//   try {
//     const orderRepository = getRepository(Order);
//     const paymentRepository = getRepository(Payment);
//     const { orderId, paymentMethod } = req.body;
//     const order = await orderRepository.findOne(orderId);
//     if (!order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }
//     const payment = new Payment();
//     payment.paymentGateway = 'YourPaymentGateway'; // Set actual payment gateway
//     payment.paymentMethod = paymentMethod;
//     payment.order = order;
//     payment.transactionId = 'YourTransactionId'; // Replace with actual transaction ID
//     payment.amount = order.amountToBePaid;
//     payment.paymentStatus = 'Pending'; // Set initial status
//     await paymentRepository.save(payment);
//     // Implement payment gateway integration logic
//     // (Send payment request to the selected payment gateway)
//     res.json({ message: 'Payment initiation successful', paymentId: payment.id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export const processPayment = async (req: Request, res: Response) => {
//   try {
//     // Implement payment processing logic
//     // (Handle response from payment gateway)
//     const paymentId = req.params.id;
//     const paymentRepository = getRepository(Payment);
//     const payment = await paymentRepository.findOne(paymentId);
//     if (!payment) {
//       return res.status(404).json({ error: 'Payment not found' });
//     }
//     // Update payment status based on the response from the payment gateway
//     payment.paymentStatus = 'Success'; // Update based on the actual response
//     await paymentRepository.save(payment);
//     // Send out payment details on success event
//     // (You can notify the order management service or communication service)
//     res.json({ message: 'Payment processed successfully', payment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// export const confirmPayment = async (req: Request, res: Response) => {
//   try {
//     // Implement payment confirmation logic
//     // (Handle response from payment gateway)
//     const paymentId = req.params.id;
//     const paymentRepository = getRepository(Payment);
//     const payment = await paymentRepository.findOne(paymentId);
//     if (!payment) {
//       return res.status(404).json({ error: 'Payment not found' });
//     }
//     // Update payment status based on the response from the payment gateway
//     payment.paymentStatus = 'Confirmed'; // Update based on the actual response
//     await paymentRepository.save(payment);
//     // Send out payment details on confirmation event
//     // (You can notify the order management service or communication service)
//     res.json({ message: 'Payment confirmed successfully', payment });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
