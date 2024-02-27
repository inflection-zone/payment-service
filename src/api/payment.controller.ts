import { Request, Response } from 'express';
import express from 'express';
import { PaymentService } from 'database/service/payment.service';
import { RazorpayService } from 'database/service/irazorpay.service';
import { StripeService } from 'database/service/istripe.service';
import { Order } from 'database/models/order.model';
import { Repository } from 'typeorm';
import { PaymentInitiationRequestDto } from 'domain.types/payment/payment.initiation.request.dto';
import { PaymentInitiationResponseDto } from 'domain.types/payment/payment.initiation.response.dto';
PaymentInitiationResponseDto
import { PaymentValidator } from './payment.validator';
import { ResponseHandler } from 'common/handlers/response.handler';

export class PaymentController {

    _service: PaymentService;

    _validator: PaymentValidator = new PaymentValidator();

    constructor(
        private orderRepository: Repository<Order>,
        private razorpayService: RazorpayService,
        private stripeService: StripeService
    ) {
        this._service = new PaymentService(orderRepository, razorpayService, stripeService);
    }

    initiatePayment = async (req: express.Request, res: express.Response) => {
        try {
            await this._validator.validateCreateRequest(req);
            const orderDetails: PaymentInitiationRequestDto = req.body;
            const paymentResult: PaymentInitiationResponseDto = await this._service.initiatePayment(orderDetails);
            const message = 'Payment initiated successfully!';
            ResponseHandler.success(req, res, message, 200, paymentResult);
        } catch (error) {
            ResponseHandler.handleError(req, res, error);
        }
    };

    checkPaymentStatus = async (req: express.Request, res: express.Response) => {
        try {
            await this._validator.validateCheckStatusRequest(req);
            const paymentId: string = req.params.paymentId;
            const paymentStatus: string = await this._service.paymentStatus(paymentId);
            const message = 'Payment status retrieved successfully!';
            ResponseHandler.success(req, res, message, 200, { paymentId, status: paymentStatus });
        } catch (error) {
            console.error('Error getting payment status:', error);
            ResponseHandler.handleError(req, res, error);
        }
    };
}


