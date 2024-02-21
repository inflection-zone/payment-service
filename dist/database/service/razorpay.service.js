"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayService = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const payment_status_enum_1 = require("../../domain.types/payment.status.enum");
class RazorpayService {
    constructor() {
        this.razorpay = new razorpay_1.default({
            key_id: 'your_key_id',
            key_secret: 'your_key_secret',
        });
    }
    processPayment(payment, paymentType, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process payment and get the response
            const orderOptions = {
                amount: amount * 100,
                currency: 'INR',
                receipt: payment.id.toString(), // Unique receipt ID
            };
            const order = yield this.createRazorpayOrder({ orderOptions });
            if (!order || !order.id) {
                throw new Error('Failed to create Razorpay order.');
            }
            try {
                const response = yield this.razorpay.payments.fetch(order.id);
                if (response && response.status === 'authorized') {
                    const captureResponse = yield this.razorpay.payments.capture(order.id, amount * 100, 'INR');
                    if (captureResponse && captureResponse.status === 'captured') {
                        return {
                            paymentId: payment.id,
                            transactionId: captureResponse.id,
                            status: payment_status_enum_1.PaymentStatus.SUCCESS,
                        };
                    }
                }
                return {
                    paymentId: payment.id,
                    transactionId: response.id,
                    status: payment_status_enum_1.PaymentStatus.FAILED,
                };
            }
            catch (error) {
                console.error('Razorpay payment error:', error);
                throw new Error('Razorpay payment failed.');
            }
        });
    }
    createRazorpayOrder(orderOptions) {
        return new Promise((resolve, reject) => {
            this.razorpay.orders.create(orderOptions, (error, order) => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(order);
                }
            });
        });
    }
}
exports.RazorpayService = RazorpayService;
// export class RazorpayService implements PaymentGatewayService {
//   private razorpay: Razorpay;
//   constructor() {
//     this.razorpay = new Razorpay({
//       key_id: 'your_key_id',
//       key_secret: 'your_key_secret',
//     });
//   }
//   async processPayment(
//     payment: Payment,
//     paymentType: PaymentType,
//     amount: number,
//   ): Promise<PaymentGatewayResponseDto> {
//     // Implement Razorpay SDK for integration
//     // ...
//     // Process payment and get the response
//     const response = await this.razorpay.orders.pay(order.id, { amount });
//     // Update the payment status and transactionId
//     return {
//       paymentId: payment.id,
//       transactionId: response.id,
//       status: response.status === 'paid' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
//     };
//   }
// }
// const orderOptions = {
//     amount: amount * 100, // Razorpay expects amount in paise
//     currency: 'INR', // Adjust currency accordingly
//     receipt: payment.id.toString(), // Unique receipt ID
//   };
//import { Injectable } from '@nestjs/common';
//import Razorpay from 'razorpay';
// import { PaymentGatewayResponseDto } from '../dtos/payment-gateway-response.dto';
// import { PaymentGatewayType } from '../enums/payment-gateway-type.enum';
// import { PaymentType } from '../enums/payment-type.enum';
// import { PaymentStatus } from '../enums/payment-status.enum';
