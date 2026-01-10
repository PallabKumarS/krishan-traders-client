import { Router } from "express";
import { RecordController } from "./record.controller";
import auth from "../../auth/requireAuth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Define routes
router.get("/", auth(USER_ROLE.admin), RecordController.getAllRecord);

router.post(
  "/add-stock",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  RecordController.addStock
);

router.patch(
  "/sell-stock",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  RecordController.sellStock
);

router.patch(
  "/:id/accept-add-stock",
  auth(USER_ROLE.admin),
  RecordController.acceptAddStock
);

router.patch(
  "/:id/accept-sell-stock",
  auth(USER_ROLE.admin),
  RecordController.acceptSellStock
);

router.delete("/:id", auth(USER_ROLE.admin), RecordController.deleteRecord);

export const RecordRoutes = router;
