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
// import Razorpay from 'razorpay';
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
            //The funds are reserved on the customer account.
            try {
                const response = yield this.razorpay.payments.fetch(order.id);
                if (response && response.status === 'authorized') {
                    const captureResponse = yield this.razorpay.payments.capture(order.id, amount * 100, 'INR');
                    //  funds have been transferred.
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
                }; //update
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
