import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../auth/validateRequest";
import auth from "../../auth/requireAuth";
import { USER_ROLE } from "../user/user.constant";
import { AuthValidation } from "./auth.validation";
import { UserValidation } from "../user/user.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.post(
  "/register",
  validateRequest(UserValidation.registerValidationSchema),
  AuthController.registerUser
);

router.patch(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordValidationSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordValidationSchema),
  AuthController.resetPassword
);

export const AuthRoutes = router;
