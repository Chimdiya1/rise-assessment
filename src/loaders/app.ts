import express, { Application, NextFunction, Response } from "express";
import apiRouter from "../routes/api.routes";
import cors from "cors";
import morgan from "morgan";

const loadApp = ({ app }: { app: any }) => {
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use("/api", apiRouter);

  app.use("*", (req: Request, res: Response) =>
    res.status(404).send({
      status: "failed",
      message: "Endpoint not found",
      data: {},
    })
  );

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.type && err.type == "entity.parse.failed") {
      return res.status(400).send({ status: "failed", message: err.message }); // Bad request
    }
    return res.status(err.status || 500).send({
      status: "failed",
      message: "Something unexpected happened",
    });
  });

  return app;
};

export { loadApp };
