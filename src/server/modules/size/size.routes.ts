import { Router } from "express";
import { SizeController } from "./size.controller";
import auth from "../../auth/requireAuth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Define routes
router.get("/", auth(USER_ROLE.admin), SizeController.getAllSize);

router.get(
  "/:productName",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  SizeController.getSingleSize
);

router.post("/", auth(USER_ROLE.admin), SizeController.createSize);

router.patch("/:productName", auth(USER_ROLE.admin), SizeController.updateSize);

router.delete(
  "/:productName",
  auth(USER_ROLE.admin),
  SizeController.deleteSize
);

export const SizeRoutes = router;
