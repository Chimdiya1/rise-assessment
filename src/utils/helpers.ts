/* eslint-disable import/prefer-default-export */
import config from "config";
import { Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3Client } from "../utils/S3Client";

export const processError = (res: Response, error: any) => {
  if (error.status) {
    return res.status(error.status).send({
      status: "failed",
      message: error.message,
      data: {},
    });
  }
  return res.status(500).send({
    status: "failed",
    message: error.message,
    data: {},
  });
};

export const uploadHelper = multer({
  storage: multerS3({
    s3: s3Client,
    acl: "public-read",
    bucket: process.env.AWS_S3_BUCKET_NAME || "",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
      cb(null, `${fileName}${path.extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 200, // 200mb file size
  },
});
