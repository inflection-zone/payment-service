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
exports.StripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const payment_type_enum_1 = require("../../domain.types/payment/payment.type.enum");
const payment_status_enum_1 = require("../../domain.types/payment/payment.status.enum");
class StripeService {
    constructor() {
        this.stripe = new stripe_1.default('your_stripe_secret_key', {
            apiVersion: '2023-10-16',
        });
    }
    mapPaymentTypeToStripe(paymentType) {
        return [payment_type_enum_1.PaymentType[paymentType].toLowerCase() + '_stripe_method'];
    }
    processPayment(payment, paymentType, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implement Stripe SDK for integration
            const stripePaymentMethodTypes = this.mapPaymentTypeToStripe(paymentType);
            try {
                const response = yield this.stripe.paymentIntents.create({
                    amount,
                    currency: 'INR',
                    payment_method_types: stripePaymentMethodTypes
                });
                if (response && response.id) {
                    return {
                        paymentId: payment.id,
                        transactionId: response.id,
                        status: payment_status_enum_1.PaymentStatus.CAPTURED,
                    };
                }
            }
            catch (error) {
                console.error('Stripe error:', error);
                return {
                    paymentId: payment.id,
                    transactionId: null,
                    status: payment_status_enum_1.PaymentStatus.FAILED,
                };
            }
        });
    }
}
exports.StripeService = StripeService;
