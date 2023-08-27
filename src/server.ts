import "reflect-metadata";
// import config from 'config';
require("dotenv").config();

import express from "express";
import * as loader from "./loaders";

const PORT = process.env.PORT;
async function startServer() {
  const app = express();
  await loader.init({ expressApp: app });

  app.listen(PORT, (): void => {
    console.log("server is running at port", PORT);
  });
}

startServer();
