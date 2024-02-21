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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const payment_model_1 = require("../models/payment.model");
const payment_gateway_type_enum_1 = require("../../domain.types/payment.gateway.type.enum");
const payment_status_enum_1 = require("../../domain.types/payment.status.enum");
class PaymentService {
    constructor(orderRepository, razorpayService, 
    //private paypalService: PaypalService,
    stripeService) {
        this.orderRepository = orderRepository;
        this.razorpayService = razorpayService;
        this.stripeService = stripeService;
        this.gatewayServices = new Map()
            .set(payment_gateway_type_enum_1.PaymentGatewayType.RAZORPAY, this.razorpayService)
            //.set(PaymentGatewayType.PAYPAL, this.paypalService)
            .set(payment_gateway_type_enum_1.PaymentGatewayType.STRIPE, this.stripeService);
    }
    initiatePayment(orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOne({
                where: { id: orderDetails.orderId },
                relations: ['user'],
            });
            if (!order) {
                throw new Error('Order not found.');
            }
            const payment = new payment_model_1.Payment();
            payment.id = orderDetails.orderId;
            payment.paymentGatewayType = orderDetails.paymentGatewayType;
            payment.paymentType = orderDetails.paymentType;
            payment.amount = orderDetails.amount;
            payment.order = order;
            payment.paymentStatus = payment_status_enum_1.PaymentStatus.INITIATED;
            const createdPayment = yield this.orderRepository.save(payment);
            const paymentGatewayService = this.gatewayServices.get(orderDetails.paymentGatewayType);
            if (!paymentGatewayService) {
                throw new Error('Invalid payment gateway type.');
            }
            const paymentGatewayResponse = yield paymentGatewayService.processPayment(createdPayment, orderDetails.paymentType, orderDetails.amount);
            createdPayment.transactionId =
                (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.transactionId) || null;
            createdPayment.paymentStatus = (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.status) || null;
            yield this.orderRepository.save(createdPayment);
            if (paymentGatewayResponse.status === payment_status_enum_1.PaymentStatus.SUCCESS) {
                yield this.onPaymentSuccess(createdPayment);
            }
            else {
                yield this.onPaymentFailure(createdPayment);
            }
            return {
                paymentId: createdPayment.id,
                status: createdPayment.paymentStatus,
                transactionId: createdPayment.transactionId,
            };
        });
    }
    handlePaymentGatewayResponse(paymentGatewayResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentGatewayResponse.paymentId },
                relations: ['order']
            });
            if (payment instanceof payment_model_1.Payment) {
                payment.transactionId = paymentGatewayResponse.transactionId;
                payment.paymentStatus = paymentGatewayResponse.status;
                payment.paymentTimestamp = new Date();
                yield this.orderRepository.save(payment);
            }
        });
    }
    onPaymentSuccess(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Payment ${payment.id} succeeded.`);
        });
    }
    onPaymentFailure(payment) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Payment ${payment.id} failed.`);
        });
    }
}
exports.PaymentService = PaymentService;
//   async initiatePayment(
//     orderDetails: PaymentInitiationRequestDto,
//   ): Promise<PaymentInitiationResponseDto> {
//     const order = await this.orderRepository.findOne({
//       where: { id: orderDetails.orderId },
//       relations: ['user'],
//     });
//     if (!order) {
//       throw new Error('Order not found.');
//     }
//     const payment = this.orderRepository.create({
//       //orderId: orderDetails.orderId.toString(),
//       payment.paymentGatewayType: orderDetails.paymentGatewayType,
//       paymentType: orderDetails.paymentType,
//       amount: orderDetails.amount,
//       status: PaymentStatus.INITIATED,
//       order : order
//     });
//     payment.orderId = orderDetails.orderId.toString();
// payment.order = order;
//     const createdPayment = await this.orderRepository.save(payment as any);
//     const paymentGatewayService = this.gatewayServices.get(
//       orderDetails.paymentGatewayType,
//     );
//     if (!paymentGatewayService) {
//       throw new Error('Invalid payment gateway type.');
//     }
//     const paymentGatewayResponse = await paymentGatewayService.processPayment(
//       createdPayment,
//       orderDetails.paymentType,
//       orderDetails.amount,
//     );
//     createdPayment.transactionId =
//       paymentGatewayResponse?.transactionId || null;
//     createdPayment.status = paymentGatewayResponse?.status || null;
//     await this.orderRepository.save(createdPayment);
//     if (paymentGatewayResponse.status === PaymentStatus.SUCCESS) {
//       await this.onPaymentSuccess(createdPayment);
//     } else {
//       await this.onPaymentFailure(createdPayment);
//     }
//     return {
//       paymentId: createdPayment.id,
//       status: createdPayment.status,
//       transactionId: createdPayment.transactionId,
//     };
//   }
// Send payment success event to order management service or communication service
