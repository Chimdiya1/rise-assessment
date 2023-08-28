import { Response } from "express";
import { reqWithUser } from "../../../utils/types";
import { auth, authRole } from "../../../middlewares/auth";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
  beforeEach(() => {});
  const payload = {
    email: "email@email.com",
    id: "user.id",
    fullName: "fullName",
    role: "admin",
  };
  let _generateToken = (): Promise<{ accessToken: string }> => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "jwt_secret",
        {
          // expiresIn: '600000'
          expiresIn: "18000000",
        },
        (err: any, token: any) => {
          if (err) {
            return reject(err);
          }
          return resolve({ accessToken: token as string });
        }
      );
    });
  };

  it("should add the user to the request object when a valid token is provided", async () => {
    let valid_token: { accessToken: string } = await _generateToken();
    const req = {
      header: jest.fn().mockReturnValue(valid_token.accessToken),
    } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
  it("should call the next middleware when a token  provided ", async () => {
    let valid_token: { accessToken: string } = await _generateToken();
    const req = {
      header: jest.fn().mockReturnValue(valid_token.accessToken),
    } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
  it("should call the next middleware when a token  provided ", async () => {
    let valid_token: { accessToken: string } = await _generateToken();
    const req = {
      header: jest.fn().mockReturnValue(valid_token.accessToken),
    } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await auth(req, res, next);

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
  it("should return 403 when a token is invalid  ", async () => {
    let valid_token: { accessToken: string } = await _generateToken();
    const req = {
      header: jest.fn().mockReturnValue(undefined),
    } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await auth(req, res, next);

    expect(req.user).toBeUndefined();
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: "Not allowed. Please supply a token",
      status: "failed",
      data: {},
    });
  });
  it("should allow access when the user has the required role", () => {
    const req = { user: { role: "admin" } } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    authRole("admin")(req, res, next);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
  it("should deny access when the user has a different role", () => {
    const req = { user: { role: "user" } } as unknown as reqWithUser;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    authRole("admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({
      message: "User is not an admin",
      status: "failed",
      data: {},
    });
    expect(next).not.toHaveBeenCalled();
  });
});
