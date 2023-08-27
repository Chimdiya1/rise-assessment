import { Response } from "express";
import { IFileService } from "../interfaces/services.interfaces";
import { processError } from "../utils/helpers";
import { reqWithUser } from "../utils/types";
import { Readable } from "stream";
import { s3Client } from "../utils/S3Client";

interface FileType extends Express.MulterS3.File {
  parentFoldername?: string;
}

export default (fileService: IFileService) => ({
  async upload(req: reqWithUser, res: Response): Promise<void | Response> {
    try {
      const fileInfo = req.file as FileType;

      if (!fileInfo) {
        return res.status(400).send({
          message: "File Upload failed",
          status: "failure",
        });
      }

      let file = await fileService.create(
        {
          filename: fileInfo.key,
          fileType: fileInfo.mimetype,
          location: fileInfo.location,
          size: fileInfo.size,
        },
        req.user.id,
        req.query.parentFoldername as string
      );
      return res.status(201).send({
        message: "File Uploaded SUccessfully",
        status: "success",
        data: {
          file,
        },
      });
    } catch (err) {
      return processError(res, err);
    }
  },
  async download(req: reqWithUser, res: Response): Promise<void | Response> {
    try {
      let fileStream = await fileService.download(
        {
          filename: req.body.filename,
          userId: req.user.id,
        },
        s3Client
      );
      let filename = req.body.filename;
      let fileStreamBody = fileStream?.Body as Readable;
      res.attachment(filename);
      fileStreamBody.pipe(res);
    } catch (err) {
      console.log(err);
      return processError(res, err);
    }
  },

  async flagFileAsUnsafe(req: reqWithUser, res: Response): Promise<void | Response> {
    try {
      let file = await fileService.flagAsUnsafe(req.body.filename, req.user.id);
      return res.status(200).send({
        message: "File Updated SUccessfully",
        status: "success",
        data: {
          file,
        },
      });
    } catch (err) {
      console.log(err);
      return processError(res, err);
    }
  },
});