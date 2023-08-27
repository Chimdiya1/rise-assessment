import { Router } from "express";
import FileService from "../services/file.service";
import FileController from "../controllers/file.controller";
import validateRequest from "../middlewares/validator";
import { FileRepository } from "../repositories/file.repository";
import { UserRepository } from "../repositories/user.repository";
import { uploadHelper } from "../utils/helpers";
import { auth, authRole } from "../middlewares/auth";
import { downloadFileSchema, markUnsafeSchema } from "../schemas/file.schema";
import { FolderRepository } from "../repositories/folder.repository";
import { UserRole } from "../utils/enum/userRole.enum";

const fileService = new FileService(
  FileRepository,
  UserRepository,
  FolderRepository
);
const fileRouter: Router = Router();

const fileController = FileController(fileService);

fileRouter.post(
  "/upload?:parentFoldername",
  auth,
  uploadHelper.single("file"),
  fileController.upload
);
fileRouter.post(
  "/download",
  auth,
  validateRequest(downloadFileSchema),
  fileController.download
);
fileRouter.post(
  "/markunsafe",
  auth,
  authRole(UserRole.ADMIN),
  validateRequest(markUnsafeSchema),
  fileController.flagFileAsUnsafe
);

export default fileRouter;
