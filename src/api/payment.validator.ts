import joi from "joi";
import express from "express";
import { ErrorHandler } from "common/handlers/error.handler";
import { PaymentCreateModel } from "domain.types/miscellaneous/payment.domain.types";

export class PaymentValidator {
  public validateCreateRequest = async (
    request: express.Request
  ): Promise<PaymentCreateModel> => {
    try {
      const schema = joi.object({
        PaymentGatewayType: joi.string().max(256).required(),
        PaymentType: joi.string().max(256).required(),
        OrderId: joi.string().uuid().required(),
        amount: joi.number().precision(10).required(),
      });
      await schema.validateAsync(request.body);
      return {
        PaymentGatewayType: request.body.PaymentGatewayType,
        PaymentType: request.body.PaymentType,
        Amount: request.body.Amount,
        OrderId: request.body.OrderId,
        PaymentTimestamp: new Date(),
        CreatedAt: new Date(),
      };
    } catch (error) {
      ErrorHandler.handleValidationError(error);
    }
  };

  public validateCheckStatusRequest = async (
    request: express.Request
  ): Promise<{ paymentId: string }> => {
    try {
      const schema = joi.object({
        paymentId: joi.string().uuid().required(),
      });
      await schema.validateAsync(request.params);
      return {
        paymentId: request.params.paymentId,
      };
    } catch (error) {
      ErrorHandler.handleValidationError(error);
    }
  };
}
