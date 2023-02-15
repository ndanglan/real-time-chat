import express from "express";
import authentication from "@middleware/auth";

const router = express();

router.use(authentication)


export default router