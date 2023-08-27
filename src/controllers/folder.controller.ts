import { Response } from "express";
import { IFolderService } from "../interfaces/services.interfaces";
import { processError } from "../utils/helpers";
import { reqWithUser } from "../utils/types";

export default (folderService: IFolderService) => ({
  async create(req: reqWithUser, res: Response): Promise<void | Response> {
    try {
      let ownerId = req.user.id;
      let folder = await folderService.create(
        {
          name: req.body.name,
        },
        ownerId,
        req.body.parentFoldername
      );
      return res.status(201).send({
        message: "Folder Created Successfully",
        status: "success",
        data: {
          folder,
        },
      });
    } catch (err) {
      return processError(res, err);
    }
  },
});
