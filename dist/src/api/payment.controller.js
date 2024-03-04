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
const payment_service_1 = require("database/services/payment.service");
const payment_initiation_response_dto_1 = require("domain.types/payment/payment.initiation.response.dto");
payment_initiation_response_dto_1.PaymentInitiationResponseDto;
const payment_validator_1 = require("./payment.validator");
const response_handler_1 = require("common/handlers/response.handler");
class PaymentController {
    constructor(orderRepository, razorpayService, stripeService) {
        this.orderRepository = orderRepository;
        this.razorpayService = razorpayService;
        this.stripeService = stripeService;
        this._validator = new payment_validator_1.PaymentValidator();
        this.initiatePayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._validator.validateCreateRequest(req);
                const orderDetails = req.body;
                const paymentResult = yield this._service.initiatePayment(orderDetails);
                const message = 'Payment initiated successfully!';
                response_handler_1.ResponseHandler.success(req, res, message, 200, paymentResult);
            }
            catch (error) {
                response_handler_1.ResponseHandler.handleError(req, res, error);
            }
        });
        this.checkPaymentStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._validator.validateCheckStatusRequest(req);
                const paymentId = req.params.paymentId;
                const paymentStatus = yield this._service.paymentStatus(paymentId);
                const message = 'Payment status retrieved successfully!';
                response_handler_1.ResponseHandler.success(req, res, message, 200, { paymentId, status: paymentStatus });
            }
            catch (error) {
                console.error('Error getting payment status:', error);
                response_handler_1.ResponseHandler.handleError(req, res, error);
            }
        });
        this._service = new payment_service_1.PaymentService(orderRepository, razorpayService, stripeService);
    }
}
exports.PaymentController = PaymentController;
