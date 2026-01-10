import { Router } from "express";
import { CompanyController } from "./company.controller";
import auth from "../../auth/requireAuth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Define routes
router.get(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  CompanyController.getAllCompany
);

router.post("/", auth(USER_ROLE.admin), CompanyController.createCompany);

router.patch("/:id", auth(USER_ROLE.admin), CompanyController.updateCompany);

router.delete("/:id", auth(USER_ROLE.admin), CompanyController.deleteCompany);

router.get(
  "/:id/products",
  auth(USER_ROLE.admin, USER_ROLE.staff),
  CompanyController.getProductsNameByCompany
);

export const CompanyRoutes = router;
