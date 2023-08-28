import { Request, Response } from "express";
import Joi, { Schema } from "joi";
import validateRequest from "../../../middlewares/validator";

describe("Validator Middleware", () => {
  beforeEach(() => {});
  it("should work correctly when no schemas are provided", () => {
    // Arrange
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Act
    validateRequest()(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });
  // Tests that the function works correctly when only one schema is provided
  it("should work correctly when only one schema is provided", () => {
    // Arrange
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();
    const schema = Joi.object({
      name: Joi.string().required(),
    });

    // Act
    validateRequest(schema)(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });
  it("should work correctly when all schemas are provided and the request properties are valid", () => {
    // Arrange
    const req = {
      body: {
        name: "John",
      },
      params: {
        id: "123",
      },
      query: {
        page: "1",
      },
    } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();
    const bodySchema = Joi.object({
      name: Joi.string().required(),
    });
    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    });
    const querySchema = Joi.object({
      page: Joi.string().required(),
    });

    // Act
    validateRequest(bodySchema, paramsSchema, querySchema)(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
  });
  it("should return an error when an invalid schema is passed", () => {
    // Arrange
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();
    const invalidSchema = {} as Schema;

    // Act
    validateRequest(invalidSchema)(req, res, next);

    // Assert
    expect(next).toHaveBeenCalledWith("Invalid schema passed to validator");
  });

  it("should return an error when a request property is missing or invalid according to its schema", () => {
    // Arrange
    const req = {
      body: {},
      params: {},
      query: {},
    } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    const bodySchema = Joi.object({
      name: Joi.string().required(),
    });
    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    });
    const querySchema = Joi.object({
      page: Joi.string().required(),
    });

    // Act
    validateRequest(bodySchema, paramsSchema, querySchema)(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "error",
      message: "name is required",
      data: {},
    });
  });
  it("should return all error messages when multiple errors occur", () => {
    // Arrange
    const req = {
      body: {},
      params: {},
      query: {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      age: Joi.number().required(),
    });
    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    });
    const querySchema = Joi.object({
      page: Joi.string().required(),
    });

    // Act
    validateRequest(bodySchema, paramsSchema, querySchema)(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      status: "error",
      message: "name is required",
      data: {},
    });
  });
});
