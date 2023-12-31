import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface reqWithUser extends Request {
  user?: any;
}

function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret",
      (err: any, decoded: unknown) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      }
    );
  });
}

export async function auth(
  req: reqWithUser,
  res: Response,
  next: NextFunction
) {
  const token = req.header("x-auth");
  if (!token) {
    return res.status(403).send({
      message: "Not allowed. Please supply a token",
      status: "failed",
      data: {},
    });
  }

  try {
    const decoded = await verifyToken(token);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).send({
      message: "Invalid token supplied",
      status: "failed",
      data: {},
    });
  }
}

export function authRole(role: string) {
  return (req: reqWithUser, res: Response, next: NextFunction) => {
    try {
      const { user } = req;
      if (!user)
        return res.status(403).send({
          message: "Not allowed",
          status: "failed",
          data: {},
        });
      if (user.role !== role)
        return res.status(403).send({
          message: "User is not an admin",
          status: "failed",
          data: {},
        });
      return next();
    } catch (err) {
      return res.status(403).send({
        message: "Not allowed",
        status: "failed",
        data: {},
      });
    }
  };
}
