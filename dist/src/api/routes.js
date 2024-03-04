"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const order_model_1 = require("../database/models/order.model");
const razorpay_service_1 = require("../database/services/providers/razorpay.service");
const stripe_service_1 = require("../database/services/providers/stripe.service");
const payment_controller_1 = require("./payment.controller");
const register = (app) => {
    const PaymentRouter = express_1.default.Router();
    const orderRepository = (0, typeorm_1.getRepository)(order_model_1.Order);
    const razorpayService = new razorpay_service_1.RazorpayService();
    const stripeService = new stripe_service_1.StripeService();
    const controller = new payment_controller_1.PaymentController(orderRepository, razorpayService, stripeService);
    PaymentRouter.post('/initiate-payment', controller.initiatePayment);
    PaymentRouter.get('/payment-status/:paymentId', controller.checkPaymentStatus);
    app.use('/api/v5/payment', PaymentRouter);
};
exports.register = register;
