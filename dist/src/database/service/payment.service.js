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
const payment_gateway_type_enum_1 = require("../../domain.types/payment/payment.gateway.type.enum");
const payment_status_enum_1 = require("../../domain.types/payment/payment.status.enum");
class PaymentService {
    constructor(orderRepository, razorpayService, stripeService) {
        this.orderRepository = orderRepository;
        this.razorpayService = razorpayService;
        this.stripeService = stripeService;
        this.gatewayServices = new Map()
            .set(payment_gateway_type_enum_1.PaymentGatewayType.RAZORPAY, this.razorpayService)
            .set(payment_gateway_type_enum_1.PaymentGatewayType.STRIPE, this.stripeService);
    }
    initiatePayment(orderDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOne({
                where: { id: orderDetails.OrderId },
                relations: ["user"],
            });
            if (!order) {
                throw new Error("Order not found.");
            }
            const payment = new payment_model_1.Payment();
            payment.id = orderDetails.OrderId;
            payment.PaymentGatewayType = orderDetails.PaymentGatewayType;
            payment.PaymentType = orderDetails.PaymentType;
            payment.Amount = orderDetails.Amount;
            payment.Order = order;
            payment.PaymentStatus = payment_status_enum_1.PaymentStatus.INITIATED;
            const createdPayment = yield this.orderRepository.save(payment);
            const paymentGatewayService = this.gatewayServices.get(orderDetails.PaymentGatewayType);
            if (!paymentGatewayService) {
                throw new Error("Invalid payment gateway type.");
            }
            const paymentGatewayResponse = yield paymentGatewayService.processPayment(createdPayment, orderDetails.PaymentType, orderDetails.Amount, orderDetails.PaymentGatewayType);
            createdPayment.TransactionId =
                (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.TransactionId) || null;
            createdPayment.PaymentStatus = (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.Status) || null;
            yield this.orderRepository.save(createdPayment);
            if (paymentGatewayResponse.Status === payment_status_enum_1.PaymentStatus.SUCCESS) {
                yield this.onPaymentSuccess(createdPayment);
            }
            else {
                yield this.onPaymentFailure(createdPayment);
            }
            return {
                PaymentId: createdPayment.id,
                Status: createdPayment.PaymentStatus,
                TransactionId: createdPayment.TransactionId,
            };
        });
    }
    paymentStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentId },
                relations: ["payment"],
            });
            if (!payment || !payment.Payment) {
                throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
            }
            return payment.Payment.PaymentStatus;
        });
    }
    getPaymentDetails(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentId },
                relations: ["payment"],
            });
            if (!payment || !payment.Payment) {
                throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
            }
            return payment.Payment;
        });
    }
    processPayment(orderId, paymentGatewayResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            let payment;
            try {
                payment = yield this.orderRepository.findOne({
                    where: { id: orderId },
                    relations: ["payment"],
                });
                if (!payment || !payment.payment) {
                    throw new Error(`Order with ID ${orderId} not found or payment not initialized.`);
                }
                const paymentGatewayService = this.gatewayServices.get(payment.payment.paymentGatewayType);
                if (!paymentGatewayService) {
                    throw new Error("Invalid payment gateway type.");
                }
                yield paymentGatewayService.processPayment(payment.payment, payment.payment.paymentType, payment.payment.amount, payment.payment.paymentGatewayType);
                payment.payment.paymentStatus = payment_status_enum_1.PaymentStatus.SUCCESS;
                yield this.orderRepository.save(payment);
            }
            catch (error) {
                console.error(error);
                payment.payment.paymentStatus = payment_status_enum_1.PaymentStatus.FAILED;
                yield this.orderRepository.save(payment);
            }
        });
    }
    handlePaymentGatewayResponse(paymentGatewayResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentGatewayResponse.PaymentId },
                relations: ["order"],
            });
            if (payment instanceof payment_model_1.Payment) {
                payment.TransactionId = paymentGatewayResponse.TransactionId;
                payment.PaymentStatus = paymentGatewayResponse.Status;
                payment.PaymentTimestamp = new Date();
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
