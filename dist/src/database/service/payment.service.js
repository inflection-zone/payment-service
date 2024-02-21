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
    // GatewaySerivce = mapping between payment gateway types and payment gateway services
    constructor(orderRepository, razorpayService, stripeService) {
        this.orderRepository = orderRepository;
        this.razorpayService = razorpayService;
        this.stripeService = stripeService;
        //this.orderRepository = orderRepository;//updated
        this.gatewayServices = new Map()
            .set(payment_gateway_type_enum_1.PaymentGatewayType.RAZORPAY, this.razorpayService)
            .set(payment_gateway_type_enum_1.PaymentGatewayType.STRIPE, this.stripeService);
    }
    //orderRepository is used to save the payment information to db
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
            // retrieves the specific GatewayService instance based on the paymentGatewayType specified in the order details.
            const paymentGatewayService = this.gatewayServices.get(orderDetails.paymentGatewayType);
            if (!paymentGatewayService) {
                throw new Error('Invalid payment gateway type.');
            }
            const paymentGatewayResponse = yield paymentGatewayService.processPayment(createdPayment, orderDetails.paymentType, orderDetails.amount, orderDetails.paymentGatewayType);
            //The response from the payment gateway is stored in the paymentGatewayResponse variable.
            // update transactionId and PaymentStatus which is obtain feom gateway response
            createdPayment.transactionId =
                (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.transactionId) || null;
            createdPayment.paymentStatus = (paymentGatewayResponse === null || paymentGatewayResponse === void 0 ? void 0 : paymentGatewayResponse.status) || null;
            // updated payment info save in db
            yield this.orderRepository.save(createdPayment);
            if (paymentGatewayResponse.status === payment_status_enum_1.PaymentStatus.SUCCESS) {
                yield this.onPaymentSuccess(createdPayment);
            }
            else {
                yield this.onPaymentFailure(createdPayment);
            }
            //return id status transactionid
            return {
                paymentId: createdPayment.id,
                status: createdPayment.paymentStatus,
                transactionId: createdPayment.transactionId,
            };
        });
    }
    paymentStatus(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentId },
                relations: ['payment'],
            });
            if (!payment || !payment.payment) {
                throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
            }
            return payment.payment.paymentStatus;
        });
    }
    getPaymentDetails(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.orderRepository.findOne({
                where: { id: paymentId },
                relations: ['payment'],
            });
            if (!payment || !payment.payment) {
                throw new Error(`Payment with ID ${paymentId} not found or payment not initialized.`);
            }
            return payment.payment;
        });
    }
    processPayment(orderId, paymentGatewayResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield this.orderRepository.findOne({
                    where: { id: orderId },
                    relations: ['payment'],
                });
                if (!payment || !payment.payment) {
                    throw new Error(`Order with ID ${orderId} not found or payment not initialized.`);
                }
                const paymentGatewayService = this.gatewayServices.get(payment.payment.paymentGatewayType);
                if (!paymentGatewayService) {
                    throw new Error('Invalid payment gateway type.');
                }
                yield paymentGatewayService.processPayment(payment.payment, payment.payment.paymentType, payment.payment.amount, payment.payment.paymentGatewayType);
                // update the payment status in the database
                payment.payment.paymentStatus = payment_status_enum_1.PaymentStatus.SUCCESS;
                yield this.orderRepository.save(payment);
            }
            catch (error) {
                // handle any errors that may occur during the payment process
                console.error(error);
                // update the payment status in the database
                payment_model_1.Payment.payment.paymentStatus = payment_status_enum_1.PaymentStatus.FAILED;
                yield this.orderRepository.save(payment_model_1.Payment);
            }
        });
    }
    // retrives payment from db based on payId updates transctn details status
    //handle the payment gateway response when a payment gateway sends a response to the servej
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
