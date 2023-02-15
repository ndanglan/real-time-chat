import express from "express";
import AuthRouter from "./auth/auth-routes";

const router = express();

router.use("/auth", AuthRouter);
// using / update authentication middleware here.

export default router;
