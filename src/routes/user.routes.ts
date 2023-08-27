import { Router } from "express";
import { UserRepository } from "../repositories/user.repository";
import UserService from "../services/user.service";
import UserController from "../controllers/user.controller";
import validateRequest from "../middlewares/validator";
import {
  createUserBodySchema,
  authUserBodySchema,
} from "../schemas/user.schema";

const userService = new UserService(UserRepository);
const userRouter: Router = Router();

const userController = UserController(userService);

userRouter.post(
  "/",
  validateRequest(createUserBodySchema),
  userController.create
);
userRouter.post(
  "/auth",
  validateRequest(authUserBodySchema),
  userController.authUser
);

export default userRouter;
