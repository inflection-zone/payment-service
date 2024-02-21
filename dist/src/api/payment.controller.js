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
exports.PaymentController = void 0;
const payment_initiation_response_dto_1 = require("domain.types/payment.initiation.response.dto");
payment_initiation_response_dto_1.PaymentInitiationResponseDto;
class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
        // Route to initiate a payment
        this.initiatePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const orderDetails = req.body;
                const paymentResult = yield this.paymentService.initiatePayment(orderDetails);
                res.status(200).json(paymentResult);
            }
            catch (error) {
                console.error('Error initiating payment:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        // Route to check payment status
        this.checkPaymentStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentId = req.params.paymentId;
                const paymentStatus = yield this.paymentService.paymentStatus(paymentId);
                res.status(200).json({ paymentId, status: paymentStatus });
            }
            catch (error) {
                console.error('Error getting payment status:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        // Route to get payment details
        this.getPaymentDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentId = req.params.paymentId;
                const paymentDetails = yield this.paymentService.getPaymentDetails(paymentId);
                res.status(200).json(paymentDetails);
            }
            catch (error) {
                console.error('Error getting payment details:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.PaymentController = PaymentController;
