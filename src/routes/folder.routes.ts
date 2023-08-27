import { Router } from "express";
import { FolderRepository } from "../repositories/folder.repository";
import { UserRepository } from "../repositories/user.repository";
import FolderService from "../services/folder.service";
import FolderController from "../controllers/folder.controller";
import validateRequest from "../middlewares/validator";
import { createFolderSchema } from "../schemas/folder.schema";
import { auth } from "../middlewares/auth";

const folderService = new FolderService(FolderRepository, UserRepository);
const folderRouter: Router = Router();

const folderController = FolderController(folderService);

folderRouter.post(
  "/create",
  auth,
  validateRequest(createFolderSchema),
  folderController.create
);

export default folderRouter;
