"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const express_1 = __importDefault(require("express"));
const payment_service_1 = require("database/service/payment.service");
const typeorm_1 = require("typeorm");
const order_model_1 = require("database/models/order.model");
const irazorpay_service_1 = require("database/service/irazorpay.service");
const istripe_service_1 = require("database/service/istripe.service");
const payment_controller_1 = require("./payment.controller");
const register = (app) => {
    const PaymentRouter = express_1.default.Router();
    const orderRepository = (0, typeorm_1.getRepository)(order_model_1.Order);
    const razorpayService = new irazorpay_service_1.RazorpayService();
    const stripeService = new istripe_service_1.StripeService();
    // Create an instance of PaymentService with the required dependencies
    const paymentService = new payment_service_1.PaymentService(orderRepository, razorpayService, stripeService);
    const controller = new payment_controller_1.PaymentController(paymentService);
    // Define route handlers
    PaymentRouter.post('/initiate-payment', controller.initiatePayment);
    PaymentRouter.get('/payment-status/:paymentId', controller.checkPaymentStatus);
    PaymentRouter.get('/payment-details/:paymentId', controller.getPaymentDetails);
    app.use('/api/v5/payment', PaymentRouter);
};
exports.register = register;
